import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type SaleItemRequest = {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type CreateSaleRequest = {
  dealName: string;
  buyerCompanyId: number;
  items: SaleItemRequest[];
  totalAmount: number;
  saleDate: string;
  orderDate: string;
  contactPersonId: number;
  receivedAmount: number;
};

export type CreateSaleCallbacks<T> = StatusCallbacks<T>;
export type CreateSaleResult<T> = StatusResult<T>;

export const CreateSale = async <T extends object>(
  payload: CreateSaleRequest,
  result: CreateSaleCallbacks<T> = {},
): Promise<CreateSaleResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: endpoints.CreateSale,
      data: payload,
    },
    callbacks: result,
  });
};
