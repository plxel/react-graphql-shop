import { mount } from "enzyme";
import wait from "waait";
import NProgress from "nprogress";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { SINGLE_ORDER_QUERY } from "../graphql/query";
import { fakeOrder } from "../lib/testUtils";
import Order from "./Order";

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: "ord123" } },
    result: { data: { order: fakeOrder() } }
  }
];

describe("<Order />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="ord123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("OrderStyles")).toHaveLength(1);
  });
});
