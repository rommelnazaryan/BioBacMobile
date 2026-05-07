import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, FontFamily, FontSizes } from '@/theme';
import Header from '@/navigation/Header';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import NotFound from '@/component/icons/NotFound';
import { t } from '@/locales';
type Props = NativeStackScreenProps<RootStackParamList, 'Phone'>;
export default function Phone(route: Props) {
  const { item } = route.route.params;
  return (
    <View style={styles.container}>
      <Header title={t('common.phoneNumber')} showBack={true} />
      {item.phones.length ===0 ?
         <View style={styles.emptyContainer}>
         <NotFound size={120} />
       </View>
      :item.phones.map((phone, index) => (
        <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.phoneContainer} >
          <Text style={styles.phoneText}>{t('common.phoneWithIndex', {index: index + 1})}:</Text>
          <Text style={styles.phoneValue}>{phone}</Text>
        </TouchableOpacity>

      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  phoneContainer: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.gray_200,
  },
  phoneText: {
    fontSize: FontSizes.medium,
    fontFamily: FontFamily.regular,
    color: Colors.black,
  },
  phoneValue: {
    fontSize: FontSizes.small,
    fontFamily: FontFamily.regular,
    color: Colors.black,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});