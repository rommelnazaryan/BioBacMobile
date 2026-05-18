import { GetProfileResponse, ListProps } from "@/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import useNetworkStore from "@/zustland/networkStore";
import { GetProfile } from "@/services/Profile";
import { useCallback, useEffect } from "react";
import useProfileStore from "@/zustland/profileStore";
import {refreshTokenOnce} from "@/services/AuthService/refreshTokenOnce";

export default function useHome() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isConnected = useNetworkStore(s => s.isConnected);
  const {setProfile} = useProfileStore();
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
          refreshTokenOnce()
            .then(() => {
              getProfile();
            })
            .catch(() => {});
        },
        onError: () => {
        },
      });
    } 
  }, [
    setProfile,
    isConnected,
  ]);


  // submit detail //
  const onSubmitDetail = (value: ListProps) => {
    switch (value.key) { 
      case 'Company':
        navigation.navigate('CompanyStack');
        break;
      case 'AccountList':
        navigation.navigate('AccountListStack');
        break;
      case 'Warehouse':
        navigation.navigate('WarehouseStack');
        break;
      case 'Pre-order':
        navigation.navigate('PreOrderStack');
        break;
      case 'Printer':
        navigation.navigate('Printer');
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    if (isConnected) {
      getProfile();
    }
  }, [isConnected, getProfile]);

  return{
    onSubmitDetail
  }
}