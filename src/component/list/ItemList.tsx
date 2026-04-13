import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '@/theme/Colors';
import {FontFamily, FontSizes, Shadows} from '@/theme';
import {
  NotFound,
  ShoppingCartIcon,
  SalesIcon,
  PaymentIcon,
  ApartmentIcon
} from '@/component/icons';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import {t} from '@/locales';
export default function ItemList({
  item,
  onCallback,
}: {
  item: any;
  onCallback: (item: any) => void;
}) {
  const SvgIcon =
    item.iconName === 'PaymentIcon'
    ? PaymentIcon
    : item.iconName === 'ReturnProductIcon'
    ? ShoppingCartIcon
      : item.iconName === 'SalesIcon'
      ? SalesIcon
      : item.iconName === 'AccountListIcon'
      ? ApartmentIcon
    : NotFound;
  // const SvgIcon =
  //   item.iconName === 'ApartmentIcon'
  //     ? ApartmentIcon
  //     : item.iconName === 'BusinessIcon'
  //     ? BusinessIcon
  //     : item.iconName === 'PaymentIcon'
  //     ? PaymentIcon
  //     : item.iconName === 'UserSvgIcon'
  //     ? UserSvgIcon
  //     : item.iconName === 'ReturnProductIcon'
  //     ? ShoppingCartIcon
  //     : NotFound;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onCallback(item)}
      style={styles.groupRow}>
        {item.iconName === 'PhoneIcon' ? (
          <FontAwesome name="phone" size={30} color="black" style={styles.phoneIcon}/>
        ) : (
          <SvgIcon size={item.iconSize ?? 40} color={Colors.black} />
        )}
      <Text style={styles.groupTitle}>
      {    item.label === 'payment'
          ? t('company.companiesPayment')
          : item.label === 'return products'
          ? t('common.returnProducts')
          : item.label === 'sales'
          ? t('company.sales')
          : item.label === 'phone'
          ? t('common.phone')
          : item.label === 'account list'
          ? t('company.companyAccountList')
          : 'other'}
        {/* {item.label === 'buyers'
          ? t('company.companyBuyerList')
          : item.label === 'sellers'
          ? t('company.companiesSellerList')
          : item.label === 'payment'
          ? t('company.companiesPayment')
          : item.label === 'payment history'
          ? t('company.companiesPaymentHistory')
          : item.label === 'return products'
          ? t('common.returnProducts')
          : 'other'} */}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionTitleSpaced: {
    marginTop: 16,
  },
  groupRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    gap: 10,
    height: 100,
    ...Shadows.md,
  },
  groupTitle: {
    color: Colors.black,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.small,
  },
  phoneIcon: {
    marginTop: '2%',
  },
});
