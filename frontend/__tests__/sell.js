import { shallow } from "enzyme";
import Sell from "../pages/sell";

describe("Sell Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Sell />);
    expect(wrapper.find("CreateItem")).toHaveLength(1);
  });

  it("require auth", () => {
    const wrapper = shallow(<Sell />);
    expect(wrapper.find("PleaseSignin")).toHaveLength(1);
  });
});
