# signbulkorder-sdk

EIP-712 bulk order signing SDK. Supports custom EIP-712 schemas and OpenSea Seaport bulk orders. Compatible with ethers v5 and v6.

## Install

```bash
npm install signbulkorder-sdk
```

## API

```ts
import {
  BulkOrder,
  EIP_712_BULK_ORDER_TYPE_DEMO,
  Order,
  OrderParameters
} from "signbulkorder-sdk";
```

| Export | Description |
| --- | --- |
| `BulkOrder<T>` | Bulk order signer |
| `Order<T>` | Signed order: `{ parameters, signature }` |
| `OrderParameters` | Base constraint for order fields (`Record<string, unknown>`) |
| `EIP_712_BULK_ORDER_TYPE_DEMO` | Prebuilt EIP-712 types for OpenSea Seaport bulk orders |

### Constructor

```ts
new BulkOrder(signer, domainData, eip712BulkOrderType)
```

- `signer` — ethers v5 or v6 signer
- `domainData` — EIP-712 domain (name, version, chainId, verifyingContract)
- `eip712BulkOrderType` — EIP-712 type definitions for your bulk order schema

### Methods

```ts
signBulkOrder(orderComponents: T[]): Promise<Order<T>[]>
verifyBulkOrder(orders: Order<T>[]): Promise<void> // TODO
```

`eip712BulkOrderType` is configured once in the constructor. `signBulkOrder` only receives the order list.

## Custom EIP-712

Define your own `OrderComponents` schema and pass matching order objects:

```ts
import { BulkOrder } from "signbulkorder-sdk";
import { hashMessage, JsonRpcProvider, Wallet } from "ethers";

type CustomOrderComponents = {
  number: number;
  message: string;
  account: string;
};

const EIP_712_BULK_ORDER_TYPE = {
  BulkOrder: [{ name: "tree", type: "OrderComponents[2][2][2][2][2][2][2]" }],
  OrderComponents: [
    { name: "number", type: "uint256" },
    { name: "message", type: "bytes32" },
    { name: "account", type: "address" }
  ]
};

const privateKey = process.env.PRIVATE_KEY as string;
const provider = new JsonRpcProvider("https://1rpc.io/eth");
const signer = new Wallet(privateKey, provider);

const domainData = {
  name: "Seaport",
  version: "1.6",
  chainId: (await provider.getNetwork()).chainId,
  verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
};

const orderComponents: CustomOrderComponents[] = Array.from({ length: 3 }, (_, i) => ({
  number: i + 1,
  message: hashMessage(String(i + 1)),
  account: signer.address
}));

const bulkOrder = new BulkOrder<CustomOrderComponents>(
  signer,
  domainData,
  EIP_712_BULK_ORDER_TYPE
);

const ordersWithSignature = await bulkOrder.signBulkOrder(orderComponents);
console.log(ordersWithSignature);
```

Pass a generic type parameter to `BulkOrder<T>` when you want typed `parameters` on the result. Without it, fields default to `Record<string, unknown>`.

## OpenSea Seaport

Use the built-in `EIP_712_BULK_ORDER_TYPE_DEMO` for Seaport bulk orders:

```ts
import { BulkOrder, EIP_712_BULK_ORDER_TYPE_DEMO } from "signbulkorder-sdk";
import { JsonRpcProvider, Wallet } from "ethers";

const privateKey = process.env.PRIVATE_KEY as string;
const provider = new JsonRpcProvider("https://1rpc.io/eth");
const signer = new Wallet(privateKey, provider);

const domainData = {
  name: "Seaport",
  version: "1.6",
  chainId: (await provider.getNetwork()).chainId,
  verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
};

const orderComponents = [
  {
    offerer: signer.address,
    zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
    offer: [
      {
        itemType: 2,
        token: "0x97f236E644db7Be9B8308525e6506E4B3304dA7B",
        identifierOrCriteria: 111n,
        startAmount: 1n,
        endAmount: 1n
      }
    ],
    consideration: [
      {
        itemType: 0,
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: 0n,
        startAmount: 1082250000000000000n,
        endAmount: 1082250000000000000n,
        recipient: signer.address
      }
    ],
    orderType: 0,
    startTime: 1686193412n,
    endTime: 1688785412n,
    zoneHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    salt: 24446860302761739304752683030156737591518664810215442929818227897836383814680n,
    conduitKey:
      "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    counter: 0n
  }
];

const bulkOrder = new BulkOrder(
  signer,
  domainData,
  EIP_712_BULK_ORDER_TYPE_DEMO
);

const ordersWithSignature = await bulkOrder.signBulkOrder(orderComponents);
console.log(ordersWithSignature);
```

`EIP_712_BULK_ORDER_TYPE_DEMO` includes these EIP-712 types:

```ts
export const EIP_712_BULK_ORDER_TYPE_DEMO = {
  BulkOrder: [{ name: "tree", type: "OrderComponents[2][2][2][2][2][2][2]" }],
  OrderComponents: [
    { name: "offerer", type: "address" },
    { name: "zone", type: "address" },
    { name: "offer", type: "OfferItem[]" },
    { name: "consideration", type: "ConsiderationItem[]" },
    { name: "orderType", type: "uint8" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "zoneHash", type: "bytes32" },
    { name: "salt", type: "uint256" },
    { name: "conduitKey", type: "bytes32" },
    { name: "counter", type: "uint256" }
  ],
  OfferItem: [
    { name: "itemType", type: "uint8" },
    { name: "token", type: "address" },
    { name: "identifierOrCriteria", type: "uint256" },
    { name: "startAmount", type: "uint256" },
    { name: "endAmount", type: "uint256" }
  ],
  ConsiderationItem: [
    { name: "itemType", type: "uint8" },
    { name: "token", type: "address" },
    { name: "identifierOrCriteria", type: "uint256" },
    { name: "startAmount", type: "uint256" },
    { name: "endAmount", type: "uint256" },
    { name: "recipient", type: "address" }
  ]
};
```

> **Note:** This SDK's `OrderParameters` is generic and driven by your EIP-712 schema. It is not the same as `@opensea/seaport-js`'s `OrderParameters`, which is Seaport-specific.

## Test

```bash
yarn test
```
