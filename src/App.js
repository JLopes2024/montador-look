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

  // Guarda o tom de pele selecionado
  const [selectedSkinTone, setSelectedSkinTone] = useState(null);
  // Índice para a combinação atual dentro das combinações do tom selecionado
  const [comboIndexBySkinTone, setComboIndexBySkinTone] = useState({});

  function escolherLookPorPele(corPele) {
    const sugestao = sugestoesPorCorPele[corPele];
    if (!sugestao) return;

    // Filtra as combinações válidas para o tom
    const combinacoesFiltradas = allCombinations.filter(
      ({ top, bottom }) =>
        sugestao.topColors.includes(top.color) &&
        sugestao.bottomColors.includes(bottom.color)
    );

    if (combinacoesFiltradas.length === 0) return;

    // Pega índice atual para esse tom
    const atualIndex = comboIndexBySkinTone[corPele] ?? -1;
    // Próximo índice (loop)
    const proximoIndex = (atualIndex + 1) % combinacoesFiltradas.length;

    // Atualiza estado do índice por tom de pele
    setComboIndexBySkinTone({
      ...comboIndexBySkinTone,
      [corPele]: proximoIndex,
    });

    // Atualiza tom de pele selecionado
    setSelectedSkinTone(corPele);
  }

  // Combinação atual, baseado no tom e índice
  let selectedTop = null;
  let selectedBottom = null;

  if (selectedSkinTone) {
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

  // Fallback: mostra primeira combinação geral se nada selecionado ainda
  if (!selectedTop || !selectedBottom) {
    selectedTop = tops[0];
    selectedBottom = bottoms[0];
  }

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
              outline:
                selectedSkinTone === id ? "3px solid #4caf50" : "none",
            }}
          />
        ))}
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
