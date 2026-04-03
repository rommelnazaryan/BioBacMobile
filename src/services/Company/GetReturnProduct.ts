import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type ReturnProductCallbacks<T> = StatusCallbacks<T>;
export type ReturnProductResult<T> = StatusResult<T>;

export const GetReturnProduct = async <T extends object>(
  page: number = 0,
  result: ReturnProductCallbacks<T> = {},
): Promise<ReturnProductResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: `${endpoints.GetReturnProduct}?sortBy=id&sortDir=DESC&page=${page}&size=20`,
    },
    callbacks: result,
  });
};
