import React, { useRef, useState } from "react";
import Card from "./Card/Card";
import Sidebar from "./Sidebar/Sidebar";
import './CardInteraction.scss';

const MOVE_FILTER_GAIN = 0.9;
const QUESTION_NUMBER = 6;
const MOVE_TIME = 500;

export default function CardInteraction() {
  const ghostRef = useRef();

  const [index, setIndex] = useState(0);
  const [my, setMy] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [questions, setQuestions] = useState([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ]);

  const windowHeight = window.innerHeight;

  const moveTo = dest => {
    setIndex(dest);
    setIsMoving(true);
    setTimeout(() => {
      setIsMoving(false);
    }, MOVE_TIME);
  };

  const handleScroll = (event) => {
    const currentScroll = event.deltaY;
    if (!isMoving) {
      if (currentScroll > 0) {
        if (currentScroll > scroll) {
          if (index < QUESTION_NUMBER - 1)
            moveTo(index + 1);
        }
      } else if (currentScroll < 0) {
        if (currentScroll < scroll) {
          if (index > 0)
            moveTo(index - 1);
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

    let destIndex = index;
    if (!isMoving && selectedItem) {
      if (my < windowHeight / 3) {
        if (index > 0) {
          destIndex = index - 1;
        }
      } else if (my > windowHeight * 2 / 3) {
        if (index < QUESTION_NUMBER - 1) {
          destIndex = index + 1;
        }
      }

      let selectedIndex = questions.indexOf(selectedItem);
      if (selectedIndex >= 0) {
        let newQuestions = [...questions];
        newQuestions[selectedIndex] = newQuestions[destIndex];
        newQuestions[destIndex] = selectedItem;
        setQuestions(newQuestions);
      }
      moveTo(destIndex);
    }

    setMy(y);
  };

  const onHandle = (event) => {
    event.preventDefault();
    setSelectedItem(questions[index]);
  };

  const sorted = [...questions].sort();

  return (
    <div className="card-interaction"
      onWheel={handleScroll}
      onMouseMove={onMove}
      onMouseUp={() => setSelectedItem(null)}
      onMouseLeave={() => setSelectedItem(null)}
    >
      <Sidebar
        n={QUESTION_NUMBER}
        c={index}
        onClick={(i) => {
          moveTo(i);
        }}>
      </Sidebar>
      <div
        className="card-container">
        {sorted.map((x) => {
          const i = questions.indexOf(x);
          const dragged = selectedItem !== null;
          const focused = index === i;
          return <Card
            key={x}
            msg={x}
            position={i - index}
            focused={focused}
            dragged={dragged}
            onHandle={onHandle}></Card>;
        })}
      </div>
      <div id="ghost" ref={ghostRef} hidden={selectedItem === null}>
        <Card isGhost></Card>
      </div>
    </div >
  );
}

