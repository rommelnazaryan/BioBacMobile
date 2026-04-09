import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {GetPaymentAllResponse} from '@/types';
import {Colors, FontFamily, FontSizes} from '@/theme';
import {t} from '@/locales';
export default function Card({element}: {element: GetPaymentAllResponse}) {
  const createdAtDate = element.date.split(':')[0];
  const {name: nameAccount} = element.account;
  const namePaymentCategory = element.paymentCategory?.name || null;
  return (
    <View
      style={[
        styles.container,
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.account')}:</Text>
        <Text style={styles.value}>{nameAccount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.parentCategory')}:</Text>
        <Text style={styles.value}>{element.target}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.category')}:</Text>
        <Text style={styles.value}>{namePaymentCategory != null ? namePaymentCategory : ''}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.username')}:</Text>
        <Text style={[styles.value,styles.username]}>{element.username}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.note')}:</Text>
        <Text style={[styles.value]}>{element.notes}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.date')}:</Text>
        <Text style={styles.value}>{createdAtDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.sum')}:</Text>
        <Text style={styles.value}>{element.sum}</Text>
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
    backgroundColor: Colors.white,
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
  username: {
  width: '60%',textAlign: 'right'
  },
});
