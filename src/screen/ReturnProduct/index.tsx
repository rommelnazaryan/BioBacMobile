import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import {Colors} from '@/theme';
import Header from '@/navigation/Header';
import Table from '@/component/Table';
import useReturnProduct from '@/hooks/useReturnProduct';
import Activity from '@/component/ActivityIndicator';
import {deviceHeight} from '@/helper';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import {ReturnProductProps} from '@/types';
import NotFound from '@/component/icons/NotFound';
import {DefaultModal} from '@/component/Modal';
import Filter from '@/component/Filter';
import {t} from '@/locales';
import Card from './_component/Card';
// type Props = NativeStackScreenProps<ReturnProductParamList, 'ReturnProduct'>;

export default function ReturnProduct() {
  const {
    loading,
    loadingMore,
    hasNextPage,
    Data,
    loadMore,
    onSubmitConfirm,
    visible,
    onSubmitDelete,
    onSubmitCancel,
    onSubmitCreate,
    isConnected,
    onSubmitEdit,
  } = useReturnProduct();
  return (
    <View style={styles.container}>
      <Header title={t('common.returnProducts')} showBack={true} />
      <Filter onHandlerCreate={onSubmitCreate} />
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : Data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <NotFound size={120} />
        </View>
      ) : (
        <>
          {isConnected ? (
            <VerticalFlatList
              data={Data}
              gap={10}
              columns={1}
              keyExtractor={item => String(item?.id ?? '')}
              onEndReached={() => loadMore()}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                loadingMore ? (
                  <Activity style={styles.footerLoading} />
                ) : !hasNextPage && Data.length > 0 ? (
                  <Text style={styles.footerText}>No more data</Text>
                ) : null
              }
              renderItem={({item: item}: {item: ReturnProductProps}) => (
                <Table
                  containerStyle={styles.tableContainer}
                  onClickEdit={() => onSubmitEdit(item)}
                  onClickDelete={() => onSubmitDelete(item.id)}
                  permission={[
                    {id: 1, name: 'COMPANY_BUYER_UPDATE'},
                  ]}
                  showDelete={false}
                  permissionType={{
                    CREATE: 'COMPANY_BUYER_CREATE',
                    UPDATE: 'COMPANY_BUYER_UPDATE',
                    DELETE: 'COMPANY_BUYER_DELETE',
                  }}
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
