import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

export default function Register() {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const submitRegisterForm = (e) => {
    e.preventDefault();
    console.log(variables);
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4} className>
        <h1 className="text-center">Registro</h1>

        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
            <Form.Text className="text-muted">
              No vamos a compartir tu email con nadie.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              value={variables.username}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value
                })
              }
            />
          </Form.Group>
          <div className="text-right">
            <Button variant="success" type="submit">
              Registrarse
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
