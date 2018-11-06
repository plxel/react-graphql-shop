import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import { CREATE_ITEM_MUTATION } from "../graphql/mutation";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import Form from "./styles/Form";

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    try {
      const files = e.target.files;
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "sickfits");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/p1xel/image/upload",
        { method: "POST", body: data }
      );
      const file = await res.json();
      this.setState({
        image: file.secure_url,
        largeImage: file.eager[0].secure_url
      });
    } catch (err) {}
  };

  render() {
    const { title, description, image, largeImage, price } = this.state;
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              try {
                // Stop the form from submitting
                e.preventDefault();
                // call the mutatuib
                const res = await createItem();
                //change them to the single item page
                Router.push({
                  pathname: "/item",
                  query: { id: res.data.createItem.id }
                });
              } catch (err) {}
            }}
          >
            <h2>Sell an Item</h2>
            <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error} />
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
                {this.state.image && (
                  <img width="200" src={image} alt="Upload preview" />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={title}
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
                  value={price}
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
                  value={description}
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
