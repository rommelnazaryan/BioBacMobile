import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {MultiSelect} from 'react-native-element-dropdown';
import {Feather} from '@/component/icons/VectorIcon';
import {t} from '@/locales';
import {DropdownOptions} from '@/navigation/types';
import {Colors, FontFamily, FontSizes, Shadows} from '@/theme';

type DropdownValue = string | number;

type MultiSelectDropdownProps = {
  style?: ViewStyle;
  data: DropdownOptions[];
  value?: DropdownValue[];
  onChange: (values: DropdownValue[]) => void;
  errorMessage?: string;
  search?: boolean;
  disable?: boolean;
  placeholder?: string;
};

const normalizeValue = (value: DropdownValue | null | undefined) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  return String(value);
};

const MultiSelectDropdown = ({
  style,
  data,
  value = [],
  onChange,
  errorMessage,
  search = false,
  disable = false,
  placeholder,
}: MultiSelectDropdownProps) => {
  const [_isFocused, setIsFocused] = useState(false);
  const isEmpty = data.length === 0;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<DropdownValue[]>(value);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [isControlled, value]);

  const selectedValues = isControlled ? value : internalValue;

  const normalizedValue = useMemo(
    () =>
      selectedValues
        ?.map(item => normalizeValue(item))
        ?.filter((item): item is string => item !== null),
    [selectedValues],
  );

  const normalizedData = useMemo(
    () =>
      data.map(item => ({
        ...item,
        value: normalizeValue(item.value) ?? '',
      })),
    [data],
  );

  const originalValueMap = useMemo(
    () =>
      new Map(
        data.map(item => [
          normalizeValue(item.value) ?? '',
          item.value,
        ]),
      ),
    [data],
  );

  const optionMap = useMemo(
    () =>
      new Map(
        data.map(item => [
          normalizeValue(item.value) ?? '',
          item,
        ]),
      ),
    [data],
  );

  const normalizedValueSet = useMemo(
    () => new Set(normalizedValue),
    [normalizedValue],
  );

  const selectedOptions = useMemo(
    () =>
      normalizedValue
        .map(item => optionMap.get(item))
        .filter((item): item is DropdownOptions => Boolean(item)),
    [normalizedValue, optionMap],
  );

  const handleChange = useCallback((values: string[]) => {
    const nextValues = values.map(
      currentValue => originalValueMap.get(currentValue) ?? currentValue,
    );

    setInternalValue(nextValues);
    onChange(nextValues);
  }, [onChange, originalValueMap]);

  const handleRemove = useCallback((itemValue: DropdownValue) => {
    const normalizedItemValue = normalizeValue(itemValue);
    const nextValues = selectedValues.filter(
      currentValue => normalizeValue(currentValue) !== normalizedItemValue,
    );

    setInternalValue(nextValues);
    onChange(nextValues);
  }, [onChange, selectedValues]);

  const renderItem = useCallback((item: {label: string; value: string}) => {
    const isSelected = normalizedValueSet.has(item.value);

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
        {isSelected && (
          <Feather
            style={styles.icon}
            color={Colors.blue}
            name="check"
            size={25}
          />
        )}
      </View>
    );
  }, [normalizedValueSet]);

  return (
    <>
      <MultiSelect
        style={[
          styles.dropdown,
          {
            borderColor: _isFocused
              ? errorMessage
                ? Colors.red
                : Colors.blue
              : Colors.gray_200,
            backgroundColor: errorMessage ? Colors.red_100 : Colors.white,
          },
          style,
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          {color: errorMessage ? Colors.red : Colors.gray},
        ]}
        selectedTextStyle={styles.hiddenSelectedText}
        selectedStyle={styles.hiddenSelectedItem}
        iconStyle={styles.iconStyle}
        iconColor={Colors.black}
        search={search && !isEmpty}
        data={normalizedData}
        disable={isEmpty || disable}
        activeColor={Colors.white}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={isEmpty ? t('common.noData') : (placeholder ?? 'Select...')}
        searchPlaceholder="Search..."
        value={normalizedValue}
        onChange={handleChange}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        renderItem={renderItem}
        renderSelectedItem={() => <View style={styles.hiddenSelectedItem} />}
      />

      {selectedOptions.length > 0 && (
        <View style={styles.selectedContainer}>
          {selectedOptions.map(item => (
            <View key={String(item.value)} style={styles.selectedChip}>
              <Text style={styles.selectedChipText}>{item.label}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleRemove(item.value)}
                style={styles.selectedChipRemove}>
                <Feather name="x" size={16} color={Colors.black} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </>
  );
};

export default memo(MultiSelectDropdown);

const styles = StyleSheet.create({
  dropdown: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    ...Shadows.md,
  },
  placeholderStyle: {
    fontSize: FontSizes.small,
    fontFamily: FontFamily.regular,
  },
  hiddenSelectedText: {
    height: 0,
    width: 0,
    color: 'transparent',
  },
  hiddenSelectedItem: {
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    opacity: 0,
  },
  iconStyle: {
    width: 25,
    height: 25,
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
  icon: {
    marginRight: 5,
  },
  selectedContainer: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray_200,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    ...Shadows.sm,
  },
  selectedChipText: {
    fontSize: FontSizes.xsmall,
    fontFamily: FontFamily.semiBold,
    color: Colors.black,
  },
  selectedChipRemove: {
    marginLeft: 8,
  },
  errorText: {
    color: Colors.red,
    fontSize: FontSizes.small,
    fontFamily: FontFamily.semiBold,
    marginLeft: '5%',
    marginTop: 10,
  },
});
