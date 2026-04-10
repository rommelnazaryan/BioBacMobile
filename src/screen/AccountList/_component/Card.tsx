import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {GetAccountListResponse} from '@/types';
import {Colors, FontFamily, FontSizes} from '@/theme';
import {t} from '@/locales';
export default function Card({element}: {element: GetAccountListResponse}) {
  const createdAtDate = element.createdAt.split(':')[0];
  const backgroundColor = element.deleted ? Colors.red_300 : Colors.white;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor}
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>Account:</Text>
        <Text style={styles.value}>{element.bankAccount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Account Balance:</Text>
        <Text style={styles.value}>{element.balance}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Our Company:</Text>
        <Text style={styles.value}>{element.ourCompanyName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Bank Name:</Text>
        <Text style={styles.value}>{element.bankName}</Text>
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
