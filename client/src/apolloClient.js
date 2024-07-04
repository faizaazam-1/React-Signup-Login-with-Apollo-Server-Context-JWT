import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'

//link of the authentication server

const httpLink = createHttpLink({
    uri: "http://localhost:5000/"
});

// Set up the authentication link
const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists  
    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: localStorage.getItem("token") || ""
      }
    };
  });

  // Initialize the Apollo Client
const client = new ApolloClient({

    // Combine the auth link and the HTTP link
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  
});

export default client;