import { ReturnProductFormItem } from '@/hooks/useReturnProduct/useCreate';
import type { Permission } from '@/permissions/engine';
export type LoginForm = {
  username: string;
  password: string;
};

export type GetAllPermissionsResponse = {
  id: number;
  name: string;
};

export type GetProfileResponse = {
  createdAt: string;
  updatedAt: string;
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  active: boolean;
  dob: string | null;
  positionId: null;
  positionName: null;
  permissions: GetAllPermissionsResponse[];
};

export type HomeListProps = {
  key: string;
  label: string;
  iconLibrary: string;
  iconName: string;
  iconSize: number;
  enabled: boolean;
  total: number;
  icon: string;
  items?: Permission[];
};

export type AllCompanyProps = {
  actualAddress: string;
  addressTT: string[];
  advancePayment: boolean;
  attributeGroupIds: number[];
  ceo: string;
  chainOfStore: string;
  clientRegisteredDate: string;
  clientType: { id: number; name: string };
  companyGroup: {
    createdAt: string;
    updatedAt: string;
    id: number;
    name: string;
  };
  condition: {
    id: number;
    deliveryMethods: number[];
    deliveryPayerId: number;
    deliveryPayerName: string;
    financialTerms: number[];
    contractFormId: number;
    contractFormName: string;
    bonus: number | null;
  };
  contactPerson: { id: number; name: string }[];
  cooperation: { id: number; name: string };
  createdAt: string;
  deleted: boolean;
  detail: { id: number; inn: string; kpp: string; ogrn: string; okpo: string };
  emails: string[];
  externalEmails: string[];
  externalPhones: string[];
  id: number;
  latitude: number | null;
  lines: string[];
  localAddress: string;
  longitude: number | null;
  name: string;
  ogrnDate: string;
  ourCompanies: { id: number; name: string }[];
  phones: string[];
  priceList: number | null;
  region: { id: number; name: string; code: string };
  responsibleEmployeeId: number;
  saleType: { id: number; name: string };
  source: { id: number; name: string };
  types: { id: number; name: string }[];
  updatedAt: string;
  warehouseAddress: string;
  websites: string[];
  creditorAmount: number;
  debtorAmount: number;
  balance: number;
  metadata: {
    page: number;
    size: number;
    totalElesments: number;
    totalPages: number;
    last: boolean;
    filter: {
      typeIds: {
        operator: string;
        value: number[];
      };
    };
  };
};

export type historyProps = {
  id: number;
  name: string;
};

export type getHistoryProps = {
  dealId: number;
  createdAt: string;
  amountChanged: number;
  note: string | null;
};

export type GetAccountResponse = {
  balance: number;
  bankAccount: string;
  bankName: string;
  bik: string;
  createdAt: string;
  deleted: boolean;
  id: number;
  ks: string;
  name: string;
  ourCompanyId: number;
  updatedAt: string;
};

export type PaymentRootItem = {
  name: string;
  targetId: number;
};

export type PaymentCategoryNode = {
  id?: number;
  parentId?: number;
  name: string;
  children?: PaymentCategoryNode[];
};

export type GetPaymentTypeResponse = {
  root: string;
  rootItems: PaymentRootItem[];
  categories: PaymentCategoryNode[];
};

export type CreatePaymentRequest = {
  accountId: number;
  category: string;
  date: string;
  notes: string;
  paymentCategoryId: number;
  sum: number;
  targetId: number;
};

export type GetPaymentResponse = {
  accountId: number;
  category: string;
  date: string;
  notes: string;
  paymentCategoryId: number;
  sum: number;
  targetId: number;
};

export type GetPaymentAllResponse = {
  createdAt: string;
  updatedAt: string;
  id: number;
  date: string;
  account: GetAccountResponse;
  paymentCategory: {
    createdAt: string;
    updatedAt: string;
    id: number;
    parentId: number | null;
    parent: PaymentCategoryNode | null;
    name: string;
    category: string;
    children: PaymentCategoryNode[];
    state: string;
  };
  notes: string;
  sum: number;
  targetType: string;
  target: string;
  username: string;
};

export type CreateCompanyRequest = {
  id?: number;
  key?: string;
  name: string;
  clientRegisteredDate: string;
  ogrnDate: string;
  ceo: string;
  phones: string[];
  emails?: string[];
  typeIds: number[];
  cooperationId: number;
  companyGroupId: number;
  longitude: string;
  latitude: string;
  creditorAmount?: number;
  debtorAmount?: number;
  actualAddress?: string;
  addressTT?: string[];
  localAddress?: string;
  warehouseAddress?: string;
};

export type ReturnProductItemProps = {
  id?: number;
  productId?: number;
  productName?: string;
  amount?: number;
  quantity?: number;
  price?: number;
  returnPrice?: number;
  sale?: number;
  sum?: number;
};

export type ReturnProductProps = {
  id: number;
  comment: string;
  companyId: number;
  warehouseId?: number;
  companyName: string;
  createdAt: string;
  createdById: number;
  createdByName: string;
  items: ReturnProductItemProps[];
  returnDate: string;
  totalAmount: number;
  updatedAt: string;
};

export type GetWarehousesResponse = {
  id: 1;
  name: string;
  location: string;
  warehouseGroupName: string;
  warehouseGroupId: number;
  attributeGroupIds: number[];
  warehouseTypeName: string;
  warehouseTypeId: number;
  attributes: null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
};

export type WarehousesParamList = {
  name: string;
  id: string | number;
  updatedAt: string;
};

export type CreateReturnRequest = {
  companyId: number;
  warehouseId: number;
  returnDate: string;
  comment: string;
  items: ReturnProductFormItem[];
};

export type GetAccountListResponse = {
  id: number;
  name: string;
  balance: number;
  bankAccount: string;
  bik: string;
  ks: string;
  bankName: string;
  ourCompanyId: number;
  ourCompanyName: string;
  deleted: boolean;
  user: null;
  createdAt: string;
  updatedAt: string;
};

export type GetAccountHistoryResponse = {
    id: number;
    accountId: number;
    accountName: string;
    amountChanged: number;
    balanceAfter: number;
    actionId: number;
    actionName: string;
    dealId: string;
    note: string;
    timestamp: string;  
};

export type GetSaleSuccessResponse = {
  
    createdAt: string;
    updatedAt: string;
    id: number;
    dealName: string;
    deliveryAddress: string;
    deliveryCost: number;
    ourCompany: {
      createdAt: string;
      updatedAt: string;
      id: number;
      name: string;
      emails: string[];
      websites: string[];
      phones: string[];
      detail: {
        id: number;
        inn: string;
        kpp: string | null;
        ogrn: string | null;
        okpo: null
      },
      accounts: GetAccountResponse[];
      attributes: []
    },
    company: null | AllCompanyProps,
    serviceCompany: null | AllCompanyProps,
    status: { 
      createdAt: string;
      updatedAt: string;
      id: number;
      name: string;
    },
    items: [], 
    totalAmount: number;
    receivedAmount: number | null;
    orderDate: string;
    saleDate: string | null;
    contactPerson: null;
    deliveryMethod: {
      id: number;
      name: string;
    },
    documentTransferForm: null | string;
    transactionType: null | string;
    transportCompany: null | string;
    saleStage: {
      createdAt: string;
      updatedAt: string;
      id: number;
      name: string;
    },
    deliveryPayer: null,
    contacts: null;
    createdById: number;
    creatorName: string;
    deliveryPayerId: number | null;
    deliveryPayerName: string | null;
    warehouseId: number;
  
};