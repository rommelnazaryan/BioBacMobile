import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback, useEffect} from 'react';
import type {RootStackParamList} from '../navigation/types';
import useAuthStore from '@/zustland/authStore';
import useNetworkStore from '@/zustland/networkStore';
import {GetAllPermissions} from '@/services/Permissions/GetPermissions';
import {GetAllPermissionsResponse} from '@/types';
import usePermissionStore from '@/zustland/permissionStore';
import {refreshTokenOnce} from '@/services/AuthService/refreshTokenOnce';
export default function useSplash() {
  const {isLoggedIn} = useAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {setPermissions,permissions} = usePermissionStore();
  const isConnected = useNetworkStore(s => s.isConnected);
  // get all permissions //
  const getAllPermissions = useCallback(async () => {
    await GetAllPermissions({
      onSuccess: res => {
        const {data} = res as {data: GetAllPermissionsResponse[]};
        setPermissions(data);
        navigation.reset({index: 0, routes: [{name: 'Tabs'}]});
      },
      onError: () => {},
      onUnauthorized: () => {
        refreshTokenOnce().then(() => {
          getAllPermissions();
        });
      }
    })
  }, [setPermissions, navigation]);

  useEffect(() => {
    setTimeout(() => {
      if (isLoggedIn) {
        if (isConnected) {
          getAllPermissions();
          return;
        } else {
          navigation.reset({index: 0, routes: [{name: 'Tabs'}]});
        }
      } else {
        navigation.reset({index: 0, routes: [{name: 'SignIn'}]});
      }
    }, 2000);
  }, [navigation, isLoggedIn, getAllPermissions, isConnected,permissions]);
}
