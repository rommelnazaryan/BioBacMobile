import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetWarehouseRelatedProductsCallbacks<T> = StatusCallbacks<T>;
export type GetWarehouseRelatedProductsResult<T> = StatusResult<T>;

export const GetWarehouseRelatedProducts = async <T extends object>(
   id: number,
  result: GetWarehouseRelatedProductsCallbacks<T> = {},
): Promise<GetWarehouseRelatedProductsResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetWarehouseRelatedProducts}?warehouseId=${id}`,
    },
    callbacks: result,
  });
};
