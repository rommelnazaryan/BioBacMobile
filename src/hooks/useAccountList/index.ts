import {useCallback, useEffect, useRef, useState} from 'react';
import {RootStackParamList} from '@/navigation/types';
import {GetAccountListResponse} from '@/types';
import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
import { GetAccountListAll } from '@/services/AccountList/AccountListAll';


export default function useAccountList() {
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getAccountListRef = useRef<() => void>(() => {});
  const [accountList, setAccountList] = useState<GetAccountListResponse[]>([]);


  // get seller data //
  const getAccountList = useCallback(() => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetAccountListAll(page,0, {
      onSuccess: payload => {
        const {data} = payload as {data: GetAccountListResponse[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };

        // page=0 -> replace, page>0 -> append
        setAccountList(prev => (page === 0 ? data : [...prev, ...data]));

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
      onError: () => {
        setLoading(false);
        setLoadingMore(false);
      },
    });
  }, [page, isConnected]);

  // load more data //
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    setPage(p => p + 1);
  }, [hasNextPage, loading, loadingMore]);

  // navigate to history //
  const onHandlerHistory = (id: number, name: string) => {
    navigation.navigate('AccountListStack', {
      screen: 'AccountListHistory',
      params: {item: {id: id, name: name}},
    });
  };


  useEffect(() => {
    getAccountListRef.current = getAccountList;
  }, [getAccountList]);

  useEffect(() => {
    getAccountList();
  }, [getAccountList]);


  useFocusEffect(
    useCallback(() => {
      getAccountList();
    }, [getAccountList])
  );

  useRefetchOnReconnect(getAccountList);

  return {
    loading,
    loadingMore,
    hasNextPage,
    accountList,
    loadMore,
    isConnected,
    onHandlerHistory
  };
}
