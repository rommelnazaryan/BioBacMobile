type Endpoints = {
  SignIn: string;
  RefreshToken: string;
  GetAllPermissions: string;
  GetProfile: string;
  GetBuyers: string;
  GetSale: string;
  GetAllCompanies: string;
  GetCompanyHistory: string;
  DeleteCompany: string;
  GetAssetInfoCategory: string;
  GetPaymentCategory: string;
  GetCompanyAccount: string;
  CreatePayment: string;
  GetPayment: string;
  GetCompanyGroup: string;
  CreateCompany: string;
  UpdateCompanyGroup: string;
  GetReturnProductAll: string;
  GetWarehouses: string;
  GetAssortment: string;
  CreateReturn: string;
  UpdateReturn: string;
  GetSaleLookup: string;
  GetReturnProduct: string;
  GetAccountListAll: string;
  GetAccountList: string;
  GetAccountHistory: string;
  GetSaleSuccess: string;
}

export const endpoints:Endpoints = {
  SignIn: 'users/auth/login',
  RefreshToken: 'users/auth/refresh-token',
  // permissions//
  GetAllPermissions: 'users/roles/all-permissions',

  // profile //
  GetProfile: 'users/info/profile',

  // company //
  GetAllCompanies: 'company/all',
  GetBuyers: 'company/buyer',
  GetSale: 'company/sale/',
  GetCompanyHistory: 'company/company-history/',
  DeleteCompany: 'company/delete/',
  GetCompanyAccount: 'company/account',
  GetCompanyGroup: 'company/company-group',
  CreateCompany: 'company/create',
  UpdateCompanyGroup: 'company/update/',
  GetAssortment: 'company/assortment/',
  CreateReturn: 'company/return/',
  UpdateReturn: 'company/return/',
  GetSaleLookup: 'company/sale/lookup/',
  GetReturnProductAll: 'company/return/all',
  GetReturnProduct: 'company/return/',

  //payment
  GetPaymentCategory: 'company/payment-category',
  CreatePayment: 'company/payment',
  GetPayment: 'company/payment/all',

  //info-controller
  GetAssetInfoCategory: 'warehouse/asset-info/category',

  //warehouses
  GetWarehouses: 'warehouse/warehouses',

  //account list
  GetAccountListAll: 'company/account/all',
  GetAccountList: 'company/account/',
  GetAccountHistory: 'company/account/history/all',

  //sale
  GetSaleSuccess: 'company/sale/success/all',
};