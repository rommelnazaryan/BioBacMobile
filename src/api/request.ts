import axios, {type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import {apiClient} from './index';

export type StatusCallbacks<TSuccess> = {
  onSuccess?: (data: TSuccess, res: AxiosResponse<TSuccess>) => void; // 200
  onUnauthorized?: (data?: unknown, err?: unknown) => void; // 401
  onError?: (err: unknown, status?: number) => void; // بقیه
};

export type StatusResult<TSuccess> =
  | {ok: true; status: 200; data: TSuccess; res: AxiosResponse<TSuccess>}
  | {ok: false; status: 401; error: unknown; data?: unknown}
  | {ok: false; status: number; error: unknown};

type RequestArgs<TResponse> = {
  client?: AxiosInstance;
  config: AxiosRequestConfig;
  callbacks?: StatusCallbacks<TResponse>;
};

export async function requestWithStatus<TResponse extends object>(
  args: RequestArgs<TResponse>,
): Promise<StatusResult<TResponse>> {
  const client = args.client ?? apiClient;
  const callbacks = args.callbacks ?? {};
  // console.log('requestWithStatus',args.config);

  try {
    const res = await client.request<TResponse>(args.config);
    if (res.status === 200) {
      callbacks.onSuccess?.(res.data, res);
      return {ok: true, status: 200, data: res.data, res};
    }

    const err = new Error(`Unexpected status: ${res.status}`);
    callbacks.onError?.(err, res.status);
    return {ok: false, status: res.status, error: err};
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    if (status === 401) {
      const data = axios.isAxiosError(err) ? err.response?.data : undefined;
      callbacks.onUnauthorized?.(data, err);
      console.log('Unauthorized',data);
      return {ok: false, status: 401, error: err, data};
    }
    if(err instanceof Error && err.message.includes('Network Error')) {
    }else{
      console.log('Error',status,err);
      callbacks.onError?.(err, status);
    }

    return {ok: false, status: status ?? 0, error: err};
  }
}


