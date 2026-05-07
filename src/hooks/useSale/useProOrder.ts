import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/component/toast/ToastProvider';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
import { GetPreOrder } from '@/services/Sale/GetPreOrder';
import useProfileStore from '@/zustland/profileStore';

const PAGE_SIZE = 20;

export default function usePreOrder() {
  const isConnected = useNetworkStore(s => s.isConnected);
  const {profile} = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [preOrderList, setPreOrderList] = useState<any[]>([]);
  const { show } = useToast();
  const requestInFlightRef = useRef(false);

  // get pre order data //
  const getPreOrder = useCallback((targetPage = 0) => {
    if (!isConnected) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (targetPage === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetPreOrder(profile?.id ?? 1, targetPage, {}, {
      onSuccess: payload => {
        const { data } = payload as { data: any[] };
        const { metadata } = payload as unknown as {
          metadata: { page: number; last: boolean; totalPages: number };
        };

        // page=0 -> replace, page>0 -> append
        setPreOrderList(prev => (targetPage === 0 ? data : [...prev, ...data]));
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
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      },
      onError: () => {
        show('Failed to get warehouses', { type: 'error' });
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      },
    });
  }, [isConnected, show, profile?.id]);

  // load more data //
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage || requestInFlightRef.current) {
      return;
    }
    getPreOrder(page + 1);
  }, [getPreOrder, hasNextPage, loading, loadingMore, page]);
  
  // submit refresh //
  const onSubmitRefresh = useCallback(() => {
    setRefreshing(true);
    setHasNextPage(true);
      getPreOrder(0);
  }, [getPreOrder]);

  useFocusEffect(
    useCallback(() => {
      getPreOrder(0);
    }, [getPreOrder]),
  );


  return {
      preOrderList,
    isConnected,
    loading,
    loadMore,
    loadingMore,
    hasNextPage,
    refreshing,
    onSubmitRefresh,
  };
}
