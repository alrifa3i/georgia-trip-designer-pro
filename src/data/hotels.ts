
import { Hotel, TourLocation } from '@/types/booking';

export const georgianHotels: Hotel[] = [
  // تبليسي
  { id: '1', name: 'فندق راديسون بلو إيفيريا', city: 'تبليسي', single_price: 120, single_view_price: 150, double_without_view_price: 200, double_view_price: 250, triple_without_view_price: 280, triple_view_price: 320, rating: 5, distance_from_center: 1.2, amenities: ['واي فاي مجاني', 'مسبح', 'سبا', 'مطعم'], is_active: true },
  { id: '2', name: 'فندق تبليسي ماريوت', city: 'تبليسي', single_price: 110, single_view_price: 140, double_without_view_price: 180, double_view_price: 220, triple_without_view_price: 250, triple_view_price: 290, rating: 5, distance_from_center: 0.8, amenities: ['واي فاي مجاني', 'مطعم', 'صالة رياضية'], is_active: true },
  { id: '3', name: 'فندق شيراتون غراند تبليسي متيخي', city: 'تبليسي', single_price: 130, single_view_price: 160, double_without_view_price: 210, double_view_price: 260, triple_without_view_price: 300, triple_view_price: 350, rating: 5, distance_from_center: 1.5, amenities: ['واي فاي مجاني', 'مسبح', 'سبا'], is_active: true },
  { id: '4', name: 'بوتيك هوتل تبليسي', city: 'تبليسي', single_price: 80, single_view_price: 100, double_without_view_price: 130, double_view_price: 160, triple_without_view_price: 180, triple_view_price: 210, rating: 4, distance_from_center: 0.5, amenities: ['واي فاي مجاني', 'مطعم'], is_active: true },
  { id: '5', name: 'فندق كمبينسكي تبليسي', city: 'تبليسي', single_price: 180, single_view_price: 220, double_without_view_price: 280, double_view_price: 350, triple_without_view_price: 400, triple_view_price: 480, rating: 5, distance_from_center: 1.0, amenities: ['واي فاي مجاني', 'مسبح', 'سبا', 'مطعم'], is_active: true },
  { id: '6', name: 'هوتل غابالا', city: 'تبليسي', single_price: 60, single_view_price: 80, double_without_view_price: 100, double_view_price: 130, triple_without_view_price: 150, triple_view_price: 180, rating: 3, distance_from_center: 2.0, amenities: ['واي فاي مجاني'], is_active: true },
  { id: '7', name: 'فندق هيلتون تبليسي', city: 'تبليسي', single_price: 140, single_view_price: 170, double_without_view_price: 220, double_view_price: 270, triple_without_view_price: 320, triple_view_price: 380, rating: 5, distance_from_center: 1.8, amenities: ['واي فاي مجاني', 'مسبح', 'سبا'], is_active: true },
  { id: '8', name: 'تيفليس بالاس', city: 'تبليسي', single_price: 70, single_view_price: 90, double_without_view_price: 110, double_view_price: 140, triple_without_view_price: 160, triple_view_price: 190, rating: 4, distance_from_center: 1.2, amenities: ['واي فاي مجاني', 'مطعم'], is_active: true },
  { id: '9', name: 'فندق كوختا', city: 'تبليسي', single_price: 90, single_view_price: 110, double_without_view_price: 140, double_view_price: 170, triple_without_view_price: 200, triple_view_price: 230, rating: 4, distance_from_center: 0.7, amenities: ['واي فاي مجاني', 'مطعم'], is_active: true },

  // باتومي
  { id: '10', name: 'شيراتون باتومي', city: 'باتومي', single_price: 120, single_view_price: 150, double_without_view_price: 200, double_view_price: 250, triple_without_view_price: 280, triple_view_price: 320, rating: 5, distance_from_center: 0.5, amenities: ['واي فاي مجاني', 'إطلالة بحرية', 'مسبح'], is_active: true },
  { id: '11', name: 'هيلتون باتومي', city: 'باتومي', single_price: 130, single_view_price: 160, double_without_view_price: 210, double_view_price: 260, triple_without_view_price: 300, triple_view_price: 350, rating: 5, distance_from_center: 0.3, amenities: ['واي فاي مجاني', 'إطلالة بحرية', 'سبا'], is_active: true },
  { id: '12', name: 'رديسون بلو باتومي', city: 'باتومي', single_price: 110, single_view_price: 140, double_without_view_price: 180, double_view_price: 220, triple_without_view_price: 250, triple_view_price: 290, rating: 5, distance_from_center: 0.4, amenities: ['واي فاي مجاني', 'إطلالة بحرية'], is_active: true },

  // كوتايسي
  { id: '13', name: 'بست ويسترن كوتايسي', city: 'كوتايسي', single_price: 80, single_view_price: 100, double_without_view_price: 130, double_view_price: 160, triple_without_view_price: 180, triple_view_price: 210, rating: 4, distance_from_center: 1.0, amenities: ['واي فاي مجاني', 'مطعم'], is_active: true },

  // بورجومي
  { id: '14', name: 'كراون بلازا بورجومي', city: 'بورجومي', single_price: 100, single_view_price: 130, double_without_view_price: 160, double_view_price: 200, triple_without_view_price: 230, triple_view_price: 270, rating: 5, distance_from_center: 0.8, amenities: ['واي فاي مجاني', 'سبا', 'مياه معدنية'], is_active: true },
  { id: '15', name: 'ريكسوس بورجومي', city: 'بورجومي', single_price: 150, single_view_price: 180, double_without_view_price: 240, double_view_price: 290, triple_without_view_price: 340, triple_view_price: 400, rating: 5, distance_from_center: 1.2, amenities: ['واي فاي مجاني', 'سبا', 'مياه معدنية'], is_active: true },
  { id: '16', name: 'فندق بورجومي بالاس', city: 'بورجومي', single_price: 70, single_view_price: 90, double_without_view_price: 110, double_view_price: 140, triple_without_view_price: 160, triple_view_price: 190, rating: 4, distance_from_center: 0.5, amenities: ['واي فاي مجاني'], is_active: true },
  { id: '17', name: 'فندق ليكاني', city: 'بورجومي', single_price: 90, single_view_price: 110, double_without_view_price: 140, double_view_price: 170, triple_without_view_price: 200, triple_view_price: 230, rating: 4, distance_from_center: 1.5, amenities: ['واي فاي مجاني', 'مياه معدنية'], is_active: true },
  { id: '18', name: 'فندق فيرما', city: 'بورجومي', single_price: 60, single_view_price: 80, double_without_view_price: 100, double_view_price: 130, triple_without_view_price: 150, triple_view_price: 180, rating: 3, distance_from_center: 2.0, amenities: ['واي فاي مجاني'], is_active: true },

  // غودوري
  { id: '19', name: 'فندق ماركو بولو غودوري', city: 'غودوري', single_price: 120, single_view_price: 150, double_without_view_price: 200, double_view_price: 250, triple_without_view_price: 280, triple_view_price: 320, rating: 4, distance_from_center: 0.2, amenities: ['واي فاي مجاني', 'منتجع تزلج'], is_active: true },
  { id: '20', name: 'فندق روومز غودوري', city: 'غودوري', single_price: 80, single_view_price: 100, double_without_view_price: 130, double_view_price: 160, triple_without_view_price: 180, triple_view_price: 210, rating: 4, distance_from_center: 0.5, amenities: ['واي فاي مجاني'], is_active: true },

  // متسخيتا
  { id: '21', name: 'فندق ساليبي', city: 'متسخيتا', single_price: 70, single_view_price: 90, double_without_view_price: 110, double_view_price: 140, triple_without_view_price: 160, triple_view_price: 190, rating: 4, distance_from_center: 0.3, amenities: ['واي فاي مجاني', 'موقع تاريخي'], is_active: true },
  { id: '22', name: 'هوتل أرماري', city: 'متسخيتا', single_price: 60, single_view_price: 80, double_without_view_price: 100, double_view_price: 130, triple_without_view_price: 150, triple_view_price: 180, rating: 3, distance_from_center: 0.8, amenities: ['واي فاي مجاني'], is_active: true },
  { id: '23', name: 'بيت ضيافة متسخيتا', city: 'متسخيتا', single_price: 50, single_view_price: 70, double_without_view_price: 80, double_view_price: 110, triple_without_view_price: 130, triple_view_price: 160, rating: 3, distance_from_center: 1.0, amenities: ['واي فاي مجاني'], is_active: true },

  // زوغديدي
  { id: '24', name: 'فندق أوديشي', city: 'زوغديدي', single_price: 60, single_view_price: 80, double_without_view_price: 100, double_view_price: 130, triple_without_view_price: 150, triple_view_price: 180, rating: 3, distance_from_center: 1.5, amenities: ['واي فاي مجاني'], is_active: true },
  { id: '25', name: 'هوتل إيفيريا زوغديدي', city: 'زوغديدي', single_price: 80, single_view_price: 100, double_without_view_price: 130, double_view_price: 160, triple_without_view_price: 180, triple_view_price: 210, rating: 4, distance_from_center: 0.8, amenities: ['واي فاي مجاني', 'مطعم'], is_active: true }
];

