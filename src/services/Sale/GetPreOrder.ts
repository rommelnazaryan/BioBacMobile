import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
  
  export type GetPreOrderCallbacks<T> = StatusCallbacks<T>;
  export type GetPreOrderResult<T> = StatusResult<T>;
  
  export const GetPreOrder = async <T extends object>(
    id: number,
    page: number = 0,
    data: any = {},
    result: GetPreOrderCallbacks<T> = {},
  ): Promise<GetPreOrderResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: `${endpoints.GetPreOrder}?sortBy=id&sortDir=DESC&page=${page}&size=20&stageIds=${id}`,
        data
      },
      callbacks: result,
    });
  };
  