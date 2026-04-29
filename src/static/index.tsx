export const USER_PERMISSIONS = {
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    PENDING: 'PENDING',
  } as const;
  export type UserPermissions = keyof typeof USER_PERMISSIONS;

  export const HOME_LIST = [
    {
      key: 'Sales',
      label: 'sales',
      iconName: 'SalesIcon',
    },
    {
      key: 'Company',
      label: 'company',
      iconName: 'CompanyIcon',
    },
    {
      key: 'AccountList',
      label: 'account list',
      iconName: 'AccountListIcon',
    },
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
      label: 'Company History',
      value: 1,
    },
    {
      label: 'Return Product List',
      value: 2,
    },
    {
      label: 'Sales List',
      value: 3,
    },

  ];