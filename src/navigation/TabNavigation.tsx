import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons, AntDesign, Feather } from '@/component/icons/VectorIcon';
import { Colors, FontFamily } from '@/theme';
import useDraftStore from '@/zustland/draftStore';

import type { RootStackParamList, TabParamList, SellerParamList, BuyerParamList, ReturnProductParamList, AccountListParamList } from './types';
//-------------Home----------------
import Home from '@/screen/Home';
import Detail from '@/screen/Home/Detail';
import HomeCreate from '@/screen/Home/Create';
//-------------Buyers----------------
import Buyers from '@/screen/Buyers';
import HistoryBuyers from '@/screen/Buyers/HistoryBuyers';
import BuyerCreate from '@/screen/Buyers/Create';

//-------------Seller----------------
import Seller from '@/screen/Seller';
import History from '@/screen/Seller/History';
import SellerCreate from '@/screen/Seller/Create';
//-------------Settings----------------
import Settings from '@/screen/Settings';

//-------------Payment----------------
import Payment from '@/screen/payment';
import PaymentHistory from '@/screen/payment/PaymentHistory';


//-------------Draft----------------
import Draft from '@/screen/Draft';

import { deviceHeight } from '@/helper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//-------------Return Product----------------
import ReturnProduct from '@/screen/ReturnProduct';
import ReturnProductCreate from '@/screen/ReturnProduct/Create';

//-------------Account List----------------
import AccountList from '@/screen/AccountList';
import AccountListHistory from '@/screen/AccountList/AccountListHistory';

const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const SettingsStack = createNativeStackNavigator<RootStackParamList>();
const DraftStack = createNativeStackNavigator<RootStackParamList>();
const SellerStack = createNativeStackNavigator<SellerParamList>();
const BuyerStack = createNativeStackNavigator<BuyerParamList>();
const ReturnProductStack = createNativeStackNavigator<ReturnProductParamList>();
const AccountListStack = createNativeStackNavigator<AccountListParamList>();


const baseScreenOptions = {
  headerShown: false,
  lazy: true,
  tabBarShowLabel: false,
  tabBarStyle: {
    height: Platform.OS === 'android' ? deviceHeight * 0.06 : deviceHeight * 0.05,
    paddingTop: Platform.OS === 'android' ? 6 : 10,
  },
  textStyle: {
    fontSize: Platform.OS === 'android' ? 16 : 10,
    fontWeight: 'bold',
    fontFamily: FontFamily.regular,
  },
} as const;

function NoFeedbackTabBarButton({
  onPress,
  onLongPress,
  accessibilityState,
  accessibilityLabel,
  testID,
  style,
  children,
}: BottomTabBarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={style}
      android_ripple={{ color: 'transparent' }}
    >
      {children}
    </Pressable>
  );
}

function TabBarIcon({
  routeName,
  color,
  size,
  focused,
  draftCount,
}: {
  routeName: keyof TabParamList;
  color: string;
  size: number;
  focused: boolean;
  draftCount: number;
}) {
  const showBadge = routeName === 'DraftScreen' && draftCount > 0;
  const badgeText = draftCount > 99 ? '99+' : String(draftCount);

  if (routeName === 'HomeScreen') {
    return <AntDesign name="home" size={size} color={color} />;
  }
  if (routeName === 'DraftScreen') {
    return (
      <View style={styles.iconWrapper}>
        <MaterialIcons name="access-time" size={size} color={color} />
        {showBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        ) : null}
      </View>
    );
  }
  // Settings tab (Ionicons)
  return (
    <Feather
      name={focused ? 'settings' : 'settings'}
      size={28}
      color={color}
    />
  );
}

const SellerStackScreen = () => {
  return (
    <SellerStack.Navigator screenOptions={{ headerShown: false }}>
      <SellerStack.Screen name="Seller" component={Seller} />
      <SellerStack.Screen name="History" component={History} />
      <SellerStack.Screen name="SellerCreate" component={SellerCreate} />
    </SellerStack.Navigator>
  );
};

const BuyerStackScreen = () => {
  return (
    <BuyerStack.Navigator screenOptions={{ headerShown: false }}>
      <BuyerStack.Screen name="Buyers" component={Buyers} />
      <BuyerStack.Screen name="HistoryBuyers" component={HistoryBuyers} />
      <BuyerStack.Screen name="BuyerCreate" component={BuyerCreate} />
    </BuyerStack.Navigator>
  );
};

const ReturnProductStackScreen = () => {
  return (
    <ReturnProductStack.Navigator screenOptions={{ headerShown: false }}>
      <ReturnProductStack.Screen name="ReturnProduct" component={ReturnProduct} />
      <ReturnProductStack.Screen name="ReturnProductCreate" component={ReturnProductCreate} />
    </ReturnProductStack.Navigator>
  );
};

const AccountListStackScreen = () => {
  return (
    <AccountListStack.Navigator screenOptions={{ headerShown: false }}>
      <AccountListStack.Screen name="AccountList" component={AccountList} />
      <AccountListStack.Screen name="AccountListHistory" component={AccountListHistory} />
    </AccountListStack.Navigator>
  );
};


const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="BuyerStack" component={BuyerStackScreen} />
      <HomeStack.Screen name="SellerStack" component={SellerStackScreen} />
      <HomeStack.Screen name="Payment" component={Payment} />
      <HomeStack.Screen name="PaymentHistory" component={PaymentHistory} />
      <HomeStack.Screen name="ReturnProductStack" component={ReturnProductStackScreen} />
      <HomeStack.Screen name="Detail" component={Detail} />
      <HomeStack.Screen name="HomeCreate" component={HomeCreate} />
      <HomeStack.Screen name="AccountListStack" component={AccountListStackScreen} />
    </HomeStack.Navigator>
  );
};


const DraftStackScreen = () => {
  return (
    <DraftStack.Navigator screenOptions={{ headerShown: false }}>
      <DraftStack.Screen name="Draft" component={Draft} />
    </DraftStack.Navigator>
  );
};

const SettingStackScreen = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={Settings} />
    </SettingsStack.Navigator>
  );
};


export default function TabNavigation() {
  const draftCount = useDraftStore(s => s.Draft.length);

  const screenOptions = ({ route }: { route: { name: keyof TabParamList } }) => ({
    ...baseScreenOptions,
    tabBarButton: (props: BottomTabBarButtonProps) => (
      <NoFeedbackTabBarButton {...props} />
    ),
    tabBarIcon: (props: { color: string; size: number; focused: boolean }) => (
      <TabBarIcon routeName={route.name} {...props} size={30} draftCount={draftCount} />
    ),
  });

  return (
    <Tab.Navigator
      screenOptions={screenOptions}>
      <Tab.Screen name="HomeScreen" component={HomeStackScreen} />
      <Tab.Screen name="DraftScreen" component={DraftStackScreen} />
      <Tab.Screen name="SettingsScreen" component={SettingStackScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
