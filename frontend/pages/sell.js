import Link from "next/link";
import CreateItem from "../components/CreateItem";
import PleaseSignin from "../components/Auth/PleaseSignin";

const Sell = props => (
  <PleaseSignin>
    <CreateItem />
  </PleaseSignin>
);

export default Sell;
