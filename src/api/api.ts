import apisauce from 'apisauce';
import type { AxiosInstance } from 'axios';
import axios from 'axios';

import type {
  CancelBulkOrdersBody,
  ChainConfigResult,
  CreateOrderBody,
  CreateOrderResult,
  CreateUserApiKeyBody,
  DeleteOrderResult,
  EnvName,
  GetTransferHistoryBody,
  OpenOrderResult,
  RegisterBody,
  RegisterResult,
  SubmitWithdrawalRequestBody,
} from '../types';

export class ApiInstance {
  private axiosApi = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 50000,
  }) as AxiosInstance;

  private api = apisauce.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL,
    axiosInstance: this.axiosApi,
  });

  // SET AUTH TOKEN
  setAuthToken = (authInfo?: any) => {
    if (authInfo) {
      this.api.setHeaders({
        'bsx-key': authInfo.api_key,
        'bsx-secret': authInfo.api_secret,
      });
    } else {
      this.api.setHeaders({ 'bsx-key': '', 'bsx-secret': '' });
    }
  };

  changeBaseUrl = (url: string) => {
    this.api.setBaseURL(url);
  };

  setBaseUrlByEnv = (env: EnvName = 'public-testnet') => {
    if (env === 'mainnet') this.api.setBaseURL('https://api.bsx.exchange/');
    else if (env === 'public-testnet')
      this.api.setBaseURL('https://api.testnet.bsx.exchange/');
  };

  // USER
  register = (body: RegisterBody) =>
    this.api.post<RegisterResult>('users/register', body);

  createOrder = (body: CreateOrderBody) =>
    this.api.post<CreateOrderResult>('orders', body);

  getOpenOrders = () => this.api.get<OpenOrderResult>('orders');

  getOrderHistory = (body: URLSearchParams) =>
    this.api.get('order-history', body);

  cancelOrder = (order_id: string) =>
    this.api.delete<DeleteOrderResult>('order', { order_id });

  cancelAllOrders = () => this.api.delete('orders/all');

  cancelBulkOrders = (body: CancelBulkOrdersBody) =>
    this.api.delete(
      'orders',
      {},
      {
        data: body,
      },
    );

  getUserTradeHistory = (body: URLSearchParams) =>
    this.api.get('trade-history', body);

  // TRADING
  getProducts = () => this.api.get('/products');

  getPortfolioDetail = () => this.api.get('/portfolio/detail');

  getFundingHistory = (productId: string) =>
    this.api.get(`/products/${productId}/funding-rate`);

  // API KEY
  getApiKeyList = () => this.api.get('users/api-key');

  deleteUserApiKey = (body: URLSearchParams) =>
    this.api.delete('users/api-key', body);

  createUserApiKey = (body: CreateUserApiKeyBody) =>
    this.api.post('users/api-key', body);

  // TRANSFER
  getTransferHistory = (body: GetTransferHistoryBody) =>
    this.api.get('/transfers/history', body);

  requestWithdraw = (body: SubmitWithdrawalRequestBody) =>
    this.api.post('/transfers/withdraw', body);

  // CONFIG SYSTEM
  getChainConfigs = () => this.api.get<ChainConfigResult>('/chain/configs');
}

export const createBsxApi = () => new ApiInstance();
