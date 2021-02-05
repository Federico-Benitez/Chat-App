import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import "./App.scss";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";

import { AuthProvider } from "./context/auth";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Switch>
              <Route path="/registro" component={Register} />
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
