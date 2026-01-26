import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
  View,
  ActivityIndicator,
} from 'react-native';
import {Colors, FontSizes} from '../../theme';
import {FontFamily} from '../../theme';

type Props = {
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  onHandler: () => void;
  icon?: ReactNode; // Added icon prop
  disabled?: boolean;
  showArrow?: boolean;
  arrowColor?: string;
  countdown?: boolean; // enable 3-2-1 countdown on press
  countdownStart?: number; // defaults to 3
  loading?: boolean;
  titleIcon?: ReactNode;
};

const Botton = (props: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={props.disabled}
      onPress={() => props.onHandler()}
      style={[styles.container, props.style]}>
      <View style={styles.contentContainer}>
        {props.loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <View style={styles.iconContainer}>
            {props.icon && props.icon}
            {props.title ? (
              <Text
                style={[
                  {fontFamily: FontFamily.semiBold},
                  {fontSize: FontSizes.medium},
                  styles.title,
                  props.textStyle,
                ]}>
                {props.title}
              </Text>
            ) : (
              props.titleIcon
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default Botton;
const styles = StyleSheet.create({
  container: {
    width: '93%',
    height: 54,
    borderRadius: 12,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    padding: 12,
    backgroundColor: Colors.blue,
  },

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.white,
  },
  iconContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  }
});
