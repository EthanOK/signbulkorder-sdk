import { Signer as SignerV6, TypedDataDomain } from "ethers";
import { VoidSigner as SignerV5 } from "ethers-v5";
import { EIP712TypeDefinitions } from "../tree/defaults";

export type BulkOrderContext = {
  signer: SignerV6 | SignerV5;
  domainData: TypedDataDomain;
  eip712BulkOrderType: EIP712TypeDefinitions;
};

export function getOrderTypes(
  eip712BulkOrderType: EIP712TypeDefinitions
): EIP712TypeDefinitions {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { BulkOrder: _bulkOrder, ...orderTypes } = eip712BulkOrderType;
  return orderTypes;
}
