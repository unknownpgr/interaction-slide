import React, { useRef, useState } from "react";
import Card from "./Card/Card";
import Sidebar from "./Sidebar/Sidebar";
import './CardInteraction.scss';

const MOVE_FILTER_GAIN = 0.9;
const QUESTIONS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
];
const QUESTION_NUMBER = QUESTIONS.length;

export default function CardInteraction() {
  const container = useRef();
  const cardContainer = useRef();
  const ghostRef = useRef();

  const [index, setIndex] = useState(0);
  const [actualScroll, setActualScroll] = useState(0);
  const [scroll, setScroll] = useState(0);

  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  const [selectedItem, setSelectedItem] = useState(null);

  const totalHeight = cardContainer.current?.clientHeight;
  const frameHeight = totalHeight / QUESTION_NUMBER;
  const windowHeight = window.innerHeight;
  let dest = index * frameHeight;

  const pickedIndex = QUESTIONS.indexOf(selectedItem);
  if (pickedIndex >= 0 && pickedIndex != index) {
    QUESTIONS[pickedIndex] = QUESTIONS[index];
    QUESTIONS[index] = selectedItem;
  }

  requestAnimationFrame(() => {
    if (isNaN(dest)) dest = 0;
    if (Math.abs(dest - actualScroll) > 0.1) {
      setActualScroll(actualScroll * MOVE_FILTER_GAIN + dest * (1 - MOVE_FILTER_GAIN));
    }

    if (Math.abs(dest - actualScroll) < 5 && selectedItem) {
      if (my < windowHeight / 3) {
        if (index > 0) {
          setIndex(index - 1);
        }
      } else if (my > windowHeight * 2 / 3) {
        if (index < QUESTION_NUMBER - 1) {
          setIndex(index + 1);
        }
      }
    }
  });

  const handleScroll = (event) => {
    const currentScroll = event.deltaY;
    if (Math.abs(dest - actualScroll) < 50) {
      if (currentScroll > 0) {
        if (currentScroll > scroll) {
          if (index < QUESTION_NUMBER - 1)
            setIndex(index + 1);
        }
      } else if (currentScroll < 0) {
        if (currentScroll < scroll) {
          if (index > 0)
            setIndex(index - 1);
        }
      }
    }
    setScroll(currentScroll);
  };

  const onMove = (event) => {
    const [x, y] = [event.clientX, event.clientY];
    if (ghostRef.current) {
      ghostRef.current.style.left = x + "px";
      ghostRef.current.style.top = y + "px";
    }
    setMx(x);
    setMy(y);
  };

  const onHandle = (event) => {
    event.preventDefault();
    setSelectedItem(QUESTIONS[index]);
  };

  return (
    <div className="card-interaction"
      onWheel={handleScroll}
      onMouseMove={onMove}
      onMouseUp={() => setSelectedItem(null)}
      onMouseLeave={() => setSelectedItem(null)}
    >
      <div className="container">
        <Sidebar
          n={QUESTION_NUMBER}
          c={index}
          onClick={(i) => {
            setIndex(i);
          }}>
        </Sidebar>
        <div className="container" ref={container}>
          <div
            className="card-container"
            ref={cardContainer}
            style={{ top: -actualScroll + frameHeight / 2 }}>
            {QUESTIONS.map((x, i) => (
              <Card key={x} msg={x} focused={index === i} onHandle={onHandle}></Card>
            ))}
          </div>
        </div>
      </div>
      <div id="ghost" ref={ghostRef} hidden={selectedItem === null}>
        <Card></Card>
      </div>
    </div>
  );
}

