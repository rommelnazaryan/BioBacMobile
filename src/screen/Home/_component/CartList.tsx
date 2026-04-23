import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { AllCompanyProps } from '@/types';
import { Colors, FontFamily, FontSizes } from '@/theme';
import { t } from '@/locales';
import { EditIcon } from '@/component/icons';

export default function CartList({ element, onCallback , onSubmitEdit}: { element: AllCompanyProps, onCallback: (element: AllCompanyProps) => void, onSubmitEdit: () => void }) {
  const backgroundColor = element.deleted ? Colors.red_300 : Colors.white;
  const contactPerson = element.contactPerson[element.contactPerson.length - 1];
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => onCallback(element)}
      style={[
        styles.container,
        { backgroundColor: backgroundColor }
      ]}>
          <View style={styles.row}>
        <Text style={styles.title}>Line:</Text>
        <Text style={styles.value}>{element.lines.map((item: any) => item.name).join(', ')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Counterparty INN:</Text>
        <Text style={styles.value}>{element.detail?.inn ?? '-'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.name')}:</Text>
        <Text style={styles.value}>{element.name}</Text>
      </View>
    
      <View style={styles.row}>
        <Text style={styles.title}>Contact Person:</Text>
        <View style={styles.iconContainer}>
        <Text style={[styles.value]}>{contactPerson ? `${contactPerson.firstName} ${contactPerson.lastName}` : '-'}</Text>
        <TouchableOpacity activeOpacity={0.5} onPress={() => onSubmitEdit()}>
        <EditIcon size={22} />
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Balance:</Text>
        <Text style={[styles.value]}>{element.balance}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.creditorAmount')}:</Text>
        <Text style={styles.value}>{element.creditorAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.debtorAmount')}:</Text>
        <Text style={styles.value}>{element.debtorAmount}</Text>
      </View> */}
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.phoneNumber')}:</Text>
        <View style={styles.iconContainer}>
        <Text style={styles.value}>{element.phones[0] ?? '-'}</Text>
        <TouchableOpacity activeOpacity={0.5} onPress={() => onSubmitEdit()}>
        <EditIcon size={22} />
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.email')}:</Text>
        <Text style={styles.value}>{element.emails[0] ?? '-'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('Actual Address')}:</Text>
        <Text style={[styles.value, styles.textSize]}>{element.actualAddress}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('Point of Sale Address')}:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.addressTT}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('Legal Address')}:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.localAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('Warehouse Address')}:</Text>
        <Text style={styles.value}>{element.warehouseAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.createdAt')}:</Text>
        <Text style={styles.value}>{createdAtDate}</Text>
      </View> */}
    </TouchableOpacity>
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
  textSize: {
    width: '60%',
     textAlign: 'right'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
