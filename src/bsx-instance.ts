import type { ApiResponse } from 'apisauce';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ethers, Wallet } from 'ethers';

import { createBsxApi, createGetOrderParams, handleError } from './api';
import { AppConfig } from './app-config';
import { createOrderBodyAndMessage } from './helper';
import {
  anyToFloatWithIncrement,
  nowInNano,
  toServerTime,
} from './helper/general-helper';
import type {
  BatchOperationParams,
  CreateOrderBody,
  GetTransferHistoryBody,
  GetUserTradeHistoryBody,
  ProductId,
} from './types/api-types';
import { type EnvName, type OrderInput } from './types/general';
import type {
  RegisterMessage,
  SigningKeyMessage,
} from './types/sign-data-types';
import { SIGN_DATA_TYPE } from './types/sign-data-types';

dayjs.extend(utc);

export class BsxInstance {
  constructor(
    userPrivateKey: string | null,
    signerPrivateKey?: string,
    env?: EnvName | string,
  ) {
    if (userPrivateKey) {
      this.userWallet = new Wallet(userPrivateKey);
      this.userAddress = this.userWallet.address;
      this.signerWallet = signerPrivateKey
        ? new Wallet(signerPrivateKey)
        : this.userWallet;
    } else if (signerPrivateKey)
      this.signerWallet = new Wallet(signerPrivateKey);
    this.setBaseUrlByEnv(env);
  }

  userWallet: Wallet | undefined;

  userAddress: string | undefined;

  signerWallet: Wallet | undefined;

  private apiInstance = createBsxApi();

  private appConfig = new AppConfig(this.apiInstance);

  static createWithApiKey = async (
    apiKey: string,
    apiSecret: string,
    signerPrivateKey: string,
    env?: EnvName | string,
  ) => {
    const instance = new BsxInstance(null, signerPrivateKey, env);
    await instance.setUpApiKey(apiKey, apiSecret);
    return instance;
  };

  private setBaseUrlByEnv = (env: EnvName | string = 'public-testnet') => {
    if (env === 'mainnet')
      this.apiInstance.changeBaseUrl('https://api.bsx.exchange/');
    else if (env === 'public-testnet')
      this.apiInstance.changeBaseUrl('https://api.testnet.bsx.exchange/');
    else this.apiInstance.changeBaseUrl(env);
  };

  setUpApiKey = async (apiKey: string, apiSecret: string) => {
    this.apiInstance.setAuthToken({ api_key: apiKey, api_secret: apiSecret });
    await this.getUserAddressByPortfolioDetail();
  };

  getUserAddressByPortfolioDetail = async () => {
    const res = await this.apiInstance.getPortfolioDetail();
    const { result, error } = handleError(res);
    if (error)
      throw new Error(
        error?.message || 'Cannot get user address by portfolio detail',
      );

    this.userAddress = result?.account;
  };

  register = async () => {
    if (!this.userWallet) throw new Error('User wallet is not defined');
    if (!this.signerWallet) throw new Error('Signer wallet is not defined');
    if (!this.userAddress) throw new Error('User address is not defined');

    const signingKeyMessage: SigningKeyMessage = {
      account: this.userAddress,
    };

    const domainData = await this.appConfig.getDomainData();
    const signingKeySignature = await this.signerWallet.signTypedData(
      domainData,
      {
        SignKey: SIGN_DATA_TYPE.SIGNING_KEY_TYPE,
      },
      signingKeyMessage,
    );

    const nonce = toServerTime(dayjs());
    const registerMessage: RegisterMessage = {
      key: this.userAddress,
      nonce,
      message: `Please sign in with your wallet to access bsx.exchange. You are signing in on ${dayjs()
        .utc()
        .format(
          'YYYY-MM-DD HH:mm:ss',
        )} (GMT). This message is exclusively signed with bsx.exchange for security.`,
    };

    const accountSignature = await this.userWallet.signTypedData(
      domainData,
      {
        Register: SIGN_DATA_TYPE.REGISTER_TYPE,
      },
      registerMessage,
    );

    const body = {
      user_wallet: this.userAddress,
      signer: this.signerWallet.address,
      nonce: registerMessage.nonce,
      wallet_signature: accountSignature,
      signer_signature: signingKeySignature,
      message: registerMessage.message,
    };
    const res = await this.apiInstance.register(body);

    const { result, error, curl } = handleError(res);
    this.apiInstance.setAuthToken(result);

    return {
      result,
      error,
      body,
      userWallet: this.userWallet,
      signerWallet: this.signerWallet,
      curl,
    };
  };

  createOrder = async (orderInput: OrderInput) => {
    if (!this.signerWallet) throw new Error('Signer wallet is not defined');
    if (!this.userAddress) throw new Error('User address is not defined');

    const { body, orderMessage } = createOrderBodyAndMessage(
      {
        nonce: nowInNano(),
        ...orderInput,
      },
      this.userAddress,
    );

    const domainData = await this.appConfig.getDomainData();
    const orderSignature = await this.signerWallet.signTypedData(
      domainData,
      { Order: SIGN_DATA_TYPE.ORDER_TYPE },
      orderMessage,
    );
    const payload: CreateOrderBody = {
      ...body,
      signature: orderSignature,
    };

    return apiCallWithBody(this.apiInstance.createOrder, payload);
  };

