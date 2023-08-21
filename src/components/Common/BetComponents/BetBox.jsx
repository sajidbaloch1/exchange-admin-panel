import React from "react";

function BetBox({ topDate, bottomData, colorClass }) {
  return (
    <div className={`grey-box ${colorClass}`}>
      <span className="top-date">{topDate}</span>
      <span className="bottom-data">{bottomData}</span>
    </div>
  );
}

export default BetBox;