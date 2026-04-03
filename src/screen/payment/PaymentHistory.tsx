import {View, StyleSheet} from 'react-native';
import React from 'react';
import usePaymentHistory from '@/hooks/usePayment/usePaymentHistory';
import {Colors} from '@/theme';
import Header from '@/navigation/Header';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import Activity from '@/component/ActivityIndicator';
import {deviceHeight} from '@/helper';
import {GetPaymentAllResponse} from '@/types';
import HistoryCard from './_component/Card';
import NotFound from '@/component/icons/NotFound';
import DefaultTable from '@/component/Table/defaultTable';

export default function PaymentHistory() {
 const {loading, loadingMore, history, loadMore} = usePaymentHistory();
  return (
    <View style={styles.container}>
        <Header title={'Payment History'} showBack={true} />
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
          renderItem={({item: company}: {item: GetPaymentAllResponse}) => (
            <DefaultTable
              containerStyle={styles.tableContainer}>
               <HistoryCard element={company}
               />
            </DefaultTable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    activityIndicator: {
      marginTop: deviceHeight / 3,
    },
    tableContainer: {
      marginBottom: 10,
    },
    footerLoading: {
      marginTop: 10,
      marginBottom: 20,
    },
    footerText: {
      textAlign: 'center',
      color: Colors.gray_300,
      marginTop: 10,
      marginBottom: 20,
    },
  emptyGrow: {flexGrow: 1},
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    color: Colors.gray_300,
  },
  });
