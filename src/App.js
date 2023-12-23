import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Welcome from './pages/Welcome';
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
