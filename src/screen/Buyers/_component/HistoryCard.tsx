import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { getHistoryProps } from '@/types';
import { FontFamily, FontSizes } from '@/theme';
import NotFound from '@/component/icons/NotFound';
import { t } from '@/locales';
import { formatted } from '@/helper/Regx';
export default function HistoryCard({ element }: { element: getHistoryProps }) {
    const timestamp = element.timestamp.replace(':', '-')
    return (
        <View style={[styles.container]}>
            {!element ?
                <NotFound size={100} /> :
                <>
                    <View style={[styles.row]}>
                        <Text style={styles.value}>{element.action.name} </Text>
                        {element.amountChanged && <Text style={styles.value}>{formatted(element.amountChanged)},00 руб</Text>}
                    </View>
                    <Text style={styles.value}>{element.note}</Text>
                    <Text style={styles.value}>{timestamp}</Text>

                    {/* <View style={styles.row}>
                        <Text style={styles.title}>{t('common.amountChanged')}:</Text>
                        <Text style={styles.value}>{element.amountChanged}</Text>
                    </View> */}
                    {/* <View style={[styles.row, styles.stretch]}>
                        <Text style={styles.title}>{t('common.note')}:</Text>
                        <Text style={[styles.value, styles.note]}>{element.note}</Text>
                    </View> */}
                    {/* <View style={styles.row}>
                        <Text style={styles.title}>{t('common.actionTime')}:</Text>
                        <Text style={styles.value}>{timestamp}</Text>
                    </View> */}
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
        flexWrap: 'wrap',
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
 
});
