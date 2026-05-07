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
        {/* <Text style={styles.title}>#</Text> */}
        {/* <Text style={styles.value}>{element.id}</Text> */}
        {/* <Text style={styles.value}>{element.creatorName}</Text> */}
        <Text style={styles.value}>{element.company?.name}</Text>
        <Text style={[styles.value]}>{element.totalAmount} руб.</Text>
        <Text style={styles.value}>{element.ourCompany?.name}</Text>
        <Text style={[styles.value]}>{element.orderDate}</Text>
      </View>
      <View style={[styles.row, {flexDirection: 'column'}]}> 
      <Text style={styles.value}>{element.dealName}</Text>
      <Text style={[styles.value]}>{element.saleDate}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.totalAmount')}:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.totalAmount}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.creator')}:</Text>
        <Text style={styles.value}>{element.creatorName}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.name')}:</Text>
        <Text style={styles.value}>{element.dealName}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.counterparty')}:</Text>
        <Text style={styles.value}>{element.company?.name}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.ourCompany')}:</Text>
        <Text style={styles.value}>{element.ourCompany?.name}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.orderDate')}:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.orderDate}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.saleDate')}:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.saleDate}</Text>
      </View> */}

      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.createdAt')}:</Text>
        <Text style={styles.value}>{createdAtDate}</Text>
      </View> */}
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
    marginTop: '2%',
    gap: 10,
    flexWrap: 'wrap',
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
