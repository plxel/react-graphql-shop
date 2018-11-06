import { mount } from "enzyme";
import wait from "waait";
import Router from "next/router";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser, fakeCartItem } from "../../lib/testUtils";
import { PAGINATION_QUERY } from "../../graphql/query";
import Pagination from "./Pagination";

Router.router = {
  push() {},
  prefetch() {}
};

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: "aggregate",
            aggregate: {
              __typename: "count",
              count: length
            }
          }
        }
      }
    }
  ];
}

describe("<Pagination />", () => {
  it("displays a loading message", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    expect(wrapper.text()).toBe("Loading...");
  });

  it("renders pagination for 18 items", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find(".pages").text()).toBe("Page 1 of 5");
    expect(wrapper.find(".totalItems").text()).toBe("18 items total");
  });

  it("disables prev button on first page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("a.prev").prop("aria-disabled")).toBe(true);
    expect(wrapper.find("a.next").prop("aria-disabled")).toBe(false);
  });

  it("disables next button on last page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("a.prev").prop("aria-disabled")).toBe(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toBe(true);
  });

  it("enables all buttons on a middle page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("a.prev").prop("aria-disabled")).toBe(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toBe(false);
  });
});
