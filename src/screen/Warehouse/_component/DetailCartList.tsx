import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { GetWarehousesDetailResponse } from '@/types';
import { Colors, FontFamily, FontSizes } from '@/theme';

export default function DetailCartList({ element }: { element: GetWarehousesDetailResponse}) {

  return (
    <View
      style={[
        styles.container,
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>{element.productName}</Text>
        <Text style={styles.value}>{element.productGroupName}</Text>
        <Text style={styles.value}>{element.warehouseName}</Text>
        <Text style={styles.value}>{element.balance} {element.productUnitName}</Text>
        <Text style={styles.value}>{element.productMinimalBalance} {element.productUnitName}</Text>
        <Text style={styles.value}>{element.selfWorthPrice}руб.</Text>
        <Text style={styles.value}>{element.totalPrice}руб.</Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  row: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5 , 
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.small,
  },
  value: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.small,
  },

});
