import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {AllCompanyProps} from '@/types';
import {Colors, FontFamily, FontSizes} from '@/theme';
import {t} from '@/locales';
export default function Card({element}: {element: AllCompanyProps}) {
  const createdAtDate = element.createdAt.split(':')[0];
  const backgroundColor = element.deleted ? Colors.red_300 : Colors.white;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor}
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.name')}:</Text>
        <Text style={styles.value}>{element.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('General Director')}:</Text>
        <Text style={styles.value}>{element.ceo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.creditorAmount')}:</Text>
        <Text style={styles.value}>{element.creditorAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.debtorAmount')}:</Text>
        <Text style={styles.value}>{element.debtorAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.phoneNumber')}:</Text>
        <Text style={styles.value}>{element.phones[0]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.email')}:</Text>
        <Text style={styles.value}>{element.emails[0]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('Actual Address')}:</Text>
        <Text style={styles.value}>{element.actualAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('Point of Sale Address')}:</Text>
        <Text style={styles.value}>{element.addressTT}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('Legal Address')}:</Text>
        <Text style={[styles.value,{width:'60%'}]}>{element.localAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('Warehouse Address')}:</Text>
        <Text style={styles.value}>{element.warehouseAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.createdAt')}:</Text>
        <Text style={styles.value}>{createdAtDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2%',
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.medium,
  },
  value: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.small,
  },
});
