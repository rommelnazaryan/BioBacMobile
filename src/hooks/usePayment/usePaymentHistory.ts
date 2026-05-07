import {useCallback, useEffect, useRef, useState} from 'react';
import {GetPaymentAllResponse} from '@/types';
import {refreshTokenOnce} from '@/services/AuthService/refreshTokenOnce';
import { useFocusEffect } from '@react-navigation/native';
import { GetHistoryPayment } from '@/services/Payment/HistoryPayment';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';


export default function usePaymentHistory() {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const isConnected = useNetworkStore(s => s.isConnected);
  const [history, setHistory] = useState<GetPaymentAllResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getHistoryRef = useRef<() => void>(() => {});


  // refresh token //
  const onSubmitRefreshToken = useCallback(() => {
    refreshTokenOnce()
      .then(() => {
        getHistoryRef.current();
      })
      .catch(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, []);

  // get seller data //
  const getHistory = useCallback(() => {
    if (!isConnected) return;
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetHistoryPayment(page, {
      onSuccess: payload => {
        const {data} = payload as {data: GetPaymentAllResponse[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };
        // page=0 -> replace, page>0 -> append
        setHistory(prev => (page === 0 ? data : [...prev, ...data]));

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
        onSubmitRefreshToken();
      },
      onError: (error) => {
        console.log('onError',error);
        setLoading(false);
        setLoadingMore(false);
      },
    });
  }, [page, onSubmitRefreshToken, isConnected]);


  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    setPage(p => p + 1);
  }, [hasNextPage, loading, loadingMore]);






  useEffect(() => {
    getHistoryRef.current = getHistory;
  }, [getHistory]);


  useFocusEffect(
    useCallback(() => {
      getHistory();
    }, [getHistory])
  );

  useRefetchOnReconnect(getHistory);
  return {
    loading,
    loadingMore,
    hasNextPage,
    history,
    loadMore,
  };
}
