import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Col, Image } from "react-bootstrap";
import classNames from "classnames";

import { useMessageDispatch, useMessageState } from "../../context/message";

const defaultPicture =
  "https://www.hostpapa.com/knowledgebase/wp-content/uploads/2018/04/1-13.png";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

export default function Users() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (err) => console.log(err)
  });

  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Cargando..</p>;
  } else if (users.length === 0) {
    usersMarkup = <p>No hay usuarios aun</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          className={classNames(
            "user-div d-flex justify-content-center  justify-content-md-start  p-3",
            {
              "bg-white": selected
            }
          )}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={user.imageUrl || defaultPicture}
            className="user-image "
          />
          <div className="d-none d-md-block ml-2">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "Enviale un mensaje!"}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  );
}
