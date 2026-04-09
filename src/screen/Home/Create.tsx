import {View, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '@/theme';
import {Controller} from 'react-hook-form';
import TextView from '@/component/view/TextView';
import useHomeCreate from '@/hooks/useHome/useCreate';
import TextInput from '@/component/input/TextInput';
import Botton from '@/component/button';
import CustomHeader from '@/navigation/Header';
import Calender from '@/component/calender';
import TouchableView from '@/component/view/TouchableView';
import DateIcon from '@/component/icons/DateIcon';
import moment from 'moment';
import DropdownComponent from '@/component/dropdown';
import MapModal from '@/component/Modal/MapModal';
import type {RootStackParamList} from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeCreate'>;

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
    keyValue
  } = useHomeCreate(route);

  return (
    <View style={styles.container}>
      <CustomHeader title={'Company Information'} showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <TextView title="Company Name" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="General Director" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Company Phone" style={styles.marginTop} />
        <Controller
          control={control}
          name="companyPhone"
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="..."
              containerStyle={styles.marginTop}
              inputSize="medium"
              onChangeText={onChange}
              keyboard="numeric"
              value={value}
              errorMessage={errors.companyPhone?.message}
            />
          )}
        />

        <TextView title="Actual Address" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Point of Sale Address" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Legal Address" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Warehouse Address" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Company Group" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Creditor amount" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Debtor amount" style={styles.marginTop} />
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
            />
          )}
        />

        <TextView title="Date" style={styles.marginTop} />
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

        <TextView title="Latitude" style={styles.marginTop} />
        <TextInput
          containerStyle={styles.marginTop}
          placeholder="..."
          inputSize="medium"
          onChangeText={text => setLatitude(text)}
          keyboard="numeric"
          value={latitude}
        />

        <TextView title="Longitude" style={styles.marginTop} />
        <TextInput
          containerStyle={styles.marginTop}
          placeholder="..."
          inputSize="medium"
          onChangeText={text => setLongitude(text)}
          keyboard="numeric"
          value={longitude}
        />

        <Botton
          title="Show Map"
          onHandler={onPressGetLocation}
          style={styles.locationButton}
          textStyle={styles.locationButtonText}
        />
        <Botton
          title={keyValue === 'edit' ? 'Update' : 'Create'}
          onHandler={handleSubmit(onCreateCompany)}
          style={styles.button}
        />
        <MapModal
          isVisible={showMap}
          onClose={() => onCloseMap()}
          onSubmit={(lat, lng) => onSubmitMap(lat, lng)}
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
});

