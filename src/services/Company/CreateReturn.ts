import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
import { CreateReturnRequest } from '@/types';
  
  export type CreateReturnCallbacks<T> = StatusCallbacks<T>;
  export type CreateReturnResult<T> = StatusResult<T>;
  
  export const CreateReturn = async <T extends object>(
    data: CreateReturnRequest,
    result: CreateReturnCallbacks<T> = {},
  ): Promise<CreateReturnResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: endpoints.CreateReturn,
        data: data,
      },
      callbacks: result,
    });
  };
  