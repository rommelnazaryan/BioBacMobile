import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Colors, FontFamily, FontSizes } from '@/theme';

export default function CartList({ element }: { element: any}) {
console.log(element);
  return (
    <View
      style={[
        styles.container,
      ]}>
      <View style={styles.row}>
        <Text style={styles.title}>{element.totalAmount}</Text>
        <Text style={styles.value}>{element.creatorName}</Text>
        <Text style={styles.value}>{element.dealName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{element.saleStage.name}</Text>
        <Text style={styles.value}>{element.company?.name}</Text>
        <Text style={styles.value}>{element.ourCompany?.name}</Text>
        <Text style={styles.value}>{element.orderDate}</Text>
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
    gap: 2,
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
