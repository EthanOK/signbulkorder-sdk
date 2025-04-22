import { Signature, Signer as SignerV6, TypedDataDomain } from "ethers";
import { VoidSigner as SignerV5 } from "ethers-v5";
import { getBulkOrderTree } from "../tree/utils";
import { EIP712TypeDefinitions } from "../tree/defaults";

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
export class BulkOrder {
  private signer: SignerV6 | SignerV5;
  private domainData: TypedDataDomain;

  constructor(signer: SignerV6 | SignerV5, domainData: TypedDataDomain) {
    this.signer = signer;
    this.domainData = domainData;
  }

  private async _getSigner() {
    return this.signer;
  }
  private async _getDomainData() {
    return this.domainData;
  }

  public async signBulkOrder(
    orderComponents: any[],
    EIP_712_BULK_ORDER_TYPE: EIP712TypeDefinitions
  ) {
    const signer = await this._getSigner();

    const domainData = await this._getDomainData();
    const tree = getBulkOrderTree(orderComponents, EIP_712_BULK_ORDER_TYPE);
    const bulkOrderType = tree.types;
    const chunks = tree.getDataToSign();
    const value = { tree: chunks };

    // console.log("domainData:\n", domainData);
    // console.log("bulkOrderType:\n", bulkOrderType);
    // console.log(
    //   "value:\n",
    //   JSON.stringify(
    //     value,
    //     (key, value) => {
    //       if (typeof value === "bigint") {
    //         return value.toString(); // 将 BigInt 转换为字符串
    //       }
    //       return value;
    //     },
    //     2
    //   )
    // );

    let signature;
    if ("signTypedData" in signer) {
      signature = await (signer as SignerV6).signTypedData(
        domainData,
        bulkOrderType,
        value
      );
    } else {
      signature = await (signer as SignerV5)._signTypedData(
        domainData,
        bulkOrderType,
        value
      );
    }

    // Use EIP-2098 compact signatures to save gas.
    if (signature.length === 132) {
      signature = Signature.from(signature).compactSerialized;
    }

    const orders: any[] = orderComponents.map((parameters, i) => ({
      parameters,
      signature: tree.getEncodedProofAndSignature(i, signature)
    }));

    return orders;
  }
}
