import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";
import { SINGLE_ITEM_QUERY } from "../graphql/query";
import SingleItem from "./SingleItem";

const item = fakeItem();

const mocks = [
  {
    request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
    result: { data: { item } }
  },
  {
    request: { query: SINGLE_ITEM_QUERY, variables: { id: "errorId" } },
    result: { errors: [{ message: "Item not found" }] }
  }
];

describe("<SingleItem />", () => {
  it("renders loading", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain("Loading...");
  });

  it("renders item content", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("img").prop("src")).toBe(item.largeImage);
    expect(wrapper.find("img").prop("alt")).toBe(item.title);

    expect(wrapper.find("h2").text()).toBe(`Viewing ${item.title}`);
    expect(wrapper.find("p").text()).toBe(item.description);
  });

  it("Errors with a not found item", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="errorId" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.text()).toContain('Item not found');
  });
});
