import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import "./App.scss";
import Register from "./pages/Register";
import Home from "./pages/home/Home";
import Login from "./pages/Login";

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./util/DynamicRoute";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <DynamicRoute path="/registro" component={Register} guest />
                <DynamicRoute exact path="/" component={Home} authenticated />
                <DynamicRoute path="/login" component={Login} guest />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
