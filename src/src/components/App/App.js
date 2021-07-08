import React, { useRef, useState } from "react";
import Card from "../Card/Card";
import "./App.css";
import Sidebar from "../Sidebar/Sidebar";

const MOVE_FILTER_GAIN = 0.9;
const QUESTION_NUMBER = 6;

export default function App() {
  const container = useRef();
  const cardContainer = useRef();

  const [index, setIndex] = useState(0);
  const [actualScroll, setActualScroll] = useState(0);
  const [scroll, setScroll] = useState(0);

  const totalHeight = cardContainer.current?.clientHeight;
  const frameHeight = totalHeight / QUESTION_NUMBER;
  let dest = index * frameHeight;

  requestAnimationFrame(() => {
    if (isNaN(dest)) dest = 0;
    if (Math.abs(dest - actualScroll) > 0.1)
      setActualScroll(
        actualScroll * MOVE_FILTER_GAIN + dest * (1 - MOVE_FILTER_GAIN)
      );
  });

  const handleScroll = (event) => {
    const currentScroll = event.deltaY;
    if (Math.abs(dest - actualScroll) < 50) {
      if (currentScroll > 0) {
        if (currentScroll > scroll) {
          if (index < QUESTION_NUMBER - 1) setIndex(index + 1);
        }
      } else if (currentScroll < 0) {
        if (currentScroll < scroll) {
          if (index > 0) setIndex(index - 1);
        }
      }
    }
    setScroll(currentScroll);
  };

  return (
    <div className="app" onWheel={handleScroll}>
      <Sidebar
        n={QUESTION_NUMBER}
        c={index}
        onClick={(i) => {
          setIndex(i);
        }}
      ></Sidebar>
      <div className="container" ref={container}>
        <div
          className="card-container"
          ref={cardContainer}
          style={{ top: -actualScroll + frameHeight / 2 }}
        >
          {new Array(QUESTION_NUMBER).fill(0).map((_, i) => (
            <Card key={i} index={i + 1} current={index + 1}></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
