import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";
import Error from "../ErrorMessage";
import Styles from "../styles/PaginationStyles";
import { perPage } from "../../config";
import { WithQuery } from "../helpers/apollo";
import { PAGINATION_QUERY } from "../../graphql/query";

class Pagination extends Component {
  render() {
    const { page } = this.props;
    return (
      <WithQuery fetchPolicy="cache-and-network" query={PAGINATION_QUERY}>
        {({ data }) => {
          const count = data.itemsConnection.aggregate.count;
          const pages = Math.ceil(count / perPage);
          return (
            <Styles>
              <Head>
                <title>
                  Sick Fits | Page {page} of {pages}
                </title>
              </Head>
              <Link
                prefetch
                href={{
                  pathname: "items",
                  query: { page: page - 1 }
                }}
              >
                <a className="prev" aria-disabled={page <= 1}>
                  Prev
                </a>
              </Link>
              <p className="pages">
                Page {page} of {pages}
              </p>
              <p className="totalItems">{count} items total</p>
              <Link
                prefetch
                href={{
                  pathname: "items",
                  query: { page: page + 1 }
                }}
              >
                <a className="next" aria-disabled={page >= pages}>
                  Next
                </a>
              </Link>
            </Styles>
          );
        }}
      </WithQuery>
    );
  }
}

export default Pagination;
