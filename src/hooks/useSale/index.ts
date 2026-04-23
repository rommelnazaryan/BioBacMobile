import { useCallback, useEffect, useRef, useState } from 'react';
import { GetSaleSuccessResponse } from '@/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
// import {refreshTokenService} from '@/services/AuthService/RefreshToken';
// import useAuthStore from '@/zustland/authStore';
import useNetworkStore from '@/zustland/networkStore';
import { useToast } from '@/component/toast/ToastProvider';
import { GetSaleSuccess } from '@/services/Sale/GetSaleSuccess';

export default function useSale() {
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isConnected = useNetworkStore(s => s.isConnected);
  //   const {refreshToken, setToken, setRefreshToken} = useAuthStore();
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getAllCompaniesRef = useRef<() => void>(() => {});
  const [saleSuccess, setSaleSuccess] = useState<GetSaleSuccessResponse[]>([]);

  // get seller data //
  const getSaleSuccess = useCallback(() => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetSaleSuccess(page, 0, {
      onSuccess: payload => {
        const { data } = payload as { data: GetSaleSuccessResponse[] };
        const { metadata } = payload as unknown as {
          metadata: { page: number; last: boolean; totalPages: number };
        };
        // page=0 -> replace, page>0 -> append
        setSaleSuccess(prev => (page === 0 ? data : [...prev, ...data]));

        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(page + 1 < metadata.totalPages);
        }

        setLoading(false);
        setLoadingMore(false);
      },
      onUnauthorized: () => {},
      onError: () => {
        setLoading(false);
        setLoadingMore(false);
        show('Failed to get sale success', {type: 'error'});
      },
    });
  }, [page, isConnected, show]);

  // load more data //
  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }
    setPage(p => p + 1);
  }, [hasNextPage, loading, loadingMore]);

  // submit create buyer //
  const onSubmitCreate = () => {
    navigation.navigate('SalesStack', {
      screen: 'SalesCreate',
      params: {item: undefined, key: 'create'},
    });
  };

  // submit edit //
  const onSubmitEdit = (item: GetSaleSuccessResponse) => {
    navigation.navigate('SalesStack', {
      screen: 'CreateSale',
      params: {item: item, key: 'edit'},
    });
  };

  useFocusEffect(
    useCallback(() => {
      getSaleSuccess();
    }, [getSaleSuccess]),
  );

  useEffect(() => {
    getAllCompaniesRef.current = getSaleSuccess;
  }, [getSaleSuccess]);

  return {
    loading,
    isConnected,
    loadMore,
    loadingMore,
    hasNextPage,
    onSubmitCreate,
    onSubmitEdit,
    saleSuccess
  };
}
