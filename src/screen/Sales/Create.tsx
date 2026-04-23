import { View, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '@/theme';
import { Controller } from 'react-hook-form';
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

type Props = NativeStackScreenProps<SalesParamList, 'SalesCreate'>;

export default function SalesCreate(route: Props) {

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
    companyList,
    lineList,
    isConnected,
    onCreateCompany,
    errorDate,
    keyValue,
    selectedLineValues, 
    setSelectedLineValues, 
    contactPersonList,
    onSubmitCreateContactPerson
  } = useSaleCreate(route);

  return (
    <View style={styles.container}>
      <CustomHeader title={'Create Sale'} showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
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
              onClick={({ value }) => onChange(value)}
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
          title={date}
          style={styles.marginTop}
          onPress={onOpenDate}
          onClose={onclearDate}
          onBlur={showDate}
          icon={<DateIcon size={24} color={Colors.black} />}
          errorMessage={errorDate}
        />

        <TextView title="Sale date" style={styles.marginTop} />
        <TouchableView
          title={date}
          style={styles.marginTop}
          onPress={onOpenDate}
          onClose={onclearDate}
          onBlur={showDate}
          icon={<DateIcon size={24} color={Colors.black} />}
          errorMessage={errorDate}
        />
        
        <TextView title="Products" style={styles.marginTop} />
        <Controller
          control={control}
          name="products"
          render={({ field: { onChange, value: value } }) => (
            <DropdownComponent
              style={styles.marginTop}
              data={isConnected ? companyList : []}
              value={value}
              onClick={({ value }) => onChange(value)}
              errorMessage={errors.products?.message}
            />
          )}
        />
        <TextView title="Creditor amount" style={styles.marginTop} />
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
            moment(date, 'DD/MM/YYYY', true).isValid()
              ? moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
              : undefined
          }
        />

        <Botton
          title={keyValue === 'edit' ? 'Update' : 'Create'}
          onHandler={handleSubmit(onCreateCompany)}
          style={styles.button}
        />

      </ScrollView>
    </View>
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
  }

});

