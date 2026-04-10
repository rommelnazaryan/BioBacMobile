import {
  requestWithStatus,
  type StatusCallbacks,
  type StatusResult,
} from '@/api/request';
import { endpoints } from '@/api/endpoints';

export type AccountHistoryCallbacks<T> = StatusCallbacks<T>;
export type CompanyHistoryResult<T> = StatusResult<T>;

export const GetAccountHistory = async <T extends object>(
  id: number,
  page: number = 0,
  result: AccountHistoryCallbacks<T> = {},
): Promise<CompanyHistoryResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: `${endpoints.GetAccountHistory}?sortBy=id&sortDir=desc&page=${page}&size=20`,
      data: {
        accountId: { value: id },
      },
    },
    callbacks: result,
  });
};
