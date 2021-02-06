import React, { useState } from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import moment from "moment";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
    }
  }
`;

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const recieved = !sent;
  const [showPopover, setshowPopover] = useState(false);

  const reactionIcons = [...new Set(message.reactions.map((r) => r.content))];

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => setshowPopover(false)
  });

  const react = (reaction) => {
    reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
  };

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setshowPopover}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="d-flex px-0 py-1 align-items-center react-button-popover">
            {reactions.map((reaction) => (
              <Button
                variant="link"
                className="react-icon-button"
                key={reaction}
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );

  return (
    <div
      className={classNames("d-flex my-1", {
        "ml-auto": sent,
        "mr-auto": recieved
      })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement={sent ? "left" : "right"}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
          </Tooltip>
        }
      >
        <div
          className={classNames("py-2 px-3 rounded-pill position-relative", {
            "bg-primary": sent,
            "bg-secondary": recieved
          })}
        >
          {message.reactions.length > 0 && (
            <div className="reactions-div p-1 rounded-pill">
              {reactionIcons}
            </div>
          )}
          <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
      </OverlayTrigger>
      {recieved && reactButton}
    </div>
  );
}
