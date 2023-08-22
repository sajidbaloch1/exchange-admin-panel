import React from "react";

function BetBox({ topDate, bottomData, colorClass }) {
  return (
    <div className={`grey-box ${colorClass}`}>
      {topDate ? (
        <>
          <span className="top-date">{topDate}</span>
          <span className="bottom-data">{bottomData}</span>
        </>
      ) : (
        <span className="top-date fw-bold">-</span>
      )}
    </div>
  );
}

export default BetBox;
