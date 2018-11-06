import Link from "next/link";
import Order from "../components/Order";
import PleaseSignin from "../components/Auth/PleaseSignin";

const OrderPage = props => (
  <PleaseSignin>
    <Order id={props.query.id} />
  </PleaseSignin>
);

export default OrderPage;
