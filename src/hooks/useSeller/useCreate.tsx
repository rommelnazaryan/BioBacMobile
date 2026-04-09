import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import useNetworkStore from '@/zustland/networkStore';
import { useState } from 'react';
import { useToast } from '@/component/toast/ToastProvider';
import moment from 'moment';
import { GetCompanyGroup } from '@/services/Company/CompnayGroup';
import { useFocusEffect } from '@react-navigation/native';
import useCompanyGroupStore from '@/zustland/companyGroup';
import { CompanyGroupParamList, DropdownOptions, RootStackParamList } from '@/navigation/types';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import { CreateCompany } from '@/services/Company/CreateSeller';
import { useNavigation } from '@react-navigation/native';
import type { CreateCompanyRequest } from '@/types';
import useDraftStore from '@/zustland/draftStore';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SellerParamList } from '@/navigation/types';
import { UpdateCompany } from '@/services/Company/UpdateCompany';
export default function useSellerCreate(route: NativeStackScreenProps<SellerParamList, 'SellerCreate'>) {
  const {item, key} = route.route.params;
  const isConnected = useNetworkStore(s => s.isConnected);
  const [showDate, setShowDate] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { companyGroup, setCompanyGroup } = useCompanyGroupStore();
  const { Draft, setDraft } = useDraftStore();
  const [companyGroupList, setCompanyGroupList] = useState<DropdownOptions[]>([]);
  const { show } = useToast();
  const [date, setDate] = useState<string>(
    moment(new Date()).format('DD/MM/YYYY'),
  );
  const [keyValue, setKeyValue] = useState<string>('');
  const [errorDate, setErrorDate] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [showMap, setShowMap] = useState(false);


  const validationSchema = Yup.object().shape({
    companyName: Yup.string().trim().required('Required'),
    generalDirector: Yup.string().trim().required('Required'),
    companyPhone: Yup.string().trim().required('Required'),
    companyGroup: Yup.string().trim().required('Required'),
    creditorAmount: Yup.string().trim(),
    debtorAmount: Yup.string().trim(),
    actualAddress: Yup.string().trim(),
    addressTT: Yup.string().trim(),
    localAddress: Yup.string().trim(),
    warehouseAddress: Yup.string().trim(),
  });



  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      companyName: '',
      companyPhone: '',
      actualAddress: '',
      addressTT: '',
      localAddress: '',
      warehouseAddress: '',
      creditorAmount: '0',
      debtorAmount: '0',
      companyGroup: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });


  useEffect(() => {
    if (item) {
     const anyItem = item as any;
     setValue('companyName', anyItem.name ?? '');
     setValue('generalDirector', anyItem.ceo ?? '');
     setValue('companyPhone', anyItem.phones?.[0] ?? '');
     // online item has companyGroup.id, draft has companyGroupId
     const companyGroupId = anyItem.companyGroup?.id ?? anyItem.companyGroupId;
     setValue('companyGroup', companyGroupId != null ? String(companyGroupId) : '');
     setValue('creditorAmount', String(anyItem.creditorAmount ?? 0));
     setValue('debtorAmount', String(anyItem.debtorAmount ?? 0));
     setValue('actualAddress', anyItem.actualAddress ?? '');
     setValue('addressTT', Array.isArray(anyItem.addressTT) ? anyItem.addressTT.join(',') : (anyItem.addressTT ?? ''));
     setValue('localAddress', anyItem.localAddress ?? '');
     setValue('warehouseAddress', anyItem.warehouseAddress ?? '');
     setDate(anyItem.clientRegisteredDate?.split?.(':')?.[0] ?? date);
     setLatitude(anyItem.latitude != null ? String(anyItem.latitude) : '');
     setLongitude(anyItem.longitude != null ? String(anyItem.longitude) : '');
   }
   setKeyValue(key);
  }, [item, setValue, date, key]);

  // open date picker
  const onOpenDate = () => {
    setShowDate(true);
  };

  // clear date//
  const onclearDate = () => {
    setDate('');
    setErrorDate('Required');
  };

  // close date picker (used by modal overlay)
  const onCloseDate = () => {
    setShowDate(false);
    setErrorDate('');
  };

  // confirm selected date
  const onConfirmDate = (payload: {
    day: number;
    month: number;
    year: number;
    dateString: string;
    timestamp: number;
  }) => {
    const dd = String(payload.day).padStart(2, '0');
    const mm = String(payload.month).padStart(2, '0');
    setDate(`${dd}/${mm}/${payload.year}`);
    setShowDate(false);
  };

  // get company group
  const getCompanyGroup = useCallback(async () => {
    if (!isConnected) return;
    await GetCompanyGroup({
      onSuccess: res => {
        const { data } = res as { data: CompanyGroupParamList[] };
        const companyGroupOptions: DropdownOptions[] = data.map(
          (group: CompanyGroupParamList) => ({
            label: group.name,
            value: group.id,
          }),
        );
        setCompanyGroup(companyGroupOptions);
        setCompanyGroupList(companyGroupOptions)
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });
  }, [isConnected, show, setCompanyGroup]);



  // get location //
  const onPressGetLocation = async () => {
    if (!isConnected) {
      show('Please check your internet connection', { type: 'error' });
      return;
    }
    setShowMap(true);
  };

  // close map modal
  const onCloseMap = () => {
    setShowMap(false);
  };

  // submit map modal
  const onSubmitMap = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setShowMap(false);
  };


  // create company //
  const onCreateCompany = useCallback(async () => {
    if (date === '') {
      setErrorDate('Required');
      return;
    }

    const data: CreateCompanyRequest = {
      name: getValues().companyName,
      clientRegisteredDate: `${moment(new Date()).format('DD/MM/YYYY')}:23:59:00`,
      ogrnDate: `${date}:23:59:00`,
      ceo: getValues().generalDirector,
      phones: [
        getValues().companyPhone
      ],
      emails: [],
      typeIds: [2],
      cooperationId: 1,
      companyGroupId: Number(getValues().companyGroup),
      longitude: longitude,
      latitude: latitude,
    }
    if (Number(getValues().creditorAmount) > 0) {
      data.creditorAmount = Number(getValues().creditorAmount);
    }
    if (Number(getValues().debtorAmount) > 0) {
      data.debtorAmount = Number(getValues().debtorAmount);
    }
    if (getValues().actualAddress !== '') {
      data.actualAddress = getValues().actualAddress;
    }
    if (getValues().addressTT !== '') {
      data.addressTT = [getValues().addressTT ?? ''];
    }
    if (getValues().localAddress !== '') {
      data.localAddress = getValues().localAddress;
    }
    if (getValues().warehouseAddress !== '') {
      data.warehouseAddress = getValues().warehouseAddress;
    }
    // if offline, save to draft//
    if (!isConnected) {
      const check = Draft.find(item => item.name === data.name);
      if(check) {
        show('Company already exists in draft', {type: 'error'});
        return;
      }
      data.key = 'Seller'
      setDraft([...Draft, data]);
      show('Company saved to draft', { type: 'success' });
      navigation.goBack();
      return;
    }
    if (key === 'edit' && (item as any)?.id != null) {
      UpdateCompany((item as any).id, data, {
        onSuccess: () => {
          show('Company updated successfully', { type: 'success' });
          navigation.goBack();
        },
        onError: () => {
          show('Failed to update company', {type: 'error'});
        },
      });
    } else {
    CreateCompany(data, {
      onSuccess: () => {
        show('Company created successfully', { type: 'success' });
        navigation.goBack();
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: (error) => {
        console.log('error', error);
        show((error as Error)?.message ?? 'Failed to create company', {
          type: 'error',
        });
      },
    });
    }
  }, [getValues, date, show, longitude, latitude, navigation, Draft, setDraft, isConnected, item, key]);



  useFocusEffect(
    useCallback(() => {
      getCompanyGroup();
    }, [getCompanyGroup])
  );


  useRefetchOnReconnect(getCompanyGroup);
  return {
    control,
    handleSubmit,
    errors,
    onOpenDate,
    onclearDate,
    onCloseDate,
    date,
    showDate,
    onConfirmDate,
    companyGroupList,
    companyGroup,
    isConnected,
    onPressGetLocation,
    showMap,
    onCloseMap,
    onSubmitMap,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    onCreateCompany,
    errorDate,
    keyValue
  }
}

