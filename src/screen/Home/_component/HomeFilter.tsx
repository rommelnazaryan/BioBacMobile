import { StyleSheet } from 'react-native'
import React from 'react'
import TextView from '@/component/view/TextView'
import { DropdownMultiSelect } from '@/component/dropdown'

export default function HomeFilter({ data, onClick, selectedLineValues }: { data: any, onClick: (item: any) => void, selectedLineValues: any }) {
    return (
        <>
            <TextView title="Line" style={styles.marginTop} />
            <DropdownMultiSelect
                style={styles.marginTop}
                data={data}
                value={selectedLineValues}
                onChange={onClick}
                dropdownPosition="top"
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