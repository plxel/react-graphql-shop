import { shallow } from "enzyme";
import Items from "../pages/items";

describe("Items Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Items query={{ page: 2}} />);
    expect(wrapper.prop("page")).toBe(2);
  });
});
