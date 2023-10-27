import React from "react";
import "./Button.css";

const Button = ({ onUp, onDown, onLeft, onRight, onRestart }) => {
  return (
    <div className="buttons">
      <div className="upwards">
        <input className="up" onClick={onUp} type="button" value="UP" />
      </div>
      <div className="sideways">
        <input className="left" onClick={onLeft} type="button" value="LEFT" />
        {/* <input className="pause" onClick={onPauseResume} type="button" value="PAUSE/RESUME" /> */}
        <input className="restart" onClick={onRestart} type="button" value="RESTART" />
        <input
          className="right"
          onClick={onRight}
          type="button"
          value="RIGHT"
        />
      </div>
      <div className="downwards">
        <input className="down" onClick={onDown} type="button" value="DOWN" />
      </div>
    </div>
  );
};
export default Button;
