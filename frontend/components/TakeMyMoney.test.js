import { mount } from "enzyme";
import wait from "waait";
import NProgress from "nprogress";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ME_QUERY } from "../graphql/query";
import { CREATE_ORDER_MUTATION } from "../graphql/mutation";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import TakeMyMoney from "./TakeMyMoney";

Router.router = {
  push() {}
};

const mocks = [
  {
    request: { query: ME_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  }
];

describe("<TakeMyMoney />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("ReactStripeCheckout")).toHaveLength(1);
  });

  it("creates an order ontoken", async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: "xyz789" } }
    });

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );

    const component = wrapper.find("TakeMyMoney").instance();

    component.onToken({ id: "abc12345" }, createOrderMock);
    expect(createOrderMock).toHaveBeenCalledWith({
      variables: { token: "abc12345" }
    });
  });

  it("turns the progress bar on", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );

    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: "xyz789" } }
    });

    NProgress.start = jest.fn();
    const component = wrapper.find("TakeMyMoney").instance();
    component.onToken({ id: "abc12345" }, createOrderMock);
    expect(NProgress.start).toHaveBeenCalled();
  });

  it("routes to the order page when completed", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    Router.router = {
      push: jest.fn()
    };

    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: "xyz789" } }
    });

    const component = wrapper.find("TakeMyMoney").instance();
    component.onToken({ id: "abc12345" }, createOrderMock);

    await wait();

    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/order",
      query: { id: "xyz789" }
    });
  });
});
