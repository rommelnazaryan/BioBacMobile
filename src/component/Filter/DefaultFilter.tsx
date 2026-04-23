import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import BaseModal from '../Modal/BaseModal';
import {Colors} from '@/theme';
import Botton from '../button';

export default function DefaultFilter({
  isVisible,
  onClose,
  children,
  containerStyle,
  onSubmit,
  onSubmitReset,
}: {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  onSubmit: () => void;
  onSubmitReset: () => void;
}) {




  return (
    <BaseModal isVisible={isVisible} onClose={onClose} variant="bottomSheet">
      <View style={[styles.container,containerStyle]}>
        <View style={styles.handle} />
         {children}
         <View style={styles.buttonContainer}>
         <Botton title="Reset" onHandler={onSubmitReset} style={[styles.button, styles.resetButton]} textStyle={styles.resetButtonText}/>
         <Botton title="Apply" onHandler={onSubmit} style={styles.button} />
         </View>

      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  },

  buttonContainer: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10%',
  },
  button: {
    width: '45%',
  },
  resetButton:{
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  resetButtonText: {
    color: Colors.red,
  }
});