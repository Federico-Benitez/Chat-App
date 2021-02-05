import React from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const recieved = !sent;

  return (
    <OverlayTrigger
      placement={sent ? "left" : "right"}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
    >
      <div
        className={classNames("d-flex my-1", {
          "ml-auto": sent,
          "mr-auto": recieved
        })}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": recieved
          })}
        >
          <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
          </p>
          {/* <p>{moment(message.createdAt).format("h:mm a")}</p> */}
        </div>
      </div>
    </OverlayTrigger>
  );
}
