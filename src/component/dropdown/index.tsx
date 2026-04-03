import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Text, ViewStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Feather} from '@/component/icons/VectorIcon';
import {Colors, FontFamily, FontSizes, Shadows} from '@/theme';
import {t} from '@/locales';
import { DropdownOptions } from '@/navigation/types';

type DropdownComponentProps = {
  style?: ViewStyle;
  data: DropdownOptions[];
  onClick: (item: {label: string; value: string | number}) => void;
  errorMessage?: string;
  search?: boolean;
  value?: string | number | null;
};

const normalizeValue = (value: string | number | null | undefined) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  return String(value);
};

const DropdownComponent = ({
  style,
  data,
  onClick,
  errorMessage,
  search = false,
  value: valueProp,
}: DropdownComponentProps) => {
  const isControlled = valueProp !== undefined;
  const isEmpty = data.length === 0;
  const [internalValue, setInternalValue] = useState<string | number | null>(null);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(valueProp ?? null);
    }
  }, [isControlled, valueProp]);

  const selectedValue = useMemo(() => {
    return isControlled ? (valueProp ?? internalValue) : internalValue;
  }, [internalValue, isControlled, valueProp]);

  const normalizedSelectedValue = useMemo(
    () => normalizeValue(selectedValue),
    [selectedValue],
  );

  const [_isFocused, setIsFocused] = useState(false);
  const renderItem = (item: {label: string; value: string | number}) => {
    const isSelected = normalizeValue(item.value) === normalizedSelectedValue;
    return (
      <View
        style={[
          styles.item,
          {backgroundColor: isSelected ? Colors.blue_100 : Colors.white},
        ]}>
        <Text
          style={[
            styles.textItem,
            {color: isSelected ? Colors.blue : Colors.black},
          ]}>
          {item.label}
        </Text>
        {normalizeValue(item.value) === normalizedSelectedValue && (
          <Feather
            style={styles.icon}
            color={Colors.blue}
            name="check"
            size={25}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <Dropdown
        style={[
          styles.dropdown,
          {
            borderColor: _isFocused ? errorMessage ? Colors.red : Colors.blue : Colors.gray_200,
            backgroundColor: errorMessage ? Colors.red_100 : Colors.white,
          },
          style,
        ]}
        placeholderStyle={[styles.placeholderStyle, {color: errorMessage ? Colors.red : Colors.gray}]}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        iconColor={Colors.black}
        search={search && !isEmpty}
        data={data}
        disable={isEmpty}
        activeColor={Colors.white}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={isEmpty ? t('common.noData') : 'Select...'}
        searchPlaceholder="Search..."
        value={selectedValue ?? null}
        onChange={item => {
          if (!isControlled) {
            setInternalValue(item.value);
          }
          onClick(item);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        renderItem={renderItem}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    fontSize: FontSizes.small,
    fontFamily: FontFamily.semiBold,
    marginLeft: '5%',
    marginTop: 10,
  },
  dropdown: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    ...Shadows.md,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    width: '95%',
    alignSelf: 'center',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: '2%',
    borderRadius: 8,
  },
  textItem: {
    flex: 1,
    fontSize: FontSizes.small,
    fontFamily: FontFamily.medium,
    color: Colors.black,
  },
  placeholderStyle: {
    fontSize: FontSizes.small,
    fontFamily: FontFamily.regular,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
});
