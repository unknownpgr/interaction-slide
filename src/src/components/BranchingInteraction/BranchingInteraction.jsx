import React, { useRef, useState } from "react";
import "./Branching.scss";

const choices = [
  [
    "a. 나는 죽음을 택하겠다!",
    "b. 산다는게-다그런거지- 누구나 민머리로와",
    "c. 먐",
    "d. 먐먐",
  ],
  ["1번", "2번", "3번"],
  [
    "동해물과 백두산이 마르고 닳도록",
    "하나님이 보우하사 우리나라만세",
    "무궁화 삼천리 화려강한",
    "대한사람 대한으로 길이 보전하세",
  ],
  ["대신귀", "여운알", "파카를", "드리겠", "습니다"],
  ["이 항목은", "가로로 길어서", "오버플로우를", "일으킵니다."],
];

const TOP = 100;
const DIST = 300;
const W = 150 * 1.5;
const H = 100 * 1.5;
const CHOICE_DISTANCE = 48;
const positions = choices.map((_, i) => [i * DIST + 32, TOP]);

function getChoicePosition(i, j) {
  return [positions[i][0], TOP + H + CHOICE_DISTANCE * j + 32];
}

function getHandlePosition(i, j) {
  let [x, y] = getChoicePosition(i, j);
  x = x + W + 16;
  y = y;
  return [x, y];
}

function getBodyPosition(i) {
  let [x, y] = positions[i];
  y += H / 2;
  return [x, y];
}

function getCurve(sx, sy, ex, ey) {
  const C = (ex - sx) / 2;
  return `M${sx},${sy} C${sx + C},${sy} ${ex - C},${ey} ${ex},${ey}`;
}

function hashIndex(x, y) {
  return x + " " + y;
}

function unHashIndex(hashed) {
  const [x, y] = hashed.split(" ");
  return [+x, +y];
}

function Card({ index, choices, onGrab }) {
  const [x, y] = positions[index];

  return (
    <>
      <div
        className="branch-card"
        style={{ left: x, top: y, width: W, height: H }}>
        This is question {index}.
      </div>
      {choices.map((text, i) => {
        const [x, y] = getChoicePosition(index, i);
        return (
          <div className="choice" key={i} style={{ top: y, left: x, width: W }}>
            <div className="text">{text}</div>
            <div className="handle" onMouseDown={() => onGrab(index, i)}>
              ⦿
            </div>
          </div>
        );
      })}
      <div className="anchor" style={{ left: x, top: y + H / 2 }}>
        ⦿
      </div>
    </>
  );
}

export default function BranchingInteraction() {
  // States
  const [selectedHandle, setSelectedHandle] = useState(null);
  const [destBody, setDestBody] = useState(-1);
  const [connection, setConnection] = useState({});

  // References
  const curve = useRef(null);
  const frame = useRef(null);

  // Constants
  const bodyPositions = choices.map((_, i) => getBodyPosition(i));

  function onGrab(i, j) {
    setSelectedHandle([i, j]);
  }

  function getNearestBodyPosition(x, y) {
    let minDist2 = 99999999;
    let minPos = -1;

    bodyPositions.forEach(([x2, y2], i) => {
      const dist = (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y);
      if (dist < minDist2) {
        minDist2 = dist;
        minPos = i;
      }
    });

    return [minPos, minDist2];
  }

  function onMove(e) {
    if (selectedHandle) {
      e.preventDefault();
      const [sx, sy] = getHandlePosition(...selectedHandle);
      if (!frame.current) return;
      const rect = frame.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY;

      let ex = mx;
      let ey = my;

      const [index, dist2] = getNearestBodyPosition(mx, my);

      if (dist2 < 100) {
        [ex, ey] = getBodyPosition(index);
        if (destBody !== index) setDestBody(index);
      } else {
        if (destBody > 0) setDestBody(-1);
      }

      let d = getCurve(sx, sy, ex, ey);

      curve.current.setAttributeNS(null, "d", d);
      if (ex < sx) {
        curve.current.setAttributeNS(null, "stroke", "#f44");
      } else if (destBody >= 0) {
        curve.current.setAttributeNS(null, "stroke", "#4f4");
      } else {
        curve.current.setAttributeNS(null, "stroke", "black");
      }
    }
  }

  function onRelease() {
    if (destBody >= 0) {
      setConnection({
        ...connection,
        [hashIndex(...selectedHandle)]: destBody,
      });
    }
    setSelectedHandle(null);
    setDestBody(-1);
  }

  return (
    <div className="scroll">
      <div
        className="frame"
        ref={frame}
        onMouseUp={onRelease}
        onMouseLeave={onRelease}
        onMouseMove={onMove}
        style={{ width: positions[choices.length - 1][0] + W + 64 }}>
        {choices.map((x, i) => {
          return <Card key={i} index={i} choices={x} onGrab={onGrab}></Card>;
        })}
        <div className="curve">
          <svg>
            {Object.entries(connection).map(([choiceIndex, dest]) => {
              if (
                selectedHandle &&
                hashIndex(...selectedHandle) === choiceIndex
              )
                return null;

              const [i, j] = unHashIndex(choiceIndex);

              const [sx, sy] = getHandlePosition(i, j);
              const [ex, ey] = getBodyPosition(dest);

              const d = getCurve(sx, sy, ex, ey);

              let color = "black";
              if (ex < sx) {
                color = "red";
              }

              return (
                <path
                  key={choiceIndex + "/" + dest}
                  ref={curve}
                  id="curveCurrent"
                  stroke={color}
                  strokeWidth="4"
                  fill="none"
                  d={d}
                />
              );
            })}
            {selectedHandle && (
              <path
                ref={curve}
                id="curveCurrent"
                stroke="black"
                strokeWidth="4"
                fill="none"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
