import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ALL_USERS_QUERY } from "../graphql/query";
import { UPDATE_PERMISSIONS_MUTATION } from "../graphql/mutation";
import { fakeUser } from "../lib/testUtils";
import Permissions, { PERMISSIONS_TYPES } from "./Permissions";

const mocks = [
  {
    request: { query: ALL_USERS_QUERY },
    result: { data: { users: [fakeUser({ email: "test@test.test" })] } }
  },
  {
    request: {
      query: UPDATE_PERMISSIONS_MUTATION,
      variables: { permissions: ["ADMIN", "USER"], userId: "4234" }
    },
    result: {
      data: {
        updatePermissions: [
          fakeUser({ email: "test@test.test", permissions: ["ADMIN", "USER"] })
        ]
      }
    }
  }
];

describe("<Permissions />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Permissions />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find("Table")).toHaveLength(1);
  });

  it("renders cells for all users and all permissions", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Permissions />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find("tbody tr")).toHaveLength(1);
    // name, email, button + permissions checkboxes
    expect(wrapper.find("thead th")).toHaveLength(3 + PERMISSIONS_TYPES.length);
  });

  it("calls the mutation properly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Permissions />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    wrapper.find('input[name="test@test.test-USER"]').simulate("change", {
      target: { checked: true, value: "USER" }
    });

    await wait(10);
    wrapper.update();

    expect(wrapper.find("UserPermissions").instance().state).toMatchObject({
      permissions: ["ADMIN", "USER"]
    });
    expect(wrapper.find(".success").text()).toBe("Saved!");
  });
});
