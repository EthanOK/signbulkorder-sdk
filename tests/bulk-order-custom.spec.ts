import { BulkOrder } from "../src";
import { hashMessage, JsonRpcProvider, Wallet } from "ethers";
import { providers, Wallet as WalletV5 } from "ethers-v5";
import "dotenv/config";
import assert from "assert";

describe("Test Custom BulkOrder", () => {
  let signature_0 = "";
  it("Sign Bulk Order base ethersv6", async () => {
    const privateKey = process.env.PRIVATE_KEY as string;
    const provider = new JsonRpcProvider("https://1rpc.io/eth");
    const signer = new Wallet(privateKey, provider);

    const domainData = {
      name: "Seaport",
      version: "1.6",
      chainId: (await provider.getNetwork()).chainId,
      verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
    };

    const orderComponents = [];

    for (let i = 1; i <= 3; i++) {
      const order = {
        number: i,
        message: hashMessage(i.toString()),
        account: signer.address
      };
      orderComponents.push(order);
    }

    const EIP_712_BULK_ORDER_TYPE = {
      BulkOrder: [
        { name: "tree", type: "OrderComponents[2][2][2][2][2][2][2]" }
      ],
      OrderComponents: [
        { name: "number", type: "uint256" },
        { name: "message", type: "bytes32" },
        { name: "account", type: "address" }
      ]
    };

    type CustomOrderComponents = {
      number: number;
      message: string;
      account: string;
    };

    const bulkOrder = new BulkOrder<CustomOrderComponents>(
      signer,
      domainData,
      EIP_712_BULK_ORDER_TYPE
    );
    const ordersWithSignature = await bulkOrder.signBulkOrder(orderComponents);
    signature_0 = ordersWithSignature[0].signature;
  });

  it("Sign Bulk Order base ethersv5", async () => {
    const privateKey = process.env.PRIVATE_KEY as string;
    const provider = new providers.JsonRpcProvider("https://1rpc.io/eth");
    const signer = new WalletV5(privateKey, provider);

    const domainData = {
      name: "Seaport",
      version: "1.6",
      chainId: (await provider.getNetwork()).chainId,
      verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
    };

    const orderComponents = [];

    for (let i = 1; i <= 3; i++) {
      const order = {
        number: i,
        message: hashMessage(i.toString()),
        account: signer.address
      };

      orderComponents.push(order);
    }

    const EIP_712_BULK_ORDER_TYPE = {
      BulkOrder: [
        { name: "tree", type: "OrderComponents[2][2][2][2][2][2][2]" }
      ],
      OrderComponents: [
        { name: "number", type: "uint256" },
        { name: "message", type: "bytes32" },
        { name: "account", type: "address" }
      ]
    };

    const bulkOrder = new BulkOrder(
      signer as any,
      domainData,
      EIP_712_BULK_ORDER_TYPE
    );
    const ordersWithSignature = await bulkOrder.signBulkOrder(orderComponents);

    const signature_1 = ordersWithSignature[0].signature;

    assert.equal(signature_0, signature_1);
  });
});
// yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/bulk-order-custom.spec.ts
