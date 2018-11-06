import { shallow } from "enzyme";
import Update from "../pages/update";

describe("Update Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Update query={{ id: 'abc'}} />);
    expect(wrapper.prop("id")).toBe('abc');
  });
});
