import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ADD_TO_CART_MUTATION } from "../../graphql/mutation";
import { ME_QUERY } from "../../graphql/query";

class AddToCart extends React.Component {
  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{ id }}
        refetchQueries={[{ query: ME_QUERY }]}
      >
        {(addToCart, { loading }) => (
          <button disabled={loading} onClick={addToCart}>
            Add
            {loading ? "ing" : ""} To Cart
          </button>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;
