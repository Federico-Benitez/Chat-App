import React, { useEffect, Fragment, useState } from "react";

import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Col, Form } from "react-bootstrap";

import { useMessageDispatch, useMessageState } from "../../context/message";

import Message from "./Message";

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

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

export default function Messages() {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState("");

  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData }
  ] = useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) =>
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: selectedUser.username,
          message: data.sendMessage
        }
      }),
    onError: (err) => console.log(err)
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages
        }
      });
    }
  }, [messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;

    setContent("");

    //mutation for sending message
    sendMessage({ variables: { to: selectedUser.username, content } });
  };

  let selectChatMarkup;
  if (!messages && !messagesLoading) {
    selectChatMarkup = <p className="info-text">Elije a un amigo</p>;
  } else if (messagesLoading) {
    selectChatMarkup = <p className="info-text">Cargando..</p>;
  } else if (messages.length > 0) {
    selectChatMarkup = messages.map((message, index) => (
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0 " />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectChatMarkup = (
      <p className="info-text">
        Aun no tienes una conversacion con esta persona, enviale un mensaje!
      </p>
    );
  }

  return (
    <Col xs={10} md={8}>
      <div className="messages-box d-flex flex-column-reverse">
        {selectChatMarkup}
      </div>
      <div>
        {selectedUser ? (
          <Form onSubmit={submitMessage}>
            <Form.Group className="d-flex align-items-center">
              <Form.Control
                type="text"
                className="message-input rounded-pill p-4 bg-secondary border-0"
                placeholder="Escribe un mensaje.."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <i
                className="icon-send fas fa-chevron-circle-right fa-3x text-primary ml-2"
                onClick={submitMessage}
                role="button"
              ></i>
            </Form.Group>
          </Form>
        ) : (
          <div></div>
        )}
      </div>
    </Col>
  );
}
