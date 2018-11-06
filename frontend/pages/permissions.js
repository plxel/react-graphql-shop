import PleaseSignin from "../components/Auth/PleaseSignin";
import Permissions from "../components/Permissions";

const PermissionsPage = props => (
  <PleaseSignin>
    <Permissions />
  </PleaseSignin>
);

export default PermissionsPage;
