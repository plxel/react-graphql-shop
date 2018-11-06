import { shallow } from "enzyme";
import Orders from "../pages/orders";

describe("Orders Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Orders />);
    expect(wrapper.find("OrderList")).toHaveLength(1);
  });

  it("require auth", () => {
    const wrapper = shallow(<Orders />);
    expect(wrapper.find("PleaseSignin")).toHaveLength(1);
  });
});
