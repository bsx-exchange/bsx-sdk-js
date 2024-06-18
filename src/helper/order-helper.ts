import dayjs from 'dayjs';

import type { OrderInput } from '../types/general';
import type { OrderMessage } from '../types/sign-data-types';
import { anyToWei } from './general-helper';

export const createOrderBodyAndMessage = (
  orderInput: OrderInput,
  sender: string,
) => {
  const {
    side,
    product_index,
    type = 'LIMIT',
    price,
    size,
    post_only,
    nonce,
    reduce_only,
    time_in_force,
    stp,
    client_order_id,
  } = orderInput;
  const body = {
    side,
    type,
    time_in_force:
      time_in_force || (type === 'MARKET' || reduce_only ? 'FOK' : 'GTC'),
    stp,
    product_index,
    price,
    size,
    nonce: nonce || `${dayjs().valueOf()}000000`,
    post_only: !!post_only,
    reduce_only: !!reduce_only,
    client_order_id,
  };

  const orderMessage: OrderMessage = {
    sender,
    size: anyToWei(body.size),
    price: anyToWei(body.price),
    nonce: body.nonce,
    productIndex: body.product_index,
    orderSide: body.side === 'BUY' ? 0 : 1,
  };
  return { body, orderMessage };
};
