import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colors } from '@/theme/Colors';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import Activity from '@/component/ActivityIndicator';
import {GetSaleSuccessResponse } from '@/types';
import { deviceHeight } from '@/helper';
import NotFound from '@/component/icons/NotFound';
import DefaultTable from '@/component/Table/defaultTable';
import CartList from './_component/CartList';
import CustomHeader from '@/navigation/Header';
import Filter from '@/component/Filter';
import useSale from '@/hooks/useSale';
import { t } from '@/locales';

export default function Sales() {
  const {
    loading,
    isConnected,
    loadMore,
    loadingMore,
    hasNextPage,
    onSubmitCreate,
    onSubmitEdit,
    saleSuccess
  } =
    useSale();
  return (
    <View style={styles.container}>
      <CustomHeader title={t('company.sales')} />
      <Filter onHandlerCreate={onSubmitCreate} />
      {loading ?
        <Activity style={styles.activityIndicator} />
        : saleSuccess.length > 0 ?
          <>
            {isConnected ? (
              <VerticalFlatList
                data={isConnected ? saleSuccess : []}
                gap={10}
                columns={1}
                keyExtractor={company => String(company?.id ?? '')}
                onEndReached={() => loadMore()}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                  loadingMore ? (
                    <Activity style={styles.footerLoading} />
                  ) : !hasNextPage && saleSuccess.length > 0 ? (
                    <Text style={styles.footerText}>{t('common.noMoreData')}</Text>
                  ) : null
                }
                renderItem={({ item: item }: { item: GetSaleSuccessResponse }) => (
                  <DefaultTable
                    containerStyle={styles.tableContainer}
                    onClickEdit={() => onSubmitEdit(item)}

                  >
                    <CartList key={item.id} element={item} />
                  </DefaultTable>
                )}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <NotFound size={120} />
              </View>
            )}
          </>
          : (
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
    height: '100%',
  },
  linstContainer: {
    width: '93%',
    alignSelf: 'center',
    height: '100%',
  },
  activityIndicator: {
    marginTop: deviceHeight / 4,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
