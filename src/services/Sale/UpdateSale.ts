import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';
import type {CreateSaleRequest} from '@/services/Sale/CreateSale';

export type UpdateSaleCallbacks<T> = StatusCallbacks<T>;
export type UpdateSaleResult<T> = StatusResult<T>;

export const UpdateSale = async <T extends object>(
  saleId: number,
  payload: CreateSaleRequest,
  result: UpdateSaleCallbacks<T> = {},
): Promise<UpdateSaleResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'PUT',
      url: `${endpoints.GetSale}${saleId}`,
      data: payload,
    },
    callbacks: result,
  });
};
