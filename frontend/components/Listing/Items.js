import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import { theme } from "styled-tools";
import { WithQuery } from "../helpers/apollo";
import Item from "./Item";
import Pagination from "./Pagination";
import { ALL_ITEMS_QUERY } from "../../graphql/query";
import { perPage } from "../../config";

const Centered = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${theme("maxWidth")};
  margin: 0 auto;
`;

class Items extends Component {
  static propTypes = {
    page: PropTypes.number
  };

  static defaultProps = {
    page: 1
  };

  render() {
    const { page } = this.props;
    return (
      <Centered>
        <p>Items</p>
        <Pagination page={page} />
        <WithQuery
          query={ALL_ITEMS_QUERY}
          fetchPolicy="cache-and-network"
          variables={{ skip: page * perPage - perPage }}
        >
          {({ data }) => {
            return (
              <ItemsList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemsList>
            );
          }}
        </WithQuery>
        <Pagination page={page} />
      </Centered>
    );
  }
}

export default Items;
