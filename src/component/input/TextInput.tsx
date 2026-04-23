import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Eye from '@/assets/svg/Eye.svg';
import EyeClose from '@/assets/svg/EyeClose.svg';
import {Colors, FontFamily, Shadows} from '@/theme';
export interface Props {
  defaultval?: string;
  keyboard?: any;
  line?: number;
  maxlength?: number;
  submitText?: any;
  edit?: boolean;
  value?: string;
  showPass?: boolean;
  rightIcon?: any;
  leftIcon?: any;
  containerStyle?: object;
  placeholder?: string;
  placeholderColor?: string;
  multiline?: boolean;
  isPassword?: boolean;
  errorMessage?: string;
  inputStyle?: object;
  errorMessageStyle?: object;
  onChangeText?: (text: string) => void;
  onClick?: () => void | undefined;
  handlePasswordIconClick?: () => void;
  onFocus?: () => void;
  onBlur?: (e: any) => void | undefined;
  SubmitEditing?: (val: any) => void | undefined;
  EndEditing?: (val: any) => void;
  KeyPress?: (val: any) => void;
  inputSize?: 'small' | 'medium' | 'large';
}

const TextInputComponent = (props: Props) => {
  const {black} = Colors;
  const [activeBorder, setActiveBorder] = useState<boolean | undefined>(false);
  const [touched, setTouched] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const [text] = useState('');

  // Don't show error styles until the user has interacted with the field
  const showError = Boolean(props.errorMessage) && touched;

  const borderStyle = useMemo(
    () => ({
      borderColor: showError
        ? Colors.red
        : activeBorder
          ? Colors.blue
          : Colors.gray_200,
    }),
    [activeBorder, showError],
  );

   const backgroundColor = useMemo(
    () => ({
      backgroundColor: props.errorMessage
        ? Colors.red_100
        : Colors.white,
    }),
    [props.errorMessage],
  );



  const floatingLabelAnimation = useRef(
    new Animated.Value(text ? 1 : 0),
  ).current;

  const sizeStyle = useMemo(() => {
    return props.inputSize === 'small'
      ? styles.sizeSmall
      : props.inputSize === 'medium'
        ? styles.sizeMedium
        : styles.sizeLarge;
  }, [props.inputSize]);

  useEffect(() => {
    if (props.defaultval) {
      Animated.timing(floatingLabelAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [props.defaultval, floatingLabelAnimation]);

  const handleBlur = (e: any) => {
    props.onBlur?.(e);
    setTouched(true);
    if (!props.value) {
      Animated.timing(floatingLabelAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
    setActiveBorder(false);
  };

  const handleFocus = () => {
    Animated.timing(floatingLabelAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
    setActiveBorder(true);
    setTouched(true);
    props.onFocus?.();
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => textInputRef.current?.focus()}>
        <View
          style={[
            styles.container,
            props.containerStyle,
            sizeStyle,
            borderStyle,
            backgroundColor,
          ]}>
          {props.leftIcon && <>{props.leftIcon}</>}
          <TextInput
            style={[styles.inputContainer, props.inputStyle]}
            ref={textInputRef}
            placeholderTextColor={
              props.placeholderColor ?? (showError ? Colors.red : Colors.gray)
            }
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            defaultValue={props.defaultval}
            multiline={props.multiline}
            maxLength={props.maxlength}
            numberOfLines={props.line}
            textAlignVertical="auto"
            autoCorrect={false}
            keyboardType={props.keyboard}
            textBreakStrategy="highQuality"
            returnKeyType="done"
            editable={props.edit}
            selectTextOnFocus={false}
            value={props.value}
            underlineColorAndroid="transparent"
            selectionColor={black}
            onSubmitEditing={val => props.SubmitEditing?.(val)}
            onEndEditing={val => props.EndEditing?.(val)}
            onKeyPress={e => props.KeyPress?.(e.nativeEvent)}
            secureTextEntry={props.showPass}
          />
          {props.rightIcon && (
            <TouchableOpacity
              onPress={props.handlePasswordIconClick}
              style={styles.rightIcon}>
              {props.showPass ?<EyeClose /> :  <Eye /> }
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
      {props.errorMessage && (
        <Text style={[styles.textError, props.errorMessageStyle]}>{props.errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '93%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    alignSelf: 'center',
    borderWidth: 1.5,
    ...Shadows.md,
  },
  sizeSmall: {height: 40},
  sizeMedium: {height: 50},
  sizeLarge: {height: 60},
  inputContainer: {
    width: '85%',
    height: 56,
    marginLeft: '1%',
    color: Colors.black,
  },
  label: {
    position: 'absolute',
    fontFamily: 'DMSans-Medium',
  },
  textError: {
    color: Colors.red,
    marginTop: 10,
    marginLeft: '5%',
    fontFamily: FontFamily.semiBold,
  },
  rightIcon: {
    marginLeft: 15,
  },
});

export default React.memo(TextInputComponent);
