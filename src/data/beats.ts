export type Beat = {
  at: number;
  index: string;
  kicker: string;
  title: string[];
  body: string;
  align?: "left" | "right";
};

export const beats: Beat[] = [
  {
    at: 0.0,
    index: "00",
    kicker: "BASALT SUPPLY CO.",
    title: ["FIELD CASE 04"],
    body: "The vault for people who break things for a living.",
    align: "left",
  },
  {
    at: 0.2,
    index: "01",
    kicker: "SEAL",
    title: ["PRESSURE", "SEALED."],
    body: "IP67. Dust-tight, watertight, drop-rated. Nothing gets in. Ever.",
    align: "left",
  },
  {
    at: 0.4,
    index: "02",
    kicker: "RELEASE",
    title: ["SPRINGS", "WIDE."],
    body: "Six reinforced latches. One hand. Zero drama.",
    align: "right",
  },
  {
    at: 0.6,
    index: "03",
    kicker: "KIT",
    title: ["MODULAR", "BOARDS."],
    body: "Four folding tool trays. Configure them for the job, not the shelf.",
    align: "left",
  },
  {
    at: 0.8,
    index: "04",
    kicker: "LOAD",
    title: ["EVERYTHING.", "EVERYWHERE."],
    body: "The whole workshop. One carry. Rock not included.",
    align: "right",
  },
];
