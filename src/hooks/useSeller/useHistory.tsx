import {useCallback, useEffect, useRef, useState} from 'react';
import {SellerParamList} from '@/navigation/types';
import {getHistoryProps} from '@/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {refreshTokenOnce} from '@/services/AuthService/refreshTokenOnce';
import { GetCompanyHistory } from '@/services/Company/Histroy';
import { useFocusEffect } from '@react-navigation/native';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';

type Props = NativeStackScreenProps<SellerParamList, 'History'>;

export default function useHistory(route: Props) {
  const {item} = route.route.params;
  const {id, name} = item;
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [history, setHistory] = useState<getHistoryProps[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getHistoryRef = useRef<() => void>(() => {});
  const isConnected = useNetworkStore(s => s.isConnected);

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
    return GetCompanyHistory(id, page, 2, {
      onSuccess: payload => {
        const {data} = payload as {data: getHistoryProps[]};
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
      onError: () => {
        setLoading(false);
        setLoadingMore(false);
      },
    });
  }, [page, onSubmitRefreshToken, id, isConnected]);

// load more data //
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
    name:name,
    loading,
    loadingMore,
    hasNextPage,
    history,
    loadMore,
  };
}
