import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetWarehouseProductBalanceCallbacks<T> = StatusCallbacks<T>;
export type GetWarehouseProductBalanceResult<T> = StatusResult<T>;

export const GetWarehouseProductBalance = async <T extends object>(
   productId: number,
   warehouseId: number,
   date: string,
  result: GetWarehouseProductBalanceCallbacks<T> = {},
): Promise<GetWarehouseProductBalanceResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetWarehouseProductBalance}?productId=${productId}&warehouseId=${warehouseId}&date=${encodeURIComponent(date)}`,
    },
    callbacks: result,
  });
};
