import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser, fakeCartItem } from "../../lib/testUtils";
import { ME_QUERY } from "../../graphql/query";
import Nav from "./Nav";

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
    result: {
      data: { me: { ...user, cart: [fakeCartItem(), fakeCartItem()] } }
    }
  }
];

describe("<Nav />", () => {
  it("renders a minimal nav when signed out", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signOutMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("NavStyles ul").children()).toHaveLength(2);
    expect(wrapper.text()).toContain("Shop");
    expect(wrapper.text()).toContain("Sign In");
  });

  it("renders a full nav when sign in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("NavStyles ul").children()).toHaveLength(6);
    expect(wrapper.find("Signout")).toHaveLength(1);
    expect(wrapper.text()).not.toContain("Sign In");
    // every cart item has quantity = 3, 2 cart items = 6 total items
    expect(wrapper.find("CartCount").prop("count")).toBe(6);
  });

  it("renders a cart items count", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    // every cart item has quantity = 3, 2 cart items = 6 total items
    expect(wrapper.find("CartCount").prop("count")).toBe(6);
  });
});
