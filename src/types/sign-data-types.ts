export const SIGN_DATA_TYPE = {
  ORDER_TYPE: [
    { name: 'sender', type: 'address' },
    { name: 'size', type: 'uint128' },
    { name: 'price', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
    { name: 'productIndex', type: 'uint8' },
    { name: 'orderSide', type: 'uint8' },
  ],
  SIGNING_KEY_TYPE: [{ name: 'account', type: 'address' }],
  REGISTER_TYPE: [
    { name: 'key', type: 'address' },
    { name: 'message', type: 'string' },
    { name: 'nonce', type: 'uint64' },
  ],
  WITHDRAW_TYPE: [
    { name: 'sender', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
};

export interface SigningKeyMessage {
  account: string;
}
export interface RegisterMessage {
  key: string;
  message: string;
  nonce: string;
}
export interface OrderMessage {
  sender: string;
  size: string;
  price: string;
  nonce: string;
  productIndex: number;
  orderSide: number;
}
