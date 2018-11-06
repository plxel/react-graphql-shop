import { mount } from "enzyme";
import wait from "waait";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ALL_ITEMS_QUERY, PAGINATION_QUERY } from "../../graphql/query";
import { fakeUser, fakeItem, fakeCartItem } from "../../lib/testUtils";
import Items from "./Items";

Router.router = {
  push() {},
  prefetch() {}
};

const mocks = [
  {
    request: {
      query: ALL_ITEMS_QUERY,
      variables: {
        skip: 0,
        first: 4
      }
    },
    result: {
      data: {
        items: [fakeItem(), { ...fakeItem(), id: "abc123" }]
      }
    }
  },
  {
    request: { query: PAGINATION_QUERY },
    result: {
      data: {
        itemsConnection: {
          __typename: "aggregate",
          aggregate: {
            __typename: "count",
            count: 2
          }
        }
      }
    }
  }
];

describe("<Items />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Items />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("Pagination")).toHaveLength(2);
    expect(wrapper.find("Item")).toHaveLength(2);
  });
});
