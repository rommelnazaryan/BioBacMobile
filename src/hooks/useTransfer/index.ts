import { GetTransferProductResponse } from '@/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/component/toast/ToastProvider';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TransferParamList } from '@/navigation/types';
import { GetTransferProductAll } from '@/services/Transfer/GetTransferProductAll';
const PAGE_SIZE = 20;

export default function useTransfer() {
  const navigation = useNavigation<NativeStackNavigationProp<TransferParamList>>();
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [transferProductList, setTransferProductList] = useState< GetTransferProductResponse[]>(
    [],
  );
  const { show } = useToast();
  const requestInFlightRef = useRef(false);
  // get warehouses all data //
  const getTransferProductAll = useCallback((targetPage = 0) => {
    if (!isConnected) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (requestInFlightRef.current) {
      return;
    }
    requestInFlightRef.current = true;
    if (targetPage === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    return GetTransferProductAll(targetPage,{}, {
      onSuccess: payload => {
        const { data } = payload as { data:  GetTransferProductResponse[] };
        const { metadata } = payload as unknown as {
          metadata: { page: number; last: boolean; totalPages: number };
        };
        // page=0 -> replace, page>0 -> append
        setTransferProductList(prev => (targetPage === 0 ? data : [...prev, ...data]));
        setPage(targetPage);

        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(targetPage + 1 < metadata.totalPages);
        } else {
          setHasNextPage(data.length >= PAGE_SIZE);
        }

        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        requestInFlightRef.current = false;
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        requestInFlightRef.current = false;
      },
      onError: () => {
        show('Failed to get warehouses', { type: 'error' });
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        requestInFlightRef.current = false;
      },
    });
  }, [isConnected, show]);

  // load more data //
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage || requestInFlightRef.current) {
      return;
    }
    getTransferProductAll(page + 1);
  }, [getTransferProductAll, hasNextPage, loading, loadingMore, page]);
  
  // submit refresh //
  const onSubmitRefresh = useCallback(() => { 
    if (requestInFlightRef.current) {
      return;
    }
    setRefreshing(true);
    setHasNextPage(true);
    getTransferProductAll(0);
  }, [getTransferProductAll]);

  const refetchFirstPage = useCallback(() => {
    getTransferProductAll(0);
  }, [getTransferProductAll]);

// submit create //
  const onSubmitCreate = () => {
  navigation.navigate('TransferCreate');
  };

  useFocusEffect(
    useCallback(() => {
      refetchFirstPage();
    }, [refetchFirstPage]),
  );

  useRefetchOnReconnect(refetchFirstPage);

  return {
    transferProductList,
    isConnected,
    loading,
    loadMore,
    loadingMore,
    hasNextPage,
    refreshing,
    onSubmitRefresh,
    onSubmitCreate
  };
}
