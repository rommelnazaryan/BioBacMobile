export const USER_PERMISSIONS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',
} as const;
export type UserPermissions = keyof typeof USER_PERMISSIONS;

export const HOME_LIST = [

  {
    key: 'Company',
    label: 'company',
    iconName: 'CompanyIcon',
  },
  {
    key: 'Warehouse',
    label: 'warehouse',
    iconName: 'ShopIcon',
  },
  {
    key: 'Pre-order',
    label: 'pre-order',
    iconName: 'SalesIcon',
  },
  {
    key: 'AccountList',
    label: 'account list',
    iconName: 'AccountListIcon',
  },
  // {
  //   key: 'Printer',
  //   label: 'printer',
  //   iconName: 'PrinterIcon',
  // },
];

export const Company_LIST = [
  {
    key: 'Payment',
    label: 'payment',
    iconName: 'PaymentIcon',
  },
  {
    key: 'ReturnProduct',
    label: 'return products',
    iconName: 'ReturnProductIcon',
  },
  {
    key: 'Sales',
    label: 'sales',
    iconName: 'SalesIcon',
  },
  {
    key: 'Phone',
    label: 'phone',
    iconName: 'PhoneIcon',
  },
  {
    key: 'Map',
    label: 'map',
    iconName: 'MapIcon',
  },

];
export const ADDITIONAL_ITEMS_LIST = [
  {
    key: 'AccountList',
    label: 'account list',
    iconName: 'AccountListIcon',
  },
];
export const COMPANY_FILTER_LIST = [
  {
    label: 'History',
    value: 1,
  },
  {
    label: 'Return',
    value: 2,
  },
  {
    label: 'Sales',
    value: 3,
  },


];