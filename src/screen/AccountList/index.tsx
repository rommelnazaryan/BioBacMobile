import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colors } from '@/theme';
import Header from '@/navigation/Header';
import Table from '@/component/Table';
import Activity from '@/component/ActivityIndicator';
import { deviceHeight } from '@/helper';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import { GetAccountListResponse } from '@/types';
import NotFound from '@/component/icons/NotFound';
import Card from './_component/Card';
import useAccountList from '@/hooks/useAccountList';
import { t } from '@/locales';


export default function AccountList() {
  const {
    loading,
    loadingMore,
    hasNextPage,
    accountList,
    loadMore,
    isConnected,
    onHandlerHistory
  } = useAccountList();
  return (
    <View style={styles.container}>
      <Header title={t('company.companyAccountList')} showBack={true} />
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : accountList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <NotFound size={120} />
        </View>
      ) : (
        <>
          {isConnected ? (
            <VerticalFlatList
              data={accountList}
              gap={10}
              columns={1}
              keyExtractor={company => String(company?.id ?? '')}
              onEndReached={() => loadMore()}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                loadingMore ? (
                  <Activity style={styles.footerLoading} />
                ) : !hasNextPage && accountList.length > 0 ? (
                  <Text style={styles.footerText}>{t('common.noMoreData')}</Text>
                ) : null
              }
              renderItem={({ item: item }: { item: GetAccountListResponse }) => (
                <Table
                  containerStyle={styles.tableContainer}
                  onClickHistory={() =>
                    onHandlerHistory(item.id, item.name)
                  }
                >
                  <Card key={item.id} element={item} />
                </Table>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <NotFound size={120} />
            </View>
          )}
        </>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


});
