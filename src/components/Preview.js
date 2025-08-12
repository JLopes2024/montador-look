import React from "react";

export default function Preview({ top, bottom }) {
  return (
    <div className="preview-card">
      {bottom && <img className="bottom-img" src={bottom.img} alt={bottom.name} />}
      {top && <img className="top-img" src={top.img} alt={top.name} />}
    </div>
  );
}
