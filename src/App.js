import React, { useState, useMemo } from "react";
import { tops, bottoms } from "./Data";

const tonsDePeleIBGE = [
  { id: "branco", label: "Branco", color: "#f5d6c6" },
  { id: "pardo", label: "Pardo", color: "#c68642" },
  { id: "preto", label: "Preto", color: "#3b1f0b" },
  { id: "amarelo", label: "Amarelo", color: "#ffd966" },
  { id: "indigena", label: "Indígena", color: "#a97454" },
];

const sugestoesPorCorPele = {
  branco: {
    topColors: ["preto", "azul", "areia"],
    bottomColors: ["preto", "azul", "cinza"],
  },
  pardo: {
    topColors: ["branco", "areia", "azul"],
    bottomColors: ["bege", "azul", "cinza"],
  },
  preto: {
    topColors: ["branco", "azul", "areia"],
    bottomColors: ["preto", "azul", "cinza"],
  },
  amarelo: {
    topColors: ["preto", "azul", "branco"],
    bottomColors: ["bege", "cinza", "preto"],
  },
  indigena: {
    topColors: ["areia", "azul", "bege"],
    bottomColors: ["bege", "cinza", "azul"],
  },
};

export default function App() {
  const allCombinations = useMemo(() => {
    const combos = [];
    for (let top of tops) {
      for (let bottom of bottoms) {
        combos.push({ top, bottom });
      }
    }
    return combos;
  }, []);

  const [currentComboIndex, setCurrentComboIndex] = useState(0);

  function proximaCombinacao() {
    setCurrentComboIndex((i) => (i + 1) % allCombinations.length);
  }

  function escolherLookPorPele(corPele) {
    const sugestao = sugestoesPorCorPele[corPele];
    if (!sugestao) return;

    const combinacoesFiltradas = allCombinations.filter(
      ({ top, bottom }) =>
        sugestao.topColors.includes(top.color) &&
        sugestao.bottomColors.includes(bottom.color)
    );

    if (combinacoesFiltradas.length > 0) {
      const index = allCombinations.findIndex(
        (combo) =>
          combo.top.id === combinacoesFiltradas[0].top.id &&
          combo.bottom.id === combinacoesFiltradas[0].bottom.id
      );
      if (index >= 0) setCurrentComboIndex(index);
    }
  }

  const { top: selectedTop, bottom: selectedBottom } = allCombinations[currentComboIndex];

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Escolha seu tom de pele (IBGE)</h1>
      <div style={{ marginBottom: 20, display: "flex", gap: 15 }}>
        {tonsDePeleIBGE.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => escolherLookPorPele(id)}
            title={label}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #333",
              backgroundColor: color,
              cursor: "pointer",
            }}
          />
        ))}

        <button
          onClick={proximaCombinacao}
          style={{
            marginLeft: 30,
            padding: "8px 16px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            height: 40,
          }}
        >
          Próxima combinação
        </button>
      </div>

      <div>
        <h2>Look sugerido:</h2>
        <div>
          <p>
            <strong>Parte superior:</strong> {selectedTop.name} ({selectedTop.color})
          </p>
          <img src={selectedTop.img} alt={selectedTop.name} width={150} />
        </div>

        <div style={{ marginTop: 20 }}>
          <p>
            <strong>Parte inferior:</strong> {selectedBottom.name} ({selectedBottom.color})
          </p>
          <img src={selectedBottom.img} alt={selectedBottom.name} width={150} />
        </div>
      </div>
    </div>
  );
}
