import { mount } from "enzyme";
import wait from "waait";
import Meta from "./Meta";

describe("<Meta />", () => {
  it("renders", () => {
    const wrapper = mount(<Meta />);
    expect(wrapper.find("Head")).toHaveLength(1);
  });
});
