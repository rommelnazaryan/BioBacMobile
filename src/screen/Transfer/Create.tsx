import { StyleSheet, ScrollView, KeyboardAvoidingView, View } from 'react-native';
import React from 'react';
import { Colors } from '@/theme';
import { Controller, useWatch } from 'react-hook-form';
import TextView from '@/component/view/TextView';
import TextInput from '@/component/input/TextInput';
import Button from '@/component/button';
import CustomHeader from '@/navigation/Header';
import Calender from '@/component/calender';
import TouchableView from '@/component/view/TouchableView';
import DateIcon from '@/component/icons/DateIcon';
import moment from 'moment';
import DropdownComponent, { DropdownMultiSelect } from '@/component/dropdown';
import { t } from '@/locales';
import useTransferCreate from '@/hooks/useTransfer/useCreate';

const isDropdownValue = (value: unknown): value is string | number =>
  typeof value === 'string' || typeof value === 'number';

export default function HomeCreate() {
  const {
    control,
    errors,
    onOpenDate,
    onclearDate,
    onCloseDate,
    date,
    showDate,
    onConfirmDate,
    errorDate,
    warehousesList,
    handleSubmit,
    onSubmit,
    loadOutputWarehouseProducts,
    loadInputWarehouseBalances,
    productsList,
    filterWearhouseInput,
    warehousesInputList,
    selectedProductRows,
    setValue,
  } = useTransferCreate();

  const productTransferQty =
    useWatch({control, name: 'productTransferQty'}) ??
    ({} as Record<string, string>);
  const keyboardVerticalOffset = 30;
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}
    >
      <CustomHeader
        title={'Product Transfer Between Warehouses'}
        showBack={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <TextView title={'Warehouse Output'} style={styles.marginTop} />
        <Controller
          control={control}
          name="warehouseOutput"
          render={({ field: { onChange, value: accountValue } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={warehousesList}
              value={accountValue}
              onClick={({ value }) => {
                onChange(value);
                setValue('products', []);
                loadOutputWarehouseProducts(+value);
                filterWearhouseInput(String(value));
                
              }}
              errorMessage={errors.warehouseOutput?.message}
            />
          )}
        />
        <TextView title={'Warehouse Input'} style={styles.marginTop} />
        <Controller
          control={control}
          name="warehouseInput"
          render={({ field: { onChange, value: accountValue } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={warehousesInputList}
              value={accountValue}
              onClick={({ value }) => {
                onChange(value);
                loadInputWarehouseBalances(+value);
              }}
              errorMessage={errors.warehouseInput?.message}
            />
          )}
        />
        <TextView title={t('common.date')} style={styles.marginTop} />
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

        <TextView title={'Notes'} style={styles.marginTop} />
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value: value } }) => (
            <TextInput
              containerStyle={styles.marginTop}
              placeholder="..."
              inputSize="medium"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <TextView title={'Products'} style={styles.marginTop} />
        <Controller
          control={control}
          name="products"
          render={({ field: { onChange, value: accountValue } }) => (
            <DropdownMultiSelect
              style={styles.marginTop}
              data={productsList}
              value={Array.isArray(accountValue) ? accountValue.filter(isDropdownValue) : []}
              onChange={values => onChange(values)}
            />
          )}
        />

        {selectedProductRows.map(row => {
          const idKey = String(row.id);
          return (
            <View key={idKey} style={styles.productQtyBlock}>
              {/* <TextView title={row.label} /> */}
              <View style={styles.qtyRow}>
                <View style={styles.qtyCol}>
                  <TextView title={'Output'} />
                  <TextInput
                    edit={false}
                    containerStyle={styles.marginTop}
                    inputSize="small"
                    value={String(row.outputQty)}
                    keyboard="numeric"
                    errorMessage={
                      row.outputQty <= 0
                        ? 'Not available in this warehouse'
                        : ''
                    }
                  />
                </View>
                <View style={styles.qtyCol}>
                  <TextView title={'Input'} />
                  <TextInput
                    edit={false}
                    containerStyle={styles.marginTop}
                    inputSize="small"
                    value={String(row.inputQty)}
                    keyboard="numeric"
                  />
                </View>
                <View style={styles.qtyCol}>
                  <TextView title={'Transfer'} />
                  <TextInput
                    containerStyle={styles.marginTop}
                    inputSize="small"
                    placeholder="0"
                    onChangeText={text =>
                      setValue('productTransferQty', {
                        ...productTransferQty,
                        [idKey]: text,
                      })
                    }
                    value={productTransferQty[idKey] ?? ''}
                    keyboard="numeric"
                  />
                </View>
              </View>
            </View>
          );
        })}

        <Button title="Create" onHandler={handleSubmit(onSubmit)} style={styles.button} />
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
    marginTop: '10%',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  qtyRow: {
    flexDirection: 'row',
    gap: 8,
    width: '93%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  qtyCol: {
    flex: 1,
    minWidth: '28%',
  },
  productQtyBlock: {
    width: '93%',
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
});
