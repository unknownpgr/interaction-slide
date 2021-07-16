import React, { useRef, useState } from "react";
import Card from "./Card/Card";
import Sidebar from "./Sidebar/Sidebar";
import './CardInteraction.scss';

const QUESTION_NUMBER = 6;
const MOVE_TIME = 500;

export default function CardInteraction() {

  /**
   * ghostRef is reference to the ghost item.
   * It is used to directly control the position of th ghost itme.
   * Definitly the position of ghost can be controlled be state.
   * But there is no reason to use state because it is not related to component reredering.
   * 
   * scrollRef and mouseYRef are not DOM element but a variable.
   * This variables are also not related to rerendering.
   * Therefore they do not have to be implemented with state.
   */
  const ghostRef = useRef(null);
  const scrollRef = useRef(0);
  const mouseYRef = useRef(0);
  const reorderRef = useRef(() => { });

  const [index, setIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [questions, setQuestions] = useState([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ]);

  const isDragging = selectedItem !== null;
  const windowHeight = window.innerHeight;

  const moveTo = dest => {
    setIndex(dest);
    setIsMoving(true);
    setTimeout(() => {
      setIsMoving(false);
      reorderRef.current();
    }, MOVE_TIME);
  };

  const handleScroll = (event) => {
    const currentScroll = event.deltaY;
    if (!isMoving) {
      if (currentScroll > 0) {
        if (currentScroll > scrollRef.current) {
          if (index < QUESTION_NUMBER - 1)
            moveTo(index + 1);
        }
      } else if (currentScroll < 0) {
        if (currentScroll < scrollRef.current) {
          if (index > 0)
            moveTo(index - 1);
        }
      }
    }
    scrollRef.current = currentScroll;
  };

  const reorder = () => {
    if (isMoving) return;
    if (!isDragging) return;

    let destIndex = index;
    const y = mouseYRef.current;

    if (y < windowHeight / 3) {
      if (index > 0) {
        destIndex = index - 1;
      }
    } else if (y > windowHeight * 2 / 3) {
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
  };
  reorderRef.current = reorder;

  const onMove = (event) => {
    const [x, y] = [event.clientX, event.clientY];
    if (ghostRef.current) {
      ghostRef.current.style.left = x + "px";
      ghostRef.current.style.top = y + "px";
    }
    mouseYRef.current = y;
    reorder();
  };

  const onHandle = (event) => {
    event.preventDefault();
    setSelectedItem(questions[index]);
  };

  /**
   * If rendering order changes, transition does not occurs smoothly.
   * Therefore sort questions to ensure rendering order.
   */
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
          /**
           * Because sorted array is sorted as it shows, 
           * Index should be retrived manually.
           */
          const i = questions.indexOf(x);
          const isFocused = index === i;
          return <Card
            key={x}
            msg={x}
            position={i - index}
            focused={isFocused}
            dragged={isDragging}
            onHandle={onHandle}></Card>;
        })}
      </div>
      <div id="ghost" ref={ghostRef} hidden={selectedItem === null}>
        <Card isGhost></Card>
      </div>
    </div >
  );
}

