import { View, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/theme/Colors';
import CustomHeader from '@/navigation/Header';
import ItemList from '@/component/list/ItemList';
import { ADDITIONAL_ITEMS_LIST } from '@/static';
import { HomeListProps } from '@/types';
import { FontSizes } from '@/theme';
import { deviceHeight } from '@/helper';
import useAdditionalItems from '@/hooks/useAditionalItems';
import { NotFound } from '@/component/icons';
import { t } from '@/locales';


export default function AdditionalItems() {
  const { 
    isConnected,
    onSubmitDetail, 
  } = useAdditionalItems();

  return (
    <ScrollView style={styles.container}>
      <CustomHeader title={t('common.additionalItems')} />
      {isConnected ? (  
        <View style={styles.linstContainer}>
        {ADDITIONAL_ITEMS_LIST.map((item) => (
          <View key={item.key} style={styles.itemContainer}>
            <ItemList
              item={item}
              onCallback={item => onSubmitDetail(item as HomeListProps)}
            />
          </View>

        ))}
      </View>
      ) : (
        <View style={styles.activityIndicator}>
          <NotFound size={120} />
        </View>
      )}
   


    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  linstContainer: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: '5%'
  },
  itemContainer: {
    width: '48%',
  },
  balance: {
    fontSize: FontSizes.medium,
  },
  activityIndicator: {
    alignItems: 'center',
    marginTop: deviceHeight / 4,

  },

});