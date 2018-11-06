import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { ME_QUERY } from "../../graphql/query";
import { SIGN_OUT_MUTATION } from "../../graphql/mutation";

import Signout from "./Signout";

const mocks = [
  {
    request: {
      query: SIGN_OUT_MUTATION
    },
    result: {
      data: {
        signout: {
          __typename: 'Message',
          message: "Googbye!"
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
        me: null,
      }
    }
  }
];

describe("<Signout />", () => {
  it("renders", () => {
    const wrapper = mount(
      <MockedProvider>
        <Signout />
      </MockedProvider>
    );

    expect(wrapper.find("button").text()).toBe("Sign out");
  });

  it("calls the mutation", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <Signout />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    wrapper.find("button").simulate("click");

    await wait(10);
    wrapper.update();

    const signedUser = await apolloClient.query({ query: ME_QUERY });

    expect(signedUser.data.me).toBe(null);
  });
});
