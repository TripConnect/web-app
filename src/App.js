import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import { Provider, useSelector } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import i18next from "i18next";

import SignIn from 'pages/SignIn';
import Home from "pages/Home";
import UserProfile from "pages/UserProfile";
import Conversation from "pages/Conversation";
import Signup from "pages/Signup";
import { persistor, store } from 'store';
import theme from "theme";
import UploadFile from "pages/UploadFile";
import PrimaryHeader from "components/PrimaryHeader";
import { I18nextProvider } from "react-i18next";

import enTranslation from 'locales/en/translation.json';
import viTranslation from 'locales/vi/translation.json';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en',
  resources: {
    en: { translation: enTranslation },
    vi: { translation: viTranslation }
  }
});

const PrivateRoute = ({ component, ...rest }) => {
  const currentUser = useSelector((state) => state.user);
  const isAuthenticated = Boolean(currentUser.accessToken);
  return isAuthenticated ? component : <SignIn />;
};

function App() {
  return (
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
              <Router>
                <PrimaryHeader key="primary-header" />
                <Routes>
                  <Route path="/" element={<PrivateRoute component={<Home />} />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile/:id" element={<PrivateRoute component={<UserProfile />} />} />
                  <Route path="/conversation/:id" element={<PrivateRoute component={<Conversation />} />} />
                  <Route path="/upload" element={<UploadFile />} />
                </Routes>
              </Router>
            </ThemeProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </I18nextProvider>
  );
}

export default App;
