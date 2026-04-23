import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type SellerCallbacks<T> = StatusCallbacks<T>;
export type SellerResult<T> = StatusResult<T>;

export const GetSeller = async <T extends object>(

  result: SellerCallbacks<T> = {},
): Promise<SellerResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: endpoints.GetSeller,
    },
    callbacks: result,
  });
};
