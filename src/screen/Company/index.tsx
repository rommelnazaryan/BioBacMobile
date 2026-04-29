import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colors } from '@/theme/Colors';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import useHome from '@/hooks/useCompany';
import Activity from '@/component/ActivityIndicator';
import { AllCompanyProps } from '@/types';
import { deviceHeight } from '@/helper';
import NotFound from '@/component/icons/NotFound';
import DefaultTable from '@/component/Table/defaultTable';
import CartList from '@/screen/Company/_component/CartList';
import CustomHeader from '@/navigation/Header';
import { DefaultModal } from '@/component/Modal';
import Filter from '@/component/Filter';
import Search from '@/component/Search';
import HomeFilter from './_component/CompanyFilter';
import { t } from '@/locales';

function CompanyEmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <NotFound size={120} />
    </View>
  );
}

export default function Company() {
  const {
    loading,
    allCompanies,
    isConnected,
    loadMore,
    loadingMore,
    hasNextPage,
    onSubmitDetail,
    visible,
    onSubmitCancel,
    onSubmitConfirm,
    onSubmitCreate,
    onSubmitRefresh,
    refreshing,
    onSubmitSearch,
    lineList,
    selectedLineValues,
    onChangeSelectedLineValues,
    onSubmitEdit,
    allCompanyCash
  } =
    useHome();
  return (
    <View style={styles.container}>
      <CustomHeader title={t('common.allCompanies')} showBack={true}/>
      <Filter onHandlerCreate={onSubmitCreate}/>
      <HomeFilter data={lineList} onClick={onChangeSelectedLineValues} selectedLineValues={selectedLineValues} style={styles.filterStyle} containerStyle={styles.filterContainerStyle} />
      <Search onChangeText={onSubmitSearch} />

      {loading ?
        <Activity style={styles.activityIndicator} /> :
        <>
          <VerticalFlatList
            data={isConnected ? allCompanies : allCompanyCash}
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
              ) : !hasNextPage && allCompanies.length > 0 ? (
                <Text style={styles.footerText}>{t('common.noMoreData')}</Text>
              ) : null
            }
            renderItem={({ item: company }: { item: AllCompanyProps }) => (
              <CartList key={company.id} element={company} onCallback={() => onSubmitDetail(company)} onSubmitEdit={() => onSubmitEdit(company)} />
            )}
          />
        </>
      }
      <DefaultModal
        isVisible={visible}
        onClose={onSubmitCancel}
        onConfirm={onSubmitConfirm}
        title={t('common.deleteCompanyTitle')}
        description={t('common.deleteCompanyDescription')}
      />
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
   marginTop: deviceHeight / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterStyle: {
    marginTop: 0,
  },
  filterContainerStyle: {
    width: '91%',
    alignSelf: 'center',
  },

});
