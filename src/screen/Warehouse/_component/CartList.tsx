import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { GetWarehousesResponse } from '@/types';
import { Colors, FontFamily, FontSizes } from '@/theme';

export default function CartList({ element }: { element: GetWarehousesResponse}) {

  return (
    <View
      style={[
        styles.container,
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>{element.name}</Text>
        <Text style={styles.value}>{element.warehouseGroupName}</Text>
        <Text style={styles.value}>{element.location}</Text>
        <Text style={styles.value}>{element.warehouseTypeName}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
