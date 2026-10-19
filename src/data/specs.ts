export type SpecRow = { k: string; v: string };

export const specs: SpecRow[] = [
  { k: "MODEL", v: "BVLT-04" },
  { k: "SHELL", v: "CO-POLYMER / UV STABLE" },
  { k: "RATING", v: "IP67 · MIL-STD-810G" },
  { k: "BOARDS", v: "4 × FOLDING TRAYS" },
  { k: "CAPACITY", v: "68 L" },
  { k: "DROP", v: "3.0 M FULLY LOADED" },
  { k: "TEMP", v: "−30°C → +70°C" },
  { k: "LATCHES", v: "6 × REINFORCED" },
  { k: "FINISH", v: "OLIVE / RUST" },
  { k: "DRY WEIGHT", v: "9.4 KG" },
];

export const chapters = [
  { id: "sequence", label: "THE OPEN" },
  { id: "specs", label: "SPEC" },
  { id: "order", label: "ORDER" },
] as const;
