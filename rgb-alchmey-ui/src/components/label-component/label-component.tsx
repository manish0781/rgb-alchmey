import "./styles.css";

import { LableComponentType } from "./types";
export const LabelComponent = (props: LableComponentType) => {
  const { userId, maxMoves, target, closesetColorRgb, deltaValue } = props;

  return (
    <>
      <div className="cls-label">
        <div>
          <span>UserId:</span>
          {userId}
        </div>
        <div>
          <span>Moves Left:</span>
          {maxMoves}
        </div>
        <div className="box-with-label">
          <span>Target Color</span>
          <div
            className="box"
            style={{
              backgroundColor: `rgb(${target[0]},${target[1]},${target[2]})`,
            }}
          ></div>
        </div>
        <div className="box-with-label">
          <span>Closeset Color</span>
          <div
            className="box"
            style={{
              backgroundColor: closesetColorRgb
                ? `rgb(${closesetColorRgb[0]},${closesetColorRgb[1]},${closesetColorRgb[2]})`
                : "",
            }}
          ></div>
        </div>
        <div>
          <span>Delta value:</span>
          {Math.round(deltaValue)}%
        </div>
      </div>
    </>
  );
};
