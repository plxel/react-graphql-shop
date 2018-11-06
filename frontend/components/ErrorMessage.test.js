import { mount, shallow } from "enzyme";
import wait from "waait";
import ErrorMessage from "./ErrorMessage";

describe("<ErrorMessage />", () => {
  it("renders", async () => {
    const wrapper = mount(<ErrorMessage />);

    expect(wrapper.find("DisplayError")).toHaveLength(1);
  });

  it("renders null if no error or no error message", () => {
    const wrapper = shallow(<ErrorMessage />);
    expect(wrapper.get(0)).toBe(null);
  });

  it("renders error message if not network error", () => {
    const wrapper = mount(
      <ErrorMessage error={{ message: "GraphQL error: Field not exist" }} />
    );
    expect(wrapper.text()).toBe("Shoot!Field not exist");
  });

  it("renders networks errors", () => {
    const wrapper = mount(
      <ErrorMessage
        error={{
          message: "Something went wrong",
          networkError: {
            result: { errors: [{ message: "Error1" }, { message: "Error2" }] }
          }
        }}
      />
    );

    expect(wrapper.find('p[data-test="graphql-error"]')).toHaveLength(2);
    expect(
      wrapper
        .find('p[data-test="graphql-error"]')
        .first()
        .text()
    ).toBe("Shoot!Error1");

    expect(
      wrapper
        .find('p[data-test="graphql-error"]')
        .last()
        .text()
    ).toBe("Shoot!Error2");
  });
});
