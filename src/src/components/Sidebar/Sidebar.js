import React from "react";
import "./Sidebar.css";

export default function Sidebar({ n, c, onClick }) {
  let dots = [];
  for (let i = 0; i < n; i++) {
    let padding = i === c ? "2" : "0.5";
    let paddingTop = 0;
    let paddingBottom = 0;
    let color = i === c ? "#0066ff" : "#88bbff";

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
      <a href="javascript:;" className="dot-a" key={i}>
        <div
          onClick={() => {
            onClick(i);
          }}
          className="dot"
          style={{ paddingTop, paddingBottom, color }}
        >
          ●
        </div>
      </a>
    );
  }
  return <div className="sidebar">{dots}</div>;
}
