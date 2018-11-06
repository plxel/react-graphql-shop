import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ALL_ITEMS_QUERY } from "../../graphql/query";
import { DELETE_ITEM_MUTATION } from "../../graphql/mutation";
import { fakeUser, fakeItem, fakeCartItem } from "../../lib/testUtils";
import DeleteItem from "./DeleteItem";

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
    request: {
      query: DELETE_ITEM_MUTATION,
      variables: { id: "abc123" }
    },
    result: {
      data: {
        deleteItem: {
          __typename: "Item",
          id: "abc123"
        }
      }
    }
  }
];

describe("<DeleteItem />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <DeleteItem id="abc123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("button")).toHaveLength(1);
  });

  it("removes item from listing when clicked", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <DeleteItem id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const {
      data: { items }
    } = await apolloClient.query({ query: ALL_ITEMS_QUERY });

    expect(items[1].id).toBe("abc123");

    global.confirm = jest.fn().mockReturnValue(true);
    wrapper.find("button").simulate("click");

    await wait(10);
    wrapper.update();

    const {
      data: { items: items2 }
    } = await apolloClient.query({ query: ALL_ITEMS_QUERY });

    await wait();

    expect(items2).toHaveLength(1);
    expect(items2[0].id).not.toBe("abc123");

    global.confirm.mockReset();
  });
});
