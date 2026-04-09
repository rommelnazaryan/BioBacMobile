import {Modal, Pressable, StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import React from 'react';
interface ModalCardProps {
  isVisible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  variant?: 'center' | 'bottomSheet';
  overlayStyle?: StyleProp<ViewStyle>;
}

export default function ModalCard({
  isVisible,
  onClose,
  children,
  variant = 'center',
  overlayStyle,
}: ModalCardProps) {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          variant === 'bottomSheet' ? styles.bottomSheetOverlay : null,
          overlayStyle,
        ]}
        onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.contentWrapper}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
  },
  bottomSheetOverlay: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  contentWrapper: {
    width: '100%',
  },

});
