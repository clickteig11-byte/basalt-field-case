export const brand = {
  name: "BASALT",
  studio: "BASALT SUPPLY CO.",
  product: "FIELD CASE 04",
  model: "BVLT-04",
  tagline: "BUILT TO TAKE A BEATING.",
  subline:
    "A pressure-sealed vault for people who break things for a living. Withdrawn from molten rock. Worn in.",
  nav: [
    { label: "CASE", href: "#sequence" },
    { label: "KIT", href: "#specs" },
    { label: "SPEC", href: "#specs" },
    { label: "ORDER", href: "#order" },
  ],
  order: {
    kicker: "NOW SHIPPING — SERIES 04",
    headline: ["STOP BABYING", "YOUR GEAR."],
    price: "$428",
    cta: "RESERVE BVLT-04",
    ctaSecondary: "DOWNLOAD SPEC SHEET",
    note: "Ships flat-packed. Rated for the worst day you'll ever have.",
  },
  marquee: [
    "BUILT TO TAKE A BEATING",
    "IP67",
    "MIL-STD-810G",
    "4 × FOLDING BOARDS",
    "MADE FOR THE WILD",
    "BVLT-04",
  ],
} as const;

export const palette = {
  ink: "#0B0A08",
  ink2: "#131211",
  olive: "#4A4D3A",
  rust: "#FF5A1F",
  bone: "#EDE9E0",
  yellow: "#FFD400",
} as const;

export type Brand = typeof brand;
