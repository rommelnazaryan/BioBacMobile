import { View, StyleSheet, ScrollView } from 'react-native'
import React, { Fragment } from 'react'
import { Colors } from '@/theme/Colors';
import CustomHeader from '@/navigation/Header';
import HomeList from './_component/HomeList';
import { HOME_LIST } from '@/static';
import { HomeListProps } from '@/types';
import useDetail from '@/hooks/useHome/useDetail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import TextView from '@/component/view/TextView';
import { FontSizes } from '@/theme';
import Activity from '@/component/ActivityIndicator';
import DefaultTable from '@/component/Table/defaultTable';
import HistoryCard from '../Buyers/_component/HistoryCard';
import { deviceHeight } from '@/helper';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function Detail(route: Props) {
  const { item,
    loading,
    loadingMore,
    loadMore,
    history, onSubmitDetail } = useDetail(route);

  console.log(history)
  return (
    <ScrollView style={styles.container}>
      <CustomHeader title={item.name} showBack={true} />
      <TextView title={`Balance: ${item.balance}`} textStyle={styles.balance} />
      <View style={styles.linstContainer}>
        {HOME_LIST.map((item) => (
          <View key={item.key} style={styles.itemContainer}>
            <HomeList
              item={item}
              onCallback={item => onSubmitDetail(item as HomeListProps)}
            />
          </View>

        ))}
      </View>

      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : (
        <View style={styles.historyContainer}>
          {history.length > 0 && (
            history.map((item, index) => (
              <DefaultTable
                key={index}
                containerStyle={styles.tableContainer}>
                <Fragment key={index}>
                  <HistoryCard element={item} />
                </Fragment>
              </DefaultTable>
            ))
          )}
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
    marginTop: deviceHeight / 8,

  },

  tableContainer: {
    marginTop: '2%',
  },
  historyContainer: {
    marginTop: '2%',
  },
});