import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import useDraft from '@/hooks/useDraft';
import CustomHeader from '@/navigation/Header';
import { Colors, FontFamily, FontSizes } from '@/theme';
import VerticalFlatList from '@/component/list/VerticalFlatList';
import Card from './_component/Card';
import NotFound from '@/component/icons/NotFound';
import DefaultTable from '@/component/Table/defaultTable';
import {DefaultModal} from '@/component/Modal';
import Button from '@/component/button';
import {t} from '@/locales';

export default function Draft() {
  const { Draft, onSubmitDelete ,visible, onSubmitCancel, onSubmitConfirm,onSubmit,loading,onSubmitEdit} = useDraft();
  return (
    <View style={styles.container}>
      <CustomHeader title={t('common.draft')} showBack={true} />
      {Draft.length === 0 ? (
        <View style={styles.emptyContainer}>
          <NotFound size={120} />
        </View>
      ) : (
           <VerticalFlatList
              data={Draft}
              gap={10}
              columns={1}
              keyExtractor={company => String(company?.name)}
              onEndReachedThreshold={0.3}
              renderItem={({item: company, index}: {item: any, index: number}) => (
                <DefaultTable
                  containerStyle={styles.tableContainer}
                  onClickEdit={() => onSubmitEdit(company)}
                  onClickDelete={() => onSubmitDelete(index)}
                  
                  >
                    <View style={styles.cardContainer}>
                    <Text style={styles.cardTitle}>{company.key}</Text>
                    </View>
                  <Card element={company}/>
                  <Button title={t('common.confirm')} onHandler={() => onSubmit(company,index)} style={styles.button} loading={loading}/>
                </DefaultTable>
              )}
            />
      )}
           <DefaultModal
        isVisible={visible}
        onClose={onSubmitCancel}
        onConfirm={onSubmitConfirm}
        title={t('common.deleteCompanyTitle')}
        description={t('common.deleteCompanyDescription')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tableContainer: {
    marginBottom: 10,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: '3%',
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
     position: 'absolute',
     top: 10,
     left: 10,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.large,
  },
});