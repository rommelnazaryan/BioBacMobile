import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetWarehousesCallbacks<T> = StatusCallbacks<T>;
export type GetWarehousesResult<T> = StatusResult<T>;

export const GetWarehouses = async <T extends object>(

  result: GetWarehousesCallbacks<T> = {},
): Promise<GetWarehousesResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: endpoints.GetWarehouses,
    },
    callbacks: result,
  });
};
