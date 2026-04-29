import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import { Colors } from '@/theme/Colors';
import CustomHeader from '@/navigation/Header';
import { COMPANY_FILTER_LIST, Company_LIST } from '@/static';
import {
  GetSaleSuccessResponse,
  getHistoryProps,
  ListProps,
  ReturnProductProps,
} from '@/types';
import useDetail from '@/hooks/useCompany/useDetail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompanyParamList } from '@/navigation/types';
import { FontSizes } from '@/theme';
import Activity from '@/component/ActivityIndicator';
import DefaultTable from '@/component/Table/defaultTable';
import HistoryCard from '../Buyers/_component/HistoryCard';
import ReturnProductCard from '../ReturnProduct/_component/Card';
import SaleCard from '../Sales/_component/CartList';
import { deviceHeight } from '@/helper';
import ItemList from '@/component/list/ItemList';
import { formatted } from '@/helper/Regx';
import DropdownComponent from '@/component/dropdown';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import NotFound from '@/component/icons/NotFound';

type Props = NativeStackScreenProps<CompanyParamList, 'Detail'>;

export default function Detail(route: Props) {
  const { item,
    loading,
    loadingMore,
    hasNextPage,
    loadMore,
    history,
    returnProductData,
    saleSuccess,
    selectedFilter,
    onSubmitDetail,
    onChangeFilter } = useDetail(route);

  const data =
    selectedFilter === 1
      ? history
      : selectedFilter === 2
        ? returnProductData
        : saleSuccess;

  const renderHistoryItem = ({item: historyItem}: {item: getHistoryProps}) => (
    <DefaultTable
      containerStyle={[
        styles.tableContainer,
        {
          backgroundColor:
            historyItem.amountChanged > 0 ? Colors.green_100 : Colors.red_100,
        },
      ]}>
      <HistoryCard element={historyItem} />
    </DefaultTable>
  );

  const renderReturnProductItem = ({
    item: returnProductItem,
  }: {
    item: ReturnProductProps;
  }) => (
    <DefaultTable containerStyle={styles.tableContainer}>
      <ReturnProductCard element={returnProductItem} />
    </DefaultTable>
  );

  const renderSaleItem = ({item: saleItem}: {item: GetSaleSuccessResponse}) => (
    <DefaultTable containerStyle={styles.tableContainer}>
      <SaleCard element={saleItem} />
    </DefaultTable>
  );

  const renderItem = (info: {item: getHistoryProps | ReturnProductProps | GetSaleSuccessResponse}) => {
    if (selectedFilter === 1) {
      return renderHistoryItem(info as {item: getHistoryProps});
    }

    if (selectedFilter === 2) {
      return renderReturnProductItem(info as {item: ReturnProductProps});
    }

    return renderSaleItem(info as {item: GetSaleSuccessResponse});
  };

  const keyExtractor = (
    currentItem: getHistoryProps | ReturnProductProps | GetSaleSuccessResponse,
    index: number,
  ) => {
    if ('dealId' in currentItem) {
      return `${currentItem.timestamp}:${currentItem.dealId}:${index}`;
    }

    return String(currentItem.id ?? index);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={item.name} showBack={true} />
      {loading ? (
        <Activity style={styles.activityIndicator} />
      ) : (
        <VerticalFlatList
          data={data}
          gap={10}
          columns={1}
          onEndReached={() => {
            if (hasNextPage) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.3}
          keyExtractor={keyExtractor}
          contentContainerStyle={data.length === 0 ? styles.emptyGrow : undefined}
          ListHeaderComponent={
            <>
              <View style={styles.balanceContainer}>
                <Text style={styles.balance}>{`${formatted(item.balance)},00 руб`}</Text>
                <DropdownComponent
                  data={COMPANY_FILTER_LIST}
                  value={selectedFilter}
                  onClick={dropdownItem => onChangeFilter(dropdownItem.value as number)}
                  style={styles.dropdown}
                />
              </View>
              <View style={styles.linstContainer}>
                {Company_LIST.map(listItem => (
                  <View key={listItem.key} style={styles.itemContainer}>
                    <ItemList
                      item={listItem}
                      onCallback={selectedItem => onSubmitDetail(selectedItem as ListProps)}
                    />
                  </View>
                ))}
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <NotFound size={120} />
            </View>
          }
          ListFooterComponent={
            loadingMore ? <Activity style={styles.footerLoading} /> : null
          }
          renderItem={renderItem}
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
  linstContainer: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: '5%'
  },
  itemContainer: {
    width: '48%',
  },
  balance: {
    fontSize: FontSizes.medium,
  },
  activityIndicator: {
    marginTop: deviceHeight / 8,

  },
  tableContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  dropdown: {
    width: '60%',
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
  },
  balanceContainer: {
    width: '91%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2%',
  },
  footerLoading: {
    marginTop: 10,
    marginBottom: 20,
  },
  emptyGrow: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    minHeight: deviceHeight / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});