import { View, StyleSheet } from 'react-native'
import React from 'react'
import TextInput from '../input/TextInput'
import { Ionicons } from '../icons/VectorIcon';
import { Colors } from '@/theme';
export default function Search( {onChangeText}: {onChangeText: (text: string) => void} ) {
  return (
    <View style={styles.container}>
        <TextInput
            placeholder="Search"
            inputSize="medium"
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputContainer}
            onChangeText={onChangeText}
        />
        <Ionicons name="search-outline" size={24} color={Colors.gray_400} style={styles.searchIcon} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  inputContainer: {
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 10,
  },
});