export const georgianTourLocations: TourLocation[] = [
  {
    name: 'مدينة الحب سيغناغي',
    description: 'مدينة رومانسية في منطقة كاخيتي',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 2,
      fromKutaisi: 2,
      toTbilisi: 1,
      toBatumi: 2,
      toKutaisi: 2
    }
  },
  {
    name: 'بحيرة ريتسا الساحرة',
    description: 'بحيرة طبيعية خلابة في أبخازيا',
    mandatoryTours: {
      fromTbilisi: 2,
      fromBatumi: 1,
      fromKutaisi: 2,
      toTbilisi: 2,
      toBatumi: 1,
      toKutaisi: 2
    }
  },
  {
    name: 'جسر السلام تبليسي',
    description: 'جسر حديث مضيء في قلب تبليسي',
    mandatoryTours: {
      fromTbilisi: 0,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 0,
      toBatumi: 1,
      toKutaisi: 1
    }
  },
  {
    name: 'قلعة ناريكالا التاريخية',
    description: 'قلعة تاريخية تطل على تبليسي',
    mandatoryTours: {
      fromTbilisi: 0,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 0,
      toBatumi: 1,
      toKutaisi: 1
    }
  },
  {
    name: 'حديقة باتومي النباتية',
    description: 'حديقة نباتية واسعة بإطلالة بحرية',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 0,
      fromKutaisi: 1,
      toTbilisi: 1,
      toBatumi: 0,
      toKutaisi: 1
    }
  },
  {
    name: 'برج الحروف الأبجدية',
    description: 'برج يمثل الأبجدية الجورجية في باتومي',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 0,
      fromKutaisi: 1,
      toTbilisi: 1,
      toBatumi: 0,
      toKutaisi: 1
    }
  },
  {
    name: 'دير جفاري المقدس',
    description: 'دير تاريخي في متسخيتا',
    mandatoryTours: {
      fromTbilisi: 0,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 0,
      toBatumi: 1,
      toKutaisi: 1
    }
  },
  {
    name: 'كنيسة سفيتيتسخوفيلي',
    description: 'كاتدرائية تاريخية في متسخيتا',
    mandatoryTours: {
      fromTbilisi: 0,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 0,
      toBatumi: 1,
      toKutaisi: 1
    }
  },

  // في تبليسي
  {
    name: 'حي الكبريت القديم',
    description: 'منطقة الحمامات الكبريتية التاريخية',
    mandatoryTours: {
      fromTbilisi: 0,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 0,
      toBatumi: 1,
      toKutaisi: 1
    }
  },
  {
    name: 'شارع روستافيلي',
    description: 'الشارع الرئيسي في تبليسي',
    mandatoryTours: {
      fromTbilisi: 0,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 0,
      toBatumi: 1,
      toKutaisi: 1
    }
  },
  {
    name: 'متاتسميندا بارك',
    description: 'حديقة ترفيهية على قمة جبل',
    mandatoryTours: {
      fromTbilisi: 0,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 0,
      toBatumi: 1,
      toKutaisi: 1
    }
  },

  // قرب كوتايسي
  {
    name: 'كهف بروميثيوس',
    description: 'كهف طبيعي مذهل مع تشكيلات صخرية',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 1,
      fromKutaisi: 0,
      toTbilisi: 1,
      toBatumi: 1,
      toKutaisi: 0
    }
  },
  {
    name: 'وادي أوكاتسي',
    description: 'وادي طبيعي بشلالات خلابة',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 1,
      fromKutaisi: 0,
      toTbilisi: 1,
      toBatumi: 1,
      toKutaisi: 0
    }
  },

  // في بورجومي
  {
    name: 'حديقة بورجومي المركزية',
    description: 'حديقة تحتوي على ينابيع المياه المعدنية',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 1,
      toBatumi: 1,
      toKutaisi: 1
    }
  },
  {
    name: 'قصر رومانوف',
    description: 'قصر تاريخي للعائلة الروسية المالكة',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 1,
      toBatumi: 1,
      toKutaisi: 1
    }
  },

  // في غودوري
  {
    name: 'منتجع غودوري للتزلج',
    description: 'منتجع تزلج حديث في جبال القوقاز',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 2,
      fromKutaisi: 2,
      toTbilisi: 1,
      toBatumi: 2,
      toKutaisi: 2
    }
  },
  {
    name: 'كاراباديا للتزلج',
    description: 'منطقة تزلج إضافية في غودوري',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 2,
      fromKutaisi: 2,
      toTbilisi: 1,
      toBatumi: 2,
      toKutaisi: 2
    }
  },
  {
    name: 'قلعة أنانوري',
    description: 'قلعة تاريخية على طريق الحرير',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 2,
      fromKutaisi: 2,
      toTbilisi: 1,
      toBatumi: 2,
      toKutaisi: 2
    }
  },

  // مناطق أخرى
  {
    name: 'بحيرة بازاليتي',
    description: 'بحيرة هادئة قرب تبليسي',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 2,
      fromKutaisi: 2,
      toTbilisi: 1,
      toBatumi: 2,
      toKutaisi: 2
    }
  },
  {
    name: 'وادي تروسو',
    description: 'وادي جبلي خلاب',
    mandatoryTours: {
      fromTbilisi: 1,
      fromBatumi: 2,
      fromKutaisi: 2,
      toTbilisi: 1,
      toBatumi: 2,
      toKutaisi: 2
    }
  },

  // في زوغديدي
  {
    name: 'قصر دادياني',
    description: 'قصر تاريخي لعائلة دادياني النبيلة',
    mandatoryTours: {
      fromTbilisi: 2,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 2,
      toBatumi: 1,
      toKutaisi: 1
    }
  },
  {
    name: 'حديقة زوغديدي النباتية',
    description: 'حديقة نباتية تاريخية',
    mandatoryTours: {
      fromTbilisi: 2,
      fromBatumi: 1,
      fromKutaisi: 1,
      toTbilisi: 2,
      toBatumi: 1,
      toKutaisi: 1
    }
  }
];

