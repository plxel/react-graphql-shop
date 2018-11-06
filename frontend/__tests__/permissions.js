import { shallow } from "enzyme";
import Permissions from "../pages/permissions";

describe("Permissions Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Permissions />);
    expect(wrapper.find("Permissions")).toHaveLength(1);
  });

  it("require auth", () => {
    const wrapper = shallow(<Permissions />);
    expect(wrapper.find("PleaseSignin")).toHaveLength(1);
  });
});
