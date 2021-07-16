import React, { useRef, useState } from "react";
import Card from "./Card/Card";
import Sidebar from "./Sidebar/Sidebar";
import './CardInteraction.scss';

const QUESTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];
const QUESTION_NUMBER = QUESTIONS.length;
const MOVE_TIME = 500;

export default function CardInteraction() {

  /**
   * The ghostRef is reference to the ghost item.
   * It is used to directly control the position of th ghost itme.
   * Definitly, the position of ghost can be controlled be state.
   * But there is no reason to use state because it is not related to component reredering.
   * 
   * The scrollRef and mouseYRef are not DOM element but a variable.
   * This variables are also not related to rerendering.
   * Therefore they do not have to be implemented with state.
   * 
   * The reorderRef is used to invoke reorder function after rerendering.
   * 
   * Suppose that an item is selected and dragged to the bottom.
   * After, if the mouse does not move at all, onMove event would not be triggered and
   * cards will not move.
   * 
   * To prevent this problem, the reorder function can be called manually after card moving.
   * However, if the reorder function is called directly, because it holds all references of previous rerendering,
   * It does not works propely.
   * 
   * Especially, isDragging, which is actually alias of selectedItem, is a state.
   * Therefore, even though selectedItem is null and isDragging is change false, if reorder function is
   * directly called it would hold isDragging = true.
   * 
   * Therefore, it would call focus, which is also came from previous rerendering, containing unchanged variables.
   * Then, same thing happens forever.
   * 
   * By using ref, the reorderRef.current is update after every rerendering.
   * Therefore, it does not holds old variables, including the focus function.
   * Consequantly, it works as it is supposed to be.
   */
  const ghostRef = useRef(null);
  const scrollRef = useRef(0);
  const mouseYRef = useRef(0);
  const reorderRef = useRef(() => { });

  /**
   * The index is the index of the focused item.
   * The selecteditem is currently selected item for reordering.
   * The isMoving is a flag variable that indecates whether transtion is occurring or not.
   * Therefore, it is set when moving starts and cleared when moving finishes.
   * The questions is an array of questions to display. The items in questions must be unique and fully comparatable.
   */
  const [index, setIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [questions, setQuestions] = useState(QUESTIONS);

  /**
   * These two variables are just an alias for easy use of variable.
   */
  const isDragging = selectedItem !== null;
  const windowHeight = window.innerHeight;

  const focus = dest => {
    setIndex(dest);
    setIsMoving(true);
    setTimeout(() => {
      setIsMoving(false);
      reorderRef.current();
    }, MOVE_TIME);
  };

  const reorder = () => {
    if (isMoving) return;
    if (!isDragging) return;

    let destIndex = index;
    const y = mouseYRef.current;
    const centerLine = windowHeight / 2;
    const threshold = 64;

    if (y < centerLine - threshold) {
      if (index > 0) {
        destIndex = index - 1;
      }
    } else if (y > centerLine + threshold) {
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

    focus(destIndex);
  };
  reorderRef.current = reorder;

  const onScroll = (event) => {
    const currentScroll = event.deltaY;
    if (!isMoving) {
      if (currentScroll > 0) {
        if (currentScroll > scrollRef.current) {
          if (index < QUESTION_NUMBER - 1)
            focus(index + 1);
        }
      } else if (currentScroll < 0) {
        if (currentScroll < scrollRef.current) {
          if (index > 0)
            focus(index - 1);
        }
      }
    }
    scrollRef.current = currentScroll;
  };

  const onMouseMove = (event) => {
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
      onWheel={onScroll}
      onMouseMove={onMouseMove}
      onMouseUp={() => setSelectedItem(null)}
      onMouseLeave={() => setSelectedItem(null)}
    >
      <Sidebar
        n={QUESTION_NUMBER}
        c={index}
        onClick={(i) => {
          focus(i);
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
      <div id="ghost" ref={ghostRef} hidden={!isDragging}>
        <Card isGhost></Card>
      </div>
    </div >
  );
}

