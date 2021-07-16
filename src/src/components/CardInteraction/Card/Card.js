import React from "react";
import "./Card.scss";

export default function Card({ msg, index, current, onHandle }) {
  const selected = index === current;
  let selectClass = selected ? '' : 'not-selected';
  return (
    <div className="card">
      <div className={"inner " + selectClass}>
        <h3>
          Q{msg}. Ullamco et labore dolor aliquip.
        </h3>
        <p>
          Eu in sunt id laboris laborum fugiat et. Duis quis dolore ipsum cupidatat pariatur excepteur laborum est ipsum sunt adipisicing commodo ex. Ut voluptate adipisicing veniam dolor sit laborum pariatur cupidatat. Mollit et et nisi adipisicing deserunt nisi ex aliqua nulla. Fugiat esse
        </p>
        {
          selected ? <div className="handle" onMouseDown={onHandle}> ::: </div> : null
        }
      </div>
    </div>
  );
}
