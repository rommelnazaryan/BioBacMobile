import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetSaleLookupCallbacks<T> = StatusCallbacks<T>;
export type GetSaleLookupResult<T> = StatusResult<T>;

export const GetSaleLookup = async <T extends object>(
  companyId: number,
  result: GetSaleLookupCallbacks<T> = {},
): Promise<GetSaleLookupResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetSaleLookup}${companyId}`,
    },
    callbacks: result,
  });
};
