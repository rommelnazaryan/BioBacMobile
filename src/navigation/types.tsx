import {AllCompanyProps, GetSaleSuccessResponse, historyProps,ListProps, PhoneProps, ReturnProductProps} from '@/types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NavigatorScreenParams} from '@react-navigation/native';

export const HomeStack = createNativeStackNavigator<RootStackParamList>();

export type SellerParamList = {
  Seller: {item: ListProps};
  History: {item: historyProps};
  SellerCreate: {item: AllCompanyProps | undefined,key: 'create' | 'edit'};
};

export type BuyerParamList = {
  Buyers: {item: ListProps};
  HistoryBuyers: {item: historyProps};
  BuyerCreate: {item: AllCompanyProps | undefined,key: 'create' | 'edit'};
};

export type ReturnProductParamList = {
  ReturnProduct: {item: AllCompanyProps};
  ReturnProductCreate: {item: ReturnProductProps | undefined,key: 'create' | 'edit',name: string};
};

export type AccountListParamList = {
  AccountList: undefined;
  AccountListHistory: {item: historyProps};
};

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  Tabs: undefined;
  Home: undefined;
  Payment: undefined;
  Settings: undefined;
  PaymentHistory: undefined;
  Draft: undefined;
  SellerStack: NavigatorScreenParams<SellerParamList> | undefined;
  BuyerStack: NavigatorScreenParams<BuyerParamList> | undefined;
  HomeCreate: {item: AllCompanyProps | undefined,key: 'create' | 'edit'};
  AccountListStack: NavigatorScreenParams<AccountListParamList> | undefined;
  CompanyStack: NavigatorScreenParams<CompanyParamList> | undefined;
  SalesStack: NavigatorScreenParams<SalesParamList> | undefined;
  PreOrderStack: NavigatorScreenParams<PreOrderParamList> | undefined;
  ReturnProductListStack: NavigatorScreenParams<ReturnProductParamList> | undefined;
};

export type CompanyParamList = {
  Company: undefined;
  Payment: undefined;
  PaymentHistory: undefined;
  HomeCreate: {item: AllCompanyProps | undefined,key: 'create' | 'edit'};
  Detail: {item: AllCompanyProps};
  SalesStack: NavigatorScreenParams<SalesParamList> | undefined;
  Phone: {item: PhoneProps};
  ReturnProductStack: NavigatorScreenParams<ReturnProductParamList> | undefined;
};

export type TabParamList = {
  HomeScreen: undefined;
  SettingsScreen: undefined;
  DraftScreen: undefined;
  AdditionalItemsScreen: undefined;
};


export type CompanyGroupParamList = {
    name: string;
    id: string;
    updatedAt: string;
};

export type DropdownOptions = {
    label: string;
    value: string | number;
};

export type AdditionalItemsParamList = {
  AdditionalItems: undefined;
  AccountListStack: NavigatorScreenParams<AccountListParamList> | undefined;
};

export type SalesParamList = {
  Sales: undefined;
  SalesCreate: {item: GetSaleSuccessResponse | undefined,key: 'create' | 'edit'};
  CreateContactPerson: undefined;
};

export type PreOrderParamList = {
  PreOrder: undefined;
};