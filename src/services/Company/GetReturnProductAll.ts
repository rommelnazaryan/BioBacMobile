import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type ReturnProductAllCallbacks<T> = StatusCallbacks<T>;
export type ReturnProductAllResult<T> = StatusResult<T>;

export const GetReturnProductAll = async <T extends object>(
  page: number = 0,
  result: ReturnProductAllCallbacks<T> = {},
): Promise<ReturnProductAllResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: `${endpoints.GetReturnProductAll}?sortBy=id&sortDir=DESC&page=${page}&size=20`,
    },
    callbacks: result,
  });
};
