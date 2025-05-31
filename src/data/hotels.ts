
import { Hotel, Transport, Currency, Airport, AdditionalServiceData } from '@/types/booking';

// المطارات
export const airports: Airport[] = [
  { code: 'tbilisi', name: 'Tbilisi International Airport', nameAr: 'مطار تبليسي الدولي', city: 'تبليسي' },
  { code: 'batumi', name: 'Batumi International Airport', nameAr: 'مطار باتومي الدولي', city: 'باتومي' },
  { code: 'kutaisi', name: 'Kutaisi International Airport', nameAr: 'مطار كوتايسي الدولي', city: 'كوتايسي' }
];

// العملات
export const currencies: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    nameAr: 'الدولار الأمريكي',
    symbol: '$',
    rate: 1,
    exchangeRate: 1
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    nameAr: 'الريال السعودي',
    symbol: 'ر.س',
    rate: 3.75,
    exchangeRate: 3.75
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    nameAr: 'الدرهم الإماراتي',
    symbol: 'د.إ',
    rate: 3.67,
    exchangeRate: 3.67
  },
  {
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    nameAr: 'الدينار الكويتي',
    symbol: 'د.ك',
    rate: 0.31,
    exchangeRate: 0.31
  }
];

// أنواع النقل
export const transportData: Transport[] = [
  {
    id: '1',
    type: 'سيدان',
    daily_price: 80,
    capacity: '1-3 أشخاص',
    reception_same_city_price: 25,
    reception_different_city_price: 50,
    farewell_same_city_price: 25,
    farewell_different_city_price: 50,
    is_active: true,
    price: 80,
    reception: { sameCity: 25, differentCity: 50 },
    farewell: { sameCity: 25, differentCity: 50 }
  },
  {
    id: '2',
    type: 'ميني فان',
    daily_price: 120,
    capacity: '4-6 أشخاص',
    reception_same_city_price: 35,
    reception_different_city_price: 70,
    farewell_same_city_price: 35,
    farewell_different_city_price: 70,
    is_active: true,
    price: 120,
    reception: { sameCity: 35, differentCity: 70 },
    farewell: { sameCity: 35, differentCity: 70 }
  },
  {
    id: '3',
    type: 'فان',
    daily_price: 150,
    capacity: '7-8 أشخاص',
    reception_same_city_price: 45,
    reception_different_city_price: 90,
    farewell_same_city_price: 45,
    farewell_different_city_price: 90,
    is_active: true,
    price: 150,
    reception: { sameCity: 45, differentCity: 90 },
    farewell: { sameCity: 45, differentCity: 90 }
  },
  {
    id: '4',
    type: 'سبرنتر',
    daily_price: 200,
    capacity: '9-14 شخص',
    reception_same_city_price: 60,
    reception_different_city_price: 120,
    farewell_same_city_price: 60,
    farewell_different_city_price: 120,
    is_active: true,
    price: 200,
    reception: { sameCity: 60, differentCity: 120 },
    farewell: { sameCity: 60, differentCity: 120 }
  },
  {
    id: '5',
    type: 'باص',
    daily_price: 280,
    capacity: '15+ أشخاص',
    reception_same_city_price: 80,
    reception_different_city_price: 160,
    farewell_same_city_price: 80,
    farewell_different_city_price: 160,
    is_active: true,
    price: 280,
    reception: { sameCity: 80, differentCity: 160 },
    farewell: { sameCity: 80, differentCity: 160 }
  }
];

// الخدمات الإضافية
export const additionalServicesData: AdditionalServiceData = {
  travelInsurance: {
    pricePerPersonPerDay: 5,
    pricePerPerson: 5,
    nameAr: 'تأمين السفر'
  },
  phoneLines: {
    pricePerLine: 15,
    nameAr: 'خط اتصال'
  },
  roomDecoration: {
    price: 50,
    nameAr: 'تزيين الغرفة'
  },
  airportReception: {
    pricePerPerson: 240,
    nameAr: 'استقبال VIP من المطار'
  }
};

// فنادق تبليسي
const tbilisiHotels: Hotel[] = [
  {
    id: '1',
    name: 'فندق تبليسي الاقتصادي',
    city: 'تبليسي',
    single_price: 45,
    single_view_price: 55,
    double_without_view_price: 65,
    double_view_price: 75,
    triple_without_view_price: 85,
    triple_view_price: 95,
    rating: 3,
    distance_from_center: 2,
    amenities: ['واي فاي مجاني', 'إفطار'],
    is_active: true,
    single: 45,
    single_v: 55,
    dbl_wv: 65,
    dbl_v: 75,
    trbl_wv: 85,
    trbl_v: 95
  },
  {
    id: '2',
    name: 'فندق تبليسي المتوسط',
    city: 'تبليسي',
    single_price: 65,
    single_view_price: 75,
    double_without_view_price: 85,
    double_view_price: 95,
    triple_without_view_price: 105,
    triple_view_price: 115,
    rating: 4,
    distance_from_center: 1.5,
    amenities: ['واي فاي مجاني', 'إفطار', 'مسبح'],
    is_active: true,
    single: 65,
    single_v: 75,
    dbl_wv: 85,
    dbl_v: 95,
    trbl_wv: 105,
    trbl_v: 115
  }
];

// فنادق باتومي
const batumiHotels: Hotel[] = [
  {
    id: '3',
    name: 'فندق باتومي الاقتصادي',
    city: 'باتومي',
    single_price: 50,
    single_view_price: 60,
    double_without_view_price: 70,
    double_view_price: 80,
    triple_without_view_price: 90,
    triple_view_price: 100,
    rating: 3,
    distance_from_center: 3,
    amenities: ['واي فاي مجاني', 'إفطار'],
    is_active: true,
    single: 50,
    single_v: 60,
    dbl_wv: 70,
    dbl_v: 80,
    trbl_wv: 90,
    trbl_v: 100
  },
  {
    id: '4',
    name: 'فندق باتومي المتوسط',
    city: 'باتومي',
    single_price: 70,
    single_view_price: 80,
    double_without_view_price: 90,
    double_view_price: 100,
    triple_without_view_price: 110,
    triple_view_price: 120,
    rating: 4,
    distance_from_center: 2,
    amenities: ['واي فاي مجاني', 'إفطار', 'إطلالة بحرية'],
    is_active: true,
    single: 70,
    single_v: 80,
    dbl_wv: 90,
    dbl_v: 100,
    trbl_wv: 110,
    trbl_v: 120
  }
];

// فنادق كوتايسي
const kutaisiHotels: Hotel[] = [
  {
    id: '5',
    name: 'فندق كوتايسي الاقتصادي',
    city: 'كوتايسي',
    single_price: 40,
    single_view_price: 50,
    double_without_view_price: 60,
    double_view_price: 70,
    triple_without_view_price: 80,
    triple_view_price: 90,
    rating: 3,
    distance_from_center: 2.5,
    amenities: ['واي فاي مجاني', 'إفطار'],
    is_active: true,
    single: 40,
    single_v: 50,
    dbl_wv: 60,
    dbl_v: 70,
    trbl_wv: 80,
    trbl_v: 90
  }
];

// جمع كل الفنادق في كائن واحد
export const hotelData: Record<string, Hotel[]> = {
  'تبليسي': tbilisiHotels,
  'باتومي': batumiHotels,
  'كوتايسي': kutaisiHotels
};

// دالة حساب الجولات الإجبارية
export const getMandatoryTours = (city: string, arrivalAirport: string, departureAirport: string): number => {
  // جولات إجبارية للوصول والمغادرة
  let mandatoryTours = 0;
  
  // جولة الوصول
  if (arrivalAirport !== city.toLowerCase()) {
    mandatoryTours += 1;
  }
  
  // جولة المغادرة
  if (departureAirport !== city.toLowerCase()) {
    mandatoryTours += 1;
  }
  
  return mandatoryTours;
};
