import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Colors } from '@/theme';
import CustomHeader from '@/navigation/Header';
import { t } from '@/locales';
import { NotFound } from '@/component/icons';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import { GetWarehousesResponse } from '@/types';
import Activity from '@/component/ActivityIndicator';
import { deviceHeight } from '@/helper';
import usePreOrder from '@/hooks/useSale/useProOrder';
import CartList from './_component/CartList';

function CompanyEmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <NotFound size={120} />
    </View>
  );
}
export default function PreOrder() {
    const { preOrderList, isConnected, loading, loadMore,loadingMore,hasNextPage,refreshing,onSubmitRefresh } = usePreOrder();
  return (
    <View style={styles.container}>
      <CustomHeader title={t('common.pre-order')} showBack={true}/>
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : 
       isConnected || preOrderList.length > 0 ? (
        <VerticalFlatList
        data={preOrderList}
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
          ) : !hasNextPage && preOrderList.length > 0 ? (
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
    marginTop: deviceHeight / 4,
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