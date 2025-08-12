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
    topColors: ["preto", "verde", "areia"],
    bottomColors: ["preto", "azul", "cinza"],
  },
  pardo: {
    topColors: ["branco", "areia", "verde"],
    bottomColors: ["bege", "verde", "cinza"],
  },
  preto: {
    topColors: ["branco", "verde", "areia"],
    bottomColors: ["preto", "bege", "cinza"],
  },
  amarelo: {
    topColors: ["preto", "verde", "branco"],
    bottomColors: ["bege", "cinza", "preto"],
  },
  indigena: {
    topColors: ["areia", "verde", "bege"],
    bottomColors: ["bege", "cinza", "verde"],
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

  const [selectedSkinTone, setSelectedSkinTone] = useState(null);
  const [comboIndexBySkinTone, setComboIndexBySkinTone] = useState({});

  // Estados para combinação aleatória
  const [randomCombo, setRandomCombo] = useState(null);

  function escolherLookPorPele(corPele) {
    const sugestao = sugestoesPorCorPele[corPele];
    if (!sugestao) return;

    const combinacoesFiltradas = allCombinations.filter(
      ({ top, bottom }) =>
        sugestao.topColors.includes(top.color) &&
        sugestao.bottomColors.includes(bottom.color)
    );

    if (combinacoesFiltradas.length === 0) return;

    const atualIndex = comboIndexBySkinTone[corPele] ?? -1;
    const proximoIndex = (atualIndex + 1) % combinacoesFiltradas.length;

    setComboIndexBySkinTone({
      ...comboIndexBySkinTone,
      [corPele]: proximoIndex,
    });

    setSelectedSkinTone(corPele);
    setRandomCombo(null); // limpa random ao escolher tom
  }

  function escolherLookAleatorio() {
    const topAleatorio = tops[Math.floor(Math.random() * tops.length)];
    const bottomAleatorio = bottoms[Math.floor(Math.random() * bottoms.length)];
    setRandomCombo({ top: topAleatorio, bottom: bottomAleatorio });
    setSelectedSkinTone(null); // limpa seleção de tom
  }

  let selectedTop = null;
  let selectedBottom = null;

  if (randomCombo) {
    selectedTop = randomCombo.top;
    selectedBottom = randomCombo.bottom;
  } else if (selectedSkinTone) {
    const sugestao = sugestoesPorCorPele[selectedSkinTone];
    const combinacoesFiltradas = allCombinations.filter(
      ({ top, bottom }) =>
        sugestao.topColors.includes(top.color) &&
        sugestao.bottomColors.includes(bottom.color)
    );

    const idx = comboIndexBySkinTone[selectedSkinTone] ?? 0;
    const comboAtual = combinacoesFiltradas[idx];

    if (comboAtual) {
      selectedTop = comboAtual.top;
      selectedBottom = comboAtual.bottom;
    }
  }

  if (!selectedTop || !selectedBottom) {
    selectedTop = tops[0];
    selectedBottom = bottoms[0];
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Escolha seu tom de pele (IBGE)</h1>
      <div style={{ marginBottom: 20, display: "flex", gap: 15, alignItems: "center" }}>
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
              outline: selectedSkinTone === id ? "3px solid #4caf50" : "none",
            }}
          />
        ))}

        <button
          onClick={escolherLookAleatorio}
          style={{
            marginLeft: 30,
            padding: "8px 16px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            height: 40,
          }}
          title="Combinação Aleatória"
        >
          Surpreenda-me!
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
