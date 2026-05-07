import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type RefreshTokenCallbacks<T> = StatusCallbacks<T>;
export type RefreshTokenResult<T> = StatusResult<T>;

export const refreshTokenService = async <T extends object>(
  refreshToken: string,
  result: RefreshTokenCallbacks<T> = {},
): Promise<RefreshTokenResult<T>> => {
  return requestWithStatus<T>({

    config: {
      method: 'POST',
      url: endpoints.RefreshToken,
      transformRequest: [data => data],
      data: refreshToken,
    },
    callbacks: result,
  });
};
