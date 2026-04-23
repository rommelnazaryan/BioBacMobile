import { useToast } from '@/component/toast/ToastProvider';
import { CreateCompany } from '@/services/Company/CreateSeller';
import { AllCompanyProps, CreateCompanyRequest } from '@/types';
import useDraftStore from '@/zustland/draftStore';
import useNetworkStore from '@/zustland/networkStore';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type {TabParamList} from '@/navigation/types';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
export default function useDraft() {
  const { Draft, setDraft } = useDraftStore();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const isConnected = useNetworkStore(s => s.isConnected);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>(0);
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  // submit cancel modal//
  const onSubmitCancel = () => {
    setVisible(false);
  };

  // submit confirm modal//
  const onSubmitConfirm = () => {
    setDraft(Draft.filter((item, index) => index !== id));
    setVisible(false);
  };

  // submit delete
  const onSubmitDelete = (draftIndex: number) => {
    setVisible(true);
    setId(draftIndex);
  }

  // submit confirm
  const onSubmit = (data:unknown,indexData:number) => {
    setLoading(true);
    if(!isConnected) {
      show('Please check your internet connection', { type: 'error' });
      setLoading(false);
      return;
    }
    CreateCompany(data as CreateCompanyRequest, {
      onSuccess: () => {
        show('Company created successfully', { type: 'success' });
        setDraft(Draft.filter((item, index) => indexData !== index));
        setLoading(false);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
        setLoading(false);
      },
      onError: (error) => {
        show((error as Error)?.message ?? 'Failed to create company', {
          type: 'error',
        });
        setLoading(false);
      },

    });  
  };


  // submit edit
  const onSubmitEdit = (data: unknown) => {
    const draft = data as AllCompanyProps & {key?: string};

    // SellerStack / BuyerStack are nested under HomeScreen tab
    if (draft.key === 'Buyer') {
      navigation.navigate('HomeScreen', {
        screen: 'BuyerStack',
        params: {
          screen: 'BuyerCreate',
          params: {item: draft, key: 'create'},
        },
      } as any);
      return;
    }

    navigation.navigate('HomeScreen', {
      screen: 'SellerStack',
      params: {
        screen: 'SellerCreate',
        params: {item: draft, key: 'create'},
      },
    } as any);
  }

  return { Draft, onSubmitDelete, setVisible, visible, onSubmitCancel, onSubmitConfirm,onSubmit,loading ,onSubmitEdit}
}