import { shallow } from "enzyme";
import Home from "../pages";

describe("Home Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Home query={{ page: 2}} />);
    expect(wrapper.prop("page")).toBe(2);
  });
});
