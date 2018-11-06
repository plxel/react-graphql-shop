import { mount } from "enzyme";
import wait from "waait";
import Router from "next/router";
import { MockedProvider } from "react-apollo/test-utils";
import debounce from "lodash.debounce";
import { fakeItem } from "../lib/testUtils";
import { SEARCH_ITEMS_QUERY } from "../graphql/query";
import Search from "./Search";

jest.mock("lodash.debounce", () => jest.fn(fn => fn));

describe("<Search />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider>
        <Search />
      </MockedProvider>
    );

    expect(wrapper.find("Downshift")).toHaveLength(1);
  });

  it("call the mutation on change and shows result if nothing found", async () => {
    const wrapper = mount(
      <MockedProvider
        mocks={[
          {
            request: {
              query: SEARCH_ITEMS_QUERY,
              variables: {
                searchTerm: "test"
              }
            },
            result: {
              data: {
                items: []
              }
            }
          }
        ]}
      >
        <Search />
      </MockedProvider>
    );

    wrapper.find("#search").simulate("change", { target: { value: "test" } });
    expect(wrapper.find("AutoComplete").instance().state.loading).toBe(true);

    await wait(10);
    wrapper.update();
    expect(wrapper.find("AutoComplete").instance().state.loading).toBe(false);

    expect(wrapper.find("DropDown").text()).toBe("Nothing found for test");
  });

  it("call the mutation on change and show result items", async () => {
    const resItem = fakeItem();
    const wrapper = mount(
      <MockedProvider
        mocks={[
          {
            request: {
              query: SEARCH_ITEMS_QUERY,
              variables: {
                searchTerm: "test"
              }
            },
            result: {
              data: {
                items: [resItem]
              }
            }
          }
        ]}
      >
        <Search />
      </MockedProvider>
    );

    wrapper.find("#search").simulate("change", { target: { value: "test" } });

    await wait(20);
    wrapper.update();

    expect(wrapper.find("DropDown").text()).toBe(resItem.title);
  });
});
