import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
import { CreateReturnRequest } from '@/types';
  
  export type UpdateReturnCallbacks<T> = StatusCallbacks<T>;
  export type UpdateReturnResult<T> = StatusResult<T>;
  
  export const UpdateReturn = async <T extends object>(
    id: number,
    data: CreateReturnRequest,
    result: UpdateReturnCallbacks<T> = {},
  ): Promise<UpdateReturnResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'PUT',
        url: `${endpoints.UpdateReturn}${id}`,
        data: data,
      },
      callbacks: result,
    });
  };
  