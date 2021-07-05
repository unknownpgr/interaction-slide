import React, { useRef, useState } from "react";
import Card from "../Card/Card";
import "./App.css";
import Sidebar from "../Sidebar/Sidebar";

export default function App() {
  const container = useRef();
  const cardContainer = useRef();
  const [scroll, setScroll] = useState(0);
  const [actualScroll, setActualScroll] = useState(0);

  const totalHeight = cardContainer.current?.clientHeight;
  const frameHeight = totalHeight / 6;

  const rate = 0.9;

  let index = Math.floor(scroll / frameHeight);

  requestAnimationFrame(() => {
    let dest = index * frameHeight;
    if (isNaN(dest)) dest = 0;
    if (Math.abs(dest - actualScroll) > 0.1)
      setActualScroll(actualScroll * rate + dest * (1 - rate));
  });

  const handleScroll = (event) => {
    let newScroll = scroll + event.deltaY / 5;
    if (newScroll < 0) newScroll = 0;
    if (cardContainer.current != null) {
      let height = totalHeight - frameHeight;
      if (newScroll > height) newScroll = height;
    }
    setScroll(newScroll);
  };

  return (
    <div className="app" onWheel={handleScroll}>
      <Sidebar
        n={6}
        c={index}
        onClick={(i) => {
          setScroll(frameHeight * i);
        }}
      ></Sidebar>
      <div className="container" ref={container}>
        <div
          className="card-container"
          ref={cardContainer}
          style={{ top: -actualScroll }}
        >
          {[1, 2, 3, 4, 5, 6].map((x) => (
            <Card key={x} index={x}></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
