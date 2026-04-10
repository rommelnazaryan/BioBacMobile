import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
  
  export type AccountListAllCallbacks<T> = StatusCallbacks<T>;
  export type AccountListAllResult<T> = StatusResult<T>;
  
  export const GetAccountListAll = async <T extends object>(
    page: number = 0,
    value: number = 0,
    result: AccountListAllCallbacks<T> = {},
  ): Promise<AccountListAllResult<T>> => {
    const data =
    value > 0
      ? {
          typeIds: {operator: 'contains', value: [value]},
        }
      : {};
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: `${endpoints.GetAccountListAll}?sortBy=id&sortDir=DESC&page=${page}&size=20`,
        data
      },
      callbacks: result,
    });
  };
  