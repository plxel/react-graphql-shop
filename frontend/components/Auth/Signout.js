import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ME_QUERY } from "../../graphql/query";
import { SIGN_OUT_MUTATION } from "../../graphql/mutation";

const Signout = () => {
  return (
    <Mutation
      mutation={SIGN_OUT_MUTATION}
      refetchQueries={[{ query: ME_QUERY }]}
    >
      {signout => <button onClick={signout}>Sign out</button>}
    </Mutation>
  );
};

export default Signout;
