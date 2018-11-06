import { WithQuery } from "../helpers/apollo";
import { ME_QUERY } from "../../graphql/query";
import Signin from "./Signin";

const PleaseSignin = props => (
  <WithQuery query={ME_QUERY}>
    {({ data }) => {
      if (!data.me) {
        return (
          <div>
            <p>Please Sign In before continuing</p>
            <Signin />
          </div>
        );
      }
      return props.children;
    }}
  </WithQuery>
);

export default PleaseSignin;
