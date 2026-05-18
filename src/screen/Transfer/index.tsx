import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colors } from '@/theme';
import CustomHeader from '@/navigation/Header';
import { t } from '@/locales';
import { NotFound } from '@/component/icons';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import { GetTransferProductResponse} from '@/types';
import Activity from '@/component/ActivityIndicator';
import { deviceHeight } from '@/helper';
import CartList from './_component/CartList';
import useTransfer from '@/hooks/useTransfer';
import Filter from '@/component/Filter';

function CompanyEmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <NotFound size={120} />
    </View>
  );
}

export default function Transfer() {
  const {
    transferProductList,
    isConnected,
    loading,
    loadMore,
    loadingMore,
    hasNextPage,
    refreshing,
    onSubmitRefresh,
    onSubmitCreate,
  } = useTransfer();
  return (
    <View style={styles.container}>
      <CustomHeader title={t('common.productTransfer')} showBack={true} />
      <Filter onHandlerCreate={onSubmitCreate} />
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : isConnected || transferProductList.length > 0 ? (
        <VerticalFlatList
          data={transferProductList}
          gap={10}
          columns={1}
          keyExtractor={(_,index) => String(index)}
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.3}
          onRefresh={() => onSubmitRefresh()}
          refreshing={refreshing}
          ListEmptyComponent={CompanyEmptyState}
          ListFooterComponent={
            loadingMore ? (
              <Activity style={styles.footerLoading} />
            ) : !hasNextPage && transferProductList.length > 0 ? (
              <Text style={styles.footerText}>{t('common.noMoreData')}</Text>
            ) : null
          }
          renderItem={({ item: element }: { item: GetTransferProductResponse }) => (
            <CartList element={element} />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <NotFound size={120} />
        </View>
      )}
    </View>
  );
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
  button: {
    width: '30%',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: '2%',
  },
});
