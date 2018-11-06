import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { WithQuery } from "./apollo";
import { ME_QUERY } from "../../graphql/query";
import { fakeUser } from "../../lib/testUtils";

const user = fakeUser();

const mocks = [
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: {
        me: fakeUser()
      }
    }
  }
];

const mocksForError = [
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: null,
      errors: [
        {
          message: "Something went wrong..."
        }
      ]
    }
  }
];

describe("<WithQuery />", () => {
  it("renders loading at first", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <WithQuery query={ME_QUERY}>
          {({ data }) => <div>test child</div>}
        </WithQuery>
      </MockedProvider>
    );

    expect(wrapper.text()).toBe("Loading...");
  });

  it("renders child after load", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <WithQuery query={ME_QUERY}>
          {({ data }) => <div>test child</div>}
        </WithQuery>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.text()).toBe("test child");
  });

  it("renders error on error", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocksForError}>
        <WithQuery query={ME_QUERY}>
          {({ data }) => <div>test child</div>}
        </WithQuery>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("DisplayError")).toHaveLength(1);
    expect(wrapper.text()).toContain("Something went wrong...");
  });
});
