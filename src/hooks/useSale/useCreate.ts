import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {type Resolver, useForm} from 'react-hook-form';
import {useCallback, useEffect, useState} from 'react';
import useNetworkStore from '@/zustland/networkStore';
import {useToast} from '@/component/toast/ToastProvider';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  DropdownOptions,
  RootStackParamList,
  SalesParamList,
} from '@/navigation/types';
import type {GetSaleSuccessResponse} from '@/types';
import useDraftStore from '@/zustland/draftStore';
import type {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {GetBuyers} from '@/services/Company/Buyers';
import {GetLine} from '@/services/Company/GetLine';
import {GetAssortment} from '@/services/Company/GetAssortment';
import {
  CreateSale,
  type CreateSaleRequest,
  type SaleItemRequest,
} from '@/services/Sale/CreateSale';
import {UpdateSale} from '@/services/Sale/UpdateSale';
import {buildSaleReceiptLines} from '@/services/print/buildSaleReceiptLines';
import {ensureSalePrinterGate} from '@/services/print/ensureSalePrinterGate';
import {tryPrintSaleReceipt} from '@/services/print/tryPrintSaleReceipt';
import useProfileStore from '@/zustland/profileStore';

const parseEffectiveSaleQuantity = (raw: unknown): number | null => {
  const qStr = String(raw ?? '').trim();
  if (!qStr) {
    return null;
  }
  const q = Number(qStr.replace(',', '.').replace(/\s/g, ''));
  if (!Number.isFinite(q) || q < 0) {
    return null;
  }
  return q <= 0 ? 1 : q;
};

export type SaleLineFields = {
  quantity: string;
  unitPrice: string;
};

export type SaleCreateFormValues = {
  dealName: string;
  company: string;
  contactPerson: string;
  products: Array<string | number>;
  saleLines: Record<string, SaleLineFields>;
  creditorAmount: string;
};

export default function useSaleCreate(
  route: NativeStackScreenProps<SalesParamList, 'SalesCreate'>,
) {
  const {item, key} = route.route.params;
  const isConnected = useNetworkStore(s => s.isConnected);
  const todayDdMmYyyy = moment(new Date()).format('DD/MM/YYYY');
  const [showDate, setShowDate] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'order' | 'sale' | null>(
    null,
  );
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {Draft, setDraft} = useDraftStore();
  const {show} = useToast();
  const {profile} = useProfileStore();
  const [orderDate, setOrderDate] = useState<string>(todayDdMmYyyy);
  const [saleDate, setSaleDate] = useState<string>(todayDdMmYyyy);
  const [errorOrderDate, setErrorOrderDate] = useState<string>('');
  const [errorSaleDate, setErrorSaleDate] = useState<string>('');
  const [companyList, setCompanyList] = useState<DropdownOptions[]>([]);
  const [lineList, setLineList] = useState<DropdownOptions[]>([]);
  const [keyValue, setKeyValue] = useState<string>('');
  const [selectedLineValues, setSelectedLineValues] = useState<Array<string | number>>([]);
  const [contactPersonList, setContactPersonList] = useState<DropdownOptions[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [productUnitPriceById, setProductUnitPriceById] = useState<
    Map<number, number>
  >(() => new Map());
  const [productList, setProductList] = useState<DropdownOptions[]>([]);
  const validationSchema = Yup.object().shape({
    dealName: Yup.string().trim().default(''),
    company: Yup.string().trim().required('Required'),
    contactPerson: Yup.string().trim(),
    products: Yup.array()
      .of(Yup.mixed<string | number>())
      .min(1, 'Required')
      .required('Required')
      .default([]),
    saleLines: Yup.object().default({}),
    creditorAmount: Yup.string().trim().default('0'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
    setError,
    clearErrors,
  } = useForm<SaleCreateFormValues>({
    defaultValues: {
      dealName: '',
      company: '',
      contactPerson: '',
      products: [] as Array<string | number>,
      saleLines: {},
      creditorAmount: '0',
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema) as Resolver<SaleCreateFormValues>,
  });

  const syncSaleLinesForSelection = useCallback(
    (ids: Array<string | number>) => {
      const prev = getValues('saleLines') ?? {};
      const next: Record<string, SaleLineFields> = {};
      for (const raw of ids) {
        const lineKey = String(raw);
        const pid = Number(raw);
        const defaultUnit = Number.isFinite(pid)
          ? productUnitPriceById.get(pid)
          : undefined;
        const existing = prev[lineKey];
        next[lineKey] = {
          quantity: existing?.quantity ?? '',
          unitPrice:
            existing?.unitPrice !== undefined && existing.unitPrice !== ''
              ? existing.unitPrice
              : String(defaultUnit != null ? defaultUnit : ''),
        };
      }
      setValue('saleLines', next);
    },
    [getValues, productUnitPriceById, setValue],
  );

  const removeSaleProduct = useCallback(
    (productId: string | number) => {
      const current = getValues('products') ?? [];
      const next = current.filter(x => String(x) !== String(productId));
      setValue('products', next);
      syncSaleLinesForSelection(next);
    },
    [getValues, setValue, syncSaleLinesForSelection],
  );

  useEffect(() => {
    if (item) {
    //   const anyItem = item as any;
    //   setValue('companyName', anyItem.name ?? '');
    //   setValue('generalDirector', anyItem.ceo ?? '');
    //   setValue('companyPhone', anyItem.phones?.[0] ?? '');
    //   const companyGroupId = anyItem.companyGroup?.id ?? anyItem.companyGroupId;
    //   setValue('companyGroup', companyGroupId != null ? String(companyGroupId) : '');
    //   setValue('creditorAmount', String(item.creditorAmount ?? 0));
    //   setValue('debtorAmount', String(item.debtorAmount ?? 0));
    //   setValue('actualAddress', item.actualAddress ?? '');
    //   setValue('addressTT', item.addressTT?.join(',') ?? '');
    //   setValue('localAddress', item.localAddress ?? '');
    //   setValue('warehouseAddress', item.warehouseAddress ?? '');
    //   setDate(anyItem.clientRegisteredDate?.split?.(':')?.[0] ?? date);
    //   setLatitude(anyItem.latitude != null ? String(anyItem.latitude) : '');
    //   setLongitude(anyItem.longitude != null ? String(anyItem.longitude) : '');
    }
    setKeyValue(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, setValue, key]);

  const onOpenOrderDate = () => {
    setActiveDateField('order');
    setShowDate(true);
  };

  const onOpenSaleDate = () => {
    setActiveDateField('sale');
    setShowDate(true);
  };

  const onClearOrderDate = () => {
    setOrderDate('');
    setErrorOrderDate('Required');
  };

  const onClearSaleDate = () => {
    setSaleDate('');
    setErrorSaleDate('Required');
  };

  const onCloseDate = () => {
    setShowDate(false);
    setActiveDateField(null);
    setErrorOrderDate('');
    setErrorSaleDate('');
  };

  const onConfirmDate = (payload: {
    day: number;
    month: number;
    year: number;
    dateString: string;
    timestamp: number;
  }) => {
    const dd = String(payload.day).padStart(2, '0');
    const mm = String(payload.month).padStart(2, '0');
    const formatted = `${dd}/${mm}/${payload.year}`;
    if (activeDateField === 'sale') {
      setSaleDate(formatted);
      setErrorSaleDate('');
    } else {
      setOrderDate(formatted);
      setErrorOrderDate('');
    }
    setShowDate(false);
    setActiveDateField(null);
  };


  // get Buyer
  const getBuyers = useCallback(async () => {
    if (!isConnected) return;
    await GetBuyers({
      onSuccess: res => {

        const {data} = res as {
          data: {id: number; name: string; assortmentId: number}[];
        };
        const companyOptions: DropdownOptions[] = data.map(company => ({
          label: company.name,
          value: company.id,
        }));
        setData(data);
        setCompanyList(companyOptions as []);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });

  }, [isConnected, show])

  // get Line
  const getLine = useCallback(async () => {
    if (!isConnected) return;
    await GetLine({
      onSuccess: res => {
        const { data } = res as { data: { id: number; name: string}[] };
        const companyOptions: any[] = data.map(
          (item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
          }),
        );
        setLineList(companyOptions as []);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });

  }, [isConnected, show])

  // get Contact Person
  // const getContactPerson = useCallback(async () => {
  //   if (!isConnected) return;
  //   await GetContactPerson({
  //     onSuccess: res => {
  //       const { data } = res as { data: { id: number; firstName: string; lastName: string }[] };
  //       const companyOptions: any[] = data.map(
  //         (item: { firstName: string; lastName: string; id: number }) => ({
  //           label: `${item.firstName} ${item.lastName}`,
  //           value: item.id,
  //         }),
  //       );
  //       setContactPersonList(companyOptions as []);
  //     },
  //     onUnauthorized: () => {
  //       show('Unauthorized', { type: 'error' });
  //     },
  //     onError: () => {
  //       show('Failed to get company group', { type: 'error' });
  //     },
  //   });

  // }, [isConnected, show])
  
  const getContactPerson = useCallback(async (value: string) => {
    const result = data.find(item => item.name === value);
            const companyOptions: any[] = result.contactPerson.map(
          (item: { firstName: string; lastName: string; id: number }) => ({
            label: `${item.firstName} ${item.lastName}`,
            value: item.id,
          }),
        );
    setContactPersonList(companyOptions as []);
  }, [data]);

  // get product
  const onSubmitGetProduct = useCallback(
    (buyerCompanyId: number | string) => {
      if (!isConnected) {
        return;
      }
      const buyer = data.find(
        (b: {id: number; assortmentId?: number}) =>
          String(b.id) === String(buyerCompanyId),
      );
      if (buyer == null || buyer.assortmentId == null) {
        show('No product list for this company', {type: 'error'});
        setProductList([]);
        setProductUnitPriceById(new Map());
        return;
      }
      GetAssortment(Number(buyer.assortmentId), {
      onSuccess: res => {
        const {
          data: { products },
        } = res as {
          data: {
            products: Array<
              {
                productName: string;
                productId: number;
              } & Record<string, unknown>
            >;
          };
        };
        const priceMap = new Map<number, number>();
        const productOptions: unknown[] = products.map(product => {
          const rawPrice =
            (product as {salePrice?: number}).salePrice ??
            (product as {unitPrice?: number}).unitPrice ??
            (product as {price?: number}).price ??
            (product as {selfWorthPrice?: number}).selfWorthPrice;
          const n = Number(rawPrice);
          if (Number.isFinite(n) && n >= 0) {
            priceMap.set(product.productId, n);
          }
          return {
            label: product.productName,
            value: product.productId,
          };
        });
        setProductUnitPriceById(priceMap);
        setProductList(productOptions as DropdownOptions[]);
        setValue('products', []);
        setValue('saleLines', {});
      },
      onUnauthorized: () => {
        console.log('unauthorized');
      },
      onError: error => {
        show((error as Error)?.message ?? 'Failed to get product', {
          type: 'error',
        });
      },
    });
  },
  [data, isConnected, setValue, show],
  );


  // create contact person
  const onSubmitCreateContactPerson = useCallback(async () => {
    navigation.navigate('SalesStack', {
      screen: 'CreateContactPerson',
    });
  }, [navigation]);

  // create company
  const onCreateCompany = useCallback(async () => {
    let datesOk = true;
    if (orderDate === '') {
      setErrorOrderDate('Required');
      datesOk = false;
    }
    if (saleDate === '') {
      setErrorSaleDate('Required');
      datesOk = false;
    }
    if (!datesOk) {
      return;
    }

    const productIds = (getValues('products') ?? []) as Array<string | number>;
    for (const raw of productIds) {
      clearErrors(`saleLines.${String(raw)}.quantity` as never);
    }

    let linesOk = true;
    for (const raw of productIds) {
      const lineKey = String(raw);
      const line = getValues('saleLines')?.[lineKey];
      if (parseEffectiveSaleQuantity(line?.quantity) === null) {
        linesOk = false;
        setError(`saleLines.${lineKey}.quantity` as never, {
          type: 'manual',
          message: 'Quantity is required',
        });
      }
    }
    if (!linesOk) {
      return;
    }

    const form = getValues();
    const buyerCompanyId = Number(form.company);
    const contactPersonId = Number(form.contactPerson);
    if (!Number.isFinite(buyerCompanyId) || buyerCompanyId <= 0) {
      show('Invalid company', {type: 'error'});
      return;
    }
    // if (!Number.isFinite(contactPersonId) || contactPersonId <= 0) {
    //   show('Select contact person', {type: 'error'});
    //   return;
    // }

    const saleLines = form.saleLines ?? {};
    const items: SaleItemRequest[] = productIds.map(raw => {
      const lineKey = String(raw);
      const line = saleLines[lineKey];
      const qty = parseEffectiveSaleQuantity(line?.quantity) ?? 1;
      const unitRaw = Number(
        String(line?.unitPrice ?? '')
          .replace(',', '.')
          .replace(/\s/g, ''),
      );
      const unitPrice = Number.isFinite(unitRaw) ? unitRaw : 0;
      const productId = Number(raw);
      return {
        productId,
        quantity: qty,
        unitPrice,
        totalPrice: qty * unitPrice,
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);
    const receivedRaw = Number(
      String(form.creditorAmount ?? '')
        .replace(',', '.')
        .replace(/\s/g, ''),
    );
    const receivedAmount = Number.isFinite(receivedRaw) ? receivedRaw : 0;
    const orderDatePart = moment(orderDate, 'DD/MM/YYYY', true).isValid()
      ? orderDate
      : moment().format('DD/MM/YYYY');
    const saleDatePart = moment(saleDate, 'DD/MM/YYYY', true).isValid()
      ? saleDate
      : moment().format('DD/MM/YYYY');

    const payload: CreateSaleRequest = {
      dealName: (form.dealName ?? '').trim(),
      buyerCompanyId,
      items,
      totalAmount,
      saleDate: `${saleDatePart}:23:59:00`,
      orderDate: `${orderDatePart}:23:59:00`,
      contactPersonId,
      receivedAmount,
    };

    const buyerCompanyName = companyList.find(
      c => String(c.value) === String(buyerCompanyId),
    )?.label;
    const contactPersonName = contactPersonList.find(
      c => String(c.value) === String(contactPersonId),
    )?.label;
    const receiptLinesForPrint = buildSaleReceiptLines({
      dealName: payload.dealName,
      buyerCompanyName:
        buyerCompanyName != null ? String(buyerCompanyName) : undefined,
      orderDateDdMmYy: orderDatePart,
      saleDateDdMmYy: saleDatePart,
      contactPersonName:
        contactPersonName != null ? String(contactPersonName) : undefined,
      items: items.map(it => ({
        productName: String(
          productList.find(p => String(p.value) === String(it.productId))
            ?.label ?? `#${it.productId}`,
        ),
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice,
      })),
      totalAmount: payload.totalAmount,
      receivedAmount: payload.receivedAmount,
      responsibleFirstName: profile?.firstname,
    });

    if (!isConnected) {
      const check = Draft.find(
        (d: {key?: string; dealName?: string}) =>
          d.key === 'Sale' && d.dealName === payload.dealName,
      );
      if (check) {
        show('Sale already in draft', {type: 'error'});
        return;
      }
      setDraft([...Draft, {...payload, key: 'Sale'}]);
      show('Sale saved to draft', {type: 'success'});
      navigation.goBack();
      return;
    }

    const printerReady = await ensureSalePrinterGate(show);
    if (!printerReady) {
      return;
    }

    const saleItem = item as GetSaleSuccessResponse | undefined;
    if (key === 'edit' && saleItem?.id != null) {
      UpdateSale(saleItem.id, payload, {
        onSuccess: () => {
          tryPrintSaleReceipt(receiptLinesForPrint).catch(() => undefined);
          show('Sale updated successfully', {type: 'success'});
          navigation.goBack();
        },
        onError: () => {
          show('Failed to update sale', {type: 'error'});
        },
      });
    } else {
      CreateSale(payload, {
        onSuccess: () => {
          tryPrintSaleReceipt(receiptLinesForPrint).catch(() => undefined);
          show('Sale created successfully', {type: 'success'});
          // navigation.goBack();
        },
        onUnauthorized: () => {
          show('Unauthorized', {type: 'error'});
        },
        onError: error => {
          show((error as Error)?.message ?? 'Failed to create sale', {
            type: 'error',
          });
        },
      });
    }
  }, [
    getValues,
    orderDate,
    saleDate,
    show,
    navigation,
    Draft,
    setDraft,
    isConnected,
    item,
    key,
    clearErrors,
    setError,
    companyList,
    contactPersonList,
    productList,
    profile?.firstname,
  ]);

  useFocusEffect(
    useCallback(() => {
      getBuyers();
      getLine()
      // getContactPerson()
    }, [getBuyers, getLine]),
  );


  return {
    control,
    handleSubmit,
    errors,
    onOpenOrderDate,
    onOpenSaleDate,
    onClearOrderDate,
    onClearSaleDate,
    onCloseDate,
    orderDate,
    saleDate,
    calendarValueDate: activeDateField === 'sale' ? saleDate : orderDate,
    showDate,
    onConfirmDate,
    companyList,
    isConnected,
    onCreateCompany,
    errorOrderDate,
    errorSaleDate,
    keyValue,
    lineList,
    selectedLineValues, setSelectedLineValues,
    contactPersonList,
    onSubmitCreateContactPerson,
    getContactPerson,
    onSubmitGetProduct,
    productList,
    syncSaleLinesForSelection,
    removeSaleProduct,
  };
}

