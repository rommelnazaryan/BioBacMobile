import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';
import { CreatePaymentRequest } from '@/types';

export type CreatePaymentCallbacks<T> = StatusCallbacks<T>;
export type CreatePaymentResult<T> = StatusResult<T>;

export const CreatePayment = async <T extends object>(
  data: CreatePaymentRequest,
  result: CreatePaymentCallbacks<T> = {},
): Promise<CreatePaymentResult<T>> => {
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: endpoints.CreatePayment,
      data,
    },
    callbacks: result,
  });
};
