export const USER_PERMISSIONS = {
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    PENDING: 'PENDING',
  } as const;


  export const HOME_LIST = [
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
  export type UserPermissions = keyof typeof USER_PERMISSIONS;