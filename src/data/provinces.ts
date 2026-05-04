import type { Province, ProvinceInfo } from "./types";

/**
 * District → Province lookup.
 * Every district in Nepal mapped to its province.
 */
export const DISTRICT_PROVINCE: Record<string, Province> = {
  // Koshi Province (14 districts)
  Taplejung: "Koshi",
  Panchthar: "Koshi",
  Ilam: "Koshi",
  Jhapa: "Koshi",
  Morang: "Koshi",
  Sunsari: "Koshi",
  Dhankuta: "Koshi",
  Tehrathum: "Koshi",
  Sankhuwasabha: "Koshi",
  Bhojpur: "Koshi",
  Solukhumbu: "Koshi",
  Okhaldhunga: "Koshi",
  Khotang: "Koshi",
  Udayapur: "Koshi",

  // Madhesh Province (8 districts)
  Saptari: "Madhesh",
  Siraha: "Madhesh",
  Dhanusha: "Madhesh",
  Mahottari: "Madhesh",
  Sarlahi: "Madhesh",
  Rautahat: "Madhesh",
  Bara: "Madhesh",
  Parsa: "Madhesh",

  // Bagmati Province (13 districts)
  Dolakha: "Bagmati",
  Sindhupalchok: "Bagmati",
  Ramechhap: "Bagmati",
  Sindhuli: "Bagmati",
  Kavrepalanchok: "Bagmati",
  Bhaktapur: "Bagmati",
  Lalitpur: "Bagmati",
  Kathmandu: "Bagmati",
  Nuwakot: "Bagmati",
  Rasuwa: "Bagmati",
  Dhading: "Bagmati",
  Makwanpur: "Bagmati",
  Chitawan: "Bagmati",

  // Gandaki Province (11 districts)
  Manang: "Gandaki",
  Mustang: "Gandaki",
  Myagdi: "Gandaki",
  Kaski: "Gandaki",
  Lamjung: "Gandaki",
  Gorkha: "Gandaki",
  Tanahu: "Gandaki",
  Syangja: "Gandaki",
  Parbat: "Gandaki",
  Baglung: "Gandaki",
  "Nawalparasi East": "Gandaki",

  // Lumbini Province (12 districts)
  Nawalparasi: "Lumbini",
  Rupandehi: "Lumbini",
  Kapilbastu: "Lumbini",
  Palpa: "Lumbini",
  Arghakhanchi: "Lumbini",
  Gulmi: "Lumbini",
  Pyuthan: "Lumbini",
  Rolpa: "Lumbini",
  Dang: "Lumbini",
  Banke: "Lumbini",
  Bardiya: "Lumbini",
  Rukum: "Lumbini",

  // Karnali Province (10 districts)
  Dolpa: "Karnali",
  Mugu: "Karnali",
  Humla: "Karnali",
  Jumla: "Karnali",
  Kalikot: "Karnali",
  Dailekh: "Karnali",
  Jajarkot: "Karnali",
  Surkhet: "Karnali",
  Salyan: "Karnali",
  "Rukum West": "Karnali",

  // Sudurpashchim Province (9 districts)
  Bajura: "Sudurpashchim",
  Bajhang: "Sudurpashchim",
  Darchula: "Sudurpashchim",
  Baitadi: "Sudurpashchim",
  Dadeldhura: "Sudurpashchim",
  Doti: "Sudurpashchim",
  Achham: "Sudurpashchim",
  Kailali: "Sudurpashchim",
  Kanchanpur: "Sudurpashchim",
};

/** Province metadata with default colors */
export const PROVINCES: ProvinceInfo[] = [
  {
    name: "Koshi",
    color: "#E8505B",
    stroke: "#c0404a",
    districts: Object.entries(DISTRICT_PROVINCE)
      .filter(([, p]) => p === "Koshi")
      .map(([d]) => d),
  },
  {
    name: "Madhesh",
    color: "#F9A826",
    stroke: "#d08e20",
    districts: Object.entries(DISTRICT_PROVINCE)
      .filter(([, p]) => p === "Madhesh")
      .map(([d]) => d),
  },
  {
    name: "Bagmati",
    color: "#2ECC71",
    stroke: "#25a85c",
    districts: Object.entries(DISTRICT_PROVINCE)
      .filter(([, p]) => p === "Bagmati")
      .map(([d]) => d),
  },
  {
    name: "Gandaki",
    color: "#3498DB",
    stroke: "#2a7ab5",
    districts: Object.entries(DISTRICT_PROVINCE)
      .filter(([, p]) => p === "Gandaki")
      .map(([d]) => d),
  },
  {
    name: "Lumbini",
    color: "#9B59B6",
    stroke: "#7d4792",
    districts: Object.entries(DISTRICT_PROVINCE)
      .filter(([, p]) => p === "Lumbini")
      .map(([d]) => d),
  },
  {
    name: "Karnali",
    color: "#E67E22",
    stroke: "#c0691c",
    districts: Object.entries(DISTRICT_PROVINCE)
      .filter(([, p]) => p === "Karnali")
      .map(([d]) => d),
  },
  {
    name: "Sudurpashchim",
    color: "#1ABC9C",
    stroke: "#15967d",
    districts: Object.entries(DISTRICT_PROVINCE)
      .filter(([, p]) => p === "Sudurpashchim")
      .map(([d]) => d),
  },
];

/** Province color lookup */
export const PROVINCE_COLORS: Record<Province, { fill: string; stroke: string }> = {
  Koshi: { fill: "#E8505B", stroke: "#c0404a" },
  Madhesh: { fill: "#F9A826", stroke: "#d08e20" },
  Bagmati: { fill: "#2ECC71", stroke: "#25a85c" },
  Gandaki: { fill: "#3498DB", stroke: "#2a7ab5" },
  Lumbini: { fill: "#9B59B6", stroke: "#7d4792" },
  Karnali: { fill: "#E67E22", stroke: "#c0691c" },
  Sudurpashchim: { fill: "#1ABC9C", stroke: "#15967d" },
};

/** All province names */
export const PROVINCE_NAMES: Province[] = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

/** All district names */
export const DISTRICT_NAMES: string[] = Object.keys(DISTRICT_PROVINCE);
