import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type CreateContactPersonCallbacks<T> = StatusCallbacks<T>;
export type CreateContactPersonResult<T> = StatusResult<T>;

export const CreateContactPerson = async <T extends object>(
  data: Record<string, unknown>,
  result: CreateContactPersonCallbacks<T> = {},
): Promise<CreateContactPersonResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: `${endpoints.GetContactPerson}`,
      data,
    },
    callbacks: result,
  });
};
