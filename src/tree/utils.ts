import {
  BytesLike,
  concat,
  keccak256,
  toBeHex,
  TypedDataEncoder,
  TypedDataField
} from "ethers";
import { DefaultGetter } from "./defaults";
import { Eip712MerkleTree } from "./Eip712MerkleTree";

export type EIP712TypeDefinitions = Record<string, TypedDataField[]>;

export function getBulkOrderTree(
  orderComponents: any[],
  EIP_712_BULK_ORDER_TYPE: EIP712TypeDefinitions,
  startIndex = 0,
  height = getBulkOrderTreeHeight(orderComponents.length + startIndex)
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { BulkOrder, ...ORDER_TYPE } = EIP_712_BULK_ORDER_TYPE;
  const primaryType = TypedDataEncoder.getPrimaryType(ORDER_TYPE);
  // const primaryType_bulk_order = TypedDataEncoder.getPrimaryType(
  //   EIP_712_BULK_ORDER_TYPE
  // );
  // console.log("bulk order primaryType:", primaryType_bulk_order);
  // console.log("order primaryType:", primaryType);
  const types = getBulkOrderTypes(height, EIP_712_BULK_ORDER_TYPE, primaryType);
  const defaultNode = DefaultGetter.from(types, primaryType);
  let elements = [...orderComponents];

  if (startIndex > 0) {
    elements = [
      ...fillArray([] as any[], startIndex, defaultNode),
      ...orderComponents
    ];
  }
  const tree = new Eip712MerkleTree(
    types,
    "BulkOrder",
    primaryType,
    elements,
    height
  );
  return tree;
}

export function getBulkOrderTreeHeight(length: number): number {
  return Math.max(Math.ceil(Math.log2(length)), 1);
}

export const fillArray = <T>(arr: T[], length: number, value: T) => {
  if (length > arr.length) arr.push(...Array(length - arr.length).fill(value));
  return arr;
};
function getBulkOrderTypes(
  height: number,
  EIP_712_BULK_ORDER_TYPE: EIP712TypeDefinitions,
  primaryType: string
): EIP712TypeDefinitions {
  const types = { ...EIP_712_BULK_ORDER_TYPE };

  types.BulkOrder = [
    { name: "tree", type: `${primaryType}${`[2]`.repeat(height)}` }
  ];
  return types;
}

export const bufferKeccak = (value: BytesLike) => hexToBuffer(keccak256(value));

export const makeArray = <T>(len: number, getValue: (i: number) => T) =>
  Array(len)
    .fill(0)
    .map((_, i) => getValue(i));

export const chunk = <T>(array: T[], size: number) => {
  return makeArray(Math.ceil(array.length / size), (i) =>
    array.slice(i * size, (i + 1) * size)
  );
};

export const bufferToHex = (buf: Buffer) => toBeHex(buf.toString("hex"));

export const hexToBuffer = (value: string) =>
  Buffer.from(value.slice(2), "hex");

export const hashConcat = (arr: BytesLike[]) => bufferKeccak(concat(arr));

export const getRoot = (elements: (Buffer | string)[], hashLeaves = true) => {
  if (elements.length === 0) throw new Error("empty tree");

  const leaves = elements.map((e) => {
    const leaf = Buffer.isBuffer(e) ? e : hexToBuffer(e);
    return hashLeaves ? bufferKeccak(leaf) : leaf;
  });

  const layers: Buffer[][] = [leaves];

  // Get next layer until we reach the root
  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer(layers[layers.length - 1]));
  }

  return layers[layers.length - 1][0];
};

export const getNextLayer = (elements: Buffer[]) => {
  return chunk(elements, 2).map(hashConcat);
};
