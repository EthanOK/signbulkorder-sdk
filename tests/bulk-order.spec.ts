import { BulkOrder, EIP_712_BULK_ORDER_TYPE_DEMO } from "../src";
import {
  hashMessage,
  JsonRpcProvider,
  keccak256,
  TypedDataEncoder,
  Wallet
} from "ethers";
import { providers, Wallet as WalletV5 } from "ethers-v5";
import "dotenv/config";
import { Seaport } from "@opensea/seaport-js";
import { Order } from "@opensea/seaport-js/lib/types";
import { stringify } from "querystring";

describe("BulkOrder", () => {
  it("Sign Bulk Order base ethersv6", async () => {
    const privateKey = process.env.PRIVATE_KEY as string;
    const provider = new JsonRpcProvider("https://1rpc.io/eth");
    const signer = new Wallet(privateKey, provider);
    // const seaport = new Seaport(signer);

    const domainData = {
      name: "Seaport",
      version: "1.6",
      chainId: (await provider.getNetwork()).chainId,
      verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
    };
    console.log(domainData);

    const orders = [];

    for (let i = 1; i <= 3; i++) {
      const order = {
        number: i,
        message: hashMessage(i.toString())
      };
      // const order = {
      //   offerer: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
      //   zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
      //   offer: [
      //     {
      //       itemType: 2,
      //       token: "0x97f236E644db7Be9B8308525e6506E4B3304dA7B",
      //       identifierOrCriteria: BigInt("111"),
      //       startAmount: BigInt("1"),
      //       endAmount: BigInt("1")
      //     }
      //   ],
      //   consideration: [
      //     {
      //       itemType: 0,
      //       token: "0x0000000000000000000000000000000000000000",
      //       identifierOrCriteria: BigInt("0"),
      //       startAmount: BigInt("1082250000000000000"),
      //       endAmount: BigInt("1082250000000000000"),
      //       recipient: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
      //     },
      //     {
      //       itemType: 0,
      //       token: "0x0000000000000000000000000000000000000000",
      //       identifierOrCriteria: BigInt("0"),
      //       startAmount: BigInt("27750000000000000"),
      //       endAmount: BigInt("27750000000000000"),
      //       recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
      //     }
      //   ],
      //   orderType: 0,
      //   startTime: BigInt("1686193412"),
      //   endTime: BigInt("1688785412"),
      //   zoneHash:
      //     "0x0000000000000000000000000000000000000000000000000000000000000000",
      //   salt: BigInt(
      //     "24446860302761739304752683030156737591518664810215442929818227897836383814680"
      //   ),
      //   conduitKey:
      //     "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
      //   counter: BigInt("0")
      // };
      // order.offer[0].identifierOrCriteria = BigInt(i);
      orders.push(order);
    }
    // const EIP_712_BULK_ORDER_TYPE = EIP_712_BULK_ORDER_TYPE_DEMO;
    const EIP_712_BULK_ORDER_TYPE = {
      BulkOrder: [
        { name: "tree", type: "OrderComponents[2][2][2][2][2][2][2]" }
      ],
      OrderComponents: [
        { name: "number", type: "uint256" },
        { name: "message", type: "bytes32" }
      ]
    };

    const bulkOrder = new BulkOrder(signer, domainData);
    const ordersWithSignature = await bulkOrder.signBulkOrder(
      orders,
      EIP_712_BULK_ORDER_TYPE
    );

    const ordersWithSignature_serialize = JSON.stringify(
      ordersWithSignature,
      (key, value) => {
        if (typeof value === "bigint") {
          return value.toString(); // 将 BigInt 转换为字符串
        }
        return value;
      },
      2
    );

    console.log(ordersWithSignature_serialize);

    // validate ordersWithSignature

    // const ordersWithSignature_ = await seaport.signBulkOrder(orders);
    // console.log(ordersWithSignature_);
    // const orders_ = [];

    // for (let i = 0; i < ordersWithSignature.length; i++) {
    //   const order = ordersWithSignature[i];
    //   const order_: Order = {
    //     parameters: {
    //       offerer: order.parameters.offerer,
    //       zone: order.parameters.zone,
    //       offer: order.parameters.offer,
    //       consideration: order.parameters.consideration,
    //       totalOriginalConsiderationItems:
    //         order.parameters.consideration.length,
    //       orderType: order.parameters.orderType,
    //       startTime: order.parameters.startTime,
    //       endTime: order.parameters.endTime,
    //       zoneHash: order.parameters.zoneHash,
    //       salt: order.parameters.salt,
    //       conduitKey: order.parameters.conduitKey
    //     },
    //     signature: order.signature
    //   };
    //   orders_.push(order_);
    // }

    // console.log(orders_);

    // const isValid = await seaport.validate(orders_).staticCall();

    // console.log("isValid", isValid);
  });

  it("Sign Bulk Order base ethersv5", async () => {
    const privateKey = process.env.PRIVATE_KEY as string;
    const provider = new providers.JsonRpcProvider("https://1rpc.io/eth");
    const signer = new WalletV5(privateKey, provider);
    // const seaport = new Seaport(signer);

    const domainData = {
      name: "Seaport",
      version: "1.6",
      chainId: (await provider.getNetwork()).chainId,
      verifyingContract: "0x0000000000000068F116a894984e2DB1123eB395"
    };
    console.log(domainData);

    const orders = [];

    for (let i = 1; i <= 3; i++) {
      const order = {
        number: i,
        message: hashMessage(i.toString())
      };
      // const order = {
      //   offerer: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
      //   zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
      //   offer: [
      //     {
      //       itemType: 2,
      //       token: "0x97f236E644db7Be9B8308525e6506E4B3304dA7B",
      //       identifierOrCriteria: BigInt("111"),
      //       startAmount: BigInt("1"),
      //       endAmount: BigInt("1")
      //     }
      //   ],
      //   consideration: [
      //     {
      //       itemType: 0,
      //       token: "0x0000000000000000000000000000000000000000",
      //       identifierOrCriteria: BigInt("0"),
      //       startAmount: BigInt("1082250000000000000"),
      //       endAmount: BigInt("1082250000000000000"),
      //       recipient: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
      //     },
      //     {
      //       itemType: 0,
      //       token: "0x0000000000000000000000000000000000000000",
      //       identifierOrCriteria: BigInt("0"),
      //       startAmount: BigInt("27750000000000000"),
      //       endAmount: BigInt("27750000000000000"),
      //       recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
      //     }
      //   ],
      //   orderType: 0,
      //   startTime: BigInt("1686193412"),
      //   endTime: BigInt("1688785412"),
      //   zoneHash:
      //     "0x0000000000000000000000000000000000000000000000000000000000000000",
      //   salt: BigInt(
      //     "24446860302761739304752683030156737591518664810215442929818227897836383814680"
      //   ),
      //   conduitKey:
      //     "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
      //   counter: BigInt("0")
      // };
      // order.offer[0].identifierOrCriteria = BigInt(i);
      orders.push(order);
    }
    // const EIP_712_BULK_ORDER_TYPE = EIP_712_BULK_ORDER_TYPE_DEMO;
    const EIP_712_BULK_ORDER_TYPE = {
      BulkOrder: [
        { name: "tree", type: "OrderComponents[2][2][2][2][2][2][2]" }
      ],
      OrderComponents: [
        { name: "number", type: "uint256" },
        { name: "message", type: "bytes32" }
      ]
    };

    const bulkOrder = new BulkOrder(signer as any, domainData);
    const ordersWithSignature = await bulkOrder.signBulkOrder(
      orders,
      EIP_712_BULK_ORDER_TYPE
    );

    const ordersWithSignature_serialize = JSON.stringify(
      ordersWithSignature,
      (key, value) => {
        if (typeof value === "bigint") {
          return value.toString(); // 将 BigInt 转换为字符串
        }
        return value;
      },
      2
    );

    console.log(ordersWithSignature_serialize);

    // validate ordersWithSignature

    // const ordersWithSignature_ = await seaport.signBulkOrder(orders);
    // console.log(ordersWithSignature_);
    // const orders_ = [];

    // for (let i = 0; i < ordersWithSignature.length; i++) {
    //   const order = ordersWithSignature[i];
    //   const order_: Order = {
    //     parameters: {
    //       offerer: order.parameters.offerer,
    //       zone: order.parameters.zone,
    //       offer: order.parameters.offer,
    //       consideration: order.parameters.consideration,
    //       totalOriginalConsiderationItems:
    //         order.parameters.consideration.length,
    //       orderType: order.parameters.orderType,
    //       startTime: order.parameters.startTime,
    //       endTime: order.parameters.endTime,
    //       zoneHash: order.parameters.zoneHash,
    //       salt: order.parameters.salt,
    //       conduitKey: order.parameters.conduitKey
    //     },
    //     signature: order.signature
    //   };
    //   orders_.push(order_);
    // }

    // console.log(orders_);

    // const isValid = await seaport.validate(orders_).staticCall();

    // console.log("isValid", isValid);
  });
});
