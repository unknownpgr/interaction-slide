import React, { useRef, useState } from "react";
import Card from "../Card/Card";
import "./App.css";
import Sidebar from "../Sidebar/Sidebar";

const MOVE_FILTER_GAIN = 0.9;
const QUESTION_NUMBER = 6;

export default function App() {
  const container = useRef();
  const cardContainer = useRef();
  const [scroll, setScroll] = useState(0);
  const [actualScroll, setActualScroll] = useState(0);

  const totalHeight = cardContainer.current?.clientHeight;
  const frameHeight = totalHeight / QUESTION_NUMBER;

  let index = Math.floor(scroll / frameHeight);

  requestAnimationFrame(() => {
    let dest = index * frameHeight;
    if (isNaN(dest)) dest = 0;
    if (Math.abs(dest - actualScroll) > 0.1)
      setActualScroll(
        actualScroll * MOVE_FILTER_GAIN + dest * (1 - MOVE_FILTER_GAIN)
      );
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
        n={QUESTION_NUMBER}
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
          {new Array(QUESTION_NUMBER).fill(0).map((_, x) => (
            <Card key={x} index={x}></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
