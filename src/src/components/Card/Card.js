import React from "react";
import "./Card.css";

export default function Card({ index, current }) {
  let opacity = index === current ? '1' : '0.25'
  return (
    <div className="card" style={{ opacity }}>
      <h3>
        Q{index}. Ullamco et labore dolor aliquip.
      </h3>
      <p>
        Eu in sunt id laboris laborum fugiat et. Duis quis dolore ipsum cupidatat pariatur excepteur laborum est ipsum sunt adipisicing commodo ex. Ut voluptate adipisicing veniam dolor sit laborum pariatur cupidatat. Mollit et et nisi adipisicing deserunt nisi ex aliqua nulla. Fugiat esse ß
      </p>
    </div>
  );
}
