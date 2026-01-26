import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import {BuyerParamList} from '@/navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '@/theme';
import Header from '@/navigation/Header';
import Table from '@/component/Table';
import useBuyers from '@/hooks/useBuyers';
import Card from './_component/Card';
import Activity from '@/component/ActivityIndicator';
import {deviceHeight} from '@/helper';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import {AllCompanyProps} from '@/types';
import NotFound from '@/component/icons/NotFound';
import {DefaultModal} from '@/component/Modal';
import Filter from '@/component/Filter';
import {t} from '@/locales';

type Props = NativeStackScreenProps<BuyerParamList, 'Buyers'>;

export default function Buyers(route: Props) {
  const {
    item: routeItem,
    loading,
    loadingMore,
    hasNextPage,
    seller,
    loadMore,
    onHandlerHistory,
    visible,
    onSubmitDelete,
    onSubmitCancel,
    onSubmitConfirm,
    onSubmitCreate,
    isConnected,
    onSubmitEdit,
  } = useBuyers(route);
  return (
    <View style={styles.container}>
      <Header title={t('company.companyBuyerList')} showBack={true} />
      <Filter onHandlerCreate={onSubmitCreate} />
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : seller.length === 0 ? (
        <View style={styles.emptyContainer}>
          <NotFound size={120} />
        </View>
      ) : (
        <>
          {isConnected ? (
            <VerticalFlatList
              data={seller}
              gap={10}
              columns={1}
              keyExtractor={company => String(company?.id ?? '')}
              onEndReached={() => loadMore()}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                loadingMore ? (
                  <Activity style={styles.footerLoading} />
                ) : !hasNextPage && seller.length > 0 ? (
                  <Text style={styles.footerText}>No more data</Text>
                ) : null
              }
              renderItem={({item: company}: {item: AllCompanyProps}) => (
                <Table
                  containerStyle={styles.tableContainer}
                  onClickHistory={() =>
                    onHandlerHistory(company.id, company.name)
                  }
                  onClickEdit={() => onSubmitEdit(company)}
                  onClickDelete={() => onSubmitDelete(company.id)}
                  permission={routeItem?.items}
                  showDelete={company?.deleted}
                  permissionType={{
                    CREATE: 'COMPANY_BUYER_CREATE',
                    UPDATE: 'COMPANY_BUYER_UPDATE',
                    DELETE: 'COMPANY_BUYER_DELETE',
                  }}
                  >
                  <Card key={company.id} element={company} />
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
      <DefaultModal
        isVisible={visible}
        onClose={onSubmitCancel}
        onConfirm={onSubmitConfirm}
        title="Delete Company"
        description="Are you sure you want to delete this company?"
      />
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
