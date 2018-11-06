import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { WithQuery } from "./helpers/apollo";
import { ALL_USERS_QUERY } from "../graphql/query";
import { UPDATE_PERMISSIONS_MUTATION } from "../graphql/mutation";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

export const PERMISSIONS_TYPES = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const Permissions = () => {
  return (
    <WithQuery query={ALL_USERS_QUERY}>
      {({ data }) => {
        return (
          <div>
            <h2>Manage permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {PERMISSIONS_TYPES.map(permission => (
                    <th key={permission}>{permission}</th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <UserPermissions key={user.id} user={user} />
                ))}
              </tbody>
            </Table>
          </div>
        );
      }}
    </WithQuery>
  );
};

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string.isRequired,
      permissions: PropTypes.array.isRequired
    }).isRequired
  };

  state = {
    permissions: this.props.user.permissions,
    showSuccess: false
  };

  handleChange = updatePermissions => async e => {
    try {
      const { checked, value } = e.target;
      let updated = [...this.state.permissions];
      if (checked) {
        updated.push(value);
      } else {
        updated = updated.filter(u => u !== value);
      }
      await this.setState({ permissions: updated });
      await updatePermissions();
      await this.setState({ showSuccess: true });
      this.timeout = setTimeout(() => {
        this.setState({ showSuccess: false });
      }, 3000);
    } catch (err) {}
  };

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const { user } = this.props;
    const { showSuccess } = this.state;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{ permissions: this.state.permissions, userId: user.id }}
      >
        {(updatePermissions, { loading, error, called }) => {
          return (
            <>
              {error && (
                <tr>
                  <td colSpan={PERMISSIONS_TYPES.length + 3}>
                    <Error error={error} />
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                called &&
                showSuccess && (
                  <tr>
                    <td colSpan={PERMISSIONS_TYPES.length + 3}>
                      <p className="success">Saved!</p>
                    </td>
                  </tr>
                )}

              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {PERMISSIONS_TYPES.map(p => (
                  <td key={p}>
                    <label>
                      <input
                        type="checkbox"
                        name={`${user.email}-${p}`}
                        checked={this.state.permissions.includes(p)}
                        value={p}
                        onChange={this.handleChange(updatePermissions)}
                      />
                    </label>
                  </td>
                ))}
                <td>
                  <SickButton
                    type="button"
                    disabled={loading}
                    onClick={updatePermissions}
                  >
                    Updat
                    {loading ? "ing" : "e"}
                  </SickButton>
                </td>
              </tr>
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default Permissions;
