import {AllCompanyProps, historyProps, HomeListProps, ReturnProductProps} from '@/types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NavigatorScreenParams} from '@react-navigation/native';

export const HomeStack = createNativeStackNavigator<RootStackParamList>();

export type SellerParamList = {
  Seller: {item: HomeListProps};
  History: {item: historyProps};
  SellerCreate: {item: AllCompanyProps | undefined,key: 'create' | 'edit'};
};

export type BuyerParamList = {
  Buyers: {item: HomeListProps};
  HistoryBuyers: {item: historyProps};
  BuyerCreate: {item: AllCompanyProps | undefined,key: 'create' | 'edit'};
};

export type ReturnProductParamList = {
  ReturnProduct: {item: HomeListProps};
  ReturnProductCreate: {item: ReturnProductProps | undefined,key: 'create' | 'edit'};
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
  ReturnProductStack: NavigatorScreenParams<ReturnProductParamList> | undefined;
  Detail: {item: AllCompanyProps};
  HomeCreate: {item: AllCompanyProps | undefined,key: 'create' | 'edit'};
  AccountListStack: NavigatorScreenParams<AccountListParamList> | undefined;
};

export type TabParamList = {
  HomeScreen: undefined;
  SettingsScreen: undefined;
  DraftScreen: undefined;
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