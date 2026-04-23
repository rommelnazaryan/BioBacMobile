import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import useNetworkStore from '@/zustland/networkStore';
import { useToast } from '@/component/toast/ToastProvider';
import moment from 'moment';
import { GetBuyers } from '@/services/Company/Buyers';
import { DropdownOptions } from '@/navigation/types';
import { GetSeller } from '@/services/Company/GetSeller';
import { CreateContactPerson } from '@/services/Company/CreateContactPersion';
import { useNavigation } from '@react-navigation/native';

export default function useSaleCreateContactPerson() {
  const emailValidator = Yup.string().trim().email('Invalid email');
  const navigation = useNavigation();
  const isConnected = useNetworkStore(s => s.isConnected);
  const [showDate, setShowDate] = useState(false);
  const { show } = useToast();
  const [date, setDate] = useState<string>(
    moment(new Date()).format('DD/MM/YYYY'),
  );
  const [errorCompany, setErrorCompany] = useState<string>('');
  const [selectedBuyerSeller, setSelectedBuyerSeller] = useState<{
    buyer: boolean;
    seller: boolean;
  }>({
    buyer: false,
    seller: false,
  });
  const [companyList, setCompanyList] = useState<DropdownOptions[]>([]);
  const [phoneList, setPhoneList] = useState<string[]>([]);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('Required'),
    lastName: Yup.string().trim().required('Required'),
    phone: Yup.string().trim(),
    email: Yup.string().trim().email('Invalid email'),
    position: Yup.string().trim().required('Required'),
    company: Yup.string().trim(),
    notes: Yup.string().trim(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      position: '',
      company: '',
      notes: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  // open date picker
  const onOpenDate = () => {
    setShowDate(true);
  };

  // clear date
  const onclearDate = () => {
    setDate('');
  };

  // close date picker
  const onCloseDate = () => {
    setShowDate(false);
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
        const { data } = res as { data: { id: number; name: string }[] };
        const companyOptions: any[] = data.map(
          (item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
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
  }, [isConnected, show]);

  // get Seller
  const getSeller = useCallback(async () => {
    if (!isConnected) return;
    await GetSeller({
      onSuccess: res => {
        const { data } = res as { data: { id: number; name: string }[] };
        const companyOptions: any[] = data.map(
          (item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
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
  }, [isConnected, show]);

  // create contact person
  const onCreateContactPerson = useCallback(async () => {
    const phoneValue = getValues().phone?.trim();
    const phones = phoneValue
      ? phoneList.includes(phoneValue)
        ? phoneList
        : [...phoneList, phoneValue]
      : phoneList;
    const emailValue = getValues().email?.trim();
    const emails = emailValue && emailValidator.isValidSync(emailValue)
      ? emailList.includes(emailValue)
        ? emailList
        : [...emailList, emailValue]
      : emailList;

    if (
      (selectedBuyerSeller.buyer || selectedBuyerSeller.seller) &&
      !getValues().company
    ) {
      setErrorCompany('Required');
      return;
    }
    if (selectedBuyerSeller.buyer === true) {
      console.log('buyer');
    }
    if (selectedBuyerSeller.seller === true) {
      console.log('seller');
    }

    const data = {
      firstName: getValues().firstName,
      lastName: getValues().lastName,
      phones: phones,
      emails: emails,
      position: getValues().position,
      notes: getValues().notes,
      dob: `${date}:23:59:00`,
      createdAt: moment(new Date()).format('DD/MM/YYYY:HH:mm:ss'),
      updatedAt: moment(new Date()).format('DD/MM/YYYY:HH:mm:ss'),
      companyId: getValues().company,
      categoryType: selectedBuyerSeller.buyer ? 'BUYER' : 'SELLER',
    }
    console.log(data);
     CreateContactPerson(data, {
      onSuccess: () => {
        show('Contact person created successfully', {type: 'success'});
        setIsLoading(false);
        navigation.goBack();
      },
      onUnauthorized: () => {
        setIsLoading(false);
        show('Unauthorized', {type: 'error'});
      },
      onError: (error) => {
        setIsLoading(false);
        show((error as Error)?.message ?? 'Failed to create contact person', {type: 'error'});
      },
    });

  }, [date, emailList, emailValidator, getValues, phoneList, selectedBuyerSeller, show, navigation]);

  // select buyer or seller
  const onSelectBuyerSeller = (key: 'buyer' | 'seller') => {
    setSelectedBuyerSeller(prev => ({
      ...prev,
      [key]: !prev[key],
      [key === 'buyer' ? 'seller' : 'buyer']: false,
    }));
    if (key === 'buyer') {
      getBuyers();
    }
    if (key === 'seller') {
      getSeller();
    }
  };

  // handle plus click
  const handlePlusClick = () => {
    const phoneValue = getValues().phone?.trim();

    if (!phoneValue) {
      show('Please enter phone number', {type: 'error'});
      return;
    }

    if (phoneList.includes(phoneValue)) {
      show('Phone number already added', {type: 'error'});
      return;
    }

    setPhoneList(prev => [...prev, phoneValue]);
    setValue('phone', '');
  };

  const onRemovePhone = useCallback((phone: string) => {
    setPhoneList(prev => prev.filter(item => item !== phone));
  }, []);

  const handleEmailPlusClick = () => {
    const emailValue = getValues().email?.trim();

    if (!emailValue) {
      show('Please enter email', {type: 'error'});
      return;
    }

    if (!emailValidator.isValidSync(emailValue)) {
      show('Please enter valid email', {type: 'error'});
      return;
    }

    if (emailList.includes(emailValue)) {
      show('Email already added', {type: 'error'});
      return;
    }

    setEmailList(prev => [...prev, emailValue]);
    setValue('email', '');
  };

  const onRemoveEmail = useCallback((email: string) => {
    setEmailList(prev => prev.filter(item => item !== email));
  }, []);

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
    onCreateContactPerson,
    selectedBuyerSeller,
    onSelectBuyerSeller,
    errorCompany,
    companyList,
    isConnected,
    handlePlusClick,
    phoneList,
    onRemovePhone,
    handleEmailPlusClick,
    emailList,
    onRemoveEmail,
    isLoading
  };
}
