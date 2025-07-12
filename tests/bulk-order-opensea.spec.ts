import { BulkOrder, EIP_712_BULK_ORDER_TYPE_DEMO } from "../src";
import { JsonRpcProvider, Wallet } from "ethers";
import { providers, Wallet as WalletV5 } from "ethers-v5";
import "dotenv/config";
import { Seaport } from "@opensea/seaport-js";
import { Order } from "@opensea/seaport-js/lib/types";
import { getOpenseaOrdersList } from "./example";
import { equal } from "assert";

describe("Test Opensea BulkOrder", () => {
  let signature_0 = "";
  it("Sign Bulk Order base ethersv6", async () => {
    const privateKey = process.env.PRIVATE_KEY as string;
    const provider = new JsonRpcProvider("https://1rpc.io/eth");
    const signer = new Wallet(privateKey, provider);
    const seaport = new Seaport(signer);

    const domainData = {
      name: "Seaport",
      version: "1.6",
      chainId: (await provider.getNetwork()).chainId,
      verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
    };
    // console.log(domainData);

    const orders = getOpenseaOrdersList();

    const EIP_712_BULK_ORDER_TYPE = EIP_712_BULK_ORDER_TYPE_DEMO;

    const bulkOrder = new BulkOrder(signer, domainData);
    const ordersWithSignature = await bulkOrder.signBulkOrder(
      orders,
      EIP_712_BULK_ORDER_TYPE
    );

    // console.log(ordersWithSignature)

    // validate ordersWithSignature
    const ordersWithSignature_opensea = await seaport.signBulkOrder(orders);

    equal(
      ordersWithSignature[0].signature,
      ordersWithSignature_opensea[0].signature
    );
    signature_0 = ordersWithSignature[0].signature;

    const ordersWithSignature_ = [];
    for (let i = 0; i < ordersWithSignature.length; i++) {
      const order = ordersWithSignature[i];
      const order_: Order = {
        parameters: {
          offerer: order.parameters.offerer,
          zone: order.parameters.zone,
          offer: order.parameters.offer,
          consideration: order.parameters.consideration,
          totalOriginalConsiderationItems:
            order.parameters.consideration.length,
          orderType: order.parameters.orderType,
          startTime: order.parameters.startTime,
          endTime: order.parameters.endTime,
          zoneHash: order.parameters.zoneHash,
          salt: order.parameters.salt,
          conduitKey: order.parameters.conduitKey
        },
        signature: order.signature
      };
      ordersWithSignature_.push(order_);
    }

    const isValid = await seaport.validate(ordersWithSignature_).staticCall();

    console.log("isValid", isValid);
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

    const orders = getOpenseaOrdersList();

    const bulkOrder = new BulkOrder(signer as any, domainData);
    const ordersWithSignature = await bulkOrder.signBulkOrder(
      orders,
      EIP_712_BULK_ORDER_TYPE_DEMO
    );

    equal(ordersWithSignature[0].signature, signature_0);
  });
});
