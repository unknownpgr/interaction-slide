import React from "react";
import "./sidebar.css";

export default function Sidebar({ n, c, onClick }) {
  let dots = [];
  for (let i = 0; i < n; i++) {
    let padding = i === c ? "1rem" : "0.25rem";
    let paddingTop = 0;
    let paddingBottom = 0;

    if (i > 0) paddingTop = padding;
    if (i < n - 1) paddingBottom = padding;

    dots.push(
      <div
        onClick={() => {
          onClick(i);
        }}
        key={i}
        className={"dot"}
        style={{ paddingTop, paddingBottom }}
      >
        ●
      </div>
    );
  }
  return <div className="sidebar">{dots}</div>;
}
