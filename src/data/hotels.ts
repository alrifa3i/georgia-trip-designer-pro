
import { Hotel, Transport, Currency, Airport, AdditionalServiceData } from '@/types/booking';

// المطارات
export const airports: Airport[] = [
  { code: 'tbilisi', name: 'Tbilisi International Airport', nameAr: 'مطار تبليسي الدولي', city: 'تبليسي' },
  { code: 'batumi', name: 'Batumi International Airport', nameAr: 'مطار باتومي الدولي', city: 'باتومي' },
  { code: 'kutaisi', name: 'Kutaisi International Airport', nameAr: 'مطار كوتايسي الدولي', city: 'كوتايسي' }
];

// ربط المطارات بالمدن
export const airportCityMapping: Record<string, string> = {
  'tbilisi': 'تبليسي',
  'batumi': 'باتومي',
  'kutaisi': 'كوتايسي'
};

// الجولات المتاحة
export const availableTours: Record<string, { name: string; description?: string }[]> = {
  'تبليسي': [
    { name: 'جولة المدينة القديمة', description: 'استكشاف البلدة القديمة والمعالم التاريخية' },
    { name: 'جولة مصنع النبيذ', description: 'زيارة مصانع النبيذ المحلية' },
    { name: 'جولة القلعة والحمامات', description: 'زيارة قلعة ناريكالا والحمامات الكبريتية' }
  ],
  'باتومي': [
    { name: 'جولة الواجهة البحرية', description: 'استكشاف الكورنيش والشاطئ' },
    { name: 'جولة الحديقة النباتية', description: 'زيارة الحديقة النباتية الشهيرة' },
    { name: 'جولة المدينة الحديثة', description: 'استكشاف المباني الحديثة والكازينوهات' }
  ],
  'كوتايسي': [
    { name: 'جولة الكهوف', description: 'زيارة كهف بروميثيوس الشهير' },
    { name: 'جولة الأديرة', description: 'زيارة الأديرة التاريخية' }
  ],
  'باكورياني': [
    { name: 'جولة منتجع التزلج', description: 'استكشاف منتجع التزلج والطبيعة' }
  ],
  'داشباش': [
    { name: 'جولة الطبيعة', description: 'استكشاف الطبيعة الخلابة' }
  ],
  'كوداوري': [
    { name: 'جولة التزلج', description: 'تجربة التزلج على الجليد' }
  ],
  'برجومي': [
    { name: 'جولة الينابيع', description: 'زيارة الينابيع الطبيعية المعدنية' }
  ]
};

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
  },
  photoSession: {
    price: 150,
    nameAr: 'جلسة تصوير احترافية'
  },
  flowerReception: {
    price: 75,
    nameAr: 'استقبال بالورود'
  }
};

