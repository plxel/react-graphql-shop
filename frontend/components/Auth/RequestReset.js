import React, { Component } from "react";
import { Mutation } from "react-apollo";

import { REQUEST_PASSWORD_RESET_MUTATION } from "../../graphql/mutation";
import Form from "../styles/Form";
import Error from "../ErrorMessage";

class RequestReset extends Component {
  state = {
    email: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = requestPasswordReset => async e => {
    try {
      e.preventDefault();
      await requestPasswordReset();
      this.setState({ email: "" });
    } catch (err) {}
  };

  render() {
    return (
      <Mutation
        mutation={REQUEST_PASSWORD_RESET_MUTATION}
        variables={this.state}
      >
        {(requestPasswordReset, { error, loading, called }) => {
          return (
            <Form
              method="post"
              onSubmit={this.handleSubmit(requestPasswordReset)}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                <Error error={error} />
                {!error &&
                  !loading &&
                  called && <p>Success! Check your email for a reset link!</p>}
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Request reset!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
