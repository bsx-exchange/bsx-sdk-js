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

    // const ok = await bsxInstance.updateCollateralMode({
    //   collateral_mode: 'USDC_COLLATERAL'
    // })
    // console.log(ok)

  //   bsxInstance
  // .updateCollateralMode({'collateral_mode': 'MULTI_COLLATERAL'})
  // .then(({ result, error, curl }) => {
  //   console.log('updateCollateralMode', result, error, curl);
  // })
  // .catch((error) => {
  //   console.log('updateCollateralMode catch error', error);
  // });


    // const portfolio = await bsxInstance.getPortfolioDetail()
    // // console.log(, {depth: null})
    // console.log(JSON.stringify(portfolio.result))

    // return;

    // const { error: errorRegister } = await bsxInstance.register();
    // if (errorRegister) return 'errorRegister';

    // // createOrder
    // const { result: resultCreateOrder, error: errorCreateOrder } =
    //   await bsxInstance.createOrder({
    //     side: 'BUY',
    //     type: 'LIMIT',
    //     product_index: 1,
    //     price: '1000',
    //     size: '0.01',
    //     post_only: false,
    //     reduce_only: false,
    //   });
    // if (errorCreateOrder || !resultCreateOrder) {
    //   console.log('errorCreateOrder: ', errorCreateOrder);
    //   return 'errorCreateOrder';
    // }
    // console.log(resultCreateOrder);

    // // cancelOrder
    // const { result: resultCancelOrder, error: errorCancelOrder } =
    //   await bsxInstance.cancelBulkOrders(["18b3da99-5e07-4452-a964-b6c7d4afd93d"]);
    //   if (errorCancelOrder || !resultCancelOrder) {
    //     console.log('errorCancelOrder: ', errorCancelOrder);
    //     return 'errorCancelOrder';
    //   }
    //   console.log(resultCancelOrder)
  } catch (e) {
    console.log('Main catch error: ', e);
  }

  return 'done';
};

main();
