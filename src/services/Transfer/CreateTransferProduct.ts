import {requestWithStatus, type StatusCallbacks, type StatusResult} from '@/api/request';
import {endpoints} from '@/api/endpoints';

export type CreateTransferProductCallbacks<T> = StatusCallbacks<T>;
export type CreateTransferProductResult<T> = StatusResult<T>;

export const CreateTransferProduct = async <T extends object>(
   data: any,
  result: CreateTransferProductCallbacks<T> = {},
): Promise<CreateTransferProductResult<T>> => { 
  return requestWithStatus<T>({
    config: {
      method: 'POST',
      url: `${endpoints.CreateTransferProduct}`,
      data,
    },
    callbacks: result,
  });
};
