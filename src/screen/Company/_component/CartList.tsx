import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { AllCompanyProps } from '@/types';
import { Colors, FontFamily, FontSizes } from '@/theme';
import Botton from '@/component/button';
import { t } from '@/locales';
import { formatted } from '@/helper/Regx';
// import { EditIcon } from '@/component/icons';

export default function CartList({ element, onCallback, onSubmitEdit }: { element: AllCompanyProps, onCallback: (element: AllCompanyProps) => void, onSubmitEdit: () => void }) {
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
        {/* <Text style={styles.title}>{t('common.line')}:</Text> */}
        <Text style={styles.value}>{element.lines.map((item: any) => item.name).join(', ')}12312312312, </Text>
        <Text style={styles.value}>{element.detail?.inn ?? '-'}</Text>
        <Text style={[styles.value, {position: 'absolute', right: 0}]}>{`${formatted(element.balance)},00 руб`}</Text>
      </View>

      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.counterpartyInn')}:</Text>
        <Text style={styles.value}>{element.detail?.inn ?? '-'}</Text>
      </View> */}
      <View style={styles.row}>
        {/* <Text style={styles.title}>{t('common.name')}:</Text> */}
        <Text style={styles.value}>{element.name}</Text>
      </View>

      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.contactPerson')}:</Text>
        <View style={styles.iconContainer}>
          <Text style={[styles.value]}>{contactPerson ? `${contactPerson.firstName} ${contactPerson.lastName}` : '-'}, </Text>
          <Text style={[styles.value]}>{element.balance}</Text>
          <TouchableOpacity activeOpacity={0.5} onPress={() => onSubmitEdit()}>
        <EditIcon size={22} />
        </TouchableOpacity>
        </View>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.balance')}:</Text>
        <Text style={[styles.value]}>{element.balance}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.creditorAmount')}:</Text>
        <Text style={styles.value}>{element.creditorAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.debtorAmount')}:</Text>
        <Text style={styles.value}>{element.debtorAmount}</Text>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.phoneNumber')}:</Text>
        <Text style={styles.value}>{element.phones[0] ?? '-'}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => onSubmitEdit()}>
        <EditIcon size={22} />
        </TouchableOpacity>
        </View>
      </View> */}
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.email')}:</Text>
        <Text style={styles.value}>{element.emails[0] ?? '-'}</Text>
      </View> */}
      <View style={[styles.row]}>
        {/* <Text style={styles.title}>{t('common.actualAddress')}:</Text> */}
        <Text style={[styles.value, styles.textSize]}>{element.actualAddress}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.title}>{t('common.pointOfSaleAddress')}:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.addressTT}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.legalAddress')}:</Text>
        <Text style={[styles.value,styles.textSize]}>{element.localAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.warehouseAddress')}:</Text>
        <Text style={styles.value}>{element.warehouseAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common.createdAt')}:</Text>
        <Text style={styles.value}>{createdAtDate}</Text>
      </View> */}
      <View style={styles.rowContainer}>
        <View>
        <Text style={[styles.value]}>{contactPerson ? `${contactPerson.firstName} ${contactPerson.lastName}` : '-'}, </Text>
        <Text style={styles.value}>{element.phones[0] ?? '-'}</Text>
        </View>
      <Botton
          title={t('common.edit')}
          onHandler={onSubmitEdit}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '100%',
    textAlign: 'right'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2%',
    flexWrap: 'wrap',
  },
  button: {
    width: '25%',
    height: 40,
    padding: 5,
    borderWidth: 2,
    borderColor: Colors.gray_200,
    backgroundColor: Colors.white,
  },
  buttonText: {
    color: Colors.gray_400,
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.small,
  }
});
