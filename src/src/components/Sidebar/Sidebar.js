import React from "react";
import "./sidebar.css";

export default function Sidebar({ n, c, onClick }) {
  let dots = [];
  for (let i = 0; i < n; i++) {
    let padding = i === c ? "1rem" : "0.25rem";
    dots.push(
      <div
        onClick={() => {
          onClick(i);
        }}
        key={i}
        className={"dot"}
        style={{ paddingBottom: padding, paddingTop: padding }}
      >
        ●
      </div>
    );
  }
  return <div className="sidebar">{dots}</div>;
}
