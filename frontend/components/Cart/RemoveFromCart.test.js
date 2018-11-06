import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ME_QUERY } from "../../graphql/query";
import { REMOVE_FROM_CART_MUTATION } from "../../graphql/mutation";
import { fakeUser, fakeCartItem } from "../../lib/testUtils";
import RemoveFromCart from "./RemoveFromCart";

const mocks = [
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({ id: "abc123", quantity: 1 })]
        }
      }
    }
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: { id: "abc123" }
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: "abc123"
        }
      }
    }
  }
];

describe("<RemoveFromCart />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id="abc123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("button")).toHaveLength(1);
  });

  it("removes an item from cart when clicked", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <RemoveFromCart id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const {
      data: { me }
    } = await apolloClient.query({ query: ME_QUERY });

    expect(me.cart).toHaveLength(1);

    wrapper.find("button").simulate("click");
    await wait();

    const {
      data: { me: me2 }
    } = await apolloClient.query({ query: ME_QUERY });

    expect(me2.cart).toHaveLength(0);
  });
});
