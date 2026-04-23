import {useCallback, useEffect, useRef, useState} from 'react';
import {BuyerParamList, RootStackParamList} from '@/navigation/types';
import {AllCompanyProps, HomeListProps} from '@/types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {GetAllCompanies} from '@/services/Company/AllCompanies';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {DeleteCompany} from '@/services/Company/DeleteCompany';
import {useToast} from '@/component/toast/ToastProvider';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';

type Props = NativeStackScreenProps<BuyerParamList, 'Buyers'>;

export default function useBuyers(route: Props) {
  const {item} = route.route.params;
  const {show} = useToast();
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [seller, setSeller] = useState<AllCompanyProps[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getAllCompaniesRef = useRef<() => void>(() => {});
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>(0);



  // get bayer data //
  const getAllCompanies = useCallback(() => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetAllCompanies(page,1, {
      onSuccess: payload => {
        const {data} = payload as {data: AllCompanyProps[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };

        // page=0 -> replace, page>0 -> append
        setSeller(prev => (page === 0 ? data : [...prev, ...data]));

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
  const onHandlerHistory = (companyId: number, name: string) => {
    navigation.navigate('BuyerStack', {
      screen: 'HistoryBuyers',
      params: {item: {id: companyId, name: name}},
    });
  };

  // submit delete //
  const onSubmitDelete = (companyId: number) => {
    setVisible(() => true);
    setId(companyId);
  };

// submit confirm modal//
  const onSubmitConfirm = () => {
    setLoading(true);
    DeleteCompany(id, {
      onSuccess: () => {
        setVisible(() => false);
        getAllCompanies();
      },
      onUnauthorized: () => {
      },
      onError: () => {
        show('Failed to delete company', {type: 'error'});
        setVisible(() => false);
        setLoading(false);
      },
    });
  };

// submit cancel modal//
  const onSubmitCancel = () => {
    setVisible(() => false);
  };

  // submit create buyer //
  const onSubmitCreate = () => {
    navigation.navigate('BuyerStack', {
      screen: 'BuyerCreate',
      params: {item: undefined, key: 'create'},
    });
  };

  // submit edit //
  const onSubmitEdit = (company: AllCompanyProps) => {
    navigation.navigate('BuyerStack', {
      screen: 'BuyerCreate',
      params: {item: company, key: 'edit'},
    });
  };

  useEffect(() => {
    getAllCompaniesRef.current = getAllCompanies;
  }, [getAllCompanies]);


  useFocusEffect(
    useCallback(() => {
      getAllCompanies();
    }, [getAllCompanies])
  );

  useRefetchOnReconnect(getAllCompanies);

  return {
    item: item as HomeListProps,
    loading,
    loadingMore,
    hasNextPage,
    seller,
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
