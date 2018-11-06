import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser } from "../../lib/testUtils";
import { ME_QUERY } from "../../graphql/query";
import PleaseSignin from "./PleaseSignin";

const user = fakeUser();

const signOutMocks = [
  {
    request: { query: ME_QUERY },
    result: { data: { me: null } }
  }
];
const signInMocks = [
  {
    request: { query: ME_QUERY },
    result: { data: { me: user } }
  }
];

describe("<PleaseSignin />", () => {
  it("renders the sign in dialog to logged out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signOutMocks}>
        <PleaseSignin>
          <p data-test="child">Hey!</p>
        </PleaseSignin>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.text()).toContain("Please Sign In before continuing");
    expect(wrapper.find("Signin")).toHaveLength(1);
    expect(wrapper.find("p[data-test=\"child\"]")).toHaveLength(0);
  });

  it("renders the child component when the user is signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signInMocks}>
        <PleaseSignin>
          <p data-test="child">Hey!</p>
        </PleaseSignin>
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find("p[data-test=\"child\"]")).toHaveLength(1);
    expect(wrapper.find("p").text()).toBe("Hey!");
  });
});
