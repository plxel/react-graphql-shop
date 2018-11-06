import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import { SIGNUP_MUTATION } from "../../graphql/mutation";
import { ME_QUERY } from "../../graphql/query";
import { fakeUser } from "../../lib/testUtils";
import Signup from "./Signup";

function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: {
      name,
      value
    }
  });
}

const user = fakeUser();

const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: user.email,
        name: user.name,
        password: "123"
      }
    },
    result: {
      data: {
        signup: {
          __typename: "User",
          id: "12345",
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

describe("<Signup />", () => {
  it("renders", () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );

    expect(wrapper.find("form")).toHaveLength(1);
  });

  it("calls the mutation properly", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    await wait();

    type(wrapper, "name", user.name);
    type(wrapper, "email", user.email);
    type(wrapper, "password", "123");

    await wait();

    wrapper.find("form").simulate("submit");

    await wait();
    await wait();
    await wait();

    const signedUser = await apolloClient.query({ query: ME_QUERY });

    expect(signedUser.data.me).toMatchObject(user);
  });
});
