import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { ME_QUERY } from "../graphql/query";

const User = props => (
  <Query {...props} query={ME_QUERY}>
    {payload => props.children(payload)}
  </Query>
);

User.propTypes = {
  children: PropTypes.func.isRequired
};

export default User;
