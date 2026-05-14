import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { GetTransferProductResponse } from '@/types';
import { Colors, FontFamily, FontSizes } from '@/theme';

export default function CartList({ element }: { element: GetTransferProductResponse}) {
  const date = element.date.split(':')[0];
  return (
    <View
      style={[
        styles.container,
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>{element.componentName}</Text>
        <Text style={styles.value}>{element.notes}</Text>
        <Text style={styles.value}>{element.fromWarehouseName}</Text>
        <Text style={styles.value}>{element.toWarehouseName}</Text>
        <Text style={styles.value}>{element.quantity}</Text>
        <Text style={styles.value}>{date}</Text>
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
    gap: 5,
    flexWrap: 'wrap',
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
