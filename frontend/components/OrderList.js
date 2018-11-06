import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { formatDistance } from "date-fns";
import Link from "next/link";
import styled from "styled-components";
import { ORDER_LIST_QUERY } from "../graphql/query";
import formatMoney from "../lib/formatMoney";
import { WithQuery } from "./helpers/apollo";
import Error from "./ErrorMessage";
import OrderItemStyles from "./styles/OrderItemStyles";

const Grid = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
  padding: 0;
`;

class OrderList extends Component {
  render() {
    return (
      <WithQuery query={ORDER_LIST_QUERY}>
        {({ data: { orders } }) => {
          return (
            <div>
              <h2>
                You have {orders.length} order
                {orders.length > 1 ? "s" : ""}
              </h2>
              <Grid>
                {orders.map(order => (
                  <OrderItemStyles key={order.id}>
                    <Link
                      href={{ pathname: "/order", query: { id: order.id } }}
                    >
                      <a>
                        <div className="order-meta">
                          <p>
                            {order.items.reduce(
                              (acc, item) => acc + item.quantity,
                              0
                            )}{" "}
                            Items
                          </p>
                          <p>{order.items.length} Products</p>
                          <p>{formatDistance(order.createdAt, new Date())}</p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.title}
                            />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </Grid>
            </div>
          );
        }}
      </WithQuery>
    );
  }
}

export default OrderList;
