// Nutsa Sénégal — 14 régions + tarifs livraison en F CFA (XOF)
// Rate: 2400 DA = 20 000 CFA (×8.333) appliquée aux tarifs DZ d'origine.
// Dakar = livraison gratuite.
window.REGIONS = {
  "01 — Dakar":        { home: 0,    relay: 0,    depts: ["Dakar","Guédiawaye","Pikine","Rufisque"] },
  "02 — Thiès":        { home: 5000, relay: 3800, depts: ["Thiès","Mbour","Tivaouane"] },
  "03 — Diourbel":     { home: 5000, relay: 3800, depts: ["Diourbel","Bambey","Mbacké"] },
  "04 — Fatick":       { home: 5800, relay: 4200, depts: ["Fatick","Foundiougne","Gossas"] },
  "05 — Kaolack":      { home: 5800, relay: 4200, depts: ["Kaolack","Guinguinéo","Nioro du Rip"] },
  "06 — Kaffrine":     { home: 5800, relay: 4200, depts: ["Kaffrine","Birkelane","Koungheul","Malem Hodar"] },
  "07 — Louga":        { home: 5800, relay: 4200, depts: ["Louga","Kébémer","Linguère"] },
  "08 — Saint-Louis":  { home: 6700, relay: 5000, depts: ["Saint-Louis","Dagana","Podor"] },
  "09 — Matam":        { home: 7500, relay: 5800, depts: ["Matam","Kanel","Ranérou-Ferlo"] },
  "10 — Ziguinchor":   { home: 6700, relay: 5000, depts: ["Ziguinchor","Bignona","Oussouye"] },
  "11 — Kolda":        { home: 7500, relay: 5800, depts: ["Kolda","Médina Yoro Foulah","Vélingara"] },
  "12 — Sédhiou":      { home: 7500, relay: 5800, depts: ["Sédhiou","Bounkiling","Goudomp"] },
  "13 — Tambacounda":  { home: 8300, relay: 6700, depts: ["Tambacounda","Bakel","Goudiry","Koumpentoum"] },
  "14 — Kédougou":     { home: 8300, relay: 6700, depts: ["Kédougou","Salémata","Saraya"] }
};

window.PRODUCTS = [
  { id:1,  title:"Nutsa Chococo (raf-aelo) 1,5 kg",     price:20000,  image:"assets/products/p01.jpg", is15:true  },
  { id:2,  title:"Nutsa Chococo 2,5 kg",                price:33300,  image:"assets/products/p02.jpg", is15:false },
  { id:3,  title:"Nutsa Chocolat Noisettes — 700 g (x6)", price:42000, image:"assets/products/p03.png", is15:false },
  { id:4,  title:"Nutsa Chocolat Noisettes — 2,5 kg",   price:25000,  image:"assets/products/p04.jpg", is15:false },
  { id:5,  title:"Nutsa Chocolat Noisettes — 12 kg",    price:120000, image:"assets/products/p05.jpg", is15:false },
  { id:6,  title:"Nutsa Discovery Pack — 6 × 1,5 kg",   price:135000, image:"assets/products/p06.png", is15:false },
  { id:7,  title:"Nutsa Fraisita 1,5 kg",               price:37500,  image:"assets/products/p07.jpg", is15:true  },
  { id:8,  title:"Nutsa Pistache Crock 1,5 kg",         price:30800,  image:"assets/products/p08.jpg", is15:true  },
  { id:9,  title:"Nutsa Pistache — 1,5 kg",             price:20000,  image:"assets/products/p09.jpg", is15:true  },
  { id:10, title:"Nutsa Pistache — 12 kg",              price:160000, image:"assets/products/p10.jpg", is15:false },
  { id:11, title:"Nutsa Pistache — 2,5 kg",             price:33300,  image:"assets/products/p11.jpg", is15:false },
  { id:12, title:"Nutsa Rocher 1,5 kg",                 price:22500,  image:"assets/products/p12.jpg", is15:true  },
  { id:13, title:"Nutsa Rocher 2,5 kg",                 price:37500,  image:"assets/products/p13.jpg", is15:false }
];
