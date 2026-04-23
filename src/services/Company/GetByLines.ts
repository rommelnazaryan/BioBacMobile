import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type GetByLinesCallbacks<T> = StatusCallbacks<T>;
export type BuyersResult<T> = StatusResult<T>;

export const GetByLines = async <T extends object>(
  lineIds: number[],
  result: GetByLinesCallbacks<T> = {},
): Promise<BuyersResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetByLines}?lineIds=${lineIds}`,
    },
    callbacks: result,
  });
};
