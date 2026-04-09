export type IconLibrary = 'AntDesign' | 'Ionicons' | 'MaterialIcons' | 'Feather' | 'Svg';

export type GroupMeta = {
  key: string;
  label: string;
  icon: {
    library: IconLibrary;
    name: string;
    size?: number;
  };
};

const DEFAULT_META: GroupMeta = {
  key: 'OTHER',
  label: 'Other',
  icon: {library: 'Svg', name: 'NotFound', size: 35},
};

/**
 * Map group key -> UI meta (label + icon).
 * You can freely change icons/order without touching the permission engine.
 */
export const PERMISSION_GROUP_META: Readonly<Record<string, GroupMeta>> = {
  BUYER: {key: 'BUYER', label: 'buyers', icon: {library: 'Svg', name: 'ApartmentIcon',size: 40}},
  SELLER: {key: 'SELLER', label: 'sellers', icon: {library: 'Svg', name: 'ApartmentIcon',size: 40}},
  PAYMENT: {key: 'PAYMENT', label: 'payment', icon: {library: 'Svg', name: 'PaymentIcon',size: 40}},
  PAYMENT_HISTORY: {key: 'PAYMENT_HISTORY', label: 'payment history', icon: {library: 'Svg', name: 'PaymentIcon',size: 40}},
  RETURN_PRODUCT: {key: 'RETURN_PRODUCT', label: 'return products', icon: {library: 'Svg', name: 'ReturnProductIcon',size: 40}},
  OTHER: DEFAULT_META,
};

export function getGroupMeta(
  groupKey: string,
  overrides?: Partial<Record<string, Partial<GroupMeta>>>,
): GroupMeta {
  const key = String(groupKey ?? '').trim().toUpperCase();
  const base =
    PERMISSION_GROUP_META[key] ?? {...DEFAULT_META, key, label: key || DEFAULT_META.label};
  const o = overrides?.[key];
  if (!o) {
    return base;
  }
  return {
    ...base,
    ...o,
    icon: {
      ...base.icon,
      ...(o.icon ?? {}),
    },
  };
}


