import { shallow } from "enzyme";
import Signup from "../pages/signup";

describe("Signup Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Signup />);
    expect(wrapper.find("Signup")).toHaveLength(1);
    expect(wrapper.find("Signin")).toHaveLength(1);
    expect(wrapper.find("RequestReset")).toHaveLength(1);
  });
});
