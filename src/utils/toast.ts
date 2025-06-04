import { ErrorMsg } from '@/constants';
import { toast } from 'react-toastify';

export const toastSuccess = (message: string): void => {
  if (message) {
    toast.success(message, {
      position: 'top-center',
      className: 'toastCustom',
    });
  }
};

export const toastError = (error: ErrorMsg) => {
  let toastData: string | string[] = '';

  if (typeof error === 'string' || (error && error instanceof Array)) {
    toastData = error;
  } else if (typeof error === 'object' && error.message) {
    toastData = error.message;
  }

  if (toastData && typeof toastData === 'string' && toastData !== '') {
    toast.error(toastData, {
      position: 'top-center',
      className: 'toastCustom',
    });
  } else if (toastData && toastData instanceof Array) {
    toastData.forEach((err) => {
      toastError(err);
    });
  }
};
