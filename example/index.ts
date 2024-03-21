import { ENV_NAME } from '../src';
import { BsxInstance } from '../src/bsx-instance';

/**
 * 0xf656fD01ac574913329AbD1Ec2d8EAa11C66B63E
 * 0xde4ed668cc5aa3130af8c79f84dca11e69a6c383dec8a86c3cb0c4388ebd2b90
 */
const bsxInstance = new BsxInstance(
  '0xde4ed668cc5aa3130af8c79f84dca11e69a6c383dec8a86c3cb0c4388ebd2b90',
  '0xde4ed668cc5aa3130af8c79f84dca11e69a6c383dec8a86c3cb0c4388ebd2b90',
  ENV_NAME.TESTNET,
);

const main = async () => {
  try {
    const { error: errorRegister } = await bsxInstance.register();
    if (errorRegister) return 'errorRegister';

    // createOrder
    const { result: resultCreateOrder, error: errorCreateOrder } =
      await bsxInstance.createOrder({
        side: 'BUY',
        type: 'LIMIT',
        product_index: 1,
        price: '1000',
        size: '0.01',
        post_only: false,
        reduce_only: false,
      });
    if (errorCreateOrder || !resultCreateOrder) return 'errorCreateOrder';
    console.log(resultCreateOrder);

    // cancelOrder
    const { result: resultCancelOrder, error: errorCancelOrder } =
      await bsxInstance.cancelOrder(resultCreateOrder.id);
    if (errorCancelOrder || !resultCancelOrder) return 'errorCancelOrder';
    console.log(resultCancelOrder);

    // requestWithdrawal
    const { result: resultRequestWithdrawal, error: errorRequestWithdrawal } =
      await bsxInstance.submitWithdrawalRequest('10');
    if (errorRequestWithdrawal || !resultRequestWithdrawal)
      return 'errorRequestWithdrawal';
    console.log(resultRequestWithdrawal);
  } catch (e) {
    console.log('Main catch error: ', e);
  }

  return 'done';
};

main();
