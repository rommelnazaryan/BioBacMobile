import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type ContactPersonCallbacks<T> = StatusCallbacks<T>;
export type ContactPersonResult<T> = StatusResult<T>;

export const GetContactPerson = async <T extends object>(

  result: ContactPersonCallbacks<T> = {},
): Promise<ContactPersonResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'GET',
      url: endpoints.GetContactPerson,
    },
    callbacks: result,
  });
};
