import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {GetSaleSuccessResponse} from '@/types';
import {FontFamily, FontSizes} from '@/theme';
import {t} from '@/locales';
export default function CartList({element}: {element: GetSaleSuccessResponse}) {
  const createdAtDate = element.createdAt.split(':')[0];
  return (
    <View
      style={[
        styles.container,
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>#</Text>
        <Text style={styles.value}>{element.id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Total amount:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.totalAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Creator:</Text>
        <Text style={styles.value}>{element.creatorName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Name:</Text>
        <Text style={styles.value}>{element.dealName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Counterparty:</Text>
        <Text style={styles.value}>{element.company?.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Our Company:</Text>
        <Text style={styles.value}>{element.ourCompany?.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Order date:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.orderDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Sale date:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.saleDate}</Text>
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
  textSize:{
width:'60%',textAlign:'right'
  }
});
