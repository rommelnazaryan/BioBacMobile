import { View, StyleSheet, TouchableOpacity, ViewStyle, Text } from 'react-native';
import React from 'react';
import { Colors, FontFamily, FontSizes, Shadows } from '@/theme';
import DeleteIcon from 'react-native-vector-icons/Ionicons';
import { Permission } from '@/permissions/engine';
import { hasPermission } from '@/permissions/hasPermission';
import { HistoryIcon, EditIcon } from '@/component/icons';

type UserPermission = {
  CREATE: string,
  UPDATE: string,
  DELETE: string,
}

type Props = {
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onClickHistory?: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  permission?: Permission[];
  showDelete?: boolean;
  permissionType?: UserPermission;
};



export default function Table({
  onClickEdit,
  onClickDelete,
  onClickHistory,
  children,
  containerStyle,
  permission,
  showDelete,
  permissionType,
}: Props) {
  const canEdit = hasPermission(permission, permissionType?.UPDATE ?? '');
  const canDelete = hasPermission(permission, permissionType?.DELETE ?? '');

  const allowActions = !showDelete;
  const showHeader =
    !!onClickHistory ||
    (allowActions && ((canEdit && !!onClickEdit) || (canDelete && !!onClickDelete)));

  return (
    <View style={[styles.contentContainer, containerStyle]}>
      {showHeader ? (
        <View style={styles.invoiceContainer}>
          {!!onClickHistory && (
            <TouchableOpacity activeOpacity={0.5} onPress={onClickHistory}>
              <HistoryIcon />
            </TouchableOpacity>
          )}
          {allowActions && canEdit && !!onClickEdit && (
            <TouchableOpacity activeOpacity={0.5} onPress={onClickEdit}>
              <EditIcon size={24} />
            </TouchableOpacity>
          )}
          {allowActions && canDelete && !!onClickDelete && (
            <TouchableOpacity activeOpacity={0.5} onPress={onClickDelete}>
              <DeleteIcon name="trash-outline" size={24} color={Colors.red} />
            </TouchableOpacity>
          )
          }
          {showDelete &&
            <View style={styles.deleteContainer}>
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          }
        </View>
      ) : null}
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
    backgroundColor: Colors.gray_200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    alignSelf: 'flex-end',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  deleteContainer: {
    width: 100,
    height: 30,
    backgroundColor: Colors.red_100,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 8,
  },
  deleteText: {
    fontSize: FontSizes.small,
    fontFamily: FontFamily.regular,
    color: Colors.red_700,
  },
});
