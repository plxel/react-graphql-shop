import Link from "next/link";
import { Mutation } from "react-apollo";
import calcTotalCartItems from '../../lib/calcTotalCartItems';
import User from "../User";
import Signout from "../Auth/Signout";
import { TOGGLE_CART_MUTATION } from "../Cart/Cart";
import CartCount from './CartCount';
import NavStyles from "../styles/NavStyles";

const Nav = () => {
  return (
    <User>
      {({ data, error }) => {
        return (
          <NavStyles>
            <Link href="/items">
              <a>Shop</a>
            </Link>

            {!error &&
              data.me && (
                <>
                  <Link href="/sell">
                    <a>Sell</a>
                  </Link>
                  <Link href="/orders">
                    <a>Orders</a>
                  </Link>
                  <Link href="/me">
                    <a>Account</a>
                  </Link>
                  <Signout />
                  <Mutation mutation={TOGGLE_CART_MUTATION}>
                    {toggleCart => (
                      <button onClick={toggleCart}>
                        My Cart
                        <CartCount count={calcTotalCartItems(data.me.cart)} />
                      </button>
                    )}
                  </Mutation>
                </>
              )}
            {(!data || !data.me) && (
              <Link href="/signup">
                <a>Sign In</a>
              </Link>
            )}
          </NavStyles>
        );
      }}
    </User>
  );
};

export default Nav;
