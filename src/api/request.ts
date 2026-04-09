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

const extractErrorMessage = (data: unknown): string | undefined => {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.message === 'string' && record.message.trim()) {
    return record.message;
  }

  if (typeof record.error === 'string' && record.error.trim()) {
    return record.error;
  }

  if (typeof record.detail === 'string' && record.detail.trim()) {
    return record.detail;
  }

  if (Array.isArray(record.message)) {
    const message = record.message.find(
      item => typeof item === 'string' && item.trim(),
    );
    if (typeof message === 'string') {
      return message;
    }
  }

  if (record.errors && typeof record.errors === 'object') {
    const firstError = Object.values(record.errors as Record<string, unknown>).find(
      value =>
        (typeof value === 'string' && value.trim()) ||
        (Array.isArray(value) &&
          value.some(item => typeof item === 'string' && item.trim())),
    );

    if (typeof firstError === 'string') {
      return firstError;
    }

    if (Array.isArray(firstError)) {
      const nestedMessage = firstError.find(
        item => typeof item === 'string' && item.trim(),
      );
      if (typeof nestedMessage === 'string') {
        return nestedMessage;
      }
    }
  }

  if (record.data) {
    return extractErrorMessage(record.data);
  }

  return undefined;
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
    console.log('err', err);
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    if (status === 401) {
      const data = axios.isAxiosError(err) ? err.response?.data : undefined;
      callbacks.onUnauthorized?.(data, err);
      console.log('Unauthorized', data);
      return {ok: false, status: 401, error: err, data};
    }

    const errorData = axios.isAxiosError(err) ? err.response?.data : undefined;
    const extractedMessage =
      extractErrorMessage(errorData) ??
      (err instanceof Error ? err.message : undefined) ??
      'Something went wrong';
    const normalizedError = new Error(extractedMessage);

    if (err instanceof Error) {
      normalizedError.stack = err.stack;
      normalizedError.name = err.name;
    }

    console.log('Error', status, extractedMessage, errorData);
    callbacks.onError?.(normalizedError, status);

    return {ok: false, status: status ?? 0, error: normalizedError};
  }
}


