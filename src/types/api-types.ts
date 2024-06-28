// ORDER
export interface CreateOrderBody {
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP';
  time_in_force: 'FOK' | 'GTC' | 'IOC';
  stp?: 'CANCEL_TAKER' | 'CANCEL_MAKER';
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
  stp: string;
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

export interface PortfolioDetail {
  account: string;
  summary: PortfolioDetailSummary;
  positions: PositionData[];
  stats: PortfolioStats;
}

export interface PortfolioStats {
  order_stats: Orderstats;
  products: ProductStat[];
  trading_stats: TradingStats;
}

interface TradingStats {
  total_trading_volume: string;
}

export interface ProductStat {
  product_id: string;
  stat: Orderstats;
}

export interface Orderstats {
  total_orders: string;
  total_done_orders: string;
  total_open_orders: string;
  total_pending_orders: string;
}
export interface PortfolioDetailSummary {
  margin_usage: string;
  account_leverage: string;
  has_pending_withdrawal: boolean;
  in_liquidation: boolean;
  free_collateral: string;
  total_account_value: string;
  total_notional: string;
  usdc_balance: string;
  unsettled_usdc: string;
  realized_pnl: string;
  total_intial_margin: string;
  total_maintenance_margin: string;
}

export interface PositionData extends ProductInfo {
  product_index: number;
  product_id: string;
  net_size: string;
  avg_entry_price: string;
  initial_margin_requirement: string;
  maintenance_margin_requirement: string;
  liquidation_price: string;
  unrealized_pnl: string;
  mark_price: string;
  leverage: string;
  unsettled_funding: string;
  funding_index: string;
  quote_balance: string;
}

export interface ProductInfo {
  product_id: string;
  index: number;
  base_asset_symbol: string;
  quote_asset_symbol: string;
  underlying: string;
  base_increment: string;
  quote_increment: string;
  min_order_size: string;
  is_active: boolean;
  perpetual_product_config: Perpetualproductconfig;
  last_cumulative_funding: string;
  quote_volume_24h: string;
  change_24h: string;
  high_24h: string;
  low_24h: string;
  last_price: string;
  mark_price: string;
  index_price: string;
  max_position_size: string;
  open_interest: string;
  funding_interval: string;
  next_funding_rate: string;
  post_only: boolean;
}

interface Perpetualproductconfig {
  initial_margin: string;
  maintenance_margin: string;
  max_leverage: string;
}

export type ProductId = 'BTC-PERP' | 'ETH-PERP' | 'SOL-PERP' | 'WIF-PERP';
export interface DeleteAllOrdersBody {
  product_id?: ProductId;
}

export interface DeleteAllOrdersResult {
  cancel_requested_orders: {
    order_id: string;
    nonce: string;
  }[];
}

export type OpType = 'CANCEL' | 'CREATE' | 'CANCEL_BULK' | 'CANCEL_ALL';
export type BatchOperationParams = {
  op_type: OpType;
  cancel_request?: {
    order_id?: string;
    nonce?: string;
    client_order_id?: string;
  };
  create_order_request?: CreateOrderBody;
  cancel_orders_request?: {
    order_ids?: string[];
    nonces?: string[];
    client_order_ids?: string[];
  };
  cancel_all_orders_request?: {
    product_id: string;
  };
};
export interface BatchUpdateOrdersBody {
  data: BatchOperationParams[];
}