export const transportTypes = [
  { 
    id: '1', 
    type: 'سيارة اقتصادية', 
    daily_price: 50, 
    capacity: '1-4 أشخاص', 
    reception_same_city_price: 30,
    reception_different_city_price: 80,
    farewell_same_city_price: 30,
    farewell_different_city_price: 80,
    is_active: true 
  },
  { 
    id: '2', 
    type: 'سيارة متوسطة', 
    daily_price: 70, 
    capacity: '1-5 أشخاص', 
    reception_same_city_price: 40,
    reception_different_city_price: 100,
    farewell_same_city_price: 40,
    farewell_different_city_price: 100,
    is_active: true 
  },
  { 
    id: '3', 
    type: 'سيارة كبيرة', 
    daily_price: 90, 
    capacity: '1-7 أشخاص', 
    reception_same_city_price: 50,
    reception_different_city_price: 120,
    farewell_same_city_price: 50,
    farewell_different_city_price: 120,
    is_active: true 
  },
  { 
    id: '4', 
    type: 'فان', 
    daily_price: 120, 
    capacity: '8-12 شخص', 
    reception_same_city_price: 60,
    reception_different_city_price: 150,
    farewell_same_city_price: 60,
    farewell_different_city_price: 150,
    is_active: true 
  },
  { 
    id: '5', 
    type: 'حافلة صغيرة', 
    daily_price: 180, 
    capacity: '13-20 شخص', 
    reception_same_city_price: 80,
    reception_different_city_price: 200,
    farewell_same_city_price: 80,
    farewell_different_city_price: 200,
    is_active: true 
  },
  { 
    id: '6', 
    type: 'حافلة كبيرة', 
    daily_price: 250, 
    capacity: '21+ شخص', 
    reception_same_city_price: 100,
    reception_different_city_price: 250,
    farewell_same_city_price: 100,
    farewell_different_city_price: 250,
    is_active: true 
  }
];
