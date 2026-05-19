import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import TextInput from '@/component/input/TextInput';
import Botton from '@/component/button';
import { Colors, FontFamily, FontSizes } from '@/theme';
import type { SaleCreateFormValues } from '@/hooks/useSale/useCreate';

/** Parse numeric input for sale line price/qty (shared with screen total). */
export const parseSaleLineNumber = (v: string) => {
  const n = Number(String(v ?? '').replace(',', '.').replace(/\s/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** Empty → no line total. Valid non‑positive (e.g. 0) → count as 1. */
export const quantityForLineTotal = (quantityRaw: string | undefined): number => {
  const t = String(quantityRaw ?? '').trim();
  if (t === '') {
    return 0;
  }
  const n = Number(t.replace(',', '.').replace(/\s/g, ''));
  if (!Number.isFinite(n) || n < 0) {
    return 0;
  }
  return n <= 0 ? 1 : n;
};

export const formatTotalRub = (total: number) =>
  `${total.toFixed(2).replace('.', ',')} руб.`;

type Props = {
  productId: string | number;
  productName: string;
  control: Control<SaleCreateFormValues>;
  errors: FieldErrors<SaleCreateFormValues>;
  onRemove: () => void;
};

export default function SaleProductLineRow({
  productId,
  productName,
  control,
  errors,
  onRemove,
}: Props) {
  const idKey = String(productId);

  const saleLinesErr = errors.saleLines as
    | Record<string, { quantity?: { message?: string } }>
    | undefined;
  const qtyError = saleLinesErr?.[idKey]?.quantity?.message;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.colProduct}>
          <Text style={styles.cellLabel}>PRODUCTS</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
        </View>
        <View style={styles.colQty}>
          <Text style={styles.cellLabel}>QUANTITY</Text>
          <Controller
            control={control}
            name={`saleLines.${idKey}.quantity` as `saleLines.${string}.quantity`}
            render={({ field: { onChange, value } }) => (
              <TextInput
                containerStyle={styles.inputCompact}
                inputSize="small"
                placeholder="0"
                keyboard="numeric"
                onChangeText={onChange}
                value={value ?? ''}
                errorMessage={qtyError ?? ''}
              />
            )}
          />
        </View>
        <View style={styles.colPrice}>
          <Text style={styles.cellLabel}>UNIT PRICE</Text>
          <Controller
            control={control}
            name={`saleLines.${idKey}.unitPrice` as `saleLines.${string}.unitPrice`}
            render={({ field: { onChange, value } }) => (
              <TextInput
                containerStyle={styles.inputCompact}
                inputSize="small"
                keyboard="numeric"
                onChangeText={onChange}
                value={value ?? ''}
              />
            )}
          />
        </View>
        {/* Line total removed; sum of all lines is shown above «Received amount». */}
        <View style={styles.colActions}>
          <Botton
            title="DELETE"
            onHandler={onRemove}
            style={styles.deleteBtn}
            textStyle={styles.deleteBtnText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '93%',
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray_200,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 6,
  },
  cellLabel: {
    fontSize: FontSizes.xsmall,
    fontFamily: FontFamily.semiBold,
    color: Colors.gray,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  colProduct: {
    flexGrow: 1,
    flexBasis: '40%',
    minWidth: 100,
  },
  colQty: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 72,
  },
  colPrice: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 72,
  },
  colActions: {
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    minWidth: 100,
    marginLeft: 'auto',
  },
  productName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.small,
    color: Colors.black,
  },
  inputCompact: {
    marginTop: 0,
  },
  deleteBtn: {
    backgroundColor: Colors.red,
    height: 34,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-end',
    width: 'auto',
    minWidth: 72,
  },
  deleteBtnText: {
    color: Colors.white,
    fontSize: FontSizes.xsmall,
  },
});
