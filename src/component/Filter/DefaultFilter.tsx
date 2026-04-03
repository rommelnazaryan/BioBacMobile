import {View, StyleSheet} from 'react-native';
import React from 'react';
import BaseModal from '../Modal/BaseModal';
import TextView from '../view/TextView';
import Dropdown from '../dropdown';
import {Colors} from '@/theme';
import TextInput from '../input/TextInput';
import Botton from '../button';

export default function DefaultFilter({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {

const firstDropdownData = [
  {label: 'Name', value: '1'},
  {label: 'Creditor amount', value: '2'},
  {label: 'Debtor amount', value: '3'},
  {label: 'Phone number', value: 'phoneNumber'},
  {label: 'Email', value: '5'},
  {label: 'Created at', value: '6'},
];


  return (
    <BaseModal isVisible={isVisible} onClose={onClose} variant="bottomSheet">
      <View style={styles.container}>
        <View style={styles.handle} />
        <TextView title="Field"/>
        <Dropdown data={firstDropdownData} onClick={() => {}} style={styles.marginField} />
        <TextView title="Operator" style={styles.marginTop}/>
        <Dropdown data={[]} onClick={() => {}} style={styles.marginField} />
        <TextView title="Longitude" style={styles.marginTop} />
        <TextInput
          containerStyle={styles.marginField}
          placeholder="..."
          inputSize="medium"
          onChangeText={(text) => console.log(text)}
          keyboard="numeric"
          value={''}
        />
        <Botton title="Apply" onHandler={() => {}} style={styles.button} />
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 500,
    backgroundColor: Colors.white,
    padding: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.gray_200,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  marginTop: {
    marginTop: '5%',
  },
  marginField: {
    marginTop: '2%',
  },
  button: {
    marginTop: '10%',
  },
});