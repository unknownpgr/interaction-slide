import React, { useEffect, useRef, useState } from "react";
import "./RealtimeInteraction.scss";

const client = new WebSocket("wss://back.dev.the-form.io/update");

const ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function RealtimeInteraction() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [focused, setFocused] = useState({});
  const [text, setText] = useState(ids.map(() => ""));
  const refs = useRef(ids.map(() => null));

  useEffect(() => {
    client.onmessage = ({ data }) => {
      const [event, ...others] = JSON.parse(data);

      switch (event) {
        case "update":
          const [id, value] = others;
          if (id !== currentIndex) {
            const nt = [...text];
            nt[id] = value;
            setText(nt);
          }
          break;
        case "focus":
          const nf1 = { ...focused };
          nf1[others[0]] = true;
          setFocused(nf1);
          break;
        case "blur":
          const nf2 = { ...focused };
          nf2[others[0]] = false;
          setFocused(nf2);
          break;
      }
    };
  }, [currentIndex, focused, text]);

  function handleKey(id, e) {
    if (e.type === "keypress" && e.key === "Enter" && id < ids.length - 1) {
      refs.current[id + 1].focus();
    }
    if (e.type === "keydown" && e.key === "ArrowUp" && id > 0) {
      refs.current[id - 1].focus();
    }
    if (e.type === "keydown" && e.key === "ArrowDown" && id < ids.length - 1) {
      refs.current[id + 1].focus();
    }
    if (
      e.type === "keydown" &&
      e.key === "Backspace" &&
      id > 0 &&
      text[id].length === 0
    ) {
      refs.current[id - 1].focus();
    }
  }

  function update(id, e) {
    const nv = [...text];
    nv[id] = e.target.value;
    setText(nv);
    client.send(JSON.stringify(["update", id, e.target.value]));
  }

  function onFocus(id) {
    setCurrentIndex(id);
    client.send(JSON.stringify(["focus", id]));
  }

  function onBlur(id) {
    setCurrentIndex(-1);
    client.send(JSON.stringify(["blur", id]));
  }

  return (
    <div className="realtime-frame">
      {ids.map((id) => (
        <div key={id}>
          <input
            style={{ backgroundColor: focused[id] ? "#eee" : null }}
            ref={(ref) => (refs.current[id] = ref)}
            value={text[id]}
            onKeyPress={(e) => handleKey(id, e)}
            onKeyDown={(e) => handleKey(id, e)}
            onChange={(e) => update(id, e)}
            onFocus={() => onFocus(id)}
            onBlur={() => onBlur(id)}></input>
        </div>
      ))}
    </div>
  );
}
