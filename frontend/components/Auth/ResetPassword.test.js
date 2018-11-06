import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ME_QUERY } from "../../graphql/query";
import { fakeUser } from "../../lib/testUtils";
import { RESET_PASSWORD_MUTATION } from "../../graphql/mutation";

import ResetPassword from "./ResetPassword";

const user = fakeUser();

const mocks = [
  {
    request: {
      query: RESET_PASSWORD_MUTATION,
      variables: {
        resetToken: "resetPasswordTestToken",
        password: "pass123",
        confirmPassword: "pass123"
      }
    },
    result: {
      data: {
        resetPassword: {
          __typename: "User",
          id: "4234",
          email: user.email,
          name: user.name
        }
      }
    }
  },
  {
    request: {
      query: ME_QUERY
    },
    result: {
      data: {
        me: { ...user }
      }
    }
  }
];

const mocksForError = [
  {
    request: {
      query: RESET_PASSWORD_MUTATION,
      variables: {
        resetToken: "resetPasswordTestToken",
        password: "pass123",
        confirmPassword: "pass123"
      }
    },
    result: {
      data: null,
      errors: [{
        message: "This token is either invalid or expired",
        path: 'resetPassword',
      }]
    }
  },
];

describe("<ResetPassword />", () => {
  it("renders", () => {
    const wrapper = mount(
      <MockedProvider>
        <ResetPassword resetToken="resetPasswordTestToken" />
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
            return <ResetPassword resetToken="resetPasswordTestToken" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    wrapper.find('input[name="password"]').simulate("change", {
      target: { name: "password", value: "pass123" }
    });

    wrapper.find('input[name="confirmPassword"]').simulate("change", {
      target: { name: "confirmPassword", value: "pass123" }
    });

    await wait();
    wrapper.update();

    wrapper.find("form").simulate("submit");

    await wait();
    wrapper.update();

    const signedUser = await apolloClient.query({ query: ME_QUERY });

    expect(signedUser.data.me).toMatchObject(user);
  });

  it('shows an error on error', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocksForError}>
        <ResetPassword resetToken="resetPasswordTestToken" />
      </MockedProvider>
    );

    wrapper.find('input[name="password"]').simulate("change", {
      target: { name: "password", value: "pass123" }
    });

    wrapper.find('input[name="confirmPassword"]').simulate("change", {
      target: { name: "confirmPassword", value: "pass123" }
    });

    await wait();
    wrapper.update();

    wrapper.find("form").simulate("submit");

    await wait();
    wrapper.update();

    expect(wrapper.find('p[data-test="graphql-error"]')).toHaveLength(1);
    expect(wrapper.text()).toContain("This token is either invalid or expired");
  })
});
