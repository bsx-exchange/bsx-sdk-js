# BSX JavaScript SDK

The JS Buy SDK is a lightweight library that allows you to interact with BSX Api.

## Table Of Contents

- [Installation](#installation)
- [Examples](#examples)
- [Usage](#usage)
  + [Create instance with API key - Primary method](#create-instance-with-api-key---primary-method)
  + [Initializing the Instance with user wallet and signer (not recommended)](#initializing-the-instance-with-user-wallet-and-signer-not-recommended)
  + [Register account (only for initializing with user wallet and signer)](#register-account-only-for-initializing-with-user-wallet-and-signer)
  + [Using other api base url](#using-other-api-base-url)
  + [Create order](#create-order)
  + [Submit withdraw request](#submit-withdraw-request)
  + [Get all open orders](#get-all-open-orders)
  + [Get orders history](#get-orders-history)
  + [Cancel order](#cancel-order)
  + [Cancel all orders](#cancel-all-orders)
  + [Cancel bulk orders](#cancel-bulk-orders)
  + [Get portfolio detail](#get-portfolio-detail)
  + [Get user trade history](#get-user-trade-history)
  + [Get products](#get-products)
  + [Get funding history](#get-funding-history)
  + [Get api key list](#get-api-key-list)
  + [Delete user api key](#delete-user-api-key)
  + [Create user api key](#create-user-api-key)
  + [Get transfer history](#get-transfer-history)


## Installation
**With Yarn:**
```bash
$ yarn add @bsx-exchange/client
```
**With NPM:**
```bash
$ npm install @bsx-exchange/client
```

## Examples

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const main = async () => {
  const bsxInstance = await BsxInstance.createWithApiKey(
    '9c77801a61fe23cebc574524b2b875e7',
    'd6217f927d24a9f40b668f94f153b97254ab230df92770f3e2367855fffd0b9f',
    '0x5ef68ecef054da6b13cdf79f2f78ca362ebffa68b19e4b5b1a3bd78df53e585c',
    ENV_NAME.TESTNET,
  );

  // More action
}
```

## Usage

### Create instance with API key - Primary method
Please notice that with this method, you cannot perform request withdraw action.

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const main = async () => {
  try {
    const bsxInstance = await BsxInstance.createWithApiKey(
      '9c77801a61fe23cebc574524b2b875e7',
      'd6217f927d24a9f40b668f94f153b97254ab230df92770f3e2367855fffd0b9f',
      '0x5ef68ecef054da6b13cdf79f2f78ca362ebffa68b19e4b5b1a3bd78df53e585c',
      ENV_NAME.TESTNET,
    );

    // Create order
    const resCreateOrder = await bsxInstance.createOrder({
      side: 'BUY',
      type: 'LIMIT',
      product_index: 1, // 1 for BTC_PERP, 2 for ETH_PERP and 3 for SOL_PERP
      price: '1000',
      size: '0.01',
      post_only: false,
      reduce_only: false,
    });
    console.log('createOrder', resCreateOrder.result, resCreateOrder.error);

    // Get all open orders
    const resOpenOrder = await bsxInstance.getAllOpenOrders();
    console.log('getAllOpenOrders', resOpenOrder.result, resOpenOrder.error);

    // Get order history
    const resOrderHistory = await bsxInstance.getOrderHistory('BTC_PERP');
    console.log('getOrderHistory', resOrderHistory.result, resOrderHistory.error);

    // Cancel order
    const resCancelOrder = await bsxInstance.cancelOrder(resCreateOrder.result.id);
    console.log('cancelOrder', resCancelOrder.result, resCancelOrder.error);

  } catch (error) {
    console.log('Error', error);
  }
}

main();
```

### Initializing the Instance with user wallet and signer (not recommended)
Input private key of your wallet and signer to create SDK Instance for later use. With this method, you can perform request withdraw action. Register action is required before performing any other actions.

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

// Initializing a client to return content in the store's primary language
const bsxInstance = new BsxInstance('0xde...', '0xde...', ENV_NAME.TESTNET);
```

### Register account (only for initializing with user wallet and signer)
Create order with signature create from signer and user wallet

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const main = async () => {
  try {
    const bsxInstance = new BsxInstance('0xde...', '0xde...', ENV_NAME.TESTNET);

    // Register account
    // MUST do if you initialize with user wallet and signer
    const { result, error: registerError, curl } = await bsxInstance.register();
    if (!registerError) {
      console.log('register success', result, curl);
    } else {
      console.log('register error', registerError, curl);
    }

    // Create order
    const resCreateOrder = await bsxInstance.createOrder({
      side: 'BUY',
      type: 'LIMIT',
      product_index: 1, // 1 for BTC_PERP, 2 for ETH_PERP and 3 for SOL_PERP
      price: '1000',
      size: '0.01',
      post_only: false,
      reduce_only: false,
    });
    console.log('createOrder', resCreateOrder.result, resCreateOrder.error);

    // Get all open orders
    const resOpenOrder = await bsxInstance.getAllOpenOrders();
    console.log('getAllOpenOrders', resOpenOrder.result, resOpenOrder.error);

    // Get order history
    const resOrderHistory = await bsxInstance.getOrderHistory('BTC_PERP');
    console.log('getOrderHistory', resOrderHistory.result, resOrderHistory.error);

    // Cancel order
    const resCancelOrder = await bsxInstance.cancelOrder(resCreateOrder.result.id);
    console.log('cancelOrder', resCancelOrder.result, resCancelOrder.error);
  } catch (error) {
    console.log('Error', error);
  }
}

main();
```

### Using other api base url
You can use other api base url by passing the url to the BsxInstance.createWithApiKey method

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const main = async () => {
  try {
    const bsxInstance = await BsxInstance.createWithApiKey(
      '9c77801a61fe23cebc574524b2b875e7',
      'd6217f927d24a9f40b668f94f153b97254ab230df92770f3e2367855fffd0b9f',
      '0x5ef68ecef054da6b13cdf79f2f78ca362ebffa68b19e4b5b1a3bd78df53e585c',
      ENV_NAME.TESTNET,
      'https://api.bsx.exchange',
    );

    // More action

  } catch (error) {
    console.log('Error', error);
  }
}

main();
```

With user wallet and signer

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const main = async () => {
  try {
    const bsxInstance = new BsxInstance(
      '0xde...',
      '0xde...',
      ENV_NAME.TESTNET,
      'https://api.bsx.exchange'
    );

    // Register account
    // MUST do if you initialize with user wallet and signer
    const { result, error: registerError, curl } = await bsxInstance.register();
    if (!registerError) {
      console.log('register success', result, curl);
    } else {
      console.log('register error', registerError, curl);
    }

    // More action

  } catch (error) {
    console.log('Error', error);
  }
}

main();
```

### Create order
Create order with signature create from signer and user wallet

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const main = async () => {
  try {
    const bsxInstance = await BsxInstance.createWithApiKey(
      '9c77801a61fe23cebc574524b2b875e7',
      'd6217f927d24a9f40b668f94f153b97254ab230df92770f3e2367855fffd0b9f',
      '0x5ef68ecef054da6b13cdf79f2f78ca362ebffa68b19e4b5b1a3bd78df53e585c',
      ENV_NAME.TESTNET,
    );
    const resCreateOrder = await bsxInstance.createOrder({
      side: 'BUY',
      type: 'LIMIT',
      product_index: 1,
      price: '1000',
      size: '0.01',
      post_only: false,
      reduce_only: false,
    })
  } catch (error) {
    console.log('Error', error);
  }
}

main();
```

Example with user wallet and signer

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const main = async () => {
  try {
    const bsxInstance = new BsxInstance('0xde...', '0xde...', ENV_NAME.TESTNET);

    // Register account
    // MUST do if you initialize with user wallet and signer
    const { result, error: registerError, curl } = await bsxInstance.register();
    if (!registerError) {
      console.log('register success', result, curl);
    } else {
      console.log('register error', registerError, curl);
    }

    const resCreateOrder = await bsxInstance.createOrder({
      side: 'BUY',
      type: 'LIMIT',
      product_index: 1,
      price: '1000',
      size: '0.01',
      post_only: false,
      reduce_only: false,
    })
  } catch (error) {
    console.log('Error', error);
  }
}

main();
```

### Submit withdraw request
Submit withdraw request

```javascript
bsxInstance
  .submitWithdrawalRequest('100.1')
  .then(({ result, error, curl }) => {
    console.log('submitWithdrawalRequest', result, error, curl);
  })
  .catch((error) => {
    console.log('submitWithdrawalRequest catch error', error);
  });
```

### Get all open orders
Get all current open order of user

```javascript
bsxInstance
  .getAllOpenOrders()
  .then(({ result, error, curl }) => {
    console.log('getAllOpenOrders', result, error, curl);
  })
  .catch((error) => {
    console.log('getAllOpenOrders catch error', error);
  });
```

### Get orders history
Get order history

```javascript
bsxInstance
  .getOrderHistory('BTC_PERP') // pass '' to get all
  .then(({ result, error, curl }) => {
    console.log('getOrderHistory', result, error, curl);
  })
  .catch((error) => {
    console.log('getOrderHistory catch error', error);
  });
```

### Cancel order
Cancel order by order id

```javascript
bsxInstance
  .cancelOrder('order_id')
  .then(({ result, error, curl }) => {
    console.log('cancelOrder', result, error, curl);
  })
  .catch((error) => {
    console.log('cancelOrder catch error', error);
  });
```

### Cancel all orders
Cancel all open orders

```javascript
bsxInstance
  .cancelAllOrders()
  .then(({ result, error, curl }) => {
    console.log('cancelAllOrders', result, error, curl);
  })
  .catch((error) => {
    console.log('cancelAllOrders catch error', error);
  });
```

Cancel all open orders of a product

```javascript
bsxInstance
  .cancelAllOrders('BTC_PERP')
  .then(({ result, error, curl }) => {
    console.log('cancelAllOrders', result, error, curl);
  })
  .catch((error) => {
    console.log('cancelAllOrders catch error', error);
  });
```

### Cancel bulk orders
Cancel bulk orders by order ids

```javascript
bsxInstance
  .cancelBulkOrders(['order_id_1', 'order_id_1'])
  .then(({ result, error, curl }) => {
    console.log('cancelBulkOrders', result, error, curl);
  })
  .catch((error) => {
    console.log('cancelBulkOrders catch error', error);
  });
```

### Get portfolio detail
Get portfolio detail of user

```javascript
bsxInstance
  .getPortfolioDetail()
  .then(({ result, error, curl }) => {
    console.log('getPortfolioDetail', result, error, curl);
  })
  .catch((error) => {
    console.log('getPortfolioDetail catch error', error);
  });
```

### Get user trade history
Get user trade history

```javascript
bsxInstance
  .getUserTradeHistory({
    product_id: 'ETH_PERP',
    limit: 50,
    page: 0,
  }) // pass '' to get all
  .then(({ result, error, curl }) => {
    console.log('getUserTradeHistory', result, error, curl);
  })
  .catch((error) => {
    console.log('getUserTradeHistory catch error', error);
  });
```

### Get products
Get all products

```javascript
bsxInstance
  .getProducts()
  .then(({ result, error, curl }) => {
    console.log('getProducts', result, error, curl);
  })
  .catch((error) => {
    console.log('getProducts catch error', error);
  });
```

### Get funding history
Get funding history

```javascript
bsxInstance
  .getFundingHistory('BTC_PERP') // pass '' to get all
  .then(({ result, error, curl }) => {
    console.log('getFundingHistory', result, error, curl);
  })
  .catch((error) => {
    console.log('getFundingHistory catch error', error);
  });
```

### Get api key list

Get api key list

```javascript
bsxInstance
  .getApiKeyList()
  .then(({ result, error, curl }) => {
    console.log('getApiKeyList', result, error, curl);
  })
  .catch((error) => {
    console.log('getApiKeyList catch error', error);
  });
```

### Delete user api key
Delete user api key by key id

```javascript

bsxInstance
  .deleteUserApiKey('api_key_id')
  .then(({ result, error, curl }) => {
    console.log('deleteUserApiKey', result, error, curl);
  })
  .catch((error) => {
    console.log('deleteUserApiKey catch error', error);
  });
```

### Create user api key
Create user api key

```javascript
bsxInstance
  .createUserApiKey('Api Name')
  .then(({ result, error, curl }) => {
    console.log('createUserApiKey', result, error, curl);
  })
  .catch((error) => {
    console.log('createUserApiKey catch error', error);
  });
```

### Get transfer history
Get transfer history

```javascript
bsxInstance
  .getTransferHistory({
    page: 0,
    limit: 100,
  })
  .then(({ result, error, curl }) => {
    console.log('getTransferHistory', result, error, curl);
  })
  .catch((error) => {
    console.log('getTransferHistory catch error', error);
  });
```





## License

MIT
