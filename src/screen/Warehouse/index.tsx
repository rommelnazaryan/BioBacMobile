import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Colors } from '@/theme';
import CustomHeader from '@/navigation/Header';
import { t } from '@/locales';
import useWarehouse from '@/hooks/useWarehouse';
import { NotFound } from '@/component/icons';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import CartList from './_component/CartList';
import { GetWarehousesResponse } from '@/types';
import Activity from '@/component/ActivityIndicator';
import { deviceHeight } from '@/helper';

function CompanyEmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <NotFound size={120} />
    </View>
  );
}
export default function Warehouse() {
    const { warehousesList, isConnected, loading, loadMore,loadingMore,hasNextPage,refreshing,onSubmitRefresh } = useWarehouse();
  return (
    <View style={styles.container}>
      <CustomHeader title={t('common.warehouse')} showBack={true}/>
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : 
       isConnected || warehousesList.length > 0 ? (
        <VerticalFlatList
        data={warehousesList}
        gap={10}
        columns={1}
        keyExtractor={company => String(company?.id ?? '')}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.3}
        onRefresh={() => onSubmitRefresh()}
        refreshing={refreshing}
        ListEmptyComponent={CompanyEmptyState}
        ListFooterComponent={
          loadingMore ? (
            <Activity style={styles.footerLoading} />
          ) : !hasNextPage && warehousesList.length > 0 ? (
            <Text style={styles.footerText}>{t('common.noMoreData')}</Text>
          ) : null
        }
        renderItem={({ item: company }: { item: GetWarehousesResponse }) => (
          <CartList key={company.id} element={company}/>
        )}
      />
       ) : (
        <View style={styles.emptyContainer}>
          <NotFound size={120} />
        </View>
       )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  activityIndicator: {
    marginTop: deviceHeight / 5,

  },
});