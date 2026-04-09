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

type Props = NativeStackScreenProps<ReturnProductParamList, 'ReturnProductCreate'>;

export default function BuyerCreate(route: Props) {
  const {
    control,
    handleSubmit,
    errors,
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
    companyList,
    warehousesList,
    onSubmitGetProduct,
    onSubmitGetSaleLookup,
    productList,
    saleList,
    productId,
    setProductLable
  } = useReturnProductCreate(route);


  const keyboardVerticalOffset = 30;
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset} style={styles.container}>
      <CustomHeader title={'Return Products Information'} showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollView}>
        <TextView title="Company" style={styles.marginTop} />
        <Controller
          control={control}
          name="Company"
          render={({ field: { onChange, value: accountValue } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={!isConnected ? [] : companyList as DropdownOptions[]}
              value={+accountValue}
              onClick={({ value }) => {
                onSubmitGetProduct(value)
                onChange(value)
              }}
              errorMessage={errors.Company?.message}
            />
          )}
        />
        <TextView title="Warehouse" style={styles.marginTop} />
        <Controller
          control={control}
          name="Warehouse"
          render={({ field: { onChange, value: accountValue } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={!isConnected ? [] : warehousesList as DropdownOptions[]}
              value={+accountValue}
              onClick={({ value }) => onChange(value)}
              errorMessage={errors.Warehouse?.message}
            />
          )}
        />
        <TextView title="Return Date" style={styles.marginTop} />
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
        <TextView title="Comment" style={styles.marginTop} />
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
          <Text style={styles.addItemText} >Items</Text>
          <Botton
            title={'Add Item'}
            onHandler={onSubmitAddItem}
            style={styles.addItemButton}
            icon={<AntDesign name="plus" size={24} color={Colors.gray_400} />}
            textStyle={styles.addItemButtonText}
          />
        </View>
        {items.map((item, index) => (

          <View key={item.id} style={styles.addItemListContainer}>
            {items.length > 1 ? (
              <TouchableOpacity
                style={styles.deleteItemButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => onDeleteItem(index)}>
                <DeleteIcon name="trash-outline" size={24} color={Colors.red} />
              </TouchableOpacity>
            ) : null}
            <TextView title="Product" />
            <DropdownComponent
              style={styles.marginTop}
              data={!isConnected ? [] : productList as DropdownOptions[]}
              value={item.productId}
              onClick={({ value, label }) => {
                setProductLable(label)
                onSubmitGetSaleLookup(productId)
                onChangeItem(index, 'productId', value)
              }}
              errorMessage={itemErrors[item.id as number]?.productId ?? ''}
            />
            <TextView title="Quantity" style={styles.marginTop} />
            <TextInput
              containerStyle={[styles.marginTop,]}
              inputStyle={styles.textInput}
              placeholder="..."
              inputSize="medium"
              onChangeText={value => onChangeItem(index, 'quantity', +value)}
              keyboard="numeric"
              value={String(item.quantity ?? '')}
            />
            <TextView title="Return Price" style={styles.marginTop} />
            <TextInput
              containerStyle={styles.marginTop}
              inputStyle={styles.textInput}
              placeholder="..."
              inputSize="medium"
              onChangeText={value => onChangeItem(index, 'returnPrice', +value)}
              keyboard="numeric"
              value={String(item.returnPrice ?? '')}
            />
            <TextView title="Sale" style={styles.marginTop} />
            <DropdownComponent
              style={styles.marginTop}
              data={!isConnected ? [] : saleList as DropdownOptions[]}
              value={item.sale}
              onClick={({ value, label }) => onChangeItem(index, 'sale', +value, label)}
              disable={false}
            />
          </View>
        ))}
        <Botton
          title={keyValue === 'edit' ? 'Update' : 'Create'}
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
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addItemButton: {
    width: '32%',
    height: 50,
    backgroundColor: Colors.background,
    borderColor: Colors.gray,
    borderWidth: 1,
  },
  addItemButtonText: {
    color: Colors.gray_400,
  },
  addItemText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.large,
    color: Colors.black,
  },
  addItemListContainer: {
    marginTop: '5%',
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: Colors.gray_400,
    borderRadius: 10,
    paddingVertical: 15,
  },
  textInput: {
    width: '98%',
  },
  deleteItemButton: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  errorMessage: {
    color: Colors.red,
    fontSize: FontSizes.small,
    fontFamily: FontFamily.semiBold,
    marginLeft: '5%',
    marginTop: 10,
  },
});

