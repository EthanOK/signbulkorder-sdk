export type OrderParameters = Record<string, unknown>;

export type Order<T extends OrderParameters = OrderParameters> = {
  parameters: T;
  signature: string;
};
