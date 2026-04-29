import {useCallback, useEffect, useRef, useState} from 'react';
import {AllCompanyProps, GetProfileResponse} from '@/types';
import {GetProfile} from '@/services/Profile';
import useProfileStore from '@/zustland/profileStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CompanyParamList} from '@/navigation/types';
import {refreshTokenService} from '@/services/AuthService/RefreshToken';
import useAuthStore from '@/zustland/authStore';
import useNetworkStore from '@/zustland/networkStore';
import {GetAllCompanies} from '@/services/Company/AllCompanies';
import { DeleteCompany } from '@/services/Company/DeleteCompany';
import { useToast } from '@/component/toast/ToastProvider';
import { GetLine } from '@/services/Company/GetLine';
import { GetByLines } from '@/services/Company/GetByLines';
import useAllCompanyCashStore from '@/zustland/allCompanyCash';

export default function useCompany() {
  const LINE_SELECTION_DELAY_MS = 2000;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>(0);
  const {show} = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<CompanyParamList>>();
  const {setProfile} = useProfileStore();
  const isConnected = useNetworkStore(s => s.isConnected);
  const {refreshToken, setToken, setRefreshToken} = useAuthStore();
  const {allCompanyCash, setAllCompanyCash} = useAllCompanyCashStore();
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const getAllCompaniesRef = useRef<() => void>(() => {});
  const [allCompanies, setAllCompanies] = useState<AllCompanyProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lineList, setLineList] = useState<any[]>([]);
  const [selectedLineValues, setSelectedLineValues] = useState<Array<number>>([]);
  const selectedLineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mergeUniqueCompanies = useCallback((current: AllCompanyProps[], incoming: AllCompanyProps[]) => {
    const byId = new Map<number, AllCompanyProps>();

    current.forEach(company => {
      byId.set(company.id, company);
    });

    incoming.forEach(company => {
      byId.set(company.id, company);
    });

    return Array.from(byId.values());
  }, []);

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
                data: {accessToken, refreshToken: nextRefreshToken},
              } = data as {
                data: {accessToken: string; refreshToken: string};
              };
              setToken(accessToken);
              setRefreshToken(nextRefreshToken);
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

  // get  company data //
  const getAllCompanies = useCallback((search?: string, targetPage = page) => {
    if (!isConnected) {
      setLoading(false);
      return;
    }
    if (targetPage === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    return GetAllCompanies(targetPage, 0, search, {
      onSuccess: payload => {
        const {data} = payload as {data: AllCompanyProps[]};
        const {metadata} = payload as unknown as {
          metadata: {page: number; last: boolean; totalPages: number};
        };
        // page=0 -> replace, page>0 -> append
        setAllCompanies(prev => (targetPage === 0 ? data : [...prev, ...data]));
        setAllCompanyCash(prev =>
          targetPage === 0 ? mergeUniqueCompanies([], data) : mergeUniqueCompanies(prev, data),
        );
        // update hasNextPage if backend provides it
        if (typeof metadata?.last === 'boolean') {
          setHasNextPage(!metadata.last);
        } else if (typeof metadata?.totalPages === 'number') {
          setHasNextPage(targetPage + 1 < metadata.totalPages);
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
  }, [page, isConnected, setAllCompanyCash, mergeUniqueCompanies]);


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
    setPage(0);
    setHasNextPage(true);
    getAllCompanies(undefined, 0);
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

  // get Line
  const getLine = useCallback(async () => {
    if (!isConnected) return;
    await GetLine({
      onSuccess: res => {
        const { data } = res as { data: { id: number; name: string}[] };
        const companyOptions: any[] = data.map(
          (item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
          }),
        );
        setLineList(companyOptions as []);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });

  }, [isConnected, show])

  const getCompaniesByLines = useCallback(async (lineValues: Array<number>) => {
    setLoading(true);
    if (!isConnected) {
      setLoading(false);
      return;
    }
    await GetByLines(lineValues, {
      onSuccess: res => {
        const { data } = res as { data: AllCompanyProps[] };
        setAllCompanies(data);
        setLoading(false);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
        setLoading(true);
      },
      onError: (error) => {
        show((error as Error).message, { type: 'error' });
        setLoading(true);
      },
    });
  }, [isConnected, show]);

  const onChangeSelectedLineValues = useCallback((values: Array<number>) => {
    setSelectedLineValues(values);
  }, []);


  // submit filter //
  const onSubmitFilter = useCallback(async() => {
    await getCompaniesByLines(selectedLineValues);
  }, [getCompaniesByLines, selectedLineValues]);

  // submit reset //
  const onSubmitReset = () => {
    if (selectedLineTimeoutRef.current) {
      clearTimeout(selectedLineTimeoutRef.current);
      selectedLineTimeoutRef.current = null;
    }

    setSelectedLineValues([]);
    setPage(0);
    setHasNextPage(true);
    getAllCompanies(undefined, 0);
  };



  useFocusEffect(
    useCallback(() => {
      getProfile();
      getAllCompanies();
      getLine();
    }, [getProfile, getAllCompanies, getLine]),
  );


  // submit search //
  const onSubmitSearch = (text: string) => {
    setPage(0);
    setHasNextPage(true);
    getAllCompanies(text, 0);
  };



  useEffect(() => {
    getAllCompaniesRef.current = getAllCompanies;
  }, [getAllCompanies]);

  useEffect(() => {
    if (selectedLineTimeoutRef.current) {
      clearTimeout(selectedLineTimeoutRef.current);
    }

    if (selectedLineValues.length === 0) {
      setPage(0);
      setHasNextPage(true);
      getAllCompanies(undefined, 0);
      return;
    }

    selectedLineTimeoutRef.current = setTimeout(() => {
      getCompaniesByLines(selectedLineValues);
    }, LINE_SELECTION_DELAY_MS);

    return () => {
      if (selectedLineTimeoutRef.current) {
        clearTimeout(selectedLineTimeoutRef.current);
      }
    };
  }, [getAllCompanies, getCompaniesByLines, selectedLineValues]);

  useEffect(() => {
    return () => {
      if (selectedLineTimeoutRef.current) {
        clearTimeout(selectedLineTimeoutRef.current);
      }
    };
  }, []);
  
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
    refreshing,
    onSubmitSearch,
    lineList,
    onSubmitFilter,
    selectedLineValues,
    onChangeSelectedLineValues,
    onSubmitReset,
    allCompanyCash
  };
}
