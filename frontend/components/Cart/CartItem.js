import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { theme } from "styled-tools";

import formatMoney from "../../lib/formatMoney";
import RemoveFromCart from "./RemoveFromCart";

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${theme("lightgrey")};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

class CartItem extends Component {
  render() {
    const {
      cartItem: { id, quantity, item }
    } = this.props;
    if (!item) {
      return (
        <CartItemStyles>
          <span>This Item has been removed</span>
          <RemoveFromCart id={id} />
        </CartItemStyles>
      );
    }

    return (
      <CartItemStyles>
        <img width="100" src={item.image} alt="" />
        <div className="details">
          <h3>{item.title}</h3>
          <p>
            {formatMoney(item.price * quantity)}
            {" - "}
            <em>
              {quantity} &times; {formatMoney(item.price)} each
            </em>
          </p>
        </div>
        <RemoveFromCart id={id} />
      </CartItemStyles>
    );
  }
}

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
};

export default CartItem;
