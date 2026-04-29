import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Colors, FontFamily, FontSizes, Shadows} from '@/theme';
import Button from '@/component/button';
import BaseModal from './BaseModal';
import {AntDesign} from '../icons/VectorIcon';
import {t} from '@/locales';
interface ModalCardProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function DefaultModal({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
}: ModalCardProps) {
  return (
    <BaseModal isVisible={isVisible} onClose={onClose} >
      <View style={styles.cardContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <AntDesign name="warning" size={24} color={Colors.red} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {/* <View style={styles.closeContainer}>
            <MaterialIcons name="close" size={20} color={Colors.black} />
          </View> */}
        </View>
        <Text style={styles.description}>
          {description}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title={t('common.cancel')}
            onHandler={onClose}
            style={[styles.button, styles.cancelButton]}
            textStyle={[styles.cancelButtonText]}
          />
          <Button title={t('common.confirm')} onHandler={onConfirm} style={styles.button} textStyle={styles.confirmButtonText}/>
        </View>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
  },
  cardContainer: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    ...Shadows.sm, // Apply shadow
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.red_100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.large,
    fontFamily: FontFamily.semiBold,
    color: Colors.black,
    marginLeft: 10,
  },
  closeContainer: {
    width: 25,
    height: 25,
    backgroundColor: Colors.gray_200,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    position: 'absolute',
  },
  description: {
    fontSize: FontSizes.medium,
    fontFamily: FontFamily.regular,
    color: Colors.black,
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10%',
  },
  button: {
    width: '45%',
    height: 50,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray_200,
  },
  cancelButtonText: {
    color: Colors.black,
    fontSize: FontSizes.small,
  },
  confirmButtonText: {
    fontSize: FontSizes.small,
  },
});
