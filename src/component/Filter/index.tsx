import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import { Colors } from '@/theme';
import Button from '../button';
import {AntDesign} from '@/component/icons/VectorIcon';
import FilterIcon from '@/component/icons/FilterIcon';
import {t} from '@/locales';
import DefaultFilter from './DefaultFilter';

type Props = {
  onHandlerCreate?: () => void;
  filter?: boolean;
}


export default function Filter({onHandlerCreate, filter}: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <View style={styles.buttonContainer}>
        {filter && (
          <Button
            title={t('common.Filter')}
            icon={<FilterIcon size={24} color={Colors.gray_400} />}
            onHandler={() => setVisible(true)}
            textStyle={{color: Colors.gray_400}}
            style={styles.filterButton}
          />
        )}
        {onHandlerCreate && (
          <Button
            titleIcon={<AntDesign name="plus" size={24} color={Colors.white} />}
            onHandler={onHandlerCreate}
            style={styles.button}
          />
        )}
      </View>
      <DefaultFilter isVisible={visible} onClose={() => setVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
    button: {
        width: '15%',
      },
      filterButton: {
        width: '30%',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray_200,
      },
      buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 10,
        gap: 10,
        width: '93%',
        alignSelf: 'center',
      },
});