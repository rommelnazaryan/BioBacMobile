import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {ReturnProductProps} from '@/types';
import {Colors, FontFamily, FontSizes} from '@/theme';
import {t} from '@/locales';
import { formatted } from '@/helper/Regx';
export default function Card({element}: {element: ReturnProductProps}) {
  const createdAtDate = element.createdAt.split(':')[0];
  const updatedAtDate = element.updatedAt.split(':')[0];
  // const backgroundColor = element.deleted ? Colors.red_300 : Colors.white;
  return (
    <View
      style={[
        styles.container,
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.username')}:</Text>
        <Text style={styles.value}>{element.createdByName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.title,styles.width]}>{t('common.buyer')}:</Text>
        <Text style={styles.value}>{element.companyName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.totalReturnAmount')}:</Text>
        <Text style={styles.value}>{`${formatted(element.totalAmount)},00 руб.` }</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.comment')}:</Text>
        <Text style={styles.value}>{element.comment}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.createdAt')}:</Text>
        <Text style={styles.value}>{createdAtDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.updatedAt')}:</Text>
        <Text style={styles.value}>{updatedAtDate}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
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
  width: {
    width: '60%',
  },
});
