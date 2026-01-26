import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
import { CreateCompanyRequest } from '@/types';
  
  export type CreateCompanyCallbacks<T> = StatusCallbacks<T>;
  export type CreateCompanyResult<T> = StatusResult<T>;
  
  export const CreateCompany = async <T extends object>(
    data: CreateCompanyRequest,
    result: CreateCompanyCallbacks<T> = {},
  ): Promise<CreateCompanyResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'POST',
        url: endpoints.CreateCompany,
        data: data,
      },
      callbacks: result,
    });
  };
  