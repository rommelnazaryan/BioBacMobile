import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@/theme';
import Button from '../button';
import { AntDesign } from '@/component/icons/VectorIcon';
import FilterIcon from '@/component/icons/FilterIcon';
import { t } from '@/locales';
import DefaultFilter from './DefaultFilter';

type Props = {
  onHandlerCreate?: () => void;
  filter?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onSubmit?: () => void;
  onSubmitReset?: () => void;
}


export default function Filter({ onHandlerCreate, filter, containerStyle, buttonStyle, children ,onSubmit,onSubmitReset}: Props) {
  const [visible, setVisible] = useState(false);
  const handleSubmit = () => {
    setVisible(() => false);
    onSubmit?.();
  };
  const handleReset = () => {
    setVisible(() => false);
    onSubmitReset?.();
  };
  return (
    <>
      <View style={[styles.buttonContainer, containerStyle]}>
        {filter && (
          <Button
            title={t('common.Filter')}
            icon={<FilterIcon size={24} color={Colors.gray_400} />}
            onHandler={() => setVisible(true)}
            textStyle={{ color: Colors.gray_400 }}
            style={styles.filterButton}
          />
        )}
        {onHandlerCreate && (
          <Button
            titleIcon={<AntDesign name="plus" size={24} color={Colors.white} />}
            onHandler={onHandlerCreate}
            style={[styles.button, buttonStyle]}
          />
        )}
      </View>
      <DefaultFilter onSubmit={handleSubmit} onSubmitReset={handleReset} containerStyle={styles.filterContainer} isVisible={visible} onClose={() => setVisible(false)} children={

        <>{children}</>
      } />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 55,
    height: 54,
    padding: 0,
  },
  filterButton: {
    width: '30%',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray_200,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '93%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    alignSelf: 'center',
  },
  filterContainer: {
    minHeight: 300,
  },
});