import React from "react";

function ItemCard({ item, selected, onClick }) {
  return (
    <button
      className={`item-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(item)}
    >
      <img src={item.img} alt={item.name} />
      <div className="item-name">{item.name}</div>
    </button>
  );
}

export default function Selector({ title, items, selectedId, onSelect }) {
  return (
    <div className="selector">
      <h3>{title}</h3>
      <div className="selector-list">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
