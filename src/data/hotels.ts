
import { Hotel, Transport } from '@/types/booking';

export const hotelData: Record<string, Hotel[]> = {
  "تبليسي": [
    { name: "Marjan plaza hotel", dbl_v: 90, trbl_v: 130, dbl_wv: 80, trbl_wv: 120, rating: 4, distanceFromCenter: 2 },
    { name: "Gallery Palace", dbl_v: 55, trbl_v: 75, dbl_wv: 45, trbl_wv: 65, rating: 3, distanceFromCenter: 1 },
    { name: "Hualing dormitory", dbl_v: 60, trbl_v: 80, dbl_wv: 55, trbl_wv: 75, rating: 3, distanceFromCenter: 3 },
    { name: "radisson red 5*", dbl_v: 150, trbl_v: 205, dbl_wv: 135, trbl_wv: 195, rating: 5, distanceFromCenter: 1 },
    { name: "Biltmore or pullman*5", dbl_v: 215, trbl_v: 270, dbl_wv: 215, trbl_wv: 270, rating: 5, distanceFromCenter: 1 },
    { name: "Addrees Hotel", dbl_v: 65, trbl_v: 75, dbl_wv: 65, trbl_wv: 75, rating: 3, distanceFromCenter: 2 },
    { name: "LM Hotel", dbl_v: 45, trbl_v: 60, dbl_wv: 45, trbl_wv: 60, rating: 3, distanceFromCenter: 4 },
    { name: "EPISODE", dbl_v: 65, trbl_v: 85, dbl_wv: 65, trbl_wv: 85, rating: 4, distanceFromCenter: 2 },
    { name: "Gino Seaside", dbl_v: 80, trbl_v: 100, dbl_wv: 80, trbl_wv: 100, rating: 4, distanceFromCenter: 3 }
  ],
  "باكورياني": [
    { name: "Bakuriani inn 5*", dbl_v: 85, trbl_v: 105, dbl_wv: 75, trbl_wv: 95, rating: 5, distanceFromCenter: 1 },
    { name: "crystal hotel 5*", dbl_v: 115, trbl_v: 165, dbl_wv: 105, trbl_wv: 155, rating: 5, distanceFromCenter: 1 },
    { name: "KOMOREBI", dbl_v: 80, trbl_v: 105, dbl_wv: 80, trbl_wv: 105, rating: 4, distanceFromCenter: 2 }
  ],
  "داشباش": [
    { name: "Diamond Resort 5*", dbl_v: 120, trbl_v: 140, dbl_wv: 120, trbl_wv: 140, rating: 5, distanceFromCenter: 1 }
  ],
  "باتومي": [
    { name: "Batumi luxury view", dbl_v: 120, trbl_v: 175, dbl_wv: 110, trbl_wv: 165, rating: 4, distanceFromCenter: 1 },
    { name: "New Wave Hotel", dbl_v: 105, trbl_v: 135, dbl_wv: 85, trbl_wv: 125, rating: 4, distanceFromCenter: 2 },
    { name: "Aqua hotel", dbl_v: 80, trbl_v: 90, dbl_wv: 75, trbl_wv: 85, rating: 3, distanceFromCenter: 3 },
    { name: "Hilton Batumi*5", dbl_v: 260, trbl_v: 305, dbl_wv: 220, trbl_wv: 265, rating: 5, distanceFromCenter: 1 },
    { name: "boulevard", dbl_v: 80, trbl_v: 95, dbl_wv: 80, trbl_wv: 95, rating: 3, distanceFromCenter: 2 }
  ],
  "كوتايسي": [
    { name: "kutaisi inn hotel*5", dbl_v: 90, trbl_v: 130, dbl_wv: 90, trbl_wv: 130, rating: 5, distanceFromCenter: 1 },
    { name: "west inn", dbl_v: 120, trbl_v: 140, dbl_wv: 115, trbl_wv: 135, rating: 4, distanceFromCenter: 2 }
  ],
  "كوداوري": [
    { name: "Quadrum Resort", dbl_v: 85, trbl_v: 120, dbl_wv: 75, trbl_wv: 115, rating: 4, distanceFromCenter: 1 },
    { name: "Gudauri inn", dbl_v: 75, trbl_v: 100, dbl_wv: 65, trbl_wv: 85, rating: 3, distanceFromCenter: 2 },
    { name: "Monte Hotel", dbl_v: 175, trbl_v: 190, dbl_wv: 155, trbl_wv: 170, rating: 5, distanceFromCenter: 1 },
  ],
  "برجومي": [
    { name: "Borjomi Likani 5*", dbl_v: 180, trbl_v: 230, dbl_wv: 120, trbl_wv: 195, rating: 5, distanceFromCenter: 1 },
    { name: "Crowne Plaza Borjomi 5*", dbl_v: 245, trbl_v: 270, dbl_wv: 200, trbl_wv: 225, rating: 5, distanceFromCenter: 1 }
  ]
};

export const transportData: Transport[] = [
  { 
    type: "سيدان", 
    price: 90,
    reception: { sameCity: 25, differentCity: 25 },
    farewell: { sameCity: 25, differentCity: 90 }
  },
  { 
    type: "ميني فان", 
    price: 100,
    reception: { sameCity: 40, differentCity: 40 },
    farewell: { sameCity: 40, differentCity: 100 }
  },
  { 
    type: "فان", 
    price: 110,
    reception: { sameCity: 65, differentCity: 65 },
    farewell: { sameCity: 65, differentCity: 110 }
  },
  { 
    type: "سبرنتر", 
    price: 250,
    reception: { sameCity: 100, differentCity: 100 },
    farewell: { sameCity: 100, differentCity: 150 }
  },
  { 
    type: "باص", 
    price: 400,
    reception: { sameCity: 150, differentCity: 150 },
    farewell: { sameCity: 150, differentCity: 200 }
  }
];

export const currencies = [
  { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' },
  { code: 'EUR', name: 'يورو', symbol: '€' },
  { code: 'GBP', name: 'جنيه إسترليني', symbol: '£' }
];

export const airports = [
  'تبليسي',
  'باتومي',
  'كوتايسي',
  'الحدود البرية'
];

export const additionalServicesData = {
  travelInsurance: {
    pricePerPersonPerDay: 5
  },
  phoneLines: {
    pricePerLine: 15,
    duration: 7 // days
  },
  roomDecoration: {
    price: 100
  },
  airportReception: {
    pricePerPerson: 240
  }
};
