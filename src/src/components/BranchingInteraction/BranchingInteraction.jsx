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

/**
 * @param {Number} i Index of question
 * @param {Number} j Index of choice
 * @returns {Array} [x, y]
 */
function getChoicePosition(i, j) {
  return [positions[i][0], TOP + H + CHOICE_DISTANCE * j + 32];
}

/**
 * @param {Number} i Index of question
 * @param {Number} j Index of choice
 * @returns {Array} [x, y]
 */
function getHandlePosition(i, j) {
  let [x, y] = getChoicePosition(i, j);
  x = x + W + 16;
  y = y;
  return [x, y];
}

/**
 * @param {Index of question} i
 * @returns {Array} [x, y]
 */
function getAnchorPosition(i) {
  let [x, y] = positions[i];
  y += H / 2;
  return [x, y];
}

/** *
 * @param {Number} sx x of start position
 * @param {Number} sy y of start position
 * @param {Number} ex x of end position
 * @param {Number} ey y of end position
 * @returns {String} SVG path d string
 */
function getCurveString(sx, sy, ex, ey) {
  const C = (ex - sx) / 2;
  return `M${sx},${sy} C${sx + C},${sy} ${ex - C},${ey} ${ex},${ey}`;
}

/**
 * Calculate nearest body anchor from given position
 * and return [index of anchor, distance to that anchor]
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Array} [index, distance square]
 */
const bodyPositions = choices.map((_, i) => getAnchorPosition(i));
function getNearestAnchor(x, y) {
  let minDist2 = 99999999;
  let minIndex = -1;

  bodyPositions.forEach(([x2, y2], i) => {
    const dist = (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y);
    if (dist < minDist2) {
      minDist2 = dist;
      minIndex = i;
    }
  });

  return [minIndex, minDist2];
}

/**
 * Convert integer tuple to string
 * @param {Number} i
 * @param {Number} j
 * @returns {String} hash
 */
function hashIndex(i, j) {
  return i + " " + j;
}

/**
 * Convert hashed string to integer tuple
 * @param {String} hashed
 * @returns {Array} [i, j]
 */
function unHashIndex(hashed) {
  const [i, j] = hashed.split(" ");
  return [+i, +j];
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

  function handleGrab(i, j) {
    setSelectedHandle([i, j]);
  }

  function handleMove(e) {
    if (selectedHandle) {
      e.preventDefault();
      const [sx, sy] = getHandlePosition(...selectedHandle);
      if (!frame.current) return;
      const rect = frame.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY;

      let ex = mx;
      let ey = my;

      const [index, dist2] = getNearestAnchor(mx, my);

      if (dist2 < 100) {
        [ex, ey] = getAnchorPosition(index);
        if (destBody !== index) setDestBody(index);
      } else {
        if (destBody > 0) setDestBody(-1);
      }

      let d = getCurveString(sx, sy, ex, ey);

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

  function handleRelease() {
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
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onMouseMove={handleMove}
        style={{ width: positions[choices.length - 1][0] + W + 64 }}>
        {choices.map((x, i) => {
          return (
            <Card key={i} index={i} choices={x} onGrab={handleGrab}></Card>
          );
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
              const [ex, ey] = getAnchorPosition(dest);

              const d = getCurveString(sx, sy, ex, ey);

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
