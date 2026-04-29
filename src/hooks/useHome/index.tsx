import { ListProps } from "@/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";

export default function useHome() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // submit detail //
  const onSubmitDetail = (value: ListProps) => {
    switch (value.key) { 
      case 'Company':
        navigation.navigate('CompanyStack');
        break;
      case 'Sales':
        navigation.navigate('SalesStack');
        break;
      default:
        break;
    }
  };

  return{
    onSubmitDetail
  }
}