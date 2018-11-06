import { shallow } from "enzyme";
import Item from "../pages/item";

describe("Item Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Item query={{ id: 'abc'}} />);
    expect(wrapper.prop("id")).toBe('abc');
  });
});
