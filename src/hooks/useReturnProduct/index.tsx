import {useCallback, useEffect, useRef, useState} from 'react';
import {RootStackParamList} from '@/navigation/types';
import {ReturnProductProps} from '@/types';
import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useToast} from '@/component/toast/ToastProvider';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
import { GetReturnProduct } from '@/services/Company/GetReturnProduct';

// type Props = NativeStackScreenProps<ReturnProductParamList, 'ReturnProduct'>;

export default function useReturnProduct() {
  // const {item} = route.route.params;
  const {show} = useToast();
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [Data, setData] = useState<ReturnProductProps[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getReturnProductRef = useRef<() => void>(() => {});
  const [visible, setVisible] = useState(false);
  // const [id, setId] = useState<number>(0);



  // get seller data //
  const getReturnProduct = useCallback(() => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetReturnProduct(page, {
      onSuccess: payload => {
        const {data} = payload as {data: ReturnProductProps[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };
        // page=0 -> replace, page>0 -> append
        setData(prev => (page === 0 ? data : [...prev, ...data]));

        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(page + 1 < metadata.totalPages);
        }

        setLoading(false);
        setLoadingMore(false);
      },
      onUnauthorized: () => {
      },
      onError: (error) => {
        show((error as Error)?.message ?? 'Failed to get return product', {type: 'error'});
        setLoading(false);
        setLoadingMore(false);
      },
    });
  }, [page, isConnected, show]);

  // load more data //
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    setPage(p => p + 1);
  }, [hasNextPage, loading, loadingMore]);

  // navigate to history //
  const onHandlerHistory = (companyId: number, name: string) => {
    navigation.navigate('BuyerStack', {
      screen: 'HistoryBuyers',
      params: {item: {id: companyId, name: name}},
    });
  };

  // submit delete //
  const onSubmitDelete = (id: number) => {
    setVisible(() => true);
    // setId(companyId);
  };

// submit confirm modal//
  const onSubmitConfirm = () => {
    setLoading(true);
  };

// submit cancel modal//
  const onSubmitCancel = () => {
    setVisible(() => false);
  };

  // submit create buyer //
  const onSubmitCreate = () => {
    navigation.navigate('ReturnProductStack', {
      screen: 'ReturnProductCreate',
      params: {item: undefined, key: 'create'},
    });
  };

  // submit edit //
  const onSubmitEdit = (item: ReturnProductProps) => {
    navigation.navigate('ReturnProductStack', {
      screen: 'ReturnProductCreate',
      params: {item: item, key: 'edit'},
    });
  };

  useEffect(() => {
    getReturnProductRef.current = getReturnProduct;
  }, [getReturnProduct]);


  useFocusEffect(
    useCallback(() => {
      getReturnProduct();
    }, [getReturnProduct])
  );

  useRefetchOnReconnect(getReturnProduct);

  return {
    loading,
    loadingMore,
    hasNextPage,
    Data,
    loadMore,
    onHandlerHistory,
    onSubmitConfirm,
    visible,
    onSubmitDelete,
    onSubmitCancel,
    onSubmitCreate,
    isConnected,
    onSubmitEdit,
  };
}
