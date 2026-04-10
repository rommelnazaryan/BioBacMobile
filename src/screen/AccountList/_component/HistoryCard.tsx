import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { GetAccountHistoryResponse } from '@/types';
import { FontFamily, FontSizes } from '@/theme';
import NotFound from '@/component/icons/NotFound';
import { t } from '@/locales';
export default function HistoryCard({ element }: { element: GetAccountHistoryResponse }) {
    const ActionDate = element.timestamp.split(':')[0]
    return (
        <View style={[styles.container]}>
            {!element ?
                <NotFound size={100} /> :
                <>
                    <View style={styles.row}>
                        <Text style={styles.title}>#</Text>
                        <Text style={styles.value}>{element.dealId}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>{t('common.amountChanged')}:</Text>
                        <Text style={styles.value}>{element.amountChanged}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Balance After:</Text>
                        <Text style={styles.value}>{element.balanceAfter}</Text>
                    </View>
                    <View style={[styles.row, styles.stretch]}>
                        <Text style={styles.title}>{t('common.note')}:</Text>
                        <Text style={[styles.value, styles.note]}>{element.note}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Aactions:</Text>
                        <Text style={styles.value}>{element.actionName}</Text>
                    </View>
                    {/* <View style={styles.row}>
                        <Text style={styles.title}>{t('common.actionTime')}:</Text>
                        <Text style={styles.value}>{createdAtDate}</Text>
                    </View> */}
                    <View style={styles.row}>
                        <Text style={styles.title}>Action time:</Text>
                        <Text style={styles.value}>{ActionDate}</Text>
                    </View>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '93%',
        alignSelf: 'center',
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '2%',
        alignItems: 'center',
    },
    title: {
        fontFamily: FontFamily.semiBold,
        fontSize: FontSizes.medium,
    },
    value: {
        fontFamily: FontFamily.regular,
        fontSize: FontSizes.small,
    },
    stretch: {
        alignItems: 'stretch',
    },
    note: {
        width: '60%',
        textAlign: 'right',
    },
});
