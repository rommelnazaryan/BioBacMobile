import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type LineCallbacks<T> = StatusCallbacks<T>;
export type LineResult<T> = StatusResult<T>;

export const GetLine = async <T extends object>(
   id?: number,
  result: LineCallbacks<T> = {},
): Promise<LineResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: `${endpoints.GetLine}${id? '/' + id : ''}`,
    },
    callbacks: result,
  });
};
