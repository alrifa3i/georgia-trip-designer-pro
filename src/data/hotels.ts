
import { Hotel, Transport } from '@/types/booking';

export const hotelData: Record<string, Hotel[]> = {
  "تبليسي": [
    { name: "Marjan plaza hotel", dbl_v: 90, trbl_v: 130, dbl_wv: 80, trbl_wv: 120 },
    { name: "Gallery Palace", dbl_v: 55, trbl_v: 75, dbl_wv: 45, trbl_wv: 65 },
    { name: "Hualing dormitory", dbl_v: 60, trbl_v: 80, dbl_wv: 55, trbl_wv: 75 },
    { name: "radisson red 5*", dbl_v: 150, trbl_v: 205, dbl_wv: 135, trbl_wv: 195 },
    { name: "Biltmore or pullman*5", dbl_v: 215, trbl_v: 270, dbl_wv: 215, trbl_wv: 270 },
    { name: "Addrees Hotel", dbl_v: 65, trbl_v: 75, dbl_wv: 65, trbl_wv: 75 },
    { name: "LM Hotel", dbl_v: 45, trbl_v: 60, dbl_wv: 45, trbl_wv: 60 },
    { name: "EPISODE", dbl_v: 65, trbl_v: 85, dbl_wv: 65, trbl_wv: 85 },
    { name: "Gino Seaside", dbl_v: 80, trbl_v: 100, dbl_wv: 80, trbl_wv: 100 }
  ],
  "باكورياني": [
    { name: "Bakuriani inn 5*", dbl_v: 85, trbl_v: 105, dbl_wv: 75, trbl_wv: 95 },
    { name: "crystal hotel 5*", dbl_v: 115, trbl_v: 165, dbl_wv: 105, trbl_wv: 155 },
    { name: "KOMOREBI", dbl_v: 80, trbl_v: 105, dbl_wv: 80, trbl_wv: 105 }
  ],
  "داشباش": [
    { name: "Diamond Resort 5*", dbl_v: 120, trbl_v: 140, dbl_wv: 120, trbl_wv: 140 }
  ],
  "باتومي": [
    { name: "Batumi luxury view", dbl_v: 120, trbl_v: 175, dbl_wv: 110, trbl_wv: 165 },
    { name: "New Wave Hotel", dbl_v: 105, trbl_v: 135, dbl_wv: 85, trbl_wv: 125 },
    { name: "Aqua hotel", dbl_v: 80, trbl_v: 90, dbl_wv: 75, trbl_wv: 85 },
    { name: "Hilton Batumi*5", dbl_v: 260, trbl_v: 305, dbl_wv: 220, trbl_wv: 265 },
    { name: "boulevard", dbl_v: 80, trbl_v: 95, dbl_wv: 80, trbl_wv: 95 }
  ],
  "كوتايسي": [
    { name: "kutaisi inn hotel*5", dbl_v: 90, trbl_v: 130, dbl_wv: 90, trbl_wv: 130 },
    { name: "west inn", dbl_v: 120, trbl_v: 140, dbl_wv: 115, trbl_wv: 135 }
  ],
  "كوداوري": [
    { name: "Quadrum Resort", dbl_v: 85, trbl_v: 120, dbl_wv: 75, trbl_wv: 115 },
    { name: "Gudauri inn", dbl_v: 75, trbl_v: 100, dbl_wv: 65, trbl_wv: 85 },
    { name: "Monte Hotel", dbl_v: 175, trbl_v: 190, dbl_wv: 155, trbl_wv: 170 },
  ],
  "برجومي": [
    { name: "Borjomi Likani 5*", dbl_v: 180, trbl_v: 230, dbl_wv: 120, trbl_wv: 195 },
    { name: "Crowne Plaza Borjomi 5*", dbl_v: 245, trbl_v: 270, dbl_wv: 200, trbl_wv: 225 }
  ]
};

export const transportData: Transport[] = [
  { type: "سيدان", price: 90 },
  { type: "ميني فان", price: 100 },
  { type: "فان", price: 110 },
  { type: "سبرنتر", price: 250 },
  { type: "باص", price: 400 }
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
