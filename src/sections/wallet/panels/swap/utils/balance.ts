import Big from "big.js";

export function balanceFormated(balance?: string | number, digits = 4) {
  if (!balance) return "0";
  const _balance = new Big(balance);
  if (_balance.eq(0)) return "0";
  if (_balance.lt(1 / 10 ** digits))
    return `<${Big(1)
      .div(10 ** digits)
      .toFixed(digits)}`;
  return _balance.toFixed(digits).replace(/\.?0+$/, "");
}
