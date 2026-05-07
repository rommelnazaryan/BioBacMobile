import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from '@/theme/Colors';
import useHome from '@/hooks/useHome';
import CustomHeader from '@/navigation/Header';
import { t } from '@/locales';
import { HOME_LIST } from '@/static';
import ItemList from '@/component/list/ItemList';
import { ListProps } from '@/types';


export default function Home() {
  const {
    onSubmitDetail
  } = useHome();
  return (
    <View style={styles.container}>
      <CustomHeader title={t('home.title')} />
      <View style={styles.linstContainer}>
        {HOME_LIST.map((item) => (
          <View key={item.key} style={styles.itemContainer}>
            <ItemList
              item={item}
              onCallback={selectedItem => onSubmitDetail(selectedItem as ListProps)}
            />
          </View>
        ))}
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    height: '100%',
  },
  itemContainer: {
    width: '48%',
  },
  linstContainer: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: '5%'
  },

});
