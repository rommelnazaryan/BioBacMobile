import { View, StyleSheet, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, FontFamily, FontSizes } from '@/theme';
import { Controller } from 'react-hook-form';
import TextView from '@/component/view/TextView';
import useReturnProductCreate from '@/hooks/useReturnProduct/useCreate';
import TextInput from '@/component/input/TextInput';
import Botton from '@/component/button';
import CustomHeader from '@/navigation/Header';
import Calender from '@/component/calender';
import TouchableView from '@/component/view/TouchableView';
import DateIcon from '@/component/icons/DateIcon';
import moment from 'moment';
import DropdownComponent from '@/component/dropdown';
import type { DropdownOptions, ReturnProductParamList } from '@/navigation/types';
import { AntDesign } from '@/component/icons/VectorIcon';
import DeleteIcon from 'react-native-vector-icons/Ionicons';
import { t } from '@/locales';
import { formatted } from '@/helper/Regx';

type Props = NativeStackScreenProps<ReturnProductParamList, 'ReturnProductCreate'>;

export default function BuyerCreate(route: Props) {
  const {
    control,
    handleSubmit,
    onOpenDate,
    onclearDate,
    onCloseDate,
    date,
    showDate,
    onConfirmDate,
    isConnected,
    onCreateCompany,
    errorDate,
    keyValue,
    items,
    itemErrors,
    onChangeItem,
    onDeleteItem,
    onSubmitAddItem,
    onSubmitGetSaleLookup,
    productList,
    saleList,
    productId,
    setProductLable
  } = useReturnProductCreate(route);

  const totalPrice = items.reduce((sum, currentItem) => {
    const quantity = Number(currentItem.quantity) || 0;
    const returnPrice = Number(currentItem.returnPrice) || 0;

    return sum + quantity * returnPrice;
  }, 0);

  const keyboardVerticalOffset = 30;
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset} style={styles.container}>
      <CustomHeader title={t('common.returnProductsInformation')} showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[6]}
        contentContainerStyle={styles.scrollView}>
        <TextView title={t('common.returnDate')} style={styles.marginTop} />
        <TouchableView
          title={date}
          style={styles.marginTop}
          onPress={onOpenDate}
          onClose={onclearDate}
          onBlur={showDate}
          icon={<DateIcon size={24} color={Colors.black} />}
          errorMessage={errorDate}
        />
        <Calender
          isVisible={showDate}
          onClose={() => onCloseDate()}
          onConfirm={onConfirmDate}
          value={
            moment(date, 'DD/MM/YYYY', true).isValid()
              ? moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
              : undefined
          }
        />
        <TextView title={t('common.comment')} style={styles.marginTop} />
        <Controller
          control={control}
          name="Comment"
          render={({ field: { onChange, value } }) => (
            <TextInput
              containerStyle={styles.marginTop}
              placeholder="..."
              inputSize="medium"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <View style={styles.addItemContainer}>
          <Text style={styles.addItemText} >{t('common.items')}</Text>
          <Botton
            title={t('common.addItem')}
            onHandler={onSubmitAddItem}
            style={[styles.addItemButton]}
            icon={<AntDesign name="plus" size={24} color={Colors.gray_400} />}
            textStyle={styles.addItemButtonText}
          />
        </View>
        <View style={styles.stickyTotalContainer}>
          <TextView title={t('common.totalPrice')} style={styles.stickyTotalLabel} />
          <Text style={styles.totalPriceText}>{`${formatted(totalPrice)},00 руб.`}</Text>
        </View>
        {items.map((item, index) => (
          <View key={item.id} style={styles.addItemListContainer}>
            {items.length > 1 ? (
              <TouchableOpacity
                style={styles.deleteItemButton}
                onPress={() => onDeleteItem(index)}>
                <DeleteIcon name="close" size={24} color={Colors.red} />
              </TouchableOpacity>
            ) : null}
            <View style={styles.itemHeaderRow}>
              <Text style={styles.text}>{t('common.product')}</Text>
              <Text style={styles.text}>{t('common.quantity')}</Text>
              <Text style={styles.text}>{t('common.returnPrice')}</Text>
              <Text style={styles.text}>{t('common.sale')}</Text>
            </View>

            <View style={styles.itemFieldsRow}>
              <View style={styles.productFieldContainer}>
                <DropdownComponent
                  data={!isConnected ? [] : productList as DropdownOptions[]}
                  value={item.productId}
                  onClick={({ value, label }) => {
                    setProductLable(label)
                    onSubmitGetSaleLookup(productId)
                    onChangeItem(index, 'productId', value)
                  }}
                  errorMessage={itemErrors[item.id as number]?.productId ?? ''}
                />
              </View>
              <View style={styles.compactFieldContainer}>
                <TextInput
                  inputStyle={[styles.textInput]}
                  placeholder="..."
                  inputSize="medium"
                  onChangeText={value => onChangeItem(index, 'quantity', +value)}
                  keyboard="numeric"
                  value={String(item.quantity ?? '')}
                />
              </View>
              <View style={styles.compactFieldContainer}>
                <TextInput
                  inputStyle={styles.textInput}
                  placeholder="..."
                  inputSize="medium"
                  onChangeText={value => onChangeItem(index, 'returnPrice', +value)}
                  keyboard="numeric"
                  value={String(item.returnPrice ?? '')}
                />
              </View>
              <View style={styles.productFieldContainer}>
                <DropdownComponent
                  data={!isConnected ? [] : saleList as DropdownOptions[]}
                  value={item.sale}
                  onClick={({ value, label }) => onChangeItem(index, 'sale', +value, label)}
                  disable={false}
                />
              </View>
            </View>
          </View>
        ))}

        <Botton
          title={keyValue === 'edit' ? t('common.update') : t('common.create')}
          onHandler={handleSubmit(onCreateCompany)}
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  marginTop: {
    marginTop: 10,
  },
  button: {
    marginTop: '5%',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  addItemContainer: {
    marginTop: '5%',
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  addItemButton: {
    width: '48%',
    height: 50,
    backgroundColor: Colors.background,
    borderColor: Colors.gray,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  addItemButtonText: {
    color: Colors.gray_400,
    fontSize: FontSizes.small,
  },
  addItemText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.large,
    color: Colors.black,
    flex: 1,
  },
  addItemListContainer: {
    marginTop: '5%',
    width: '98%',
    alignSelf: 'center',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: Colors.gray_400,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  textInput: {
    width: '98%',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  itemFieldsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productFieldContainer: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactFieldContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteItemButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    // width: '30%',
    // height:40,
    // alignSelf: 'flex-end',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: Colors.background,
    // borderWidth: 2,
    // borderColor: Colors.red_300,
    // padding: 5,
    // marginTop: 10,
  },
  deleteItemButtonText: {
    color: Colors.red_300,
    fontSize: FontSizes.small,
    fontFamily: FontFamily.semiBold,
  },
  errorMessage: {
    color: Colors.red,
    fontSize: FontSizes.small,
    fontFamily: FontFamily.semiBold,
    marginLeft: '5%',
    marginTop: 10,
  },
  text: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.small,
    color: Colors.black,
  },
  totalPriceText: {
    width: '90%',
    alignSelf: 'center',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.medium,
    color: Colors.black,
  },
  stickyTotalContainer: {
    width: '100%',
    backgroundColor: Colors.background,
    paddingVertical: 10,
  },
  stickyTotalLabel: {
    marginTop: 0,
  },
});

