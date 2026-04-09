import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetReturnProductCallbacks<T> = StatusCallbacks<T>;
export type GetReturnProductResult<T> = StatusResult<T>;

export const GetReturnProduct = async <T extends object>(
  companyId: number,
  result: GetReturnProductCallbacks<T> = {},
): Promise<GetReturnProductResult<T>> => { 
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetReturnProduct}${companyId}`,
    },
    callbacks: result,
  });
};
