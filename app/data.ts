export const WA_NUMBER = "6282152425391"; // Diambil dari database settings K Gaming (082152425391 -> 62)

export interface Product {
  id: string;
  cat: 'mk' | 'mn' | 'sn';
  name: string;
  price: number;
  sold: number;
  emoji: string;
  tint: string;
  ok: boolean;
  img?: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  { id: "p0", cat: "mk", name: "Nasi Goreng Sosis", price: 18000, sold: 142, emoji: "🍳", tint: "#FFE9C7", ok: true, img: "" },
  { id: "p1", cat: "mk", name: "Mie Goreng Telur", price: 16000, sold: 120, emoji: "🍜", tint: "#FFDDCF", ok: true, img: "" },
  { id: "p2", cat: "mk", name: "Ayam Geprek", price: 20000, sold: 98, emoji: "🍗", tint: "#FFEFB8", ok: true, img: "" },
  { id: "p3", cat: "mk", name: "Indomie Kuah Telur", price: 13000, sold: 87, emoji: "🍲", tint: "#FFD6D6", ok: true, img: "" },
  { id: "p4", cat: "mk", name: "Nasi Ayam Teriyaki", price: 22000, sold: 40, emoji: "🍱", tint: "#DCE6FF", ok: false, img: "" },
  { id: "p5", cat: "mn", name: "Es Teh Manis", price: 5000, sold: 210, emoji: "🧋", tint: "#FFE8D0", ok: true, img: "" },
  { id: "p6", cat: "mn", name: "Kopi Susu Gula Aren", price: 14000, sold: 133, emoji: "☕", tint: "#EBDDCF", ok: true, img: "" },
  { id: "p7", cat: "mn", name: "Es Jeruk", price: 8000, sold: 76, emoji: "🍊", tint: "#FFE0B5", ok: true, img: "" },
  { id: "p8", cat: "mn", name: "Thai Tea", price: 12000, sold: 55, emoji: "🥤", tint: "#FFDAC4", ok: true, img: "" },
  { id: "p9", cat: "mn", name: "Air Mineral", price: 4000, sold: 60, emoji: "💧", tint: "#D6EAFF", ok: true, img: "" },
  { id: "p10", cat: "sn", name: "Kentang Goreng", price: 12000, sold: 160, emoji: "🍟", tint: "#FFF0B8", ok: true, img: "" },
  { id: "p11", cat: "sn", name: "Sosis Bakar", price: 10000, sold: 90, emoji: "🌭", tint: "#FFD9CF", ok: true, img: "" },
  { id: "p12", cat: "sn", name: "Tahu Crispy", price: 8000, sold: 70, emoji: "🧆", tint: "#F5E8C0", ok: true, img: "" },
  { id: "p13", cat: "sn", name: "Pisang Coklat", price: 10000, sold: 45, emoji: "🍌", tint: "#FFEBA8", ok: true, img: "" }
];
