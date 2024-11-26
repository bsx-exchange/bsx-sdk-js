import { ENV_NAME } from '../src';
import { BsxInstance } from '../src/bsx-instance';

const main = async () => {
  try {
    const bsxInstance = await BsxInstance.createWithApiKey(
      "7de31802d6bbd54230db0c3ac0c996a7",
      "ba1b31a16363a16916e695269d90925e3c5501d67fe89329be476c52bddd5a23",
      "0x746de15abd290263318d37e877c0c97e1138c5907eae7c5171b124039e77be2b",
      ENV_NAME.TESTNET
    )




    // const portfolio = await bsxInstance.getPortfolioDetail()
    // // console.log(, {depth: null})
    // console.log(JSON.stringify(portfolio.result))

    // return;

    // const { error: errorRegister } = await bsxInstance.register();
    // if (errorRegister) return 'errorRegister';

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
    if (errorCreateOrder || !resultCreateOrder) {
      console.log('errorCreateOrder: ', errorCreateOrder);
      return 'errorCreateOrder';
    }
    console.log(resultCreateOrder);

    // // cancelOrder
    // const { result: resultCancelOrder, error: errorCancelOrder } =
    //   await bsxInstance.cancelOrder(resultCreateOrder.id);
    // if (errorCancelOrder || !resultCancelOrder) {
    //   console.log('errorCancelOrder: ', errorCancelOrder);
    //   return 'errorCancelOrder';
    // }
  } catch (e) {
    console.log('Main catch error: ', e);
  }

  return 'done';
};

main();
