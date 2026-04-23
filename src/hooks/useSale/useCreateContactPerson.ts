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

export default function useSaleCreateContactPerson() {
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
    console.log('onCreateContactPerson');
    console.log(getValues(), date);
    if (
      (selectedBuyerSeller.buyer || selectedBuyerSeller.seller) &&
      !getValues().company?.trim()
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
  }, [getValues, selectedBuyerSeller, date]);

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
  };
}
