import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colors } from '@/theme/Colors';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import useHome from '@/hooks/useHome';
import Activity from '@/component/ActivityIndicator';
import { AllCompanyProps } from '@/types';
import { deviceHeight } from '@/helper';
import NotFound from '@/component/icons/NotFound';
import DefaultTable from '@/component/Table/defaultTable';
import CartList from '@/screen/Home/_component/CartList';
import CustomHeader from '@/navigation/Header';
import { DefaultModal } from '@/component/Modal';
import Filter from '@/component/Filter';
import Search from '@/component/Search';

export default function Home() {
  const {
    loading,
    allCompanies,
    isConnected,
    loadMore,
    loadingMore,
    hasNextPage,
    onSubmitDelete,
    onSubmitEdit,
    onSubmitDetail,
    visible,
    onSubmitCancel,
    onSubmitConfirm,
    onSubmitCreate,
    onSubmitRefresh,
    refreshing,
    onSubmitSearch,
  } =
    useHome();
  return (
    <View style={styles.container}>
      <CustomHeader title="All Companies" />
      <View style={styles.containerWrapper}>
        <Search onChangeText={onSubmitSearch} />
        <Filter onHandlerCreate={onSubmitCreate} containerStyle={styles.filterContainer} buttonStyle={styles.buttonStyle} />
      </View>
      {loading ?
        <Activity style={styles.activityIndicator} />
        : allCompanies.length > 0 ?
          <>
            {isConnected ? (
              <VerticalFlatList
                data={isConnected ? allCompanies : []}
                gap={10}
                columns={1}
                keyExtractor={company => String(company?.id ?? '')}
                onEndReached={() => loadMore()}
                onEndReachedThreshold={0.3}
                onRefresh={() => onSubmitRefresh()}
                refreshing={refreshing}
                ListFooterComponent={
                  loadingMore ? (
                    <Activity style={styles.footerLoading} />
                  ) : !hasNextPage && allCompanies.length > 0 ? (
                    <Text style={styles.footerText}>No more data</Text>
                  ) : null
                }
                renderItem={({ item: company }: { item: AllCompanyProps }) => (
                  <DefaultTable
                    containerStyle={styles.tableContainer}
                    // onClickHistory={() =>
                    //   onHandlerHistory(company.id, company.name)
                    // }
                    onClickEdit={() => onSubmitEdit(company)}
                    onClickDelete={() => onSubmitDelete(company.id)}

                  >
                    <CartList key={company.id} element={company} onCallback={() => onSubmitDetail(company)} />
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
  filterContainer: {
    width: '15%',
    alignSelf: 'flex-end',
  },
  buttonStyle: {
    width: '100%',
  },
  containerWrapper:{
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  }
});
