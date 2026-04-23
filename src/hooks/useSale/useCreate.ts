import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {useCallback, useEffect, useState} from 'react';
import useNetworkStore from '@/zustland/networkStore';
import {useToast} from '@/component/toast/ToastProvider';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  DropdownOptions,
  RootStackParamList,
  SalesParamList,
} from '@/navigation/types';
import type {CreateCompanyRequest} from '@/types';
import useDraftStore from '@/zustland/draftStore';
import type {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import {UpdateCompany} from '@/services/Company/UpdateCompany';
import { CreateCompany } from '@/services/Company/CreateSeller';
import { GetBuyers } from '@/services/Company/Buyers';
import { GetLine } from '@/services/Company/GetLine';
import { GetContactPerson } from '@/services/Company/GetcontactPerson';

export default function useSaleCreate(
  route: NativeStackScreenProps<SalesParamList, 'SalesCreate'>,
) {
  const {item, key} = route.route.params;
  const isConnected = useNetworkStore(s => s.isConnected);
  const [showDate, setShowDate] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {Draft, setDraft} = useDraftStore();
  const {show} = useToast();
  const [date, setDate] = useState<string>(moment(new Date()).format('DD/MM/YYYY'));
  const [errorDate, setErrorDate] = useState<string>('');
  const [companyList, setCompanyList] = useState<DropdownOptions[]>([]);
  const [lineList, setLineList] = useState<DropdownOptions[]>([]);
  const [keyValue, setKeyValue] = useState<string>('');
  const [selectedLineValues, setSelectedLineValues] = useState<Array<string | number>>([]);
  const [contactPersonList, setContactPersonList] = useState<DropdownOptions[]>([]);


  const validationSchema = Yup.object().shape({
    dealName: Yup.string().trim().required('Required'),
    company: Yup.string().trim().required('Required'),
    contactPerson: Yup.string().trim().required('Required'),
    products: Yup.string().trim().required('Required'),
    creditorAmount: Yup.string().trim(),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      dealName: '',
      company: '',
      contactPerson: '',
      products: '',
      creditorAmount: '0',
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (item) {
    //   const anyItem = item as any;
    //   setValue('companyName', anyItem.name ?? '');
    //   setValue('generalDirector', anyItem.ceo ?? '');
    //   setValue('companyPhone', anyItem.phones?.[0] ?? '');
    //   const companyGroupId = anyItem.companyGroup?.id ?? anyItem.companyGroupId;
    //   setValue('companyGroup', companyGroupId != null ? String(companyGroupId) : '');
    //   setValue('creditorAmount', String(item.creditorAmount ?? 0));
    //   setValue('debtorAmount', String(item.debtorAmount ?? 0));
    //   setValue('actualAddress', item.actualAddress ?? '');
    //   setValue('addressTT', item.addressTT?.join(',') ?? '');
    //   setValue('localAddress', item.localAddress ?? '');
    //   setValue('warehouseAddress', item.warehouseAddress ?? '');
    //   setDate(anyItem.clientRegisteredDate?.split?.(':')?.[0] ?? date);
    //   setLatitude(anyItem.latitude != null ? String(anyItem.latitude) : '');
    //   setLongitude(anyItem.longitude != null ? String(anyItem.longitude) : '');
    }
    setKeyValue(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, setValue, key]);

  // open date picker
  const onOpenDate = () => {
    setShowDate(true);
  };

  // clear date
  const onclearDate = () => {
    setDate('');
    setErrorDate('Required');
  };

  // close date picker
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


  // get Buyer
  const getBuyers = useCallback(async () => {
    if (!isConnected) return;
    await GetBuyers({
      onSuccess: res => {

        const { data } = res as { data: { id: number; name: string; assortmentId: number }[] };
        const companyOptions: any[] = data.map(
          (company: { name: string; assortmentId: number }) => ({
            label: company.name,
            value: company.assortmentId == null ? Math.random() * 1000000 : company.assortmentId,
          }),
        );
        setCompanyList(companyOptions as []);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });

  }, [isConnected, show])

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

  // get Contact Person
  const getContactPerson = useCallback(async () => {
    if (!isConnected) return;
    await GetContactPerson({
      onSuccess: res => {
        const { data } = res as { data: { id: number; firstName: string; lastName: string }[] };
        const companyOptions: any[] = data.map(
          (item: { firstName: string; lastName: string; id: number }) => ({
            label: `${item.firstName} ${item.lastName}`,
            value: item.id,
          }),
        );
        setContactPersonList(companyOptions as []);
      },
      onUnauthorized: () => {
        show('Unauthorized', { type: 'error' });
      },
      onError: () => {
        show('Failed to get company group', { type: 'error' });
      },
    });

  }, [isConnected, show])


  // create contact person
  const onSubmitCreateContactPerson = useCallback(async () => {
    navigation.navigate('SalesStack', {
      screen: 'CreateContactPerson',
    });
  }, [navigation]);

  // create company
  const onCreateCompany = useCallback(async () => {
    if (date === '') {
      setErrorDate('Required');
      return;
    }
    const data: CreateCompanyRequest = {
      // name: getValues().companyName,
      // clientRegisteredDate: `${moment(new Date()).format('DD/MM/YYYY')}:23:59:00`,
      // ogrnDate: `${date}:23:59:00`,
      // ceo: getValues().generalDirector,
      // phones: [getValues().companyPhone],
      // emails: [],
      // typeIds: [1],
      // cooperationId: 1,
      // companyGroupId: Number(getValues().companyGroup),
      // longitude: longitude,
      // latitude: latitude,
    };
    if (Number(getValues().creditorAmount) > 0) {
      data.creditorAmount = Number(getValues().creditorAmount);
    }

    // if offline, save to draft
    if (!isConnected) {
      const check = Draft.find(item => item.name === data.name);
      if(check) {
        show('Company already exists in draft', {type: 'error'});
        return;
      }
      data.key = 'Buyer'
      setDraft([...Draft, data]);
      show('Company saved to draft', {type: 'success'});
      navigation.goBack();
      return;
    }

    if (key === 'edit' && (item as any)?.id != null) {
      UpdateCompany((item as any).id, data, {
        onSuccess: () => {
          show('Company updated successfully', {type: 'success'});
          navigation.goBack();
        },
        onError: () => {
          show('Failed to update company', {type: 'error'});
        },
      });
    } else {
      CreateCompany(data, {
        onSuccess: () => {
          show('Company created successfully', {type: 'success'});
          navigation.goBack();
        },
        onUnauthorized: () => {
          show('Unauthorized', {type: 'error'});
        },
        onError: error => {
          show((error as Error)?.message ?? 'Failed to create company', {
            type: 'error',
          });
        },
      });
    }
  }, [
    getValues,
    date,
    show,
    navigation,
    Draft,
    setDraft,
    isConnected,
    item,
    key,
  ]);

  useFocusEffect(
    useCallback(() => {
      getBuyers();
      getLine()
      getContactPerson()
    }, [getBuyers, getLine, getContactPerson]),
  );


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
    companyList,
    isConnected,
    onCreateCompany,
    errorDate,
    keyValue,
    lineList,
    selectedLineValues, setSelectedLineValues,
    contactPersonList,
    onSubmitCreateContactPerson
  };
}

