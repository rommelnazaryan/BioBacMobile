import { AdditionalItemsParamList } from '@/navigation/types';
import { HomeListProps } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import useNetworkStore from '@/zustland/networkStore';

export default function useAdditionalItems() {
  const isConnected = useNetworkStore(s => s.isConnected);
  const navigation =
    useNavigation<NativeStackNavigationProp<AdditionalItemsParamList>>();

  // submit detail //
  const onSubmitDetail = (value: HomeListProps) => {
    switch (value.key) {
      case 'AccountList':
        navigation.navigate('AccountListStack');
        break;
    }
  };

  return {
    isConnected,
    onSubmitDetail,
  };
}
