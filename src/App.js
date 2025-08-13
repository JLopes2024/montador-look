// Importações necessárias
import React, { useState, useMemo } from "react";
import { tops, bottoms } from "./Data"; // Arrays com peças superiores e inferiores

// Lista de tons de pele (baseada no IBGE) com cor para visualização
const tonsDePeleIBGE = [
  { id: "branco", label: "Branco", color: "#f5d6c6" },
  { id: "pardo", label: "Pardo", color: "#c68642" },
  { id: "preto", label: "Preto", color: "#3b1f0b" },
  { id: "amarelo", label: "Amarelo", color: "#ffd966" },
  { id: "indigena", label: "Indígena", color: "#a97454" },
];

// Sugestões de cores de roupas para cada tom de pele
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
  // Cria todas as combinações possíveis de top + bottom (usando useMemo para evitar recálculo)
  const allCombinations = useMemo(() => {
    const combos = [];
    for (let top of tops) {
      for (let bottom of bottoms) {
        combos.push({ top, bottom });
      }
    }
    return combos;
  }, []);

  // Estado para guardar o tom de pele selecionado
  const [selectedSkinTone, setSelectedSkinTone] = useState(null);

  // Guarda qual índice de combinação foi usado para cada tom de pele (para ir alternando)
  const [comboIndexBySkinTone, setComboIndexBySkinTone] = useState({});

  // Guarda a combinação aleatória escolhida
  const [randomCombo, setRandomCombo] = useState(null);

  // Função para escolher um look baseado no tom de pele
  function escolherLookPorPele(corPele) {
    const sugestao = sugestoesPorCorPele[corPele];
    if (!sugestao) return;

    // Filtra apenas as combinações que atendem às cores recomendadas
    const combinacoesFiltradas = allCombinations.filter(
      ({ top, bottom }) =>
        sugestao.topColors.includes(top.color) &&
        sugestao.bottomColors.includes(bottom.color)
    );

    if (combinacoesFiltradas.length === 0) return;

    // Descobre qual é o próximo índice (para alternar looks a cada clique)
    const atualIndex = comboIndexBySkinTone[corPele] ?? -1;
    const proximoIndex = (atualIndex + 1) % combinacoesFiltradas.length;

    // Atualiza o índice e define o tom selecionado
    setComboIndexBySkinTone({
      ...comboIndexBySkinTone,
      [corPele]: proximoIndex,
    });

    setSelectedSkinTone(corPele);
    setRandomCombo(null); // Limpa o look aleatório
  }

  // Função para escolher um look completamente aleatório
  function escolherLookAleatorio() {
    const topAleatorio = tops[Math.floor(Math.random() * tops.length)];
    const bottomAleatorio =
      bottoms[Math.floor(Math.random() * bottoms.length)];
    setRandomCombo({ top: topAleatorio, bottom: bottomAleatorio });
    setSelectedSkinTone(null); // Limpa seleção de tom de pele
  }

  // Variáveis para guardar o top e bottom selecionados
  let selectedTop = null;
  let selectedBottom = null;

  // Se for aleatório, usa o randomCombo
  if (randomCombo) {
    selectedTop = randomCombo.top;
    selectedBottom = randomCombo.bottom;
  }
  // Se for por tom de pele, pega a combinação filtrada
  else if (selectedSkinTone) {
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

  // Se nada foi escolhido, mostra a primeira peça de cada lista
  if (!selectedTop || !selectedBottom) {
    selectedTop = tops[0];
    selectedBottom = bottoms[0];
  }

  // Renderização do aplicativo
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Escolha seu tom de pele (IBGE)</h1>

      {/* Botões para seleção de tom de pele */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 15,
          alignItems: "center",
        }}
      >
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

        {/* Botão para look aleatório */}
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

      {/* Exibição do look selecionado */}
      <div>
        <h2>Look sugerido:</h2>

        {/* Parte superior */}
        <div>
          <p>
            <strong>Parte superior:</strong> {selectedTop.name} (
            {selectedTop.color})
          </p>
          <img
            src={selectedTop.img}
            alt={selectedTop.name}
            width={150}
          />
        </div>

        {/* Parte inferior */}
        <div style={{ marginTop: 20 }}>
          <p>
            <strong>Parte inferior:</strong> {selectedBottom.name} (
            {selectedBottom.color})
          </p>
          <img
            src={selectedBottom.img}
            alt={selectedBottom.name}
            width={150}
          />
        </div>
      </div>
    </div>
  );
}
