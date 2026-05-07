import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
  
  export type GetWarehousesAllCallbacks<T> = StatusCallbacks<T>;
  export type GetWarehousesAllResult<T> = StatusResult<T>;
  
  export const GetWarehousesAll = async <T extends object>(
    page: number = 0,
    data: any = {},
    result: GetWarehousesAllCallbacks<T> = {},
  ): Promise<GetWarehousesAllResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: `${endpoints.GetWarehousesAll}?sortBy=id&sortDir=DESC&page=${page}&size=20`,
        data
      },
      callbacks: result,
    });
  };
  