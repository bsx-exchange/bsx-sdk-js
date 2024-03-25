# BSX JavaScript SDK

The JS Buy SDK is a lightweight library that allows you to interact with BSX Api.

## Table Of Contents

- [Installation](#installation)
- [Examples](#examples)
  + [Initializing the Instance](#initializing-the-instance)

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

### Initializing the Instance
Input private key of your wallet and signer to create SDK Instance for later use.

```javascript
import { BsxInstance } from '@bsx-exchange/client';

// Initializing a client to return content in the store's primary language
const bsxInstance = new BsxInstance('0xde...', '0xde...', ENV_NAME.TESTNET);
```

### Register account
Create order with signature create from signer and user wallet

```javascript
import { BsxInstance, ENV_NAME } from '@bsx-exchange/client';

const bsxInstance = new BsxInstance('0xde...', '0xde...', ENV_NAME.TESTNET);
bsxInstance
  .register()
  .then(({ result, error, curl }) => {
    console.log('register', result, error, curl);
  })
  .catch((error) => {
    console.log('register catch error', error);
  });
```

### Create order
Create order with signature create from signer and user wallet

```javascript
import { BsxInstance } from '@bsx-exchange/client';

const bsxInstance = new BsxInstance('0xde...', '0xde...', ENV_NAME.TESTNET);
const { error: registerError } = await bsxInstance.register();
if (!registerError) {
  bsxInstance
    .createOrder({
      side: 'BUY',
      type: 'LIMIT',
      product_index: 1,
      price: '1000',
      size: '0.01',
      post_only: false,
      reduce_only: false,
    })
    .then(({ result, error, curl }) => {
      console.log('createOrder', result, error, curl);
    })
    .catch((error) => {
      console.log('createOrder catch error', error);
    });
}
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
  .getAllOpenOrders('100.1')
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
