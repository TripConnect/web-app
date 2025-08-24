import {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import {Provider, useSelector} from 'react-redux';
import {persistor, RootState, store} from 'store';
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from '@apollo/client';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider} from '@mui/material/styles';
import i18next from "i18next";
import {I18nextProvider} from "react-i18next";
import Index from './pages/sign-in';
import Home from "pages/Home";
import UserProfile from "pages/UserProfile";
import {Conversation} from "pages/conversation";
import {SignUp} from "./pages/sign-up";
import UploadFile from "pages/UploadFile";
import theme from "theme";
import enTranslation from 'locales/en/translation.json';
import viTranslation from 'locales/vi/translation.json';
import Settings from "pages/Settings";
import {SystemLanguage} from "constants/lang";
import {setContext} from '@apollo/client/link/context';
import OtpValidation from "pages/OtpValidation";
import LivestreamHost from "pages/LivestreamHost";
import Header from "./shared/components/Header";

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
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
  interpolation: {escapeValue: false}, // React already does escape
  lng: SystemLanguage.EN,
  resources: {
    [SystemLanguage.EN]: {translation: enTranslation},
    [SystemLanguage.VI]: {translation: viTranslation}
  }
});

const AuthRoute = ({component}: { component: JSX.Element }) => {
  const currentUser = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const isAuthenticated = !!currentUser.userId;

  useEffect(() => {

    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? component : null;
};

function App() {
  return (
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
              <Router>
                <Header key="primary-header"/>
                <Routes>
                  <Route path="/signup" element={<SignUp/>}/>
                  <Route path="/signin" element={<Index/>}/>
                  <Route path="/livestream/:id/host" element={<AuthRoute component={<LivestreamHost/>}/>}/>
                  <Route path="/otp-validation" element={<OtpValidation/>}/>
                  <Route path="/profile/:id" element={<AuthRoute component={<UserProfile/>}/>}/>
                  <Route path="/conversation/:id" element={<AuthRoute component={<Conversation/>}/>}/>
                  <Route path="/settings" element={<AuthRoute component={<Settings/>}/>}/>
                  <Route path="/upload" element={<UploadFile/>}/>
                  <Route path="/" element={<AuthRoute component={<Home/>}/>}/>
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