  batchUpdateOrders = async (
    data: {
      op_type: 'CANCEL' | 'CREATE';
      cancel_request?: {
        order_id?: string;
        nonce?: string;
        client_order_id?: string;
      };
      create_order_request?: OrderInput;
    }[],
  ) => {
    if (!this.signerWallet) throw new Error('Signer wallet is not defined');
    if (!this.userAddress) throw new Error('User address is not defined');
    const domainData = await this.appConfig.getDomainData();

    const batchBody: BatchOperationParams[] = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i]!;
      if (item.op_type === 'CANCEL') {
        batchBody.push({
          op_type: 'CANCEL',
          cancel_request: item.cancel_request,
        });
      } else {
        const { body, orderMessage } = createOrderBodyAndMessage(
          {
            nonce: nowInNano(),
            ...item.create_order_request!,
          },
          this.userAddress,
        );

        // eslint-disable-next-line no-await-in-loop
        const orderSignature = await this.signerWallet.signTypedData(
          domainData,
          { Order: SIGN_DATA_TYPE.ORDER_TYPE },
          orderMessage,
        );
        const payload: CreateOrderBody = {
          ...body,
          signature: orderSignature,
        };
        batchBody.push({
          op_type: 'CREATE',
          create_order_request: payload,
        });
      }
    }

    return apiCallWithBody(this.apiInstance.batchUpdateOrders, {
      data: batchBody,
    });
  };

  submitWithdrawalRequest = async (amount: string) => {
    if (!this.userWallet) throw new Error('User wallet is not defined');
    if (!this.userAddress) throw new Error('User address is not defined');

    const domainData = await this.appConfig.getDomainData();
    const usdcAddress = await this.appConfig.getUsdcAddress();
    const body = {
      sender: this.userAddress,
      amount: anyToFloatWithIncrement(amount, 2),
      token: usdcAddress,
      nonce: nowInNano(),
    };

    const message = {
      sender: body.sender,
      token: body.token,
      amount: ethers.parseEther(body.amount).toString(),
      nonce: body.nonce,
    };

    const signature = await this.userWallet.signTypedData(
      domainData,
      {
        Withdraw: SIGN_DATA_TYPE.WITHDRAW_TYPE,
      },
      message,
    );

    if (!signature) throw new Error('Cannot create signature');

    return apiCallWithBody(this.apiInstance.requestWithdraw, {
      ...body,
      signature,
    });
  };

  getAllOpenOrders = async () => apiCall(this.apiInstance.getOpenOrders);

  getOrderHistory = async (product_id: string) =>
    apiCallWithBody(
      this.apiInstance.getOrderHistory,
      createGetOrderParams({ product_id }),
    );

  cancelOrder = async (order_id: string) =>
    apiCallWithBody(this.apiInstance.cancelOrder, order_id);

  cancelAllOrders = async (productId?: ProductId) =>
    apiCallWithBody(
      this.apiInstance.cancelAllOrders,
      productId ? { product_id: productId } : {},
    );

  cancelBulkOrders = async (orderIds: string[]) =>
    apiCallWithBody(this.apiInstance.cancelBulkOrders, { order_ids: orderIds });

  getPortfolioDetail = async () => apiCall(this.apiInstance.getPortfolioDetail);

  getUserTradeHistory = async (params: GetUserTradeHistoryBody) =>
    apiCallWithBody(
      this.apiInstance.getUserTradeHistory,
      createGetOrderParams(params),
    );

  getProducts = async () => apiCall(this.apiInstance.getProducts);

  getFundingHistory = async (productId: string) =>
    apiCallWithIdAndBody(
      this.apiInstance.getFundingHistory,
      productId,
      undefined,
    );

  getApiKeyList = async () => apiCall(this.apiInstance.getApiKeyList);

  deleteUserApiKey = async (apiKey: string) => {
    const body = new URLSearchParams();
    body.append('api_keys', apiKey);
    return apiCallWithBody(this.apiInstance.deleteUserApiKey, body);
  };

  createUserApiKey = async (name: string) =>
    apiCallWithBody(this.apiInstance.createUserApiKey, { name });

  getTransferHistory = async (body: GetTransferHistoryBody) =>
    apiCallWithBody(this.apiInstance.getTransferHistory, body);
}

const apiCall = async <T, U>(apiFunction: () => Promise<ApiResponse<T, U>>) => {
  const res = await apiFunction();
  return handleError(res);
};

const apiCallWithBody = async <T, U, TT>(
  apiFunction: (body: TT) => Promise<ApiResponse<T, U>>,
  body: TT,
) => {
  const res = await apiFunction(body);
  return handleError(res);
};

const apiCallWithIdAndBody = async <T, U, TT>(
  apiFunction: (id: string, body: TT) => Promise<ApiResponse<T, U>>,
  id: string,
  body: TT,
) => {
  const res = await apiFunction(id, body);
  return handleError(res);
};
