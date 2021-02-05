import React, { useEffect, useState, Fragment } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";

import { useAuthDispatch } from "../../context/auth";
import Users from "./Users";

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

export default function Home({ history }) {
  const dispatch = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData }
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  if (messagesData) console.log(messagesData.getMessages);

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Iniciar Sesión</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Registrarse</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Row>
      <Row className="bg-white">
        <Users setSelectedUser={setSelectedUser} />
        <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((message) => (
              <p key={message.uuid}>{message.content}</p>
            ))
          ) : (
            <p>Mensajes</p>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
