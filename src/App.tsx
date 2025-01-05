import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { Provider, useSelector } from 'react-redux';
import { persistor, store } from 'store';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";

import SignIn from 'pages/SignIn';
import Home from "pages/Home";
import UserProfile from "pages/UserProfile";
import Conversation from "pages/Conversation";
import SignUp from "pages/SignUp";
import UploadFile from "pages/UploadFile";
import PrimaryHeader from "components/PrimaryHeader";
import theme from "theme";
import enTranslation from 'locales/en/translation.json';
import viTranslation from 'locales/vi/translation.json';
import Settings from "pages/Settings";
import { SystemLanguage } from "constants/lang";
import { setContext } from '@apollo/client/link/context';
import { getCurrentUser } from "helpers/storeHelpers";
import OtpValidation from "pages/OtpValidation";
import LivestreamHost from "pages/LivestreamHost";

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  let currentUser = getCurrentUser();
  const token = currentUser.accessToken;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
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
  lng: SystemLanguage.EN,
  resources: {
    [SystemLanguage.EN]: { translation: enTranslation },
    [SystemLanguage.VI]: { translation: viTranslation }
  }
});

const PrivateRoute = ({ component }: { component: any }) => {
  const currentUser = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const isAuthenticated = Boolean(currentUser.accessToken);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? component : null;
};

function App() {
  // console.log(window.location.pathname == "/");

  return (
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
              <Router>
                <PrimaryHeader key="primary-header" />
                <Routes>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/livestream/:id/host" element={<PrivateRoute component={<LivestreamHost />} />} />
                  <Route path="/otp-validation" element={<OtpValidation />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/profile/:id" element={<PrivateRoute component={<UserProfile />} />} />
                  <Route path="/conversation/:id" element={<PrivateRoute component={<Conversation />} />} />
                  <Route path="/settings" element={<PrivateRoute component={<Settings />} />} />
                  <Route path="/upload" element={<UploadFile />} />
                  <Route path="/" element={<PrivateRoute component={<Home />} />} />
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
