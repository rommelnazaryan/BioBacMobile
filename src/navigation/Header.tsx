// src/components/CustomHeader.js
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '@/theme/Colors';
import Arrow from 'react-native-vector-icons/MaterialIcons';
import {FontFamily} from '@/theme';
type CustomHeaderProps = {
  title?: string;
  showBack?: boolean;
  icon?: React.ReactNode;
  onHandler?: () => void;
  onSubmitBack?: () => void;
  style?: ViewStyle;
};

export default function CustomHeader({
  title,
  showBack = false,
  onSubmitBack,
  style,
}: CustomHeaderProps) {
  const navigation = useNavigation();
  return (
    <View style={[styles.header, style]}>
        {showBack && (
          <View style={styles.backContainer}>
            <TouchableOpacity
              onPress={onSubmitBack ? onSubmitBack : () => navigation.goBack()}>
              <Arrow name="arrow-back" size={30} color={Colors.black} />
            </TouchableOpacity>
          </View>
        )}
        <Text
          style={[styles.title]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title || ''}
        </Text>
        <View/>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   position: 'absolute',
   left: 20,
  },


  title: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
    width: '60%',
  },
});
