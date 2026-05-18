import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
  
  export type GetTransferProductAllCallbacks<T> = StatusCallbacks<T>;
  export type GetTransferProductAllResult<T> = StatusResult<T>;
  
  export const GetTransferProductAll = async <T extends object>(
    page: number = 0,
    data: any = {},
    result: GetTransferProductAllCallbacks<T> = {},
  ): Promise<GetTransferProductAllResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: `${endpoints.GetTransferProductAll}?sortBy=id&sortDir=DESC&page=${page}&size=20`,
        data
      },
      callbacks: result,
    });
  };
  