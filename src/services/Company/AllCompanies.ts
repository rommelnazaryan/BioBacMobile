import {
  requestWithStatus,
  type StatusCallbacks,
  type StatusResult,
} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type AllCompanyCallbacks<T> = StatusCallbacks<T>;
export type AllCompanyResult<T> = StatusResult<T>;

export const GetAllCompanies = async <T extends object>(
  page: number = 0,
  value: number = 0,
  search?: string,
  result: AllCompanyCallbacks<T> = {},
): Promise<AllCompanyResult<T>> => {
  const data =
  value > 0
    ? {
        typeIds: {operator: 'contains', value: [value]},
      }
    : {};
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: `${endpoints.GetAllCompanies}?sortBy=id&sortDir=DESC&page=${page}&size=20${search ? `&search=${search}` : ''}`,
      data
    },
    callbacks: result,
  });
};
