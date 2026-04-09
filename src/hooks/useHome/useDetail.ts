import {useCallback, useEffect, useRef, useState} from 'react';
import {RootStackParamList} from '@/navigation/types';
import {AllCompanyProps, getHistoryProps, HomeListProps} from '@/types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
import { GetCompanyHistory } from '@/services/Company/Histroy';
import { Linking } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>; 

export default function useDetail(route: Props) {
  const {item} = route.route.params;
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
    const getHistoryRef = useRef<() => void>(() => {});
  // const [visible, setVisible] = useState(false);
  const [history, setHistory] = useState<getHistoryProps[]>([]);





  // get history //
  const getHistory = useCallback((id: number) => {
    if (!isConnected) return;
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetCompanyHistory(id, page, 1, {
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
      },
      onError: () => {
        setLoading(false);
        setLoadingMore(false);
      },
    });
  }, [page, isConnected]); 


  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    setPage(p => p + 1);
  }, [hasNextPage, loading, loadingMore]);


  // submit detail //
  const onSubmitDetail = (value: HomeListProps) => {
    switch(value.key) {
      case 'Payment':
        navigation.navigate('Payment');
        break;
      case 'ReturnProduct':
        navigation.navigate('ReturnProductStack');
        break;
      case 'Phone':
        Linking.openURL(`tel:${item.phones[0]}`);
        break;
      default:
        break;
    }
  };



  useEffect(() => {
    getHistoryRef.current = () => getHistory(item.id); 
  }, [getHistory,item.id]);

  useFocusEffect(
    useCallback(() => {
      getHistory(item.id);
    }, [getHistory,item.id]),
  );

  useRefetchOnReconnect(() => getHistory(item.id));





 


  return {
    item: item as AllCompanyProps,
    loading,
    loadingMore,
    hasNextPage,
    loadMore,
    isConnected,
    history,
    onSubmitDetail,

  };
}
