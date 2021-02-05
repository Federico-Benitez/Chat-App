import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

export default function Home({ history }) {
  const dispatch = useAuthDispatch();
  const logout = () => {
    dispatch({
      type: "LOGOUT"
    });
    history.push("/login");
  };

  return (
    <Row className="bg-white justify-content-around">
      <Link to="/login">
        <Button variant="link">Login</Button>
      </Link>
      <Link to="/registro">
        <Button variant="link">Registro</Button>
      </Link>

      <Button variant="link" onClick={logout}>
        Cerrar Sesión
      </Button>
    </Row>
  );
}
