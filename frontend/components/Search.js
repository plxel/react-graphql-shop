import React, { Component } from "react";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { SEARCH_ITEMS_QUERY } from "../graphql/query";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

function routeToItem(item) {
  Router.push({
    pathname: "/item",
    query: {
      id: item.id
    }
  });
}

class AutoComplete extends Component {
  state = {
    items: [],
    loading: false
  };

  onChange = debounce(async (e, client) => {
    try {
      await this.setState({ loading: true });

      const response = await client.query({
        query: SEARCH_ITEMS_QUERY,
        variables: { searchTerm: e.target.value }
      });
      this.setState({ items: response.data.items, loading: false });
    } catch (err) {}
  }, 350);

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          itemToString={item => (item ? item.title : "")}
          onChange={routeToItem}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: "search",
                      placeholder: "Search for an item",
                      id: "search",
                      className: this.state.loading ? "loading" : "",
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>

              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      key={item.id}
                      {...getItemProps({ item })}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {this.state.items.length === 0 &&
                    !this.state.loading && (
                      <DropDownItem>
                        Nothing found for {inputValue}
                      </DropDownItem>
                    )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
