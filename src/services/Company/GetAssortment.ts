import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetAssortmentCallbacks<T> = StatusCallbacks<T>;
export type GetAssortmentResult<T> = StatusResult<T>;

export const GetAssortment = async <T extends object>(
  assortmentId: number,
  result: GetAssortmentCallbacks<T> = {},
): Promise<GetAssortmentResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetAssortment}${assortmentId}`,
    },
    callbacks: result,
  });
};
