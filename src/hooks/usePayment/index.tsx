import {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {GetPaymentCategory} from '@/services/Payment/PaymentCategory';
import {GetCompanyAccount} from '@/services/Company/Account';
import {
  GetAccountResponse,
  GetPaymentTypeResponse,
  PaymentCategoryNode,
} from '@/types';
import {useToast} from '@/component/toast/ToastProvider';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {type FieldErrors, useForm} from 'react-hook-form';
import { CreatePayment } from '@/services/Payment/CreatePayment';
import useNetworkStore from '@/zustland/networkStore';
import useRefetchOnReconnect from '../useRefetchOnReconnect';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type Option = {label: string; value: string};
type PaymentFormValues = {
  account: string;
  amount: string;
  comment: string;
  type: string;
  listType: string;
  category0: string;
};

export default function usePayment() {
  const isConnected = useNetworkStore(s => s.isConnected);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showDate, setShowDate] = useState(false);
  const {show} = useToast();
  const [date, setDate] = useState<string>(
    moment(new Date()).format('DD/MM/YYYY'),
  );
  const [account, setAccount] = useState<{label: string; value: string}[]>([]);
  const [typeName, setTypeName] = useState<{label: string; value: string}[]>(
    [],
  );
  const [listType, setListType] = useState<{label: string; value: string}[]>(
    [],
  );
  const [type, setType] = useState<GetPaymentTypeResponse[]>([]);
  const [typeFilterName, setTypeFilterName] = useState<string>('');
  const [categoryLevels, setCategoryLevels] = useState<Option[][]>([]);
  const [categoryPath, setCategoryPath] = useState<Option[]>([]);
  const [selectedLeafCategory, setSelectedLeafCategory] = useState<Option | null>(
    null,
  );
  const [categoryResetKey, setCategoryResetKey] = useState(0);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [listTypeId, setListTypeId] = useState<string>('');
  const [result, setResult] = useState<{
    date: string;
    account: string;
    type: string;
    category: string;
    categoryChild: string;
  }>({
    date: '',
    account: '',
    type: '',
    category: '',
    categoryChild: '',
  });

  const buildOptions = useCallback(
    (nodes: PaymentCategoryNode[] = []): Option[] => {
      return nodes.map(n => ({
        label: n.name,
        value: String(n.id ?? n.parentId ?? n.name),
      }));
    },
    [],
  );
  // get root categories//
  const getRootCategories = useCallback((): PaymentCategoryNode[] => {
    const res = type.find(item => item.root === typeFilterName);
    return res?.categories ?? [];
  }, [type, typeFilterName]);
  // validation schema//
  const validationSchema = Yup.object().shape({
    account: Yup.string().trim().required('Required'),
    amount: Yup.string().trim().required('Required'),
    comment: Yup.string().trim().required('Required'),
    type: Yup.string().trim().required('Required'),
    listType: Yup.string().trim().required('Required'),
    category0: Yup.string().trim().required('Required'),
  });

  
  const {
    control,
    handleSubmit,
    formState: {errors, submitCount},
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      account: '',
      amount: '',
      comment: '',
      type: '',
      listType: '',
      category0: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  // open date picker
  const onOpenDate = () => {
    setShowDate(true);
  };
 
  // clear date//
  const onclearDate = () => {
    setDate('');
  };

  // close date picker (used by modal overlay)
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
    setResult(prev => ({...prev, date: date}));
    setShowDate(false);
  };

  // get payment category
  const getPaymentCategory = useCallback(async () => {
    await GetPaymentCategory({
      onSuccess: res => {
        const {data} = res as {data: GetPaymentTypeResponse[]};
        const typeOptions: {label: string; value: string}[] = data.map(
          (item, index) => ({
            label: item.root,
            value: index.toString(),
          }),
        );
        setTypeName(typeOptions);
        setType(data);
      },
      onError: () => {
      },
      onUnauthorized: () => {
      },
    });
  }, []);

  // get company account
  const getCompanyAccount = useCallback(async () => {
    await GetCompanyAccount({
      onSuccess: res => {
        const {data} = res as {data: GetAccountResponse[]};
        const accountOptions: {label: string; value: string}[] = data.map(
          item => ({
            label: item.name,
            value: item.id.toString(),
          }),
        );
        setAccount(accountOptions);
      },
      onError: error => {
        show((error as Error).message, {type: 'error'});
      },
      onUnauthorized: error => {
      },
    });
  }, [show]);

  // submit filter list type (Type)
  const onSubmitFilterList = ({label}: {label: string}) => {
    const res = type.find(item => item.root === label);
    const resultFilterList = res?.rootItems.map(
      (item: {name: string; targetId: number}) => ({
        label: item.name,
        value: item.targetId.toString(),
      }),
    );
    setListType(resultFilterList ?? []);
    setTypeFilterName(label);
    setCategoryName(label);

    // reset dependent selections when Type changes
    setListTypeId('');
    setCategoryLevels([]);
    setCategoryPath([]);
    setSelectedLeafCategory(null);
    setCategoryResetKey(k => k + 1);
    setValue('listType', '');
    setValue('category0', '');
  };

  // submit filter category
  const onSubmitFilterCategory = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => {
    // list-of-type changed -> user must re-select categories
    setCategoryResetKey(k => k + 1);
    // reset required first category selection
    setValue('category0', '');
    const rootCategories = getRootCategories();
    const firstLevel = buildOptions(rootCategories);
    setCategoryLevels(firstLevel.length > 0 ? [firstLevel] : []);
    setCategoryPath([]);
    setSelectedLeafCategory(null);
    // keep previous behavior of saving selected "list type" label
    setResult(prev => ({...prev, category: label, categoryChild: ''}));
    setListTypeId(value);
  };

   // onSelect Category Level
  const onSelectCategoryLevel = useCallback(
    (levelIndex: number, selected: Option) => {
      const nextPath = [...categoryPath.slice(0, levelIndex), selected];
      setCategoryPath(nextPath);
      // last chosen item (leaf will always be the latest selected)
      setSelectedLeafCategory(selected);
      if (levelIndex === 0) {
        setValue('category0', selected.value, {shouldValidate: true});
      }

      // walk the tree using the selected values
      let nodes: PaymentCategoryNode[] = getRootCategories();
      let selectedNode: PaymentCategoryNode | undefined;

      for (const step of nextPath) {
        selectedNode = nodes.find(
          n => String(n.id ?? n.parentId ?? n.name) === step.value,
        );
        nodes = selectedNode?.children ?? [];
      }

      const nextOptions = buildOptions(nodes);
      setCategoryLevels(prev => {
        const trimmed = prev.slice(0, levelIndex + 1);
        return nextOptions.length > 0 ? [...trimmed, nextOptions] : trimmed;
      });

      // store leaf selection label path (useful for submit)
      setResult(prev => ({
        ...prev,
        categoryChild: nextPath.map(x => x.label).join(' / '),
      }));
    },
    [buildOptions, categoryPath, getRootCategories, setValue],
  );

  // onSubmit Discard
  const onSubmitDiscard = () => {
    setVisibleModal(true);
  };

  // submit payment
  const onSubmit = () => {
    if (!isConnected) {
      show('Please check your internet connection', {type: 'error'});
      return;
    }

    // if (!selectedLeafCategory?.value) {
    //   show('Please select a category', {type: 'error'});
    //   return;
    // }

    CreatePayment(
      {
        accountId: Number(getValues().account),
        category: categoryName,
        date: `${date}:23:59:00`,
        notes: getValues().comment,
        paymentCategoryId: Number(selectedLeafCategory?.value),
        sum: Number(getValues().amount),
        targetId: Number(listTypeId),
      },
      {
        onSuccess: () => {
          // clear selections but keep date + loaded dropdown data
          setAccount([]);
          setTypeName([]);
          setListType([]);
          setCategoryLevels([]);
          setCategoryPath([]);
          setSelectedLeafCategory(null);
          setCategoryResetKey(k => k + 1);
          setCategoryName('');
          setListTypeId('');
          reset({
            account: '',
            amount: '',
            comment: '',
            type: '',
            listType: '',
            category0: '',
          });
          show('Payment created successfully', {type: 'success'});
          // navigation.navigate('PaymentHistory');
        },
        onError: error => {
          show((error as Error)?.message ?? 'Error', {type: 'error'});
        },
        onUnauthorized: error => {
          show('Unauthorized', {type: 'error'});
        },
      },
    );
  };

  // onSubmit modal Cancel
  const onSubmitCancel = () => {
    setVisibleModal(false);
  };

  // onSubmit modal Confirm
  const onSubmitConfirm = () => {
    navigation.goBack()
  };

  const onInvalidSubmit = () => {
    show('Please complete required fields', {type: 'error'});
  };

  useFocusEffect(
    useCallback(() => {
      getPaymentCategory();
      getCompanyAccount();
    }, [getPaymentCategory, getCompanyAccount]),
  );

  useRefetchOnReconnect(getCompanyAccount);

  return {
    date,
    showDate,
    setShowDate,
    onOpenDate,
    onCloseDate,
    onConfirmDate,
    account,
    typeName,
    onSubmitFilterList,
    onSubmitFilterCategory,
    listType,
    categoryLevels,
    categoryPath,
    onSelectCategoryLevel,
    selectedLeafCategory,
    categoryResetKey,
    onSubmit,
    onInvalidSubmit,
    setResult,
    control,
    handleSubmit,
    errors,
    result,
    onSubmitDiscard,
    visibleModal,
    onSubmitCancel,
    onSubmitConfirm,
    onclearDate,
    submitCount,
  };
}
