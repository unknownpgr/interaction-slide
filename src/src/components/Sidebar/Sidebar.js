import React from "react";
import "./sidebar.css";

export default function Sidebar({ n, c, onClick }) {
  let dots = [];
  for (let i = 0; i < n; i++) {
    let padding = i === c ? "1" : "0.25";
    let paddingTop = 0;
    let paddingBottom = 0;

    if (i === 0) {
      paddingTop = 0 + "rem";
      paddingBottom = padding * 2 + "rem";
    } else if (i === n - 1) {
      paddingTop = padding * 2 + "rem";
      paddingBottom = 0 + "rem";
    } else {
      paddingTop = padding + "rem";
      paddingBottom = padding + "rem";
    }

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
