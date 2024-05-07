import type { ApiResponse, PROBLEM_CODE } from 'apisauce';
import type { AxiosRequestConfig } from 'axios';

export interface HandleErrorOptions {
  toastHelper?: any;
  showToast?: boolean;
  unauthorizedCB?: () => void;
}
export type ApiError = {
  message: string | undefined;
  value?: PROBLEM_CODE;
  code?: number;
  data?: any;
};
type ApiResponseErrorData = {
  message: string;
};
export function handleError<T, U>(
  response: ApiResponse<T, U | ApiResponseErrorData>,
  options?: HandleErrorOptions,
): {
  result: T | undefined;
  error: ApiError | undefined;
  curl?: string;
} {
  let error;
  let result;
  if (response.ok) {
    if (response.status === 200 || response.status === 201) {
      result = response?.data;
    } else {
      error = {
        message: `Response ok with status not 200 or 201. (${response.status})`,
      };
    }
  } else {
    const { data, status } = response;
    const { toastHelper, showToast, unauthorizedCB } = options || {};

    const { message } = data || {};

    if (status === 401) {
      unauthorizedCB?.();
    }

    if (showToast) {
      if (status === 401 && unauthorizedCB) {
        // handle 401
      } else toastHelper?.error(message);
    }
    error = {
      value: response.problem,
      code: response.status,
      message,
      data: response.data,
    };
  }
  return {
    result,
    error,
    curl: response.config ? axiosToCurl(response.config) : '',
  };
}

export const createGetOrderParams = (body: any) => {
  const allParams = {
    limit: 100,
    sorted_by: 'CREATED_AT', // CREATED_AT UPDATED_AT
    sorting: 'DESC',
    ...body,
  };
  const params = new URLSearchParams();
  Object.keys(allParams).forEach((key) => {
    if (allParams[key]) {
      if (Array.isArray(allParams[key])) {
        allParams[key].forEach((item: any) => {
          params.append(key, item);
        });
      } else {
        params.append(key, allParams[key]);
      }
    }
  });
  return params;
};

export const axiosToCurl = (config: AxiosRequestConfig): string => {
  if (!config) return '';
  let curlCommand = `curl -X ${config.method?.toUpperCase()} "${
    config.baseURL
  }${config.url}"`;

  try {
    if (config.headers) {
      Object.keys(config.headers).forEach((key: string) => {
        curlCommand += ` -H "${key}: ${config.headers?.[key]}"`;
      });
    }

    if (config.data) {
      curlCommand += ` --data '${config.data}'`;
    }

    if (config.params) {
      Object.keys(config.params).forEach((key: string) => {
        curlCommand += ` --data-urlencode "${key}=${config.params[key]}"`;
      });
    }

    return curlCommand;
  } catch (e) {
    console.log(e);
    return '';
  }
};
