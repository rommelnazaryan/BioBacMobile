import {View, StyleSheet, ScrollView, TouchableOpacity, Text, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '@/theme';
import {Controller} from 'react-hook-form';
import TextView from '@/component/view/TextView';
import useCompanyCreate from '@/hooks/useCompany/useCreate';
import TextInput from '@/component/input/TextInput';
import Botton from '@/component/button';
import CustomHeader from '@/navigation/Header';
import Calender from '@/component/calender';
import TouchableView from '@/component/view/TouchableView';
import DateIcon from '@/component/icons/DateIcon';
import moment from 'moment';
import DropdownComponent, {DropdownMultiSelect} from '@/component/dropdown';
import MapModal from '@/component/Modal/MapModal';
import type {CompanyParamList} from '@/navigation/types';
import { AntDesign } from '@/component/icons/VectorIcon';
import { t } from '@/locales';

type Props = NativeStackScreenProps<CompanyParamList, 'HomeCreate'>;

export default function HomeCreate(route: Props) {
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
    companyGroupList,
    companyGroup,
    isConnected,
    onPressGetLocation,
    showMap,
    onCloseMap,
    onSubmitMap,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    onCreateCompany,
    errorDate,
    keyValue,
    onSubmitCreateContactPerson,
    contactPersonList,
    handlePlusClick,
    phoneList,
    onRemovePhone,

  } = useCompanyCreate(route);
  const isEditMode = keyValue === 'edit';
  const keyboardVerticalOffset = 30;
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset} style={styles.container}>
      <CustomHeader title={t('common.companyInformation')} showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <TextView title={t('common.tin')} style={styles.marginTop} />
        <Controller
          control={control}
          name="TIN"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              edit={!isEditMode}
            />
          )}
        />
        <TextView title={t('common.companyName')} style={styles.marginTop} />
        <Controller
          control={control}
          name="companyName"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.companyName?.message}
              edit={!isEditMode}
            />
          )}
        />

        <TextView title={t('common.generalDirector')} style={styles.marginTop} />
        <Controller
          control={control}
          name="generalDirector"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.generalDirector?.message}
              edit={!isEditMode}
            />
          )}
        />

        <TextView title={t('common.companyPhone')} style={styles.marginTop} />
        <Controller
          control={control}
          name="companyPhone"
          render={({field: {onChange, value}}) => (
            <>
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              keyboard="numeric"
              value={value}
              errorMessage={errors.companyPhone?.message}
              plusIcon={true}
              handlePlusClick={handlePlusClick}
            />
            {phoneList.length > 0 && (
              <View style={styles.phoneListContainer}>
                  {phoneList.map(phone => (
                      <View key={phone} style={styles.phoneChip}>
                          <Text style={styles.phoneChipText}>{phone}</Text>
                          {!isEditMode && (
                            <TouchableOpacity onPress={() => onRemovePhone(phone)}>
                              <AntDesign name="close" size={18} color={Colors.red} />
                            </TouchableOpacity>
                          )}
                      </View>
                  ))}
              </View>
          )}
          </>
          )}
        />

      <TextView title={t('common.contactPerson')} style={styles.marginTop} />
        <Controller
          control={control}
          name="contactPerson"
          render={({field: {onChange, value: accountValue}}) => (
            <DropdownMultiSelect
              style={styles.marginTop}
              data={isConnected ? contactPersonList : []}
              value={accountValue}
              onChange={onChange}
              errorMessage={errors.contactPerson?.message}
            />
          )}
        />
        <Botton
          title={t('common.addMore')}
          onHandler={onSubmitCreateContactPerson}
          style={styles.contactPersonButton}
          textStyle={styles.contactPersonButtonText}
        />


        <TextView title={t('common.actualAddress')} style={styles.marginTop} />
        <Controller
          control={control}
          name="actualAddress"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.actualAddress?.message}
              edit={!isEditMode}
            />
          )}
        />

        <TextView title={t('common.pointOfSaleAddress')} style={styles.marginTop} />
        <Controller
          control={control}
          name="addressTT"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.addressTT?.message}
              edit={!isEditMode}
            />
          )}
        />

        <TextView title={t('common.legalAddress')} style={styles.marginTop} />
        <Controller
          control={control}
          name="localAddress"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.localAddress?.message}
              edit={!isEditMode}
            />
          )}
        />

        <TextView title={t('common.warehouseAddress')} style={styles.marginTop} />
        <Controller
          control={control}
          name="warehouseAddress"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.warehouseAddress?.message}
              edit={!isEditMode}
            />
          )}
        />

        <TextView title={t('common.companyGroup')} style={styles.marginTop} />
        <Controller
          control={control}
          name="companyGroup"
          render={({field: {onChange, value: accountValue}}) => (
            <DropdownComponent
              style={styles.marginTop}
              data={isConnected ? companyGroupList : companyGroup}
              value={accountValue}
              onClick={({value}) => onChange(value)}
              errorMessage={errors.companyGroup?.message}
              disable={isEditMode}
            />
          )}
        />

        <TextView title={t('common.creditorAmount')} style={styles.marginTop} />
        <Controller
          control={control}
          name="creditorAmount"
          render={({field: {onChange, value}}) => (
            <TextInput
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              keyboard="numeric"
              value={value}
              edit={!isEditMode}
            />
          )}
        />

        <TextView title={t('common.debtorAmount')} style={styles.marginTop} />
        <Controller
          control={control}
          name="debtorAmount"
          render={({field: {onChange, value}}) => (
            <TextInput
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              keyboard="numeric"
              value={value}
              edit={!isEditMode}
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
          disabled={isEditMode}
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

        <TextView title={t('common.latitude')} style={styles.marginTop} />
        <TextInput
          containerStyle={styles.marginTop}
          placeholder="..."
          inputSize="medium"
          onChangeText={text => setLatitude(text)}
          keyboard="numeric"
          value={latitude}
          edit={!isEditMode}
        />

        <TextView title={t('common.longitude')} style={styles.marginTop} />
        <TextInput
          containerStyle={styles.marginTop}
          placeholder="..."
          inputSize="medium"
          onChangeText={text => setLongitude(text)}
          keyboard="numeric"
          value={longitude}
          edit={!isEditMode}
        />

        <Botton
          title={t('common.showMap')}
          onHandler={onPressGetLocation}
          style={styles.locationButton}
          textStyle={styles.locationButtonText}
          disabled={isEditMode}
        />
        <Botton
          title={keyValue === 'edit' ? t('common.update') : t('common.create')}
          onHandler={handleSubmit(onCreateCompany)}
          style={styles.button}
        />
        <MapModal
          isVisible={showMap}
          onClose={() => onCloseMap()}
          onSubmit={(lat, lng) => onSubmitMap(lat, lng)}
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
  locationButton: {
    width: '35%',
    backgroundColor: Colors.white,
    borderColor: Colors.blue,
    borderWidth: 2,
    marginTop: '5%',
    alignSelf: 'flex-start',
    marginLeft: '4%',
  },
  locationButtonText: {
    color: Colors.blue,
  },
  mapContainer: {
    width: '100%',
    height: 200,
  },
  map: {
    flex: 1,
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
  phoneListContainer: {
    width: '93%',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray_200,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  phoneChipText: {
    color: Colors.black,
  },
});

