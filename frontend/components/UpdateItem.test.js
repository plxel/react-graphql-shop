import { mount } from "enzyme";
import wait from "waait";
import Router from "next/router";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";
import { SINGLE_ITEM_QUERY } from "../graphql/query";
import { UPDATE_ITEM_MUTATION } from "../graphql/mutation";
import UpdateItem from "./UpdateItem";

const item = fakeItem();

const mocks = [
  {
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: { id: "abc123" }
    },
    result: {
      data: {
        item: {
          ...item,
          id: "abc123"
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_ITEM_MUTATION,
      variables: {
        id: "abc123",
        title: "newTitle"
      }
    },
    result: {
      data: {
        updateItem: {
          ...item,
          title: "newTitle",
          __typename: "Item"
        }
      }
    }
  }
];

describe("<UpdateItem />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UpdateItem id="abc123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("form")).toHaveLength(1);
  });

  it("updates an item when the form is submitted", async () => {
    const showSuccess = jest.fn();

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UpdateItem id="abc123" showSuccess={showSuccess} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    wrapper
      .find("#title")
      .simulate("change", { target: { name: "title", value: "newTitle" } });

    await wait();
    wrapper.update();

    wrapper.find("form").simulate("submit");

    await wait(10);
    wrapper.update();

    expect(showSuccess).toHaveBeenCalledWith("Saved!");
  });

  it("show no item found if no item found", async () => {
    const wrapper = mount(
      <MockedProvider
        mocks={[
          {
            request: {
              query: SINGLE_ITEM_QUERY,
              variables: { id: "abc12345" }
            },
            result: {
              data: {
                item: null
              }
            }
          }
        ]}
      >
        <UpdateItem id="abc12345" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.text()).toBe("No item found");
  });
});
