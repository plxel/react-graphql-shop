import React, { Component } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { format } from "date-fns";
import Head from "next/head";
import { WithQuery } from "./helpers/apollo";
import { SINGLE_ORDER_QUERY } from "../graphql/query";
import formatMoney from "../lib/formatMoney";
import OrderStyles from "./styles/OrderStyles";

class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };
  render() {
    return (
      <WithQuery query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
        {({ data: { order } }) => (
          <OrderStyles>
            <Head>
              <title>Sick Fits - Order {order.id}</title>
            </Head>
            <p>
              <span>Order ID:</span>
              <span>{this.props.id}</span>
            </p>
            <p>
              <span>Charge:</span>
              <span>{order.charge}</span>
            </p>
            <p>
              <span>Date:</span>
              <span>{format(order.createdAt, "MMMM D, YYYY h:mm a")}</span>
            </p>
            <p>
              <span>Order total:</span>
              <span>{formatMoney(order.total)}</span>
            </p>
            <p>
              <span>Item count:</span>
              <span>{order.items.length}</span>
            </p>
            <div className="items">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h2>{item.title}</h2>
                    <p>Qty: {item.quantity}</p>
                    <p>Each: {formatMoney(item.price)}</p>
                    <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </OrderStyles>
        )}
      </WithQuery>
    );
  }
}

export default Order;