// بيانات الفنادق المحدثة
export const hotelData: Record<string, Hotel[]> = {
  "تبليسي": [
    {
      id: '1',
      name: "LM Hotel",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 45,
      double_view_price: 45,
      triple_without_view_price: 60,
      triple_view_price: 60,
      rating: 4,
      distance_from_center: 2,
      amenities: ['واي فاي مجاني', 'إفطار'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 45,
      dbl_v: 45,
      trbl_wv: 60,
      trbl_v: 60
    },
    {
      id: '2',
      name: "Gallery Palace",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 45,
      double_view_price: 55,
      triple_without_view_price: 65,
      triple_view_price: 75,
      rating: 4,
      distance_from_center: 1.5,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 45,
      dbl_v: 55,
      trbl_wv: 65,
      trbl_v: 75
    },
    {
      id: '3',
      name: "Hualing dormitory",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 55,
      double_view_price: 60,
      triple_without_view_price: 75,
      triple_view_price: 80,
      rating: 3,
      distance_from_center: 3,
      amenities: ['واي فاي مجاني', 'إفطار'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 55,
      dbl_v: 60,
      trbl_wv: 75,
      trbl_v: 80
    },
    {
      id: '4',
      name: "Addrees Hotel",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 65,
      double_view_price: 65,
      triple_without_view_price: 75,
      triple_view_price: 75,
      rating: 4,
      distance_from_center: 2,
      amenities: ['واي فاي مجاني', 'إفطار', 'مركز لياقة'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 65,
      dbl_v: 65,
      trbl_wv: 75,
      trbl_v: 75
    },
    {
      id: '5',
      name: "EPISODE",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 65,
      double_view_price: 65,
      triple_without_view_price: 85,
      triple_view_price: 85,
      rating: 4,
      distance_from_center: 1.8,
      amenities: ['واي فاي مجاني', 'إفطار', 'سبا'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 65,
      dbl_v: 65,
      trbl_wv: 85,
      trbl_v: 85
    },
    {
      id: '6',
      name: "Gino Seaside",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 80,
      double_view_price: 80,
      triple_without_view_price: 100,
      triple_view_price: 100,
      rating: 4,
      distance_from_center: 2.5,
      amenities: ['واي فاي مجاني', 'إفطار', 'مطعم'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 80,
      dbl_v: 80,
      trbl_wv: 100,
      trbl_v: 100
    },
    {
      id: '7',
      name: "Marjan plaza hotel",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 80,
      double_view_price: 90,
      triple_without_view_price: 120,
      triple_view_price: 130,
      rating: 4,
      distance_from_center: 1,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'مركز لياقة'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 80,
      dbl_v: 90,
      trbl_wv: 120,
      trbl_v: 130
    },
    {
      id: '8',
      name: "radisson red 5*",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 135,
      double_view_price: 150,
      triple_without_view_price: 195,
      triple_view_price: 205,
      rating: 5,
      distance_from_center: 0.5,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'سبا', 'مطعم فاخر'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 135,
      dbl_v: 150,
      trbl_wv: 195,
      trbl_v: 205
    },
    {
      id: '9',
      name: "Biltmore or pullman*5",
      city: 'تبليسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 215,
      double_view_price: 215,
      triple_without_view_price: 270,
      triple_view_price: 270,
      rating: 5,
      distance_from_center: 0.3,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'سبا', 'مطعم فاخر', 'خدمة الغرف'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 215,
      dbl_v: 215,
      trbl_wv: 270,
      trbl_v: 270
    }
  ],
  "باكورياني": [
    {
      id: '10',
      name: "KOMOREBI",
      city: 'باكورياني',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 80,
      double_view_price: 80,
      triple_without_view_price: 105,
      triple_view_price: 105,
      rating: 4,
      distance_from_center: 2,
      amenities: ['واي فاي مجاني', 'إفطار', 'منتجع تزلج'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 80,
      dbl_v: 80,
      trbl_wv: 105,
      trbl_v: 105
    },
    {
      id: '11',
      name: "Bakuriani inn 5*",
      city: 'باكورياني',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 75,
      double_view_price: 85,
      triple_without_view_price: 95,
      triple_view_price: 105,
      rating: 5,
      distance_from_center: 1,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'منتجع تزلج'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 75,
      dbl_v: 85,
      trbl_wv: 95,
      trbl_v: 105
    },
    {
      id: '12',
      name: "crystal hotel 5*",
      city: 'باكورياني',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 105,
      double_view_price: 115,
      triple_without_view_price: 155,
      triple_view_price: 165,
      rating: 5,
      distance_from_center: 1.5,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'سبا', 'منتجع تزلج'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 105,
      dbl_v: 115,
      trbl_wv: 155,
      trbl_v: 165
    }
  ],
  "داشباش": [
    {
      id: '13',
      name: "Diamond Resort 5*",
      city: 'داشباش',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 120,
      double_view_price: 120,
      triple_without_view_price: 140,
      triple_view_price: 140,
      rating: 5,
      distance_from_center: 5,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'سبا', 'منتجع طبيعي'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 120,
      dbl_v: 120,
      trbl_wv: 140,
      trbl_v: 140
    }
  ],
  "باتومي": [
    {
      id: '14',
      name: "Aqua hotel",
      city: 'باتومي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 75,
      double_view_price: 80,
      triple_without_view_price: 85,
      triple_view_price: 90,
      rating: 3,
      distance_from_center: 3,
      amenities: ['واي فاي مجاني', 'إفطار'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 75,
      dbl_v: 80,
      trbl_wv: 85,
      trbl_v: 90
    },
    {
      id: '15',
      name: "boulevard",
      city: 'باتومي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 80,
      double_view_price: 80,
      triple_without_view_price: 95,
      triple_view_price: 95,
      rating: 4,
      distance_from_center: 1,
      amenities: ['واي فاي مجاني', 'إفطار', 'إطلالة بحرية'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 80,
      dbl_v: 80,
      trbl_wv: 95,
      trbl_v: 95
    },
    {
      id: '16',
      name: "New Wave Hotel",
      city: 'باتومي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 85,
      double_view_price: 105,
      triple_without_view_price: 125,
      triple_view_price: 135,
      rating: 4,
      distance_from_center: 2,
      amenities: ['واي فاي مجاني', 'إفطار', 'إطلالة بحرية', 'مسبح'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 85,
      dbl_v: 105,
      trbl_wv: 125,
      trbl_v: 135
    },
    {
      id: '17',
      name: "Batumi luxury view",
      city: 'باتومي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 110,
      double_view_price: 120,
      triple_without_view_price: 165,
      triple_view_price: 175,
      rating: 4,
      distance_from_center: 1.5,
      amenities: ['واي فاي مجاني', 'إفطار', 'إطلالة بحرية', 'مسبح', 'سبا'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 110,
      dbl_v: 120,
      trbl_wv: 165,
      trbl_v: 175
    },
    {
      id: '18',
      name: "Hilton Batumi*5",
      city: 'باتومي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 220,
      double_view_price: 260,
      triple_without_view_price: 265,
      triple_view_price: 305,
      rating: 5,
      distance_from_center: 0.5,
      amenities: ['واي فاي مجاني', 'إفطار', 'إطلالة بحرية', 'مسبح', 'سبا', 'مطعم فاخر'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 220,
      dbl_v: 260,
      trbl_wv: 265,
      trbl_v: 305
    }
  ],
  "كوتايسي": [
    {
      id: '19',
      name: "kutaisi inn hotel*5",
      city: 'كوتايسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 90,
      double_view_price: 90,
      triple_without_view_price: 130,
      triple_view_price: 130,
      rating: 5,
      distance_from_center: 2,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 90,
      dbl_v: 90,
      trbl_wv: 130,
      trbl_v: 130
    },
    {
      id: '20',
      name: "west inn",
      city: 'كوتايسي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 115,
      double_view_price: 120,
      triple_without_view_price: 135,
      triple_view_price: 140,
      rating: 4,
      distance_from_center: 1.5,
      amenities: ['واي فاي مجاني', 'إفطار', 'مطعم'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 115,
      dbl_v: 120,
      trbl_wv: 135,
      trbl_v: 140
    }
  ],
  "كوداوري": [
    {
      id: '21',
      name: "Gudauri inn",
      city: 'كوداوري',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 65,
      double_view_price: 75,
      triple_without_view_price: 85,
      triple_view_price: 100,
      rating: 3,
      distance_from_center: 3,
      amenities: ['واي فاي مجاني', 'إفطار', 'منتجع تزلج'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 65,
      dbl_v: 75,
      trbl_wv: 85,
      trbl_v: 100
    },
    {
      id: '22',
      name: "Quadrum Resort",
      city: 'كوداوري',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 75,
      double_view_price: 85,
      triple_without_view_price: 115,
      triple_view_price: 120,
      rating: 4,
      distance_from_center: 2,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'منتجع تزلج'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 75,
      dbl_v: 85,
      trbl_wv: 115,
      trbl_v: 120
    },
    {
      id: '23',
      name: "Monte Hotel",
      city: 'كوداوري',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 155,
      double_view_price: 175,
      triple_without_view_price: 170,
      triple_view_price: 190,
      rating: 5,
      distance_from_center: 1,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'سبا', 'منتجع تزلج فاخر'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 155,
      dbl_v: 175,
      trbl_wv: 170,
      trbl_v: 190
    }
  ],
  "برجومي": [
    {
      id: '24',
      name: "Borjomi Likani 5*",
      city: 'برجومي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 120,
      double_view_price: 180,
      triple_without_view_price: 195,
      triple_view_price: 230,
      rating: 5,
      distance_from_center: 2,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'سبا', 'ينابيع طبيعية'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 120,
      dbl_v: 180,
      trbl_wv: 195,
      trbl_v: 230
    },
    {
      id: '25',
      name: "Crowne Plaza Borjomi 5*",
      city: 'برجومي',
      single_price: 0,
      single_view_price: 0,
      double_without_view_price: 200,
      double_view_price: 245,
      triple_without_view_price: 225,
      triple_view_price: 270,
      rating: 5,
      distance_from_center: 1,
      amenities: ['واي فاي مجاني', 'إفطار', 'مسبح', 'سبا', 'مطعم فاخر', 'ينابيع طبيعية'],
      is_active: true,
      single: 0,
      single_v: 0,
      dbl_wv: 200,
      dbl_v: 245,
      trbl_wv: 225,
      trbl_v: 270
    }
  ]
};

// دالة حساب الجولات الإجبارية
export const getMandatoryTours = (city: string, arrivalAirport: string, departureAirport: string): number => {
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
