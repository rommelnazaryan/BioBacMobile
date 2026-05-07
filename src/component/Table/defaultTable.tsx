import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { Colors, Shadows } from '@/theme';
import DeleteIcon from 'react-native-vector-icons/Ionicons';
import { HistoryIcon, EditIcon } from '@/component/icons';

type Props = {
    onClickEdit?: () => void;
    onClickDelete?: () => void;
    onClickHistory?: () => void;
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
};



export default function DefaultTable({
    onClickEdit,
    onClickDelete,
    onClickHistory,
    children,
    containerStyle,
}: Props) {


    return (
        <View style={[styles.contentContainer, containerStyle]}>
            {/* <View style={styles.invoiceContainer}>
                {onClickHistory && (
                    <TouchableOpacity activeOpacity={0.5} onPress={onClickHistory}>
                        <HistoryIcon />
                    </TouchableOpacity>
                )}
                {onClickEdit && (
                    <TouchableOpacity activeOpacity={0.5} onPress={onClickEdit}>
                        <EditIcon size={24} />
                    </TouchableOpacity>
                )}
                {onClickDelete && (
                    <TouchableOpacity activeOpacity={0.5} onPress={onClickDelete}>
                        <DeleteIcon name="trash-outline" size={24} color={Colors.red} />
                    </TouchableOpacity>
                )
                }
            </View> */}
            {children}
        </View>
    );
}
const styles = StyleSheet.create({
    contentContainer: {
        width: '93%',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray_200,
        ...Shadows.sm,
    },
    invoiceContainer: {
        width: '100%',
        backgroundColor: Colors.gray_100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        alignSelf: 'flex-end',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
    },
});
