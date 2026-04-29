import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { getHistoryProps } from '@/types';
import { FontFamily, FontSizes } from '@/theme';
import NotFound from '@/component/icons/NotFound';
import { t } from '@/locales';
export default function HistoryCard({ element }: { element: getHistoryProps }) {
    const timestamp = element.timestamp.replace(':', '-')
    return (
        <View style={[styles.container]}>
            {!element ?
                <NotFound size={100} /> :
                <>
                    <View style={[styles.row, {justifyContent: 'flex-end'}]}>
                        <Text style={[styles.value]}>{element.action.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>{t('common.amountChanged')}:</Text>
                        <Text style={styles.value}>{element.amountChanged}</Text>
                    </View>
                    <View style={[styles.row, styles.stretch]}>
                        <Text style={styles.title}>{t('common.note')}:</Text>
                        <Text style={[styles.value, styles.note]}>{element.note}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>{t('common.actionTime')}:</Text>
                        <Text style={styles.value}>{timestamp}</Text>
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
