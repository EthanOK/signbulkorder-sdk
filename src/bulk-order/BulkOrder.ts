import { Signer as SignerV6, TypedDataDomain } from "ethers";
import { VoidSigner as SignerV5 } from "ethers-v5";
import { EIP712TypeDefinitions } from "../tree/defaults";
import { signBulkOrder, signOrder } from "../sign";
import { verifyOrder, verifyOrders } from "../verify";
import { OrderParameters, Order } from "../types";
import { BulkOrderContext } from "./context";

export class BulkOrder<T extends OrderParameters = OrderParameters> {
  private ctx: BulkOrderContext;

  constructor(
    signer: SignerV6 | SignerV5,
    domainData: TypedDataDomain,
    eip712BulkOrderType: EIP712TypeDefinitions
  ) {
    this.ctx = { signer, domainData, eip712BulkOrderType };
  }

  public signOrder(orderComponents: T): Promise<Order<T>> {
    return signOrder(this.ctx, orderComponents);
  }

  public signBulkOrder(orderComponents: T[]): Promise<Order<T>[]> {
    return signBulkOrder(this.ctx, orderComponents);
  }

  public verifyOrder(order: Order<T>, accountAddress: string): boolean {
    return verifyOrder(this.ctx, order, accountAddress);
  }

  public verifyOrders(
    orders: Order<T>[],
    accountAddress: string
  ): Promise<boolean> {
    return verifyOrders(this.ctx, orders, accountAddress);
  }

  /** @alias verifyOrders */
  public verifyBulkOrder(
    orders: Order<T>[],
    accountAddress: string
  ): Promise<boolean> {
    return verifyOrders(this.ctx, orders, accountAddress);
  }
}
