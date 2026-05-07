import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {GetAccountListResponse} from '@/types';
import {Colors, FontFamily, FontSizes} from '@/theme';
import {t} from '@/locales';
import { formatted } from '@/helper/Regx';
import { HistoryIcon } from '@/component/icons';
export default function Card({element, onHandlerHistory}: {element: GetAccountListResponse, onHandlerHistory: (id: number, name: string) => void}) {
  const createdAtDate = element.createdAt.split(':')[0];
  const backgroundColor = element.deleted ? Colors.red_300 : Colors.white;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor}
      ]}>
      <View style={styles.row}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => onHandlerHistory(element.id, element.name)} style={styles.historyIcon}>
        <HistoryIcon size={25}/>
        </TouchableOpacity>
        {/* <Text style={styles.title}>{t('common.account')}:</Text> */}
        <Text style={styles.value}>{element.bankAccount}</Text>
        <Text style={styles.value}>{formatted(element.balance)},00 руб</Text>

      </View>
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.accountBalance')}:</Text>
      </View> */}
      <View style={styles.row}>
        {/* <Text style={styles.title}>{t('common.ourCompany')}:</Text> */}
        <Text style={styles.value}>{element.ourCompanyName}</Text>
        <Text style={styles.value}>{element.bankName}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.bankName')}:</Text>
        <Text style={styles.value}>{element.bankName}</Text>
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
    gap: 10,
    marginTop: '2%',
  },

  value: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.small,
  },
  historyIcon: {
    position: 'absolute',
    right: 0,
    top: -15,
  },
});
