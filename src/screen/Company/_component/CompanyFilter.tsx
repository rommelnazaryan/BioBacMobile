import { StyleSheet } from 'react-native'
import React from 'react'
// import TextView from '@/component/view/TextView'
import { DropdownMultiSelect } from '@/component/dropdown'
// import { t } from '@/locales'
import { StyleProp, ViewStyle } from 'react-native'
export default function HomeFilter({ data, onClick, selectedLineValues, style,containerStyle }: { data: any, onClick: (item: any) => void, selectedLineValues: any, style?: StyleProp<ViewStyle>, containerStyle?: StyleProp<ViewStyle> }) {
    return (
        <>
            {/* <TextView title={t('common.line')} style={StyleSheet.flatten([styles.marginTop, style])} /> */}
            <DropdownMultiSelect
                style={StyleSheet.flatten([styles.marginTop, containerStyle])}
                data={data}
                value={selectedLineValues}
                onChange={onClick}
            />

        </>
    )
}

const styles = StyleSheet.create({
    marginTop: {
        marginTop: 10,
    },
    marginField: {
        marginTop: 10,
    },
})