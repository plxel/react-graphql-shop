import { Query, Mutation } from "react-apollo";
import Error from "../ErrorMessage";

export const WithQuery = ({ children, ...props }) => (
  <Query {...props}>
    {({ data, loading, error }) => {
      if (error) {
        return <Error error={error} />;
      }

      if (loading) {
        return <p>Loading...</p>;
      }

      return children({ data });
    }}
  </Query>
);
