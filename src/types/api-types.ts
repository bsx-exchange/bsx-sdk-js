// ORDER
export interface CreateOrderBody {
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP';
  time_in_force: 'FOK' | 'GTC' | 'IOC';
  product_index: number;
  price: string;
  size: string;
  nonce: string;
  post_only: boolean;
  reduce_only: boolean;
  signature: string;
}

export interface RegisterBody {
  user_wallet: string;
  signer: string;
  nonce: string;
  wallet_signature: string;
  signer_signature: string;
  message: string;
}

export interface RegisterResult {
  api_key: string;
  api_secret: string;
  expired_at: string;
  name: string;
}

export interface CancelBulkOrdersBody {
  order_ids: string[];
}

export interface GetUserTradeHistoryBody {
  product_id: string;
  limit: number;
  page: number;
}

export interface CreateUserApiKeyBody {
  name: string;
}

export interface CreateOrderResult {
  id: string;
  price: string;
  size: string;
  product_id: string;
  side: string;
  type: string;
  time_in_force: string;
  nonce: string;
  post_only: boolean;
  created_at: string;
  cancel_reason: string;
  reject_reason: string;
  cancel_reject_reason: string;
  filled_fees: string;
  filled_size: string;
  status: 'PENDING' | 'OPEN' | 'DONE';
  sender: string;
  avg_price: string;
  cancel_requested: boolean;
  is_liquidation: boolean;
  initial_margin: string;
  last_trades: any[];
  reduce_only: boolean;
}

export interface ChainConfigResult {
  name: string;
  version: string;
  chain_id: string;
  verifying_contract: string;
  addresses: {
    usdc_contract: string;
  };
}

interface UserOrder {
  id: string;
  price: string;
  size: string;
  product_id: string;
  side: string;
  type: string;
  time_in_force: string;
  nonce: string;
  post_only: boolean;
  created_at: string;
  cancel_reason: string;
  reject_reason: string;
  cancel_reject_reason: string;
  filled_fees: string;
  filled_size: string;
  status: 'PENDING' | 'OPEN' | 'DONE';
  sender: string;
  avg_price: string;
  cancel_requested: boolean;
  is_liquidation: boolean;
  initial_margin: string;
  last_trades: any[];
  reduce_only: boolean;
}

export type OpenOrderResult = UserOrder[];

export interface DeleteOrderResult {
  order_id: string;
  nonce: string;
}

export interface GetTransferHistoryBody {
  page: number;
  limit: number;
}

export interface SubmitWithdrawalRequestBody {
  sender: string;
  amount: string;
  token: string;
  nonce: string;
  signature: string;
}
