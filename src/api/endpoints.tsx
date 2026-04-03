type Endpoints = {
  SignIn: string;
  RefreshToken: string;
  GetAllPermissions: string;
  GetProfile: string;
  GetBuyers: string;
  GetSeller: string;
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
  GetReturnProduct: string;
  GetWarehouses: string;
  GetAssortment: string;
  CreateReturn: string;
  UpdateReturn: string;
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
  GetSeller: 'company/seller',
  GetCompanyHistory: 'company/company-history/',
  DeleteCompany: 'company/delete/',
  GetCompanyAccount: 'company/account',
  GetCompanyGroup: 'company/company-group',
  CreateCompany: 'company/create',
  UpdateCompanyGroup: 'company/update/',
  GetAssortment: 'company/assortment/',
  CreateReturn: 'company/return/',
  UpdateReturn: 'company/return/',
  //payment
  GetPaymentCategory: 'company/payment-category',
  CreatePayment: 'company/payment',
  GetPayment: 'company/payment/all',

  //info-controller
  GetAssetInfoCategory: 'warehouse/asset-info/category',

  //return product
  GetReturnProduct: 'company/return/all',

  //warehouses
  GetWarehouses: 'warehouse/warehouses',
};