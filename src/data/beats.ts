export type Beat = {
  at: number;
  statement: string;
  line: string;
};

export const beats: Beat[] = [
  {
    at: 0.18,
    statement: "Lifts on its own.",
    line: "Release the latches and the lid opens on its own.",
  },
  {
    at: 0.38,
    statement: "Trays fold out.",
    line: "Two side trays swing open and stay level.",
  },
  {
    at: 0.6,
    statement: "Tools stand up.",
    line: "Cutouts hold each tool upright so you can find it.",
  },
  {
    at: 0.8,
    statement: "Everything has a place.",
    line: "It closes as neatly as it opened.",
  },
];
