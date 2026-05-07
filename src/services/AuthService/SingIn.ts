import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type SignInCallbacks<T> = StatusCallbacks<T>;
export type SignInResult<T> = StatusResult<T>;

export const signInService = async <T extends object>(
  username: string,
  password: string,
  result: SignInCallbacks<T> = {},
): Promise<SignInResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: endpoints.SignIn,
      data: {username, password},
    },
    callbacks: result,
  });
};
