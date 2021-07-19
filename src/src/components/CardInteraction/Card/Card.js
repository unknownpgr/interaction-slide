import React from "react";
import "./Card.scss";

export default function Card({ msg, position, focused, dragged, onHandle, isGhost }) {

  let style = {};
  if (isGhost) {
    style = { transform: `translate(-105%, -50%)` };
    style.boxShadow = 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px';
  } else {
    style = { transform: `translate(-50%, -50%) translateY(${position * 300}px)` };
    if (focused) {
      if (dragged) {
        style.opacity = '0';
      } else {
        style.boxShadow = 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px';
      }
    } else {
      style.transform += ' scale(0.975)';
    }
  }

  return (
    <div className="card" style={style}>
      <h3>
        Q{msg}. Ullamco et labore dolor aliquip.
      </h3>
      <p>
        Eu in sunt id laboris laborum fugiat et. Duis quis dolore ipsum cupidatat pariatur excepteur laborum est ipsum sunt adipisicing commodo ex. Ut voluptate adipisicing veniam dolor sit laborum pariatur cupidatat. Mollit et et nisi adipisicing deserunt nisi ex aliqua nulla. Fugiat esse
      </p>
      {
        focused ? <div className="handle" onMouseDown={onHandle}> ::: </div> : null
      }
    </div>
  );
}
