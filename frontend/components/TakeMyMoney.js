import React, { Component } from "react";
import PropTypes from "prop-types";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import NProgress from "nprogress";
import { ME_QUERY } from "../graphql/query";
import { CREATE_ORDER_MUTATION } from "../graphql/mutation";
import calcTotalPrice from "../lib/calcTotalPrice";
import calcTotalCartItems from "../lib/calcTotalCartItems";
import Error from "./ErrorMessage";
import User from "./User";

class TakeMyMoney extends Component {
  onToken = async (res, createOrder) => {
    NProgress.start();
    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => alert(err.message));

    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id }
    });
  };

  render() {
    return (
      <User>
        {({ data, loading }) => {
          if (loading) {
            return <p>Loading...</p>;
          }

          if (!data.me) {
            return null;
          }

          const { me } = data;
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: ME_QUERY }]}
            >
              {createOrder => (
                <StripeCheckout
                  amount={calcTotalPrice(me.cart)}
                  name="Sick Fits"
                  description={`Order of ${calcTotalCartItems(me.cart)} items`}
                  image={
                    me.cart &&
                    me.cart.length &&
                    me.cart[0].item &&
                    me.cart[0].item.image
                  }
                  stripeKey="pk_test_HL9ul3VgxnVKaQLNCb25JdqR"
                  currency="USD"
                  email={me.email}
                  token={res => this.onToken(res, createOrder)}
                >
                  {this.props.children}
                </StripeCheckout>
              )}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

export default TakeMyMoney;
