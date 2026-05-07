import {Text, StyleSheet, View, ViewStyle, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, FontFamily, FontSizes, Shadows} from '@/theme';
import {MaterialIcons} from '../icons/VectorIcon';

interface TouchableViewProps {
  title: string;
  style?: ViewStyle;
  onClose?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  focused?: boolean; // controlled focus (optional)
  onBlur?:boolean
  icon?: React.ReactNode;
  errorMessage?: string;
}

export default function TouchableView({
  title,
  style,
  onClose,
  onPress,
  disabled,
  focused,
  onBlur,
  icon,
  errorMessage,
}: TouchableViewProps) {
  const [isFocusedInternal, setIsFocusedInternal] = useState(onBlur);
  const isFocused = focused ?? isFocusedInternal;
  const hasError = !!errorMessage;
  const onHandlerPress = () => {
    setIsFocusedInternal(true);
    onPress?.();
  };
  useEffect(() => {
    setIsFocusedInternal(onBlur ?? false);
  }, [onBlur]);
  
  return (
    <View style={ styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        style={[
          styles.container,
          style,
          {
            borderColor: isFocused ? Colors.blue : Colors.gray_200,
            backgroundColor: disabled
              ? Colors.gray_200
              : hasError
              ? Colors.red_100
              : Colors.white,
          },
        ]}
        onPress={onHandlerPress}
      >
        <Text style={[styles.text, {color: title ? Colors.black : Colors.gray}]}>
          {title || 'Select'}
        </Text>

        {title ? (
          <TouchableOpacity activeOpacity={0.8} disabled={disabled} onPress={onClose}>
            <MaterialIcons name="close" size={22} color="black" />
          </TouchableOpacity>
        ) : icon ? (
          icon
        ) : null}
      </TouchableOpacity>

      {hasError ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '93%',
    alignSelf: 'center',

  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray_200,
    borderRadius: 12,
    ...Shadows.md,
    height: 50,
  },
  text: {
    fontSize: FontSizes.small,
    fontFamily: FontFamily.regular,
    color: Colors.black,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 6,
    fontSize: FontSizes.small,
    fontFamily: FontFamily.regular,
    color: Colors.red,
  },
});
