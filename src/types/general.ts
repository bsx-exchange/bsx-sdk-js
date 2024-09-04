export type EnvName = 'public-testnet' | 'mainnet';
export const ENV_NAME: {
  [key: string]: EnvName;
} = {
  TESTNET: 'public-testnet',
  MAINNET: 'mainnet',
};
export interface DomainData {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

// ORDER
export interface OrderInput {
  side: 'BUY' | 'SELL';
  product_index: number;
  type?: 'MARKET' | 'LIMIT';
  price: string;
  size: string;
  time_in_force?: 'FOK' | 'GTC' | 'IOC' | 'GTT';
  expired_at?: string;
  stp?: 'CANCEL_TAKER' | 'CANCEL_MAKER';
  post_only?: boolean;
  nonce?: string;
  reduce_only?: boolean;
  client_order_id?: string;
}
