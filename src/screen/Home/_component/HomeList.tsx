import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '@/theme/Colors';
import {FontFamily, FontSizes, Shadows} from '@/theme';
import {HomeListProps} from '@/types';
import {
  ApartmentIcon,
  BusinessIcon,
  NotFound,
  ShoppingCartIcon,
  UserSvgIcon,
} from '@/component/icons';
import {t} from '@/locales';
import {PaymentIcon} from '@/component/icons';
export default function HomeList({
  item,
  onCallback,
}: {
  item: HomeListProps;
  onCallback: (item: HomeListProps) => void;
}) {
  const SvgIcon =
    item.iconName === 'ApartmentIcon'
      ? ApartmentIcon
      : item.iconName === 'BusinessIcon'
      ? BusinessIcon
      : item.iconName === 'PaymentIcon'
      ? PaymentIcon
      : item.iconName === 'UserSvgIcon'
      ? UserSvgIcon
      : item.iconName === 'ReturnProductIcon'
      ? ShoppingCartIcon
      : NotFound;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onCallback(item)}
      style={styles.groupRow}>
      <SvgIcon size={item.iconSize ?? 40} color={Colors.black} />
      <Text style={styles.groupTitle}>
        {item.label === 'buyers'
          ? t('company.companyBuyerList')
          : item.label === 'sellers'
          ? t('company.companiesSellerList')
          : item.label === 'payment'
          ? t('company.companiesPayment')
          : item.label === 'payment history'
          ? t('company.companiesPaymentHistory')
          : item.label === 'return products'
          ? t('common.returnProducts')
          : 'other'}
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
});
