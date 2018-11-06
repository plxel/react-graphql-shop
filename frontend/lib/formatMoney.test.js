import formatMoney from "./formatMoney";

describe("formatMoney Function", () => {
  it("works with fractional dollars", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(99)).toEqual("$0.99");
    expect(formatMoney(50)).toEqual("$0.50");
  });

  it("leaves cents off for whole dollars", () => {
    expect(formatMoney(5000)).toEqual("$50");
    expect(formatMoney(0)).toEqual("$0");
    expect(formatMoney(500000000)).toEqual("$5,000,000");
  });

  it("works with whole and fractional dollars", () => {
    expect(formatMoney(5012)).toEqual("$50.12");
    expect(formatMoney(101)).toEqual("$1.01");
    expect(formatMoney(123123123123)).toEqual("$1,231,231,231.23");
  });
});
