import { StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '@/theme';
import { Controller, useWatch } from 'react-hook-form';
import TextView from '@/component/view/TextView';
import TextInput from '@/component/input/TextInput';
import Botton from '@/component/button';
import CustomHeader from '@/navigation/Header';
import Calender from '@/component/calender';
import TouchableView from '@/component/view/TouchableView';
import DateIcon from '@/component/icons/DateIcon';
import moment from 'moment';
import DropdownComponent, { DropdownMultiSelect } from '@/component/dropdown';
import type { SalesParamList } from '@/navigation/types';
import useSaleCreate from '@/hooks/useSale/useCreate';
import SaleProductLineRow from '@/screen/Sales/_component/SaleProductLineRow';

type Props = NativeStackScreenProps<SalesParamList, 'SalesCreate'>;

const isDropdownValue = (value: unknown): value is string | number =>
  typeof value === 'string' || typeof value === 'number';

export default function SalesCreate(route: Props) {
  const {
    control,
    handleSubmit,
    errors,
    onOpenOrderDate,
    onOpenSaleDate,
    onClearOrderDate,
    onClearSaleDate,
    onCloseDate,
    orderDate,
    saleDate,
    calendarValueDate,
    showDate,
    onConfirmDate,
    companyList,
    lineList,
    isConnected,
    onCreateCompany,
    errorOrderDate,
    errorSaleDate,
    keyValue,
    selectedLineValues,
    setSelectedLineValues,
    contactPersonList,
    onSubmitCreateContactPerson,
    getContactPerson,
    onSubmitGetProduct,
    productList,
    syncSaleLinesForSelection,
    removeSaleProduct,
  } = useSaleCreate(route);

  const selectedProducts =
    useWatch({ control, name: 'products' }) ?? [];
    const keyboardVerticalOffset = 30;

  return (
    <KeyboardAvoidingView
    behavior="padding"
    keyboardVerticalOffset={keyboardVerticalOffset}
    style={styles.container}>
      <CustomHeader title={'Create Sale'} showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <TextView title="Deal name" style={styles.marginTop} />
        <Controller
          control={control}
          name="dealName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.dealName?.message}
            />
          )}
        />
        <TextView title="Line" style={styles.marginTop} />
        <DropdownMultiSelect
          style={styles.marginTop}
          data={lineList}
          value={selectedLineValues}
          onChange={setSelectedLineValues}
        />

        <TextView title="Company" style={styles.marginTop} />
        <Controller
          control={control}
          name="company"
          render={({ field: { onChange, value: value } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={isConnected ? companyList : []}
              value={value}
              onClick={({value: buyerCompanyId, label: labelValue}) => {
                onChange(buyerCompanyId);
                getContactPerson(labelValue);
                onSubmitGetProduct(String(buyerCompanyId));
              }}
              errorMessage={errors.company?.message}
            />
          )}
        />

        <TextView title="Contact person" style={styles.marginTop} />
        <Controller
          control={control}
          name="contactPerson"
          render={({ field: { onChange, value: Value } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={isConnected ? contactPersonList : []}
              value={Value}
              onClick={({ value }) => onChange(value)}
              errorMessage={errors.contactPerson?.message}
            />
          )}
        />

        <Botton
          title={'Add More'}
          onHandler={onSubmitCreateContactPerson}
          style={styles.contactPersonButton}
          textStyle={styles.contactPersonButtonText}
        />

        <TextView title="Order date" />
        <TouchableView
          title={orderDate}
          style={styles.marginTop}
          onPress={onOpenOrderDate}
          onClose={onClearOrderDate}
          onBlur={showDate}
          icon={<DateIcon size={24} color={Colors.black} />}
          errorMessage={errorOrderDate}
        />

        <TextView title="Sale date" style={styles.marginTop} />
        <TouchableView
          title={saleDate}
          style={styles.marginTop}
          onPress={onOpenSaleDate}
          onClose={onClearSaleDate}
          onBlur={showDate}
          icon={<DateIcon size={24} color={Colors.black} />}
          errorMessage={errorSaleDate}
        />

        <TextView title="Products" style={styles.marginTop} />
        <Controller
          control={control}
          name="products"
          render={({ field: { onChange, value } }) => (
            <DropdownMultiSelect
              style={styles.marginTop}
              data={isConnected ? productList : []}
              value={Array.isArray(value) ? value.filter(isDropdownValue) : []}
              onChange={ids => {
                onChange(ids);
                syncSaleLinesForSelection(ids);
              }}
              errorMessage={errors.products?.message}
            />
          )}
        />

        {(Array.isArray(selectedProducts)
          ? selectedProducts.filter(isDropdownValue)
          : []
        ).map(productId => {
          const meta = productList.find(
            p => String(p.value) === String(productId),
          );
          const productName =
            meta?.label != null ? String(meta.label) : `#${productId}`;
          return (
            <SaleProductLineRow
              key={String(productId)}
              productId={productId}
              productName={productName}
              control={control}
              errors={errors}
              onRemove={() => removeSaleProduct(productId)}
            />
          );
        })}

        <TextView title="Received amount" style={styles.marginTop} />
        <Controller
          control={control}
          name="creditorAmount"
          render={({ field: { onChange, value } }) => (
            <TextInput
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              keyboard="numeric"
              value={value}
            />
          )}
        />

        <Calender
          isVisible={showDate}
          onClose={() => onCloseDate()}
          onConfirm={onConfirmDate}
          value={
            moment(calendarValueDate, 'DD/MM/YYYY', true).isValid()
              ? moment(calendarValueDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
              : undefined
          }
        />

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
  contactPersonButton: {
    width: '35%',
    backgroundColor: Colors.background,
    borderColor: Colors.gray_300,
    borderWidth: 1,
    marginTop: '5%',
    alignSelf: 'flex-end',
    marginRight: '4%',
  },
  contactPersonButtonText: {
    color: Colors.gray_400,
  },
});
