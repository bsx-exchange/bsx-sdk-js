// ORDER
export interface CreateOrderBody {
  side: 'BUY' | 'SELL';
  type: OrderType;
  time_in_force: 'FOK' | 'GTC' | 'IOC' | 'GTT';
  expired_at?: string;
  stp?: OrderStpFlag;
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
  stp: OrderStpFlag;
  nonce: string;
  post_only: boolean;
  created_at_ts: string;
  cancel_reason: string;
  reject_reason: string;
  cancel_reject_reason: string;
  filled_fees: string;
  filled_size: string;
  status: OrderStatus;
  sender: string;
  avg_price: string;
  cancel_requested: boolean;
  is_liquidation: boolean;
  initial_margin: string;
  last_trades: Trade[];
  reduce_only: boolean;
  order_stop_type: OrderStopType;
  stop_price: string;
  client_order_id: string;
  updated_at: string;
  cancel_requested_at: string;
  liquidation_fee_rate: string;
  maker_fee_rate: string;
  taker_fee_rate: string;
  stop_price_option: StopPriceOption;
  expired_at: string;
}

export interface Trade {
  id: string;
  price: string;
  size: string;
  liquidity_indicator: string;
  time: number;
  funding_payment: string;
  trading_fee: string;
  sequencer_fee: string;
}

export interface ChainConfigResult {
  name: string;
  version: string;
  chain_id: string;
  verifying_contract: string;
  addresses: {
    usdc_contract: `0x${string}`;
    degen_contract: `0x${string}`;
    weth_contract: `0x${string}`;
    usdt_contract: `0x${string}`;
    cbbtc_contract: `0x${string}`;
  };
  main: DomainData;
  degen: DomainData;
}

interface DomainData {
  name: string;
  version: string;
  chain_id: string;
  verifying_contract: string;
}

interface UserOrder {
  id: string;
  price: string;
  stop_price: string;
  size: string;
  product_id: string;
  side: string;
  type: OrderType;
  time_in_force: string;
  nonce: string;
  post_only: boolean;
  created_at_ts: string;
  cancel_reason: string;
  reject_reason: string;
  cancel_reject_reason: string;
  filled_fees: string;
  filled_size: string;
  status: OrderStatus; 
  sender: string;
  avg_price: string;
  order_stop_type: OrderStopType;
  cancel_requested: boolean;
  is_liquidation: boolean;
  initial_margin: string;
  last_trades: Trade[];
  reduce_only: boolean;
  stop_price_option: StopPriceOption;
  client_order_id: string;
  stp: OrderStpFlag;
  updated_at: string;
  cancel_requested_at: string;
  liquidation_fee_rate: string;
  maker_fee_rate: string;
  taker_fee_rate: string;
  expired_at: string;
}


export type OpenOrderResult = UserOrder[];

export type OrderHistoryResult = UserOrder[];

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
  maker_fee: number,
  taker_fee: number
}

export interface PortfolioStats {
  order_stats: Orderstats;
  products: ProductStat[];
  trading_stats: TradingStats;
  tokens: TokenStat[];
}

export interface TokenStat {
  address: string;
  total_deposit: string;
  total_withdraw: string;
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
  collateral_mode: CollateralMode;
  collateral_margin_balance: string;
  cross_margin_balance: string;
  margin_usage: string;
  account_leverage: string;
  in_liquidation: boolean;
  free_collateral: string;
  total_account_value: string;
  total_notional: string;
  usdc_balance: string;
  unsettled_usdc: string;
  realized_pnl: string;
  total_initial_margin: string;
  total_maintenance_margin: string;
  token_balances: TokenBalance[];
  has_pending_withdrawal: boolean;
  total_unrealized_pnl: string;
  total_collateral_value: string;
  margin_health: string;
  has_pending_swap: boolean;
  total_isolated_order_reserve: string;
}

export interface TokenBalance {
  address: string;
  balance: string;
}

export interface PositionData extends ProductInfo {
  product_index: number;
  product_id: string;
  margin_mode: MarginMode;
  margin_balance: string;
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
  stop_position: {
    nearest_take_profit: { price: string; size: string; stop_price_option: StopPriceOption };
    nearest_stop_loss: { price: string; size: string; stop_price_option: StopPriceOption };
  };
  index_price: string;
  isolated_usdc_balance: string;
  in_isolated_liquidation: boolean;
  free_isolated_usdc_balance: string;
}

export interface ProductInfo {
  product_id: string;
  index: number;
  visible: boolean;
  display_name: string;
  display_base_asset_symbol: string;
  base_asset_symbol: string;
  quote_asset_symbol: string;
  underlying: string;
  base_increment: string;
  quote_increment: string;
  min_order_size: string;
  is_active: boolean;
  perpetual_product_config: Perpetualproductconfig;
  spot_product_config: Spotproductconfig;
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
  predicted_funding_rate: string;
  post_only: boolean;
  next_funding_time: string;
}

interface Perpetualproductconfig {
  initial_margin: string;
  maintenance_margin: string;
  max_leverage: string;
}
interface Spotproductconfig {}

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

export interface UpdateCollateralModeBody {
  collateral_mode: CollateralMode
}

export interface UpdateMarginModeBody {
  product_id: string;
  margin_mode: MarginMode;
}

export type StopPriceOption = 'MARK_PRICE' | 'LAST_TRADED_PRICE' | 'NONE';
export type OrderStpFlag = 'CANCEL_TAKER' | 'CANCEL_MAKER';
export type OrderStopType = 'TAKE_PROFIT' | 'STOP_LOSS' | 'STOP_NONE';
export type OrderStatus = 'PENDING' | 'OPEN' | 'DONE' | 'STOP_ACCEPTED';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP';
export type CollateralMode = 'MULTI_COLLATERAL' | 'USDC_COLLATERAL';
export type MarginMode = 'CROSS' | 'ISOLATED';
