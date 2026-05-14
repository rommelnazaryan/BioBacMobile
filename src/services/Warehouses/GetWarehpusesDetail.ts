import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
  
  export type GetWarehousesDetailCallbacks<T> = StatusCallbacks<T>;
  export type GetWarehousesDetailResult<T> = StatusResult<T>;
  
  export const GetWarehousesDetail = async <T extends object>(
    page: number = 0,
    data: any = {},
    result: GetWarehousesDetailCallbacks<T> = {},
  ): Promise<GetWarehousesDetailResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: `${endpoints.GetWarehousesDetail}?sortBy=id&sortDir=DESC&page=${page}&size=20`,
        data
      },
      callbacks: result,
    });
  };