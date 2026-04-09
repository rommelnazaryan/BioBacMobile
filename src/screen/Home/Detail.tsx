import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/theme/Colors';
import CustomHeader from '@/navigation/Header';
import HomeList from './_component/HomeList';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import { HOME_LIST } from '@/static';
import { getHistoryProps, HomeListProps } from '@/types';
import useDetail from '@/hooks/useHome/useDetail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import TextView from '@/component/view/TextView';
import { FontSizes } from '@/theme';
import Activity from '@/component/ActivityIndicator';
import NotFound from '@/component/icons/NotFound';
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
  return (
    <View style={styles.container}>
      <CustomHeader title={item.name} showBack={true} />
      <TextView title={`Balance: ${item.balance}`} textStyle={styles.balance} />
      <View style={styles.linstContainer}>
        <VerticalFlatList
          data={HOME_LIST}
          gap={10}
          columns={2}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <HomeList
              item={item}
              onCallback={item => onSubmitDetail(item as HomeListProps)}
            />
          )}
        />
      </View>
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : (
        <VerticalFlatList
          data={history}
          gap={10}
          columns={1}
          contentContainerStyle={history.length === 0 ? styles.emptyGrow : undefined}
          keyExtractor={(item, index) =>
            item?.createdAt ? `${item.createdAt}:${index}` : String(index)
          }
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <NotFound size={120} />
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <Activity style={styles.footerLoading} />
            ) : null
          }
          renderItem={({ item: company }: { item: getHistoryProps }) => (
            <DefaultTable
              containerStyle={styles.tableContainer}>
              <HistoryCard element={company} />
            </DefaultTable>
          )}
        />
      )}
    </View>
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
  },
  balance: {
    fontSize: FontSizes.medium,
  },
  activityIndicator: {
    marginTop: deviceHeight / 8,

  },
  emptyGrow: { flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoading: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 10,
  },
});