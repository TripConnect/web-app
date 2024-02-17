import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';

import Welcome from 'pages/Welcome';
import Home from "pages/Home";
import Profile from "pages/Profile";
import Conversation from "pages/Conversation";
import SocketIOListener from 'services/SocketIOListener';
import { persistor, store } from 'store';
import theme from "theme";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
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
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
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
