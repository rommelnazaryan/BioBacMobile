import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
  
  export type GetSaleSuccessCallbacks<T> = StatusCallbacks<T>;
  export type GetSaleSuccessResult<T> = StatusResult<T>;
  
  export const GetSaleSuccess = async <T extends object>(
    page: number = 0,
    value: number = 0,
    result: GetSaleSuccessCallbacks<T> = {},
  ): Promise<GetSaleSuccessResult<T>> => {
    const data =
    value > 0
      ? {
          typeIds: {operator: 'contains', value: [value]},
        }
      : {};
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: `${endpoints.GetSaleSuccess}?sortBy=id&sortDir=DESC&page=${page}&size=20`,
        data
      },
      callbacks: result,
    });
  };
  