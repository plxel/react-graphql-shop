import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ORDER_LIST_QUERY } from "../graphql/query";
import { fakeOrder } from "../lib/testUtils";
import OrderList from "./OrderList";

const mocksSingleOrder = [
  {
    request: { query: ORDER_LIST_QUERY },
    result: { data: { orders: [fakeOrder()] } }
  }
];

const mocks = [
  {
    request: { query: ORDER_LIST_QUERY },
    result: { data: { orders: [fakeOrder(), fakeOrder({ id: "order2" })] } }
  }
];

describe("<OrderList />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <OrderList />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("h2").text()).toBe("You have 2 orders");
  });

  it("renders each order", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <OrderList />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("OrderItemStyles")).toHaveLength(2);
  });

  it("renders each order details correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <OrderList />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const order = wrapper.find("OrderItemStyles").last();

    expect(order.find("Link").prop("href")).toMatchObject({
      pathname: "/order",
      query: { id: "order2" }
    });

    expect(order.text()).toContain("2 Items");
    expect(order.text()).toContain("2 Products");
    expect(order.text()).toContain("$400");
  });

  it("renders title for single order correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocksSingleOrder}>
        <OrderList />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("h2").text()).toBe("You have 1 order");
  });
});
