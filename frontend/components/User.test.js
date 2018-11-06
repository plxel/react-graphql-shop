import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser } from "../lib/testUtils";
import { ME_QUERY } from "../graphql/query";
import User from "./User";

const user = fakeUser();

const mocks = [
  {
    request: { query: ME_QUERY },
    result: { data: { me: user } }
  }
];

describe("<User />", () => {
  it("render child", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <User>{() => <p>Child</p>}</User>
      </MockedProvider>
    );

    expect(wrapper.text()).toContain("Child");
  });

  it("renders child and passes query payload", async () => {
    const child = jest.fn().mockReturnValue(null);
    let childArgs;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <User>
          {(...args) => {
            childArgs = [...args];
            return null;
          }}
        </User>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const payload = childArgs[0];
    expect(payload.data.me).toMatchObject(user);
    expect(payload.loading).toBeDefined();
  });
});
