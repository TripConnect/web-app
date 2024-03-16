import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';

import Welcome from 'pages/Welcome';
import Home from "pages/Home";
import UserProfile from "pages/UserProfile";
import Conversation from "pages/Conversation";
import Signup from "pages/Signup";
import SocketIOListener from 'services/SocketIOListener';
import { persistor, store } from 'store';
import theme from "theme";
import UploadFile from "pages/UploadFile";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  }),
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <SocketIOListener />
            <Router>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/upload" element={<UploadFile />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/conversation" element={<Conversation />} />
              </Routes>
            </Router>
          </ThemeProvider>,
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
