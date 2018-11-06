import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { REQUEST_PASSWORD_RESET_MUTATION } from "../../graphql/mutation";
import RequestReset from "./RequestReset";

const mocks = [
  {
    request: {
      query: REQUEST_PASSWORD_RESET_MUTATION,
      variables: { email: "alexeym.vn@gmail.com" }
    },
    result: {
      data: {
        requestPasswordReset: {
          message: "success",
          __typename: "Message"
        }
      }
    }
  }
];

describe("<RequestReset />", () => {
  it("renders", () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    expect(wrapper.find("form")).toHaveLength(1);
  });

  it("calls the mutation", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    // simulate typing an email
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: "alexeym.vn@gmail.com" }
    });

    await wait();
    wrapper.update();
    wrapper.find("form").simulate("submit");
    await wait(10);
    wrapper.update();

    expect(wrapper.find("p").text()).toContain(
      "Success! Check your email for a reset link!"
    );
  });
});
