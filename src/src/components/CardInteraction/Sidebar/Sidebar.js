import React from "react";
import "./Sidebar.scss";

/**
 * Let
 *    default margin = dm
 *    additional margin = am
 *    total length   = L
 * 
 * Then L = dm * (n-1) + am * 2
 * Suppose that am = dm * r.
 * Then L = dm * (n-1) + dm * r * 2
 *        = dm * (n-1+r*2)
 * 
 * Therefore dm = L / (n-1+r*2)
 */

const SIDEBAR_HEIGHT = 200;
const ADDITIONAL_MARGIN_RATE = 1;

export default function Sidebar({ n, c, onClick }) {

  // Calculate default margin(dm) and additional marign(am)
  const dm = SIDEBAR_HEIGHT / (n - 1 + ADDITIONAL_MARGIN_RATE * 2);
  const am = dm * ADDITIONAL_MARGIN_RATE;

  let dots = [];
  let y = 0;

  for (let i = 0; i < n; i++) {
    const selected = i === c;
    let mt = dm;
    let mb = dm;

    // Calculate upper margin and lower margin
    if (i === 0) {
      mt = 0;
      if (selected) {
        mb += am * 2;
      }
    } else if (i === n - 1) {
      mb = 0;
      if (selected) {
        mt += am * 2;
      }
    } else {
      if (selected) {
        mb += am;
        mt += am;
      }
    }

    // Add upper margin
    y += mt;

    // Place component
    dots.push(
      <button
        className="dot"
        onClick={() => { onClick(i); }}
        key={i}
        style={{
          transform: `translate(-50%,-50%) translateY( ${y}px)`,
          color: selected ? "rgb(0,102,255)" : "rgb(204,224,255)"
        }}
      >
        ●
      </button>
    );

    // Add lower margin
    y += mb;
  }

  return (
    <div className="sidebar" style={{ height: y }}>
      {dots}
      < div className="bar" ></div >
    </div >
  );
}
