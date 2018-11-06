import Link from "next/link";
import OrderList from "../components/OrderList";
import PleaseSignin from "../components/Auth/PleaseSignin";

const OrdersPage = props => (
  <PleaseSignin>
    <OrderList />
  </PleaseSignin>
);

export default OrdersPage;
