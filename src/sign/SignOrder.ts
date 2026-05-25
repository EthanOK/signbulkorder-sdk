import { Signature, Signer as SignerV6 } from "ethers";
import { VoidSigner as SignerV5 } from "ethers-v5";
import { BulkOrderContext, getOrderTypes } from "../bulk-order/context";
import { EIP712TypeDefinitions } from "../tree/defaults";
import { getBulkOrderTree } from "../tree/utils";
import { Order, OrderParameters } from "../types";

async function signTypedData(
  ctx: BulkOrderContext,
  types: EIP712TypeDefinitions,
  value: Record<string, unknown>
): Promise<string> {
  const { signer, domainData } = ctx;

  let signature: string;
  if ("signTypedData" in signer) {
    signature = await (signer as SignerV6).signTypedData(
      domainData,
      types,
      value
    );
  } else {
    signature = await (signer as SignerV5)._signTypedData(
      domainData,
      types,
      value
    );
  }

  if (signature.length === 132) {
    signature = Signature.from(signature).compactSerialized;
  }

  return signature;
}

export async function signOrder<T extends OrderParameters>(
  ctx: BulkOrderContext,
  orderComponents: T
): Promise<Order<T>> {
  const orderTypes = getOrderTypes(ctx.eip712BulkOrderType);
  const signature = await signTypedData(
    ctx,
    orderTypes,
    orderComponents as Record<string, unknown>
  );

  return { parameters: orderComponents, signature };
}

export async function signBulkOrder<T extends OrderParameters>(
  ctx: BulkOrderContext,
  orderComponents: T[]
): Promise<Order<T>[]> {
  const tree = getBulkOrderTree(orderComponents, ctx.eip712BulkOrderType);
  const signature = await signTypedData(ctx, tree.types, {
    tree: tree.getDataToSign()
  });

  return orderComponents.map((parameters, i) => ({
    parameters,
    signature: tree.getEncodedProofAndSignature(i, signature)
  }));
}
