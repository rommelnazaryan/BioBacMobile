import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetCompanyCallbacks<T> = StatusCallbacks<T>;
export type BuyersResult<T> = StatusResult<T>;

export const GetCompany = async <T extends object>(
  id: number,
  result: GetCompanyCallbacks<T> = {},
): Promise<BuyersResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetCompany}${id}`,
    },
    callbacks: result,
  });
};