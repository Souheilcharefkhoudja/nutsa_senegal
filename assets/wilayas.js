// ═══════════════════════════════════════════════════════════
//  NUTSA — Sénégal · Régions + tarifs livraison (F CFA / XOF)
//  Rate: 2400 DA = 20 000 CFA (× 8.333) applied to the DZ tiers.
//  Structure kept identical to the DZ theme (window.WILAYAS,
//  keys "NN — Name", .home / .desk / .communes[]) so the
//  order-bar JS runs unchanged.
// ═══════════════════════════════════════════════════════════
window.WILAYAS = {
  "01 — Dakar":         { home: 0,     desk: 0,    communes: ["Dakar","Guédiawaye","Pikine","Rufisque"] },
  "02 — Thiès":         { home: 5000,  desk: 3800, communes: ["Thiès","Mbour","Tivaouane"] },
  "03 — Diourbel":      { home: 5000,  desk: 3800, communes: ["Diourbel","Bambey","Mbacké"] },
  "04 — Fatick":        { home: 5800,  desk: 4200, communes: ["Fatick","Foundiougne","Gossas"] },
  "05 — Kaolack":       { home: 5800,  desk: 4200, communes: ["Kaolack","Guinguinéo","Nioro du Rip"] },
  "06 — Kaffrine":      { home: 5800,  desk: 4200, communes: ["Kaffrine","Birkelane","Koungheul","Malem Hodar"] },
  "07 — Louga":         { home: 5800,  desk: 4200, communes: ["Louga","Kébémer","Linguère"] },
  "08 — Saint-Louis":   { home: 6700,  desk: 5000, communes: ["Saint-Louis","Dagana","Podor"] },
  "09 — Matam":         { home: 7500,  desk: 5800, communes: ["Matam","Kanel","Ranérou-Ferlo"] },
  "10 — Ziguinchor":    { home: 6700,  desk: 5000, communes: ["Ziguinchor","Bignona","Oussouye"] },
  "11 — Kolda":         { home: 7500,  desk: 5800, communes: ["Kolda","Médina Yoro Foulah","Vélingara"] },
  "12 — Sédhiou":       { home: 7500,  desk: 5800, communes: ["Sédhiou","Bounkiling","Goudomp"] },
  "13 — Tambacounda":   { home: 8300,  desk: 6700, communes: ["Tambacounda","Bakel","Goudiry","Koumpentoum"] },
  "14 — Kédougou":      { home: 8300,  desk: 6700, communes: ["Kédougou","Salémata","Saraya"] }
};
