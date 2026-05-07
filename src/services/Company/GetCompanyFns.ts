import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetCompanyFnsCallbacks<T> = StatusCallbacks<T>;
export type GetCompanyFnsResult<T> = StatusResult<T>;

export const GetCompanyFns = async <T extends object>(
  Id: number,
  result: GetCompanyFnsCallbacks<T> = {},
): Promise<GetCompanyFnsResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetCompanyFns}${Id}`,
    },
    callbacks: result,
  });
};
