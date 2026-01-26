import {
    requestWithStatus,
    type StatusCallbacks,
    type StatusResult,
  } from '@/api/request';
  import {endpoints} from '@/api/endpoints';
  
  export type UpdateCompanyCallbacks<T> = StatusCallbacks<T>;
  export type UpdateCompanyResult<T> = StatusResult<T>;
  
  export const UpdateCompany = async <T extends object>(
    id: number,
    data: any,
    result: UpdateCompanyCallbacks<T> = {},
  ): Promise<UpdateCompanyResult<T>> => {
    return requestWithStatus<T>({
      config: {
        method: 'PUT',
        url: `${endpoints.UpdateCompanyGroup}${id}`,
        data: data,
      },
      callbacks: result,
    });
  };
