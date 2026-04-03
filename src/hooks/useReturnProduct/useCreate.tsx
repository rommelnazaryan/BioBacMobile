import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import useNetworkStore from '@/zustland/networkStore';
import { useToast } from '@/component/toast/ToastProvider';
import moment from 'moment';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DropdownOptions, ReturnProductParamList } from '@/navigation/types';
import type { CreateReturnRequest, GetWarehousesResponse, WarehousesParamList } from '@/types';
import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { GetBuyers } from '@/services/Company/Buyers';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import { GetWarehouses } from '@/services/Warehouses/GetWarehouses';
import { GetAssortment } from '@/services/Company/GetAssortment';
import { CreateReturn } from '@/services/Company/CreateReturn';
import { UpdateReturn } from '@/services/Company/UpdateReturn';
//create empty item //
export type ReturnProductFormItem = {
  id: number;
  productId: string | number;
  quantity: string | number;
  returnPrice: string | number;
  sale: string | number;
};

let nextReturnProductItemId = 1;

const createEmptyItem = (): ReturnProductFormItem => ({
  id: nextReturnProductItemId++,
  productId: '',
  quantity: 1,
  returnPrice: 0,
  sale: 0,
});

export default function useReturnProductCreate(
  route: NativeStackScreenProps<ReturnProductParamList, 'ReturnProductCreate'>,
) {
  const navigation = useNavigation();
  const { item, key } = route.route.params;
  const isConnected = useNetworkStore(s => s.isConnected);
  const [showDate, setShowDate] = useState(false);
  const [errorDate, setErrorDate] = useState<string>('');
  // const { Draft, setDraft } = useDraftStore();
  const { show } = useToast();
  const [date, setDate] = useState<string>(moment(new Date()).format('DD/MM/YYYY'));
  const [keyValue, setKeyValue] = useState<string>('');
  const [items, setItems] = useState<ReturnProductFormItem[]>([createEmptyItem()]);
  const [itemErrors, setItemErrors] = useState<
    Record<string, { productId?: string }>
  >({});
  const [companyList, setCompanyList] = useState<DropdownOptions[]>([]);
  const [warehousesList, setWarehousesList] = useState<DropdownOptions[]>([]);
  const [saleList] = useState<DropdownOptions[]>([{ label: 'Без сделки', value: '0' }]);
  const [productList, setProductList] = useState<DropdownOptions[]>([]);
  const validationSchema = Yup.object().shape({
    Company: Yup.string().trim().required('Required'),
    Warehouse: Yup.string().trim().required('Required'),
    Comment: Yup.string().trim(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      Company: '',
      Warehouse: '',
      Comment: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });
  // get product
  const onSubmitGetProduct = useCallback((productId: number | string) => {
    if (!isConnected) return;

    GetAssortment(Number(productId), {
      onSuccess: res => {
        const {
          data: { products },
        } = res as {
          data: { products: { productName: string; productId: number }[] };
        };
        const productOptions: any[] = products.map(
          (product: { productName: string; productId: number }) => ({
            label: product.productName,
            value: product.productId,
          }),
        );
        setProductList(productOptions as []);
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
  }, [isConnected, show]);
  
  // set default values//
  useEffect(() => {
    if (item) {
      setValue('Company', item.companyId.toString());
      setValue('Comment', item.comment);
      setDate(item.returnDate.split?.(':')?.[0]);
      onSubmitGetProduct(item?.items?.[0]?.productId ?? '0');
      setItems(item.items.map(returnItem => ({
        id: returnItem.id ?? nextReturnProductItemId++,
        productId: returnItem.productId ?? '',
        quantity: returnItem.quantity ?? 1,
        returnPrice: returnItem.returnPrice ?? returnItem.price ?? 0,
        sale: returnItem.sale ?? 0,
      })));
    }
    setKeyValue(key);
  }, [item, setValue, key, onSubmitGetProduct]);


  // get Buyer
  const getBuyers = useCallback(async () => {
    if (!isConnected) return;
    await GetBuyers({
      onSuccess: res => {
        const { data } = res as { data: { id: number; name: string; assortmentId: number }[] };
        const companyOptions: any[] = data.map(
          (company: { name: string; assortmentId: number }) => ({
            label: company.name,
            value: company.assortmentId == null? Math.random() * 1000000 : company.assortmentId,
          }),
        );
        setCompanyList(companyOptions as []);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });

    await GetWarehouses({
      onSuccess: res => {
        const { data } = res as { data: GetWarehousesResponse[] };
        const warehousesOptions: DropdownOptions[] = data.map(
          (warehouse: WarehousesParamList) => ({
            label: warehouse.name,
            value: warehouse.id,
          }),
        );
        setWarehousesList(warehousesOptions as []);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });
  }, [isConnected, show]);




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


  //Add Item
  const onSubmitAddItem = () => {
    setItems(prev => [...prev, createEmptyItem()]);
  };

  // onChange item (product, quantity, returnPrice, sale) 
  const onChangeItem = useCallback(
    <K extends keyof ReturnProductFormItem>(
      index: number,
      field: K,
      value: ReturnProductFormItem[K],
    ) => {
      const itemId = items[index]?.id;
      setItems(prev =>
        prev.map((currentItem, itemIndex) =>
          itemIndex === index ? { ...currentItem, [field]: value } : currentItem,
        ),
      );
      if (field === 'productId' && itemId) {
        setItemErrors(prev => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            productId: String(value).trim() ? undefined : prev[itemId]?.productId,
          },
        }));
      }
    },
    [items],
  );

  // delete item
  const onDeleteItem = (index: number) => {
    const itemId = items[index]?.id;
    setItems(prev => prev.filter((_, itemIndex) => itemIndex !== index));
    if (itemId) {
      setItemErrors(prev => {
        const next = { ...prev };
        delete next[itemId as keyof typeof next];
        return next;
      });
    }
  };


  // create return (buyer)
  const onCreateCompany = async () => {
    const nextItemErrors = items.reduce<Record<string, { productId?: string }>>(
      (acc, currentItem) => {
        if (!String(currentItem.productId ?? '').trim()) {
          acc[currentItem.id] = { productId: 'Required' };
        }
        return acc;
      },
      {},
    );

    setItemErrors(nextItemErrors);
    if (Object.keys(nextItemErrors).length > 0) {
      return;
    }

    const data: CreateReturnRequest = {
      companyId: Number(getValues().Company),
      warehouseId: Number(getValues().Warehouse),
      returnDate: `${date}:23:59:00`,
      comment: getValues().Comment ?? '',
      items: items,
    };


    // if offline, save to draft
    if (!isConnected) {
      return
    }

    if (key === 'edit' && (item as any)?.id != null) {
      console.log(data);
      UpdateReturn((item as any)?.id, data, {
        onSuccess: () => {
          show('Return updated successfully', { type: 'success' });
          navigation.goBack();
        },
        onUnauthorized: () => {
          show('Unauthorized', { type: 'error' });
        },
        onError: (error) => {
          show((error as Error)?.message ?? 'Failed to update return', { type: 'error' });
        },
      });
    } else {
      CreateReturn(data, {
        onSuccess: () => {
          show('Return created successfully', { type: 'success' });
          navigation.goBack();
        },
        onUnauthorized: () => {
          show('Unauthorized', { type: 'error' });
        },
        onError: (error) => {
          show((error as Error)?.message ?? 'Failed to create return', { type: 'error' });
        },
      });

    }
  };




  useFocusEffect(
    useCallback(() => {
      getBuyers();
    }, [getBuyers]),
  );

  useRefetchOnReconnect(getBuyers);

  return {
    control,
    handleSubmit,
    errors,
    onOpenDate,
    onclearDate,
    onCloseDate,
    date,
    showDate,
    onConfirmDate,
    isConnected,
    onCreateCompany,
    errorDate,
    keyValue,
    items,
    itemErrors,
    onChangeItem,
    onDeleteItem,
    onSubmitAddItem,
    companyList,
    warehousesList,
    onSubmitGetProduct,
    productList,
    saleList
  };
}

