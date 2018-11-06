import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { SIGNUP_MUTATION } from "../../graphql/mutation";
import { ME_QUERY } from "../../graphql/query";
import { fakeUser, fakeCartItem } from "../../lib/testUtils";
import Cart, { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION } from "./Cart";

const mocks = [
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: {
        me: { ...fakeUser(), cart: [fakeCartItem()] }
      }
    }
  },
  {
    request: {
      query: LOCAL_STATE_QUERY
    },
    result: {
      data: {
        cartOpen: true
      }
    }
  }
];

describe("<Cart />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("header")).toHaveLength(1);
    expect(wrapper.find("CartItem")).toHaveLength(1);
  });
});
