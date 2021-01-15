import React from "react";
import { Layout } from "./components/Layout";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";

// import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from "apollo-utilities";

// import {ApolloClient,createHttpLink,split, ApolloLink} from "@apollo/client"
// import {  HttpLink, ApolloClient, ApolloLink, InMemoryCache, split,  NormalizedCacheObject } from '@apollo/client';

// import { SubscriptionClient } from "subscriptions-transport-ws";
import { StoreContextProvider } from "./store/store";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import config from './auth_config.json';
import { createBrowserHistory } from 'history';
import { setContext } from 'apollo-link-context';
import createAuth0Client from '@auth0/auth0-spa-js';

const history = createBrowserHistory();


const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret':process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,

      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});


const HASURA_SECRET = process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET;
console.log(`${HASURA_SECRET}`);

const wsLink = new WebSocketLink({
  uri: `ws://${process.env.REACT_APP_HASURA_ENDPOINT}`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret':process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
        Authorization: `Bearer ${localStorage.getItem('token')}`

      },
    },
  },
});
const httpLink = new HttpLink({
  uri: `https://${process.env.REACT_APP_HASURA_ENDPOINT}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
  });

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) as any;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

// const link = ApolloLink.from([errorLink, authLink.concat(httpLink)]);

const client = new ApolloClient<NormalizedCacheObject>({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

const App: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    createAuth0Client(config).then(async auth0 => {
      let user;
      if (window.location.search.includes('code=')) {
        await auth0.handleRedirectCallback();
        user = await auth0.getUser();
        setUser({ username: user!.nickname, id: user!.sub, auth0});
        history.replace('/');
      }
      const isAuthenticated = await auth0.isAuthenticated();
      if (!isAuthenticated) {
        auth0.loginWithRedirect({ redirect_uri: "http://localhost:3000" });
      } else {
        user = await auth0.getUser();
        const token = (auth0 as any).cache.cache[
          'default::openid profile email'
        ].id_token;
        localStorage.setItem('token', token);
        setUser({ username: user!.nickname, id: user!.sub, auth0 });
      }
    });
  }, []);

  return (
    <StoreContextProvider user={user}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <Layout />
          </div>
        </ThemeProvider>
      </ApolloProvider>
    </StoreContextProvider>
  );
};

export default App;
