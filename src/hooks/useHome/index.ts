import {useCallback, useEffect, useRef, useState} from 'react';
import {AllCompanyProps, GetProfileResponse} from '@/types';
import {GetProfile} from '@/services/Profile';
import useProfileStore from '@/zustland/profileStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {refreshTokenService} from '@/services/AuthService/RefreshToken';
import useAuthStore from '@/zustland/authStore';
import useNetworkStore from '@/zustland/networkStore';
import {GetAllCompanies} from '@/services/Company/AllCompanies';
import { DeleteCompany } from '@/services/Company/DeleteCompany';
import { useToast } from '@/component/toast/ToastProvider';

export default function useHome() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>(0);
  const {show} = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {setProfile} = useProfileStore();
  const isConnected = useNetworkStore(s => s.isConnected);
  const {refreshToken, setToken, setRefreshToken} = useAuthStore();
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getAllCompaniesRef = useRef<() => void>(() => {});
  const [allCompanies, setAllCompanies] = useState<AllCompanyProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  // get profile //
  const getProfile = useCallback(() => {
    if (isConnected) {
      GetProfile({
        onSuccess: res => {
          const {data} = res as {data: GetProfileResponse};
          // const result = comparePermissions({
          //   fullPermissions: permissions,
          //   userPermissions: data.permissions,
          // });
          // const groupsData = orderGrouped(
          //   result.grouped,
          //   ['BUYER', 'SELLER', 'PAYMENT', 'PAYMENT_HISTORY', 'RETURN_PRODUCT'],
          //   {
          //     includeEmpty: true,
          //   },
          // ).map(g => {
          //   const enabled = g.items.filter(x => x.has).length;
          //   const meta = getGroupMeta(g.key);
          //   return {
          //     key: g.key,
          //     label: meta.label,
          //     iconLibrary: meta.icon.library,
          //     iconName: meta.icon.name,
          //     enabled,
          //     total: g.items.length,
          //     iconSize: meta.icon.size,
          //     items: g.items, // <-- permissions
          //   };
          // });
          // setGroupsStore(groupsData as unknown as HomeListProps[]);
          // setGroups(groupsData as unknown as HomeListProps[]);
          setProfile(data);
        },
        onUnauthorized: () => {
          refreshTokenService(refreshToken, {
            onSuccess: data => {
              const {
                data: {accessToken, refreshToken},
              } = data as {
                data: {accessToken: string; refreshToken: string};
              };
              setToken(accessToken);
              setRefreshToken(refreshToken);
              // GetProfile({
              //   onSuccess: res => {
              //     const {data} = res as {data: GetProfileResponse};
              //     const result = comparePermissions({
              //       fullPermissions: permissions,
              //       userPermissions: data.permissions,
              //     });
              //     const groupsData = orderGrouped(
              //       result.grouped,
              //       ['BUYER', 'SELLER'],
              //       {
              //         includeEmpty: true,
              //       },
              //     ).map(g => {
              //       const enabled = g.items.filter(x => x.has).length;
              //       const meta = getGroupMeta(g.key);
              //       return {
              //         key: g.key,
              //         label: meta.label,
              //         iconLibrary: meta.icon.library,
              //         iconName: meta.icon.name,
              //         enabled,
              //         total: g.items.length,
              //         iconSize: meta.icon.size,
              //         items: g.items, // <-- permissions
              //       };
              //     });
              //     setGroups(groupsData as unknown as HomeListProps[]);
              //     setProfile(data);
              //     setLoading(false);
              //   },
              //   onError: () => {
              //     setLoading(false);
              //   },
              // });
            },
            onError: () => {
              getProfile();
            },
          });
        },
        onError: () => {
          setLoading(false);
        },
      });
    } 
  }, [
    setProfile,
    setToken,
    setRefreshToken,
    refreshToken,
    isConnected,
  ]);

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
    return GetAllCompanies(page, 0, {
      onSuccess: payload => {
        const {data} = payload as {data: AllCompanyProps[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };
        // page=0 -> replace, page>0 -> append
        setAllCompanies(prev => (page === 0 ? data : [...prev, ...data]));

        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(page + 1 < metadata.totalPages);
        }
        setRefreshing(false);
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
    navigation.navigate('HomeCreate', {
      item: undefined,
      key: 'create',
    });
  };

  // submit refresh //
  const onSubmitRefresh = () => {
    setRefreshing(true);
    getAllCompanies();
  };

  // submit edit //
  const onSubmitEdit = (company: AllCompanyProps) => {
    navigation.navigate('HomeCreate', {
      item: company,
      key: 'edit',
    });
  };

  // submit detail //
  const onSubmitDetail = (company: AllCompanyProps) => {
    navigation.navigate('Detail', {item: company});
  };

  useFocusEffect(
    useCallback(() => {
      getProfile();
      getAllCompanies();
    }, [getProfile, getAllCompanies]),
  );


  useEffect(() => {
    getAllCompaniesRef.current = getAllCompanies;
  }, [getAllCompanies]);
  
  return {
    loading,
    allCompanies,
    isConnected,
    loadMore,
    loadingMore,
    hasNextPage,
    onSubmitDelete,
    onSubmitConfirm,
    onSubmitCancel,
    onSubmitCreate,
    onSubmitEdit,
    visible,
    onSubmitDetail,
    onSubmitRefresh,
    refreshing
  };
}
