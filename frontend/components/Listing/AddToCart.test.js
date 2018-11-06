import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ME_QUERY } from "../../graphql/query";
import { ADD_TO_CART_MUTATION } from "../../graphql/mutation";
import { fakeUser, fakeCartItem } from "../../lib/testUtils";
import AddToCart from "./AddToCart";

const mocks = [
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: {
        me: { ...fakeUser(), cart: [] }
      }
    }
  },
  {
    request: {
      query: ADD_TO_CART_MUTATION,
      variables: { id: "abc123" }
    },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem({ id: "abc123" }),
          quantity: 1
        }
      }
    }
  },
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: {
        me: { ...fakeUser(), cart: [fakeCartItem({ id: "abc123" })] }
      }
    }
  }
];

describe("<AddToCart />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("button")).toHaveLength(1);
  });

  it("adds an item to cart when clicked", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <AddToCart id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const {
      data: { me }
    } = await apolloClient.query({ query: ME_QUERY });

    expect(me.cart).toHaveLength(0);

    wrapper.find("button").simulate("click");
    
    await wait();
    await wait();
    wrapper.update();

    const {
      data: { me: me2 }
    } = await apolloClient.query({ query: ME_QUERY });

    await wait();

    expect(me2.cart).toHaveLength(1);
    expect(me2.cart[0].id).toBe("abc123");
    expect(me2.cart[0].quantity).toBe(3);
  });

  it("changes from add to adding when clicked", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.text()).toContain("Add To Cart");
    wrapper.find("button").simulate("click");
    expect(wrapper.text()).toContain("Adding To Cart");
  });
});
