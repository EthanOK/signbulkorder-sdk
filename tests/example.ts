export const getOpenseaOrdersList = () => {
  const orders = [];
  for (let i = 1; i <= 3; i++) {
    const order = {
      offerer: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
      zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
      offer: [
        {
          itemType: 2,
          token: "0x97f236E644db7Be9B8308525e6506E4B3304dA7B",
          identifierOrCriteria: BigInt("111"),
          startAmount: BigInt("1"),
          endAmount: BigInt("1")
        }
      ],
      consideration: [
        {
          itemType: 0,
          token: "0x0000000000000000000000000000000000000000",
          identifierOrCriteria: BigInt("0"),
          startAmount: BigInt("1082250000000000000"),
          endAmount: BigInt("1082250000000000000"),
          recipient: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
        },
        {
          itemType: 0,
          token: "0x0000000000000000000000000000000000000000",
          identifierOrCriteria: BigInt("0"),
          startAmount: BigInt("27750000000000000"),
          endAmount: BigInt("27750000000000000"),
          recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
        }
      ],
      orderType: 0,
      startTime: BigInt("1686193412"),
      endTime: BigInt("1688785412"),
      zoneHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      salt: BigInt(
        "24446860302761739304752683030156737591518664810215442929818227897836383814680"
      ),
      conduitKey:
        "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
      counter: BigInt("0")
    };
    order.offer[0].identifierOrCriteria = BigInt(i * 100);
    orders.push(order);
  }
  return orders;
};
