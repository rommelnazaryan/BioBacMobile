import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { Colors, FontFamily, FontSizes } from '@/theme';

interface TextViewProps {
    title: string;
  style?: ViewStyle
  textStyle?: TextStyle
}

export default function TextView({title, style, textStyle}: TextViewProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text,textStyle]}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width:'90%',
    alignSelf: 'center',
  },
  text: {
    fontSize: FontSizes.small,
    fontFamily: FontFamily.semiBold,
    color: Colors.black,
  },
});