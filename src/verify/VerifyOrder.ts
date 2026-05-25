import { recoverAddress, Signature, TypedDataEncoder } from "ethers";
import { BulkOrderContext, getOrderTypes } from "../bulk-order/context";
import {
  decodeEncodedBulkOrderSignature,
  isBulkOrderSignature
} from "../tree/Eip712MerkleTree";
import {
  computeBulkOrderHash,
  deriveEIP712Digest,
  getBulkOrderTypes
} from "../tree/utils";
import { Order, OrderParameters } from "../types";

function verifyDigestSignature(
  digest: string,
  signature: string,
  expectedSigner: string
): boolean {
  let normalizedSignature = signature;

  if ((signature.length - 2) / 2 === 64) {
    normalizedSignature = Signature.from(signature).serialized;
  }

  const recovered = recoverAddress(digest, normalizedSignature);

  return recovered.toLowerCase() === expectedSigner.toLowerCase();
}

export function verifyOrder<T extends OrderParameters>(
  ctx: BulkOrderContext,
  order: Order<T>,
  accountAddress: string
): boolean {
  const orderTypes = getOrderTypes(ctx.eip712BulkOrderType);
  const primaryType = TypedDataEncoder.getPrimaryType(orderTypes);
  let orderHash = TypedDataEncoder.from(orderTypes).hashStruct(
    primaryType,
    order.parameters
  );
  let ecdsaSignature = order.signature;

  if (isBulkOrderSignature(order.signature)) {
    const { key, proof, signature } = decodeEncodedBulkOrderSignature(
      order.signature
    );
    const bulkOrderTypes = getBulkOrderTypes(
      proof.length,
      ctx.eip712BulkOrderType,
      primaryType
    );
    orderHash = computeBulkOrderHash(orderHash, proof, key, bulkOrderTypes);
    ecdsaSignature = signature;
  }

  const digest = deriveEIP712Digest(ctx.domainData, orderHash);

  return verifyDigestSignature(digest, ecdsaSignature, accountAddress);
}

export async function verifyOrders<T extends OrderParameters>(
  ctx: BulkOrderContext,
  orders: Order<T>[],
  accountAddress: string
): Promise<boolean> {
  if (orders.length === 0) {
    return true;
  }

  for (const order of orders) {
    if (!verifyOrder(ctx, order, accountAddress)) {
      return false;
    }
  }

  return true;
}
