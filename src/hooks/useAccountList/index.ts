import {useCallback, useRef, useState} from 'react';
import {RootStackParamList} from '@/navigation/types';
import {GetAccountListResponse} from '@/types';
import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
  const [accountList, setAccountList] = useState<GetAccountListResponse[]>([]);
  const requestInFlightRef = useRef(false);


  // get seller data //
  const getAccountList = useCallback((targetPage = 0) => {
    if (!isConnected) {
      setLoading(false);
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
    return GetAccountListAll(targetPage,0, {
      onSuccess: payload => {
        const {data} = payload as {data: GetAccountListResponse[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };

        // page=0 -> replace, page>0 -> append
        setAccountList(prev => (targetPage === 0 ? data : [...prev, ...data]));
        setPage(targetPage);

        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(targetPage + 1 < metadata.totalPages);
        }

        setLoading(false);
        setLoadingMore(false);
        requestInFlightRef.current = false;
      },
      onUnauthorized: () => {
        setLoading(false);
        setLoadingMore(false);
        requestInFlightRef.current = false;
      },
      onError: () => {
        setLoading(false);
        setLoadingMore(false);
        requestInFlightRef.current = false;
      },
    });
  }, [isConnected]);

  // load more data //
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage || requestInFlightRef.current) {
      return;
    }
    getAccountList(page + 1);
  }, [getAccountList, hasNextPage, loading, loadingMore, page]);

  // navigate to history //
  const onHandlerHistory = (id: number, name: string) => {
    navigation.navigate('AccountListStack', {
      screen: 'AccountListHistory',
      params: {item: {id: id, name: name}},
    });
  };



  useFocusEffect(
    useCallback(() => {
      getAccountList();
    }, [getAccountList])
  );


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
