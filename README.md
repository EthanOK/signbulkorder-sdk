# Bulk Order

## Sign Bulk Order

```ts
const privateKey = process.env.PRIVATE_KEY as string;
const provider = new JsonRpcProvider("https://1rpc.io/eth");
const signer = new Wallet(privateKey, provider);

const domainData = {
  name: "Seaport",
  version: "1.6",
  chainId: (await provider.getNetwork()).chainId,
  verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
};

const bulkOrder = new BulkOrder(signer, domainData);
const orders = [];

for (let i = 1; i <= 3; i++) {
  const order = {
    number: i,
    message: hashMessage(i.toString())
  };
  orders.push(order);
}

const EIP_712_BULK_ORDER_TYPE = {
  BulkOrder: [{ name: "tree", type: "OrderComponents[2][2][2][2][2][2][2]" }],
  OrderComponents: [
    { name: "number", type: "uint256" },
    { name: "message", type: "bytes32" }
  ]
};

const ordersWithSignature = await bulkOrder.signBulkOrder(
  orders,
  EIP_712_BULK_ORDER_TYPE
);

console.log(ordersWithSignature);
```
## Opensea BULK_ORDER_TYPE
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
