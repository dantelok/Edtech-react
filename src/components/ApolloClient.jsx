import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import CalendarPage from '../pages/CalendarPage.jsx';

// Set up Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000', // The URI of your GraphQL server
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <CalendarPage />
  </ApolloProvider>
);

export default App;