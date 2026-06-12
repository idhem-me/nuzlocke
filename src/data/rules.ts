export const NUZLOCKE_RULES = [
  {
    title: "Une seule capture par zone",
    description:
      "Vous ne pouvez attraper que le premier Pokémon rencontré dans chaque zone. Si la capture échoue ou si vous le laissez fuir, la zone est considérée comme ratée : aucune autre capture n'est possible dans cette zone.",
  },
  {
    title: "Pokémon KO = mort",
    description:
      "Un Pokémon mis KO est considéré comme mort. Il doit être placé définitivement dans la boîte (PC) et ne peut plus être utilisé dans votre équipe.",
  },
  {
    title: "Surnommer ses Pokémon",
    description:
      "Chaque Pokémon capturé doit recevoir un surnom unique. Cela renforce l'attachement émotionnel et rend chaque perte plus marquante.",
  },
] as const;

export const NUZLOCKE_NOTES = [
  "Ces règles sont les bases du défi Nuzlocke. Vous pouvez ajouter vos propres variantes (mode Hardcore, etc.) pour vos parties.",
];
