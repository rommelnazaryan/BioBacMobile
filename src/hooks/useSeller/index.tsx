import {useCallback, useEffect, useRef, useState} from 'react';
import {RootStackParamList, SellerParamList} from '@/navigation/types';
import {AllCompanyProps, HomeListProps} from '@/types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {GetAllCompanies} from '@/services/Company/AllCompanies';
import {refreshTokenService} from '@/services/AuthService/RefreshToken';
import useAuthStore from '@/zustland/authStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {DeleteCompany} from '@/services/Company/DeleteCompany';
import { useToast } from '@/component/toast/ToastProvider';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import useNetworkStore from '@/zustland/networkStore';
type Props = NativeStackScreenProps<SellerParamList, 'Seller'>;

export default function useSeller(route: Props) {
  const {item} = route.route.params;
  const {show} = useToast();
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStore(s => s.isConnected);
  const [loadingMore, setLoadingMore] = useState(false);
  const {refreshToken} = useAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [seller, setSeller] = useState<AllCompanyProps[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getAllCompaniesRef = useRef<() => void>(() => {});
  const [visible, setVisible] = useState(false);
  const [companyId, setCompanyId] = useState<number>(0);

  // refresh token //
  const onSubmitRefreshToken = useCallback(() => {
    refreshTokenService(refreshToken, {
      onSuccess: () => {
        getAllCompaniesRef.current();
      },
      onError: () => {
        setLoading(false);
      },
    });
  }, [refreshToken]);

  // get seller data //
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
    return GetAllCompanies(page,2, {
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
        onSubmitRefreshToken();
      },
      onError: (error, status) => {
        setLoading(false);
        setLoadingMore(false);
        console.log('GetAllCompanies error', {status, error});
      },
    });
  }, [page, onSubmitRefreshToken, isConnected]);

  // load more data //
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    setPage(p => p + 1);
  }, [hasNextPage, loading, loadingMore]);

  // navigate to history //
  const onHandlerHistory = (id: number, name: string) => {
    navigation.navigate('SellerStack', {
      screen: 'History',
      params: {item: {id: id, name: name}},
    });
  };

  // submit delete //
  const onSubmitDelete = (id: number) => {
    setVisible(() => true);
    setCompanyId(id);
  };

// submit confirm modal//
  const onSubmitConfirm = () => {
    setLoading(true);
    DeleteCompany(companyId, {
      onSuccess: () => {
        setVisible(() => false);
        getAllCompanies();
      },
      onUnauthorized: () => {
        onSubmitRefreshToken();
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

// submit create seller//
  const onSubmitCreate = () => {
    navigation.navigate('SellerStack', {
      screen: 'SellerCreate',
      params: {item: undefined, key: 'create'},
    })
  };

// submit edit //
const onSubmitEdit = (item: AllCompanyProps) => {
  navigation.navigate('SellerStack', {
    screen: 'SellerCreate',
    params: {item: item as AllCompanyProps, key: 'edit'},
  })
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
    onSubmitEdit
  };
}
