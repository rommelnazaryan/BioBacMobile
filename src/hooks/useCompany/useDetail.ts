import {useCallback, useEffect, useState} from 'react';
import { CompanyParamList } from '@/navigation/types';
import { AllCompanyProps, getHistoryProps, GetSaleSuccessResponse, ListProps, ReturnProductProps } from '@/types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
import { GetCompanyHistory } from '@/services/Company/Histroy';
import { GetReturnProductAll } from '@/services/Company/GetReturnProductAll';
import { useToast } from '@/component/toast/ToastProvider';
import { GetSaleSuccess } from '@/services/Sale/GetSaleSuccess';

type Props = NativeStackScreenProps<CompanyParamList, 'Detail'>;
type DetailFilterValue = 1 | 2 | 3;

export default function useDetail(route: Props) {
  const { item } = route.route.params;
  const {show} = useToast();
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<CompanyParamList>>();
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<DetailFilterValue>(1);
  const [history, setHistory] = useState<getHistoryProps[]>([]);
  const [returnProductData, setReturnProductData] = useState<ReturnProductProps[]>([]);
  const [saleSuccess, setSaleSuccess] = useState<GetSaleSuccessResponse[]>([]);

  // get history //
  const getHistory = useCallback(
    (id: number, targetPage = page) => {
      if (!isConnected) return;
      if (targetPage === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      return GetCompanyHistory(id, targetPage, 1, {
        onSuccess: payload => {
          const { data } = payload as { data: getHistoryProps[] };
          const { metadata } = payload as unknown as {
            metadata: { page: number; last: boolean; totalPages: number };
          };
          // page=0 -> replace, page>0 -> append
          setHistory(prev => (targetPage === 0 ? data : [...prev, ...data]));

          // update hasNextPage if backend provides it
          if (typeof metadata?.last === 'boolean') {
            setHasNextPage(!metadata.last);
          } else if (typeof metadata?.totalPages === 'number') {
            setHasNextPage(targetPage + 1 < metadata.totalPages);
          }

          setLoading(false);
          setLoadingMore(false);
        },
        onUnauthorized: () => {
          console.log('onUnauthorized');
        },
        onError: () => {
          setLoading(false);
          setLoadingMore(false);
        },
      });
    },
    [page, isConnected],
  );

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    setPage(p => p + 1);
  }, [hasNextPage, loading, loadingMore]);

  // get return product data //
  const getReturnProductAll = useCallback((targetPage = page) => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    if (targetPage === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetReturnProductAll(targetPage, {
      onSuccess: payload => {
        const {data} = payload as {data: ReturnProductProps[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };
        const companyReturnProducts = data.filter(
          returnProduct => returnProduct.companyId === item.id,
        );
        // page=0 -> replace, page>0 -> append
        setReturnProductData(prev =>
          targetPage === 0
            ? companyReturnProducts
            : [...prev, ...companyReturnProducts],
        );

        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(targetPage + 1 < metadata.totalPages);
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
  }, [item.id, page, isConnected, show]);

  // get sale data //
  const getSaleSuccess = useCallback((targetPage = page) => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    if (targetPage === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetSaleSuccess(targetPage, 0, {
      onSuccess: payload => {
        const { data } = payload as { data: GetSaleSuccessResponse[] };
        const { metadata } = payload as unknown as {
          metadata: { page: number; last: boolean; totalPages: number };
        };
        const companySales = data.filter(
          sale => sale.company?.id === item.id,
        );
        // page=0 -> replace, page>0 -> append
        setSaleSuccess(prev =>
          targetPage === 0 ? companySales : [...prev, ...companySales],
        );

        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(targetPage + 1 < metadata.totalPages);
        }

        setLoading(false);
        setLoadingMore(false);
      },
      onUnauthorized: () => {},
      onError: () => {
        setLoading(false);
        setLoadingMore(false);
        show('Failed to get sale success', {type: 'error'});
      },
    });
  }, [item.id, page, isConnected, show]);

  const fetchByFilter = useCallback(
    (filter: DetailFilterValue, targetPage = 0) => {
      if (filter === 1) {
        return getHistory(item.id, targetPage);
      }

      if (filter === 2) {
        return getReturnProductAll(targetPage);
      }

      return getSaleSuccess(targetPage);
    },
    [getHistory, getReturnProductAll, getSaleSuccess, item.id],
  );
  // submit detail //
  const onSubmitDetail = (value: ListProps) => {
    switch (value.key) {
      case 'Payment':
        navigation.navigate('Payment');
        break;
      case 'ReturnProduct':
        navigation.navigate('ReturnProductStack', {
          screen: 'ReturnProduct',
          params: {item: item as AllCompanyProps},
        });
        break;
      case 'Phone':
        navigation.navigate('Phone',{item: item as {phones: string[]}});
        break;
      case 'Sales':
        navigation.navigate('SalesStack');
        break;
      default:
        break;
    }
  };
  const onChangeFilter = (value: number) => {
    const nextFilter = value as DetailFilterValue;
    setPage(0);
    setHasNextPage(true);
    setSelectedFilter(nextFilter);
    fetchByFilter(nextFilter, 0);
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedFilter(1);
      setPage(0);
      setHasNextPage(true);
      fetchByFilter(1, 0);
    }, [fetchByFilter]),
  );

  useEffect(() => {
    if (page === 0) {
      return;
    }

    fetchByFilter(selectedFilter, page);
  }, [fetchByFilter, page, selectedFilter]);

  useRefetchOnReconnect(() => fetchByFilter(selectedFilter, 0));

  return {
    item: item as AllCompanyProps,
    loading,
    loadingMore,
    hasNextPage,
    loadMore,
    isConnected,
    history,
    returnProductData,
    saleSuccess,
    selectedFilter,
    onSubmitDetail,
    onChangeFilter
  };
}
