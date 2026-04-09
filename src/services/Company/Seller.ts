import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type SaleCallbacks<T> = StatusCallbacks<T>; 
export type SaleResult<T> = StatusResult<T>;

export const GetSele = async <T extends object>(
  Id: number,
  result: SaleCallbacks<T> = {},
): Promise<SaleResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetSale}${Id}`,
    },
    callbacks: result,
  });
};
