import React, { Component } from "react";
import Head from "next/head";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { SINGLE_ITEM_QUERY } from "../graphql/query";
import Error from "./ErrorMessage";

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${p => p.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

class SingleItem extends Component {
  render() {
    const { id } = this.props;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ error, loading, data }) => {
          if (error) {
            return <Error error={error} />;
          }
          if (loading) {
            return <p>Loading...</p>;
          }
          if (!data.item) {
            return <p>No item found</p>;
          }
          const { item } = data;
          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    );
  }
}

export default SingleItem;