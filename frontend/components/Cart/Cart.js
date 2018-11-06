import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";
import calcTotalPrice from "../../lib/calcTotalPrice";
import formatMoney from "../../lib/formatMoney";
import User from "../User";
import CartItem from "./CartItem";
import TakeMyMoney from "../TakeMyMoney";
import CartStyles from "../styles/CartStyles";
import Supreme from "../styles/Supreme";
import CloseButton from "../styles/CloseButton";
import SickButton from "../styles/SickButton";

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

// to hide warning about required children prop
const noop = () => {};

const Composed = adopt({
  user: <User children={noop}/>,
  toggleCart: <Mutation mutation={TOGGLE_CART_MUTATION} children={noop}/>,
  localState: <Query query={LOCAL_STATE_QUERY} children={noop} />
});

class Cart extends Component {
  render() {
    return (
      <Composed>
        {({ user, toggleCart, localState }) => {
          const { me } = user.data;
          if (!me) {
            return null;
          }
          return (
            <CartStyles open={localState.data.cartOpen}>
              <header>
                <CloseButton title="Close" onClick={toggleCart}>
                  &times;
                </CloseButton>
                <Supreme>
                  {me.name}
                  's Cart
                </Supreme>
                <p>
                  Your have {me.cart.length} Item
                  {me.cart.length === 1 ? "" : "s"} in your cart.
                </p>
              </header>
              <ul>
                {me.cart.map(cartItem => (
                  <CartItem key={cartItem.id} cartItem={cartItem} />
                ))}
              </ul>
              <footer>
                <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                {me.cart.length > 0 && (
                  <TakeMyMoney>
                    <SickButton>Checkout</SickButton>
                  </TakeMyMoney>
                )}
              </footer>
            </CartStyles>
          );
        }}
      </Composed>
    );
  }
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
