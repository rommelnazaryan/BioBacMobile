import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, FontFamily, FontSizes, Shadows } from '@/theme';
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
import { useMemo } from 'react';
import useSaleCreate from '@/hooks/useSale/useCreate';
import SaleProductLineRow, {
  formatTotalRub,
  parseSaleLineNumber,
  quantityForLineTotal,
} from '@/screen/Sales/_component/SaleProductLineRow';

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
    lineList,
    isConnected,
    onCreateCompany,
    errorOrderDate,
    errorSaleDate,
    keyValue,
    selectedLineValues,
    setSelectedLineValues,
    contactPersonList,
    productList,
    syncSaleLinesForSelection,
    removeSaleProduct,
    companyName,
  } = useSaleCreate(route);

  const productsWatch = useWatch({ control, name: 'products' });
  const saleLinesWatch = useWatch({ control, name: 'saleLines' });

  const { selectedProductIds, productsGrandTotal } = useMemo(() => {
    const ids = Array.isArray(productsWatch)
      ? productsWatch.filter(isDropdownValue)
      : [];
    const lines =
      saleLinesWatch != null && typeof saleLinesWatch === 'object'
        ? (saleLinesWatch as Record<
            string,
            { quantity?: string; unitPrice?: string }
          >)
        : {};
    let sum = 0;
    for (const pid of ids) {
      const idKey = String(pid);
      const row = lines[idKey];
      if (!row) {
        continue;
      }
      const qty = quantityForLineTotal(row.quantity);
      const unit = parseSaleLineNumber(String(row.unitPrice ?? '0'));
      sum += qty * unit;
    }
    return { selectedProductIds: ids, productsGrandTotal: sum };
  }, [productsWatch, saleLinesWatch]);

  const keyboardVerticalOffset = 30;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}
    >
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
        <View style={styles.selectedContainer}>
          {lineList.length > 0 &&
            lineList.map(item => (
              <View key={String(item.value)} style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>{item.label}</Text>
              </View>
            ))}
        </View>

        <TextView title="Company" style={styles.marginTop} />
        <View style={styles.companyChip}>
          <Text style={styles.selectedChipText}>{companyName}</Text>
        </View>
        {/* <Controller
          control={control}
          name="company"
          render={({ field: { onChange, value: value } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={isConnected ? companyList : []}
              value={value}
              onClick={({value: buyerCompanyId}) => {
                onChange(buyerCompanyId);
                // getContactPerson(labelValue);
                onSubmitGetProduct(String(buyerCompanyId));
              }}
              errorMessage={errors.company?.message}
            />
          )}
        /> */}

        <TextView title="Contact person" style={styles.marginTop} />
        <View style={styles.selectedContainer}>
          {contactPersonList.length > 0 &&
            contactPersonList.map(item => (
              <View key={String(item.value)} style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>
                  {item.firstName} {item.lastName}
                </Text>
              </View>
            ))}
        </View>
        {/* <Controller
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
        /> */}

        {/* <Botton
          title={'Add More'}
          onHandler={onSubmitCreateContactPerson}
          style={styles.contactPersonButton}
          textStyle={styles.contactPersonButtonText}
        /> */}
        <View style={styles.dateContainer}>
          <View style={styles.dateColumn}>
            <TextView title="Order date" style={styles.marginTop} />
            <TouchableView
              title={orderDate}
              containerStyle={styles.dateTouchableWrapper}
              style={styles.marginTop}
              onPress={onOpenOrderDate}
              onClose={onClearOrderDate}
              onBlur={showDate}
              icon={<DateIcon size={22} color={Colors.black} />}
              errorMessage={errorOrderDate}
            />
          </View>
          <View style={styles.dateColumn}>
            <TextView title="Sale date" style={styles.marginTop} />
            <TouchableView
              title={saleDate}
              containerStyle={styles.dateTouchableWrapper}
              style={styles.marginTop}
              onPress={onOpenSaleDate}
              onClose={onClearSaleDate}
              onBlur={showDate}
              icon={<DateIcon size={22} color={Colors.black} />}
              errorMessage={errorSaleDate}
            />
          </View>
        </View>
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

        {selectedProductIds.map(productId => {
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

        {selectedProductIds.length > 0 ? (
          <>
            <Text style={styles.productsGrandTotal}>
              Total price:{formatTotalRub(productsGrandTotal)}
            </Text>
          </>
        ) : null}

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
  productsGrandTotal: {
    marginTop: '5%',
    width: '93%',
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'right',
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
  selectedChipText: {
    fontSize: FontSizes.xsmall,
    fontFamily: FontFamily.semiBold,
    color: Colors.black,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray_200,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    ...Shadows.sm,
  },
  selectedContainer: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  companyChip: {
    alignSelf: 'flex-start',
    marginLeft: '4%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray_200,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '93%',
    alignSelf: 'center',
    marginTop: 10,
    columnGap: 10,
  },
  dateColumn: {
    flex: 1,
    minWidth: 0,
  },
  dateTouchableWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
