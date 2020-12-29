import React from "react";

import { WebSocketLink } from "@apollo/client/link/ws";

import {} from "@apollo/react-hooks";
// import {ApolloClient,createHttpLink,split, ApolloLink} from "@apollo/client"
import {
  ApolloProvider,
  HttpLink,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  NormalizedCacheObject,
} from "@apollo/client";

import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Layout } from "./components/Layout";

const wsClient = new SubscriptionClient(
  "ws://https://messaging-app.hasura.app/v1/graphql",
  {
    reconnect: true,
  }
);

const wsLink = new WebSocketLink(wsClient);

const httpLink = new HttpLink({
  uri: "https://messaging-app.hasura.app/v1/graphql",
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) as any;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  httpLink,
  wsLink
);

// const link = ApolloLink.from([errorLink, authLink.concat(httpLink)]);

const client = new ApolloClient<NormalizedCacheObject>({
  link: ApolloLink.from([link]),
  cache: new InMemoryCache(),
});

export function RootProvider() {
  return (
    <ApolloProvider client={client}>
      {/* {Children} */}
      <Layout />
    </ApolloProvider>
  );
}
