import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import { SINGLE_ITEM_QUERY } from "../graphql/query";
import { UPDATE_ITEM_MUTATION } from "../graphql/mutation";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import Form from "./styles/Form";

class UpdateItem extends Component {
  static propTypes = {
    showSuccess: PropTypes.func
  };

  static defaultProps = {
    showSuccess: () => {} // TODO implement alerts
  };

  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  handleSubmit = updateItem => async e => {
    try {
      e.preventDefault();
      const res = await updateItem({
        variables: {
          id: this.props.id,
          ...this.state
        }
      });
      if (!res.error) {
        this.props.showSuccess("Saved!");
      }
    } catch (err) {}
  };

  render() {
    const { title, description, image, largeImage, price } = this.state;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) {
            return <p>Loading...</p>;
          }
          if (!data.item) {
            return <p>No item found</p>;
          }
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={this.handleSubmit(updateItem)}>
                  <h2>Sell an Item</h2>
                  <fieldset disabled={loading} aria-busy={loading}>
                    <Error error={error} />
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        type="number"
                        id="description"
                        name="description"
                        placeholder="Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>

                    <button type="submit">
                      Sav
                      {loading ? "ing" : "e"} changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
