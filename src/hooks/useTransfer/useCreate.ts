
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, useWatch} from 'react-hook-form';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useNetworkStore from '@/zustland/networkStore';
import {useToast} from '@/component/toast/ToastProvider';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  DropdownOptions,
} from '@/navigation/types';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import { GetWarehouses } from '@/services/Warehouses/GetWarehouses';
import { GetWarehousesResponse } from '@/types';
import { GetWarehouseRelatedProducts } from '@/services/Warehouses/GetWarehouseRelatedProducts';
import { GetWarehouseProductBalance } from '@/services/Warehouses/GetWarehpuseProductBalance';
import { CreateTransferProduct } from '@/services/Transfer/CreateTransferProduct';

const normalizeProductId = (id: string | number): number => {
  const n = Number(id);
  return Number.isFinite(n) ? n : NaN;
};

const balanceFromRelatedProduct = (item: {
  balance?: number;
  componentBalance?: number;
  quantity?: number;
}): number => {
  const raw = item.balance ?? item.componentBalance ?? item.quantity ?? 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

const transferDisplayDateToApi = (displayDdMmYyyy: string): string => {
  const parsed = moment(displayDdMmYyyy, 'DD/MM/YYYY', true);
  if (parsed.isValid()) {
    return parsed.format('DD/MM/YYYY');
  }
  return moment().format('DD/MM/YYYY');
};

const extractBalanceFromPayload = (payload: unknown): number => {
  if (payload == null) {
    return 0;
  }
  if (typeof payload === 'number') {
    return Number.isFinite(payload) ? payload : 0;
  }
  if (typeof payload !== 'object') {
    return 0;
  }
  const o = payload as Record<string, unknown>;
  const nested =
    o.data != null && typeof o.data === 'object'
      ? (o.data as Record<string, unknown>)
      : null;
  const raw =
    o.balance ??
    o.quantity ??
    o.componentBalance ??
    nested?.balance ??
    nested?.quantity ??
    nested?.componentBalance;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

const balancesMapFromRelatedProducts = (
  data: Array<{
    id?: number;
    componentId?: number;
    productId?: number;
    balance?: number;
    componentBalance?: number;
    quantity?: number;
  }>,
): Map<number, number> => {
  const map = new Map<number, number>();
  for (const row of data) {
    const rawId = row.id ?? row.componentId ?? row.productId;
    if (rawId == null) continue;
    const id = Number(rawId);
    if (!Number.isFinite(id)) continue;
    map.set(id, balanceFromRelatedProduct(row));
  }
  return map;
};

export type TransferSelectedProductRow = {
  id: number;
  label: string;
  outputQty: number;
  inputQty: number;
};

type TransferCreateFormValues = {
  warehouseOutput: string;
  warehouseInput: string;
  notes: string;
  products: Array<string | number>;
  /** keyed by component/product id string */
  productTransferQty: Record<string, string>;
};

export default function useTransferCreate() {
  const navigation = useNavigation();
  const isConnected = useNetworkStore(s => s.isConnected);
  const [showDate, setShowDate] = useState(false);
  const {show} = useToast();
  const [date, setDate] = useState<string>(moment(new Date()).format('DD/MM/YYYY'));
  const [errorDate, setErrorDate] = useState<string>('');
  const [allWarehousesList, setAllWarehousesList] = useState<DropdownOptions[]>([]);
  const [productsList, setProductsList] = useState<DropdownOptions[]>([]);
  const [balancesOutput, setBalancesOutput] = useState<Map<number, number>>(() => new Map());
  const [balancesInput, setBalancesInput] = useState<Map<number, number>>(() => new Map());
  /** Full related-products payload from output warehouse (used to filter rows by MultiSelect ids). */
  const [data, setData] = useState<any[]>([]);
  const [filteredSelection, setFilteredSelection] = useState<any[]>([]);
  const [balanceByProductId, setBalanceByProductId] = useState<
    Map<number, {output: number; input: number}>
  >(() => new Map());
  const outputProductsFetchSeq = useRef(0);
  const inputBalancesFetchSeq = useRef(0);
  const balanceFetchSeq = useRef(0);

  const validationSchema = Yup.object().shape({
    warehouseOutput: Yup.string().trim().required('Required'),
    warehouseInput: Yup.string().trim().required('Required'),
    notes: Yup.string().trim().default(''),
    products: Yup.array().default([]),
    productTransferQty: Yup.object().default({}),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
  } = useForm<TransferCreateFormValues>({
    defaultValues: {
      warehouseOutput: '',
      warehouseInput: '',
      notes: '',
      products: [],
      productTransferQty: {},
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const warehouseOutput = useWatch({control, name: 'warehouseOutput'});
  const warehouseInput = useWatch({control, name: 'warehouseInput'});
  const selectedProductIds = useWatch({control, name: 'products'}) as
    | Array<string | number>
    | undefined;

  const warehousesList = useMemo(
    () =>
      allWarehousesList.filter(
        warehouse => String(warehouse.value) !== String(warehouseInput),
      ),
    [allWarehousesList, warehouseInput],
  );

  const warehousesInputList = useMemo(
    () =>
      allWarehousesList.filter(
        warehouse => String(warehouse.value) !== String(warehouseOutput),
      ),
    [allWarehousesList, warehouseOutput],
  );

  const selectedProductIdNumbers = useMemo(() => {
    if (!Array.isArray(selectedProductIds)) return [];
    return selectedProductIds
      .map(normalizeProductId)
      .filter(id => Number.isFinite(id));
  }, [selectedProductIds]);

  const selectionKey = useMemo(
    () => selectedProductIdNumbers.join(','),
    [selectedProductIdNumbers],
  );

  const fetchProductBalancesFromApi = useCallback(
    async (productIds: number[]) => {
      if (!isConnected) {
        return;
      }
      const seq = ++balanceFetchSeq.current;
      const outId = Number(getValues('warehouseOutput'));
      const inId = Number(getValues('warehouseInput'));

      if (
        productIds.length === 0 ||
        !Number.isFinite(outId) ||
        !Number.isFinite(inId) ||
        outId <= 0 ||
        inId <= 0
      ) {
        if (seq === balanceFetchSeq.current) {
          setBalanceByProductId(new Map());
        }
        return;
      }

      const apiDate = transferDisplayDateToApi(date);

      const pairs = await Promise.all(
        productIds.map(async pid => {
          const [outRes, inRes] = await Promise.all([
            GetWarehouseProductBalance<Record<string, unknown>>(
              pid,
              outId,
              `${apiDate}:23:59:00`,
              {},
            ),
            GetWarehouseProductBalance<Record<string, unknown>>(
              pid,
              inId,
              `${apiDate}:23:59:00`,
              {},
            ),
          ]);
          const outputQty = outRes.ok ? extractBalanceFromPayload(outRes.data) : 0;
          const inputQty = inRes.ok ? extractBalanceFromPayload(inRes.data) : 0;
          return [pid, {output: outputQty, input: inputQty}] as const;
        }),
      );

      if (seq !== balanceFetchSeq.current) {
        return;
      }
      setBalanceByProductId(new Map(pairs));
    },
    [date, getValues, isConnected],
  );

  useEffect(() => {
    const ids =
      selectionKey.length === 0
        ? []
        : selectionKey
            .split(',')
            .map(part => normalizeProductId(part))
            .filter(id => Number.isFinite(id));

    const idSet = new Set(ids.map(String));
    const filtered = Array.isArray(data)
      ? data.filter((row: any) => {
          const rid = normalizeProductId(
            row.id ?? row.componentId ?? row.productId,
          );
          return Number.isFinite(rid) && idSet.has(String(rid));
        })
      : [];

    setFilteredSelection(filtered);
    fetchProductBalancesFromApi(ids).catch(() => {});
  }, [
    selectionKey,
    data,
    warehouseOutput,
    warehouseInput,
    date,
    fetchProductBalancesFromApi,
  ]);

  const quantityOutputTotal = useMemo(() => {
    return selectedProductIdNumbers.reduce((sum, id) => {
      const apiBal = balanceByProductId.get(id);
      const q = apiBal?.output ?? balancesOutput.get(id) ?? 0;
      return sum + q;
    }, 0);
  }, [balancesOutput, balanceByProductId, selectedProductIdNumbers]);

  const quantityInputTotal = useMemo(() => {
    return selectedProductIdNumbers.reduce((sum, id) => {
      const apiBal = balanceByProductId.get(id);
      const q = apiBal?.input ?? balancesInput.get(id) ?? 0;
      return sum + q;
    }, 0);
  }, [balancesInput, balanceByProductId, selectedProductIdNumbers]);

  const nameByIdFromFilteredRows = useMemo(() => {
    const m = new Map<number, string>();
    for (const row of filteredSelection) {
      const rid = normalizeProductId(
        row.id ?? row.componentId ?? row.productId,
      );
      if (Number.isFinite(rid) && row.name != null && String(row.name).trim()) {
        m.set(rid, String(row.name));
      }
    }
    return m;
  }, [filteredSelection]);

  const selectedProductRows = useMemo((): TransferSelectedProductRow[] => {
    const labelById = new Map<number, string>();
    for (const p of productsList) {
      const id = normalizeProductId(p.value);
      if (Number.isFinite(id)) {
        labelById.set(id, p.label);
      }
    }

    if (!Array.isArray(selectedProductIds)) {
      return [];
    }

    return selectedProductIds
      .map(normalizeProductId)
      .filter(id => Number.isFinite(id))
      .map(id => {
        const apiBal = balanceByProductId.get(id);
        return {
          id,
          label:
            labelById.get(id) ?? nameByIdFromFilteredRows.get(id) ?? `#${id}`,
          outputQty: apiBal?.output ?? balancesOutput.get(id) ?? 0,
          inputQty: apiBal?.input ?? balancesInput.get(id) ?? 0,
        };
      });
  }, [
    balancesInput,
    balancesOutput,
    balanceByProductId,
    nameByIdFromFilteredRows,
    productsList,
    selectedProductIds,
  ]);

  const outputWarehouseQuantityError = useMemo(() => {
    if (selectedProductIdNumbers.length === 0) return '';
    if (quantityOutputTotal <= 0) {
      return 'Not available in this warehouse';
    }
    return '';
  }, [quantityOutputTotal, selectedProductIdNumbers.length]);

  useEffect(() => {
    const idStrs = selectedProductIdNumbers.map(String);
    const current = getValues('productTransferQty') ?? {};
    const next: Record<string, string> = {};
    for (const idStr of idStrs) {
      next[idStr] = current[idStr] ?? '';
    }
    const sameKeys =
      idStrs.length === Object.keys(current).length &&
      idStrs.every(k => Object.prototype.hasOwnProperty.call(current, k)) &&
      Object.keys(current).every(k => idStrs.includes(k));
    const sameVals = sameKeys && idStrs.every(k => (current[k] ?? '') === next[k]);
    if (sameVals) {
      return;
    }
    setValue('productTransferQty', next);
  }, [getValues, selectedProductIdNumbers, setValue]);


  // open date picker
  const onOpenDate = () => {
    setShowDate(true);
  };

  // clear date
  const onclearDate = () => {
    setDate('');
    setErrorDate('Required');
  };

  // close date picker
  const onCloseDate = () => {
    setShowDate(false);
    setErrorDate('');
  };

  // confirm selected date
  const onConfirmDate = (payload: {
    day: number;
    month: number;
    year: number;
    dateString: string;
    timestamp: number;
  }) => {
    const dd = String(payload.day).padStart(2, '0');
    const mm = String(payload.month).padStart(2, '0');
    setDate(`${dd}/${mm}/${payload.year}`);
    setShowDate(false);
  };

  // get company group
  const getWarehouses = useCallback(async () => {
    if (!isConnected) return;
    await GetWarehouses({
      onSuccess: res => {
        const {data: warehousesPayload} = res as {data: GetWarehousesResponse[]};
        const warehousesOptions: DropdownOptions[] = warehousesPayload.map(
          (groupItem: GetWarehousesResponse) => ({
            label: groupItem.name,
            value: groupItem.id,
          }),
        );
        setAllWarehousesList(warehousesOptions);
      },
      onUnauthorized: () => {
        show('Unauthorized', {type: 'error'});
      },
      onError: () => {
        show('Failed to get company group', {type: 'error'});
      },
    });
  }, [isConnected, show]);

  /** Products available to ship from the output warehouse (dropdown + output balances). */
  const loadOutputWarehouseProducts = useCallback(
    async (warehouseId: number) => {
      if (!isConnected || !warehouseId) return;
      const seq = ++outputProductsFetchSeq.current;
      await GetWarehouseRelatedProducts(warehouseId, {
        onSuccess: res => {
          if (seq !== outputProductsFetchSeq.current) return;
          balanceFetchSeq.current += 1;
          const {data: relatedRows} = res as {data: any[]};
          const list = Array.isArray(relatedRows) ? relatedRows : [];
          setData(list as any);
          const productsOptions: DropdownOptions[] = list.map((groupItem: any) => ({
            label: groupItem.name,
            value: groupItem.id ?? groupItem.componentId ?? groupItem.productId,
          }));
          setProductsList(productsOptions);
          setBalancesOutput(balancesMapFromRelatedProducts(list));
        },
        onUnauthorized: () => {
          show('Unauthorized', {type: 'error'});
        },
        onError: () => {
          show('Failed to load warehouse products', {type: 'error'});
        },
      });
    },
    [isConnected, show],
  );

  /** Stock at the input warehouse for the same product ids (does not replace product list). */
  const loadInputWarehouseBalances = useCallback(
    async (warehouseId: number) => {
      if (!isConnected || !warehouseId) return;
      const seq = ++inputBalancesFetchSeq.current;
      await GetWarehouseRelatedProducts(warehouseId, {
        onSuccess: res => {
          if (seq !== inputBalancesFetchSeq.current) return;
          const {data: inputRelatedRows} = res as {data: any[]};
          const list = Array.isArray(inputRelatedRows) ? inputRelatedRows : [];
          setBalancesInput(balancesMapFromRelatedProducts(list));
        },
        onUnauthorized: () => {
          show('Unauthorized', {type: 'error'});
        },
        onError: () => {
          show('Failed to load warehouse balances', {type: 'error'});
        },
      });
    },
    [isConnected, show],
  );

  const filterWearhouseInput = (value: string) => {
    if (String(getValues('warehouseInput')) === value) {
      setValue('warehouseInput', '');
      setBalancesInput(new Map());
    }
  };

 // submit create transfer product
  const onSubmit = async (formValues: TransferCreateFormValues) => {
    if (!isConnected) {
      show('No connection', {type: 'error'});
      return;
    }
    const fromWarehouseId = Number(formValues.warehouseOutput);
    const toWarehouseId = Number(formValues.warehouseInput);
    if (!Number.isFinite(fromWarehouseId) || !Number.isFinite(toWarehouseId)) {
      show('Invalid warehouses', {type: 'error'});
      return;
    }
    const productIds =
      Array.isArray(formValues.products) && formValues.products.length > 0
        ? formValues.products
            .map(normalizeProductId)
            .filter(id => Number.isFinite(id))
        : [];
    if (productIds.length === 0) {
      show('Select at least one product', {type: 'error'});
      return;
    }

    const dateForApi = `${transferDisplayDateToApi(date)}:23:59:00`;
    const notes = formValues.notes ?? '';

    const payload = productIds.map(componentId => {
      const qtyRaw = formValues.productTransferQty[String(componentId)] ?? '';
      const quantity = Number(String(qtyRaw).replace(',', '.'));
      return {
        fromWarehouseId,
        toWarehouseId,
        componentType: 'products' as const,
        componentId,
        quantity: Number.isFinite(quantity) ? quantity : 0,
        date: dateForApi,
        notes,
      };
    });

    await CreateTransferProduct(payload, {
      onSuccess: () => {
        show('Transfer product created successfully', {type: 'success'});
        navigation.goBack();
      },
      onUnauthorized: () => {
        show('Unauthorized', {type: 'error'});
      },
      onError: () => {
        show('Failed to create transfer product', {type: 'error'});
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      getWarehouses();
    }, [getWarehouses]),
  );

  useRefetchOnReconnect(getWarehouses);

  return {
    control,
    setValue,
    errors,
    onOpenDate,
    onclearDate,
    onCloseDate,
    date,
    showDate,
    onConfirmDate,
    errorDate,
    warehousesList,
    handleSubmit,
    onSubmit,
    loadOutputWarehouseProducts,
    loadInputWarehouseBalances,
    productsList,
    filterWearhouseInput,
    warehousesInputList,
    quantityOutputTotal,
    quantityInputTotal,
    selectedProductRows,
    outputWarehouseQuantityError,
    filteredSelection,
  };
}

