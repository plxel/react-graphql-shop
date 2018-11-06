import { mount } from "enzyme";
import wait from "waait";
import Router from "next/router";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";
import { CREATE_ITEM_MUTATION } from "../graphql/mutation";
import CreateItem from "./CreateItem";
import { wrap } from "module";

const dogImage = "https://dog.com/dog.jpg";

global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{ secure_url: dogImage }]
  })
});

const mocks = [
  {
    request: {
      query: CREATE_ITEM_MUTATION,
      variables: {}
    },
    result: {
      data: {
        createItem: {}
      }
    }
  }
];

describe("<CreateItem />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    expect(wrapper.find("form")).toHaveLength(1);
  });

  it("uploads a file when changed", async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const input = wrapper.find('input[type="file"]');
    input.simulate("change", { target: { files: ["fakedog.jpg"] } });
    await wait();
    const component = wrapper.find("CreateItem").instance();
    expect(global.fetch).toHaveBeenCalled();
    expect(component.state.image).toBe(dogImage);
    expect(component.state.largeImage).toBe(dogImage);
    global.fetch.mockReset();
  });

  it("handles state updating", async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    wrapper
      .find("#title")
      .simulate("change", { target: { name: "title", value: "testing" } });
    wrapper.find("#price").simulate("change", {
      target: { name: "price", type: "number", value: 50000 }
    });
    wrapper.find("#description").simulate("change", {
      target: { name: "description", value: "this is test description" }
    });

    await wait();

    const component = wrapper.find("CreateItem").instance();

    expect(component.state).toMatchObject({
      title: "testing",
      price: 50000,
      description: "this is test description"
    });
  });

  it("creates an item when the form is submitted", async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            image: "",
            largeImage: "",
            price: item.price
          }
        },
        result: {
          data: {
            createItem: {
              ...item,
              __typename: "Item"
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );

    wrapper
      .find("#title")
      .simulate("change", { target: { name: "title", value: item.title } });
    wrapper.find("#price").simulate("change", {
      target: { name: "price", type: "number", value: item.price }
    });
    wrapper.find("#description").simulate("change", {
      target: { name: "description", value: item.description }
    });

    await wait();

    Router.router = {
      push: jest.fn()
    };

    wrapper.find("form").simulate("submit");
    await wait();

    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/item",
      query: { id: "123" }
    });
  });
});
