import { shallow } from "enzyme";
import Reset from "../pages/reset";

describe("Reset Page", () => {
  it("renders", () => {
    const wrapper = shallow(<Reset query={{ resetToken: "abc" }} />);
    expect(wrapper.find("ResetPassword").prop("resetToken")).toBe("abc");
  });
});
