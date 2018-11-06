import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ME_QUERY } from "../../graphql/query";
import { fakeUser } from "../../lib/testUtils";
import { SIGNIN_MUTATION } from "../../graphql/mutation";

import Signin from "./Signin";

const user = fakeUser();

const mocks = [
  {
    request: {
      query: SIGNIN_MUTATION,
      variables: {
        password: user.password,
        email: user.email
      }
    },
    result: {
      data: {
        signin: user
      }
    }
  },
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: {
        me: user
      }
    }
  }
];

const mocksForError = [
  {
    request: {
      query: SIGNIN_MUTATION,
      variables: {
        password: user.password,
        email: user.email
      }
    },
    result: {
      data: null,
      errors: [
        {
          message: "Invalid password",
          path: "signin"
        }
      ]
    }
  }
];

describe("<Signin />", () => {
  it("renders", () => {
    const wrapper = mount(
      <MockedProvider>
        <Signin />
      </MockedProvider>
    );

    expect(wrapper.find("form")).toHaveLength(1);
  });

  it("calls the mutation", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <Signin />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    wrapper.find('input[name="email"]').simulate("change", {
      target: { name: "email", value: user.email }
    });

    wrapper.find('input[name="password"]').simulate("change", {
      target: { name: "password", value: user.password }
    });

    await wait();
    wrapper.update();

    wrapper.find("form").simulate("submit");

    await wait(10);
    wrapper.update();

    const signedUser = await apolloClient.query({ query: ME_QUERY });

    expect(signedUser.data.me).toMatchObject(user);
  });

  it("shows an error on error", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocksForError}>
        <Signin />
      </MockedProvider>
    );

    wrapper.find('input[name="email"]').simulate("change", {
      target: { name: "email", value: user.email }
    });

    wrapper.find('input[name="password"]').simulate("change", {
      target: { name: "password", value: user.password }
    });

    await wait();
    wrapper.update();

    wrapper.find("form").simulate("submit");

    await wait(10);
    wrapper.update();

    expect(wrapper.find('p[data-test="graphql-error"]')).toHaveLength(1);
    expect(wrapper.text()).toContain("Invalid password");
  });
});
