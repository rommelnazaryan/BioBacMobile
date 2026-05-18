import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colors } from '@/theme';
import CustomHeader from '@/navigation/Header';
import { t } from '@/locales';
import { NotFound } from '@/component/icons';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import { GetWarehousesDetailResponse } from '@/types';
import Activity from '@/component/ActivityIndicator';
import { deviceHeight } from '@/helper';
import useWarehouseDetail from '@/hooks/useWarehouse/useWarehouseDetail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WarehouseParamList } from '@/navigation/types';
import DetailCartList from './_component/DetailCartList';
import Button from '@/component/button';
type Props = NativeStackScreenProps<WarehouseParamList, 'Detail'>;

function CompanyEmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <NotFound size={120} />
    </View>
  );
}

export default function WarehouseDetail(props: Props) {
  const {
    item,
    warehousesList,
    isConnected,
    loading,
    loadMore,
    loadingMore,
    hasNextPage,
    refreshing,
    onSubmitRefresh,
    onSubmitTransfer
  } = useWarehouseDetail(props);
  return (
    <View style={styles.container}>
      <CustomHeader title={item.name} showBack={true} />
      <Button
        title={t('common.transfer')}
        onHandler={() => onSubmitTransfer()}
        style={styles.button}
      />
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : isConnected || warehousesList.length > 0 ? (
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
          renderItem={({ item: company }: { item: GetWarehousesDetailResponse }) => (
            <DetailCartList
              key={company.id}
              element={company}
            />
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
