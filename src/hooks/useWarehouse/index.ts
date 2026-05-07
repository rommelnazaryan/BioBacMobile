import { GetWarehousesResponse } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/component/toast/ToastProvider';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
import { GetWarehousesAll } from '@/services/Warehouses/GetWarehousesAll';

const PAGE_SIZE = 20;

export default function useWarehouse() {
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [warehousesList, setWarehousesList] = useState<GetWarehousesResponse[]>(
    [],
  );
  const { show } = useToast();
  const requestInFlightRef = useRef(false);

  // get warehouses all data //
  const getWarehousesAll = useCallback((targetPage = 0) => {
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
    return GetWarehousesAll(targetPage, {}, {
      onSuccess: payload => {
        const { data } = payload as { data: GetWarehousesResponse[] };
        const { metadata } = payload as unknown as {
          metadata: { page: number; last: boolean; totalPages: number };
        };

        // page=0 -> replace, page>0 -> append
        setWarehousesList(prev => (targetPage === 0 ? data : [...prev, ...data]));
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
    getWarehousesAll(page + 1);
  }, [getWarehousesAll, hasNextPage, loading, loadingMore, page]);
  
  // submit refresh //
  const onSubmitRefresh = useCallback(() => {
    if (requestInFlightRef.current) {
      return;
    }
    setRefreshing(true);
    setHasNextPage(true);
    getWarehousesAll(0);
  }, [getWarehousesAll]);

  const refetchFirstPage = useCallback(() => {
    getWarehousesAll(0);
  }, [getWarehousesAll]);

  useFocusEffect(
    useCallback(() => {
      refetchFirstPage();
    }, [refetchFirstPage]),
  );

  useRefetchOnReconnect(refetchFirstPage);

  return {
    warehousesList,
    isConnected,
    loading,
    loadMore,
    loadingMore,
    hasNextPage,
    refreshing,
    onSubmitRefresh,
  };
}
