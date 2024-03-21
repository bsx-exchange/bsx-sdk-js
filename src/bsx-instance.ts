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
  CreateOrderBody,
  GetTransferHistoryBody,
  GetUserTradeHistoryBody,
} from './types/api-types';
import type { EnvName, OrderInput } from './types/general';
import type {
  RegisterMessage,
  SigningKeyMessage,
} from './types/sign-data-types';
import { SIGN_DATA_TYPE } from './types/sign-data-types';

dayjs.extend(utc);

export class BsxInstance {
  constructor(
    userPrivateKey: string,
    signerPrivateKey?: string,
    env?: EnvName,
  ) {
    this.userWallet = new Wallet(userPrivateKey);
    this.signerWallet = signerPrivateKey
      ? new Wallet(signerPrivateKey)
      : this.userWallet;
    this.apiInstance.setBaseUrlByEnv(env);
  }

  userWallet: Wallet;

  signerWallet: Wallet;

  private apiInstance = createBsxApi();

  private appConfig = new AppConfig(this.apiInstance);

  register = async () => {
    const signingKeyMessage: SigningKeyMessage = {
      account: this.userWallet.address,
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
      key: this.userWallet.address,
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
      user_wallet: this.userWallet.address,
      signer: this.signerWallet.address,
      nonce: registerMessage.nonce,
      wallet_signature: accountSignature,
      signer_signature: signingKeySignature,
      message: registerMessage.message,
    };
    const res = await this.apiInstance.register(body);

    const { result, error } = handleError(res);
    this.apiInstance.setAuthToken(result);

    return {
      result,
      error,
      body,
      userWallet: this.userWallet,
      signerWallet: this.signerWallet,
    };
  };

  createOrder = async (orderInput: OrderInput) => {
    const { body, orderMessage } = createOrderBodyAndMessage(
      {
        side: orderInput.side,
        type: orderInput.type,
        product_index: orderInput.product_index,
        price: orderInput.price,
        size: orderInput.size,
        post_only: orderInput.post_only,
        reduce_only: orderInput.reduce_only,
        nonce: nowInNano(),
      },
      this.userWallet.address,
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

  submitWithdrawalRequest = async (amount: string) => {
    const domainData = await this.appConfig.getDomainData();
    const usdcAddress = await this.appConfig.getUsdcAddress();
    const body = {
      sender: this.userWallet?.address,
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

    const signature = await this.userWallet?.signTypedData(
      domainData,
      {
        Withdraw: SIGN_DATA_TYPE.WITHDRAW_TYPE,
      },
      message,
    );

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

  cancelAllOrders = async () => apiCall(this.apiInstance.cancelAllOrders);

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