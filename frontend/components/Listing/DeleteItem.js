import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { ALL_ITEMS_QUERY } from "../../graphql/query";
import { DELETE_ITEM_MUTATION } from '../../graphql/mutation';

class DeleteItem extends Component {
  update = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    const { id, children } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this?")) {
                deleteItem().catch(e => alert(e.message));
              }
            }}
          >
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
