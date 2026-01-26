import {useCallback, useState} from 'react';
import {GetProfileResponse} from '@/types';
import {GetProfile} from '@/services/Profile';
import useProfileStore from '@/zustland/profileStore';
import {comparePermissions, orderGrouped} from '@/permissions/engine';
import usePermissionStore from '@/zustland/permissionStore';
import {getGroupMeta} from '@/permissions/groupMeta';
import {HomeListProps} from '@/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {refreshTokenService} from '@/services/AuthService/RefreshToken';
import useAuthStore from '@/zustland/authStore';
import useGroupStore from '@/zustland/GroupStore';
import useNetworkStore from '@/zustland/networkStore';

export default function useHome() {
  const [loading, setLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {setProfile} = useProfileStore();
  const isConnected = useNetworkStore(s => s.isConnected);
  const {refreshToken, setToken, setRefreshToken} = useAuthStore();
  const {groupsStore, setGroupsStore} = useGroupStore();
  const {permissions} = usePermissionStore();
  const [groups, setGroups] = useState<HomeListProps[]>([]);

  // get profile //
  const getProfile = useCallback(() => {
    if (isConnected) {
      setLoading(true);
      GetProfile({
        onSuccess: res => {
          const {data} = res as {data: GetProfileResponse};
          const result = comparePermissions({
            fullPermissions: permissions,
            userPermissions: data.permissions,
          });
          const groupsData = orderGrouped(
            result.grouped,
            ['BUYER', 'SELLER', 'PAYMENT', 'PAYMENT_HISTORY'],
            {
              includeEmpty: true,
            },
          ).map(g => {
            const enabled = g.items.filter(x => x.has).length;
            const meta = getGroupMeta(g.key);
            return {
              key: g.key,
              label: meta.label,
              iconLibrary: meta.icon.library,
              iconName: meta.icon.name,
              enabled,
              total: g.items.length,
              iconSize: meta.icon.size,
              items: g.items, // <-- permissions
            };
          });
          setGroupsStore(groupsData as unknown as HomeListProps[]);
          setGroups(groupsData as unknown as HomeListProps[]);
          setProfile(data);
          setLoading(false);
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
              setLoading(false);
            },
          });
        },
        onError: () => {
          setLoading(false);
        },
      });
    } else {
      setLoading(false);
    }
  }, [
    setProfile,
    permissions,
    setToken,
    setRefreshToken,
    refreshToken,
    setGroupsStore,
    isConnected,
  ]);

  // navigate to detail //
  const navigateToDetail = useCallback(
    (item: HomeListProps) => {
      switch (item.key) {
        case 'BUYER':
          navigation.navigate('BuyerStack', {
            screen: 'Buyers',
            params: {item},
          });
          break;
        case 'SELLER':
          navigation.navigate('SellerStack', {
            screen: 'Seller',
            params: {item},
          });
          break;
        case 'PAYMENT':
          navigation.navigate('Payment');
          break;
        case 'PAYMENT_HISTORY':
          navigation.navigate('PaymentHistory');
          break;
        default:
          console.warn(`Unknown home item key: ${item.key}`);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [getProfile]),
  );


  return {
    loading,
    groups,
    navigateToDetail,
    groupsStore,
    isConnected
  };
}
