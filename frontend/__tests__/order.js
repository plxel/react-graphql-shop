import { shallow } from "enzyme";
import Order from "../pages/order";

describe("Order Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Order query={{ id: 'abc'}} />);
    expect(wrapper.find('Order').prop("id")).toBe('abc');
  });

  it("require auth", () => {
    const wrapper = shallow(<Order query={{ id: 'abc'}} />);
    expect(wrapper.find("PleaseSignin")).toHaveLength(1);
  });
});
