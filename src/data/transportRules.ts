
// قواعد احتساب أسعار الاستقبال والتوديع والسيارات

export const transportPricing = {
  'سيدان': {
    dailyPrice: 90, // 1-3 أشخاص
    reception: {
      sameCity: 25,
      differentCity: 25
    },
    farewell: {
      sameCity: 25,
      differentCity: 90
    }
  },
  'ميني فان': {
    dailyPrice: 100, // 4-6 أشخاص
    reception: {
      sameCity: 45,
      differentCity: 45
    },
    farewell: {
      sameCity: 45,
      differentCity: 100
    }
  },
  'فان': {
    dailyPrice: 120, // 7-8 أشخاص
    reception: {
      sameCity: 55,
      differentCity: 55
    },
    farewell: {
      sameCity: 55,
      differentCity: 120
    }
  },
  'سبرنتر': {
    dailyPrice: 250, // 9-14 شخص
    reception: {
      sameCity: 160,
      differentCity: 160
    },
    farewell: {
      sameCity: 160,
      differentCity: 250
    }
  }
};

// قواعد الجولات الإجبارية المحدثة والدقيقة
export const mandatoryToursRules = {
  // القواعد العامة للمدن
  batumi: 2, // باتومي دائماً 2 جولة إجبارية
  default: 1, // باقي المدن 1 جولة إجبارية
  
  // قواعد خاصة حسب مطار الوصول والمغادرة
  arrivalRules: {
    'TBS': 0, // إذا كان الوصول تبليسي فلا توجد جولات إجبارية
    'BUS': 2, // إذا كان الوصول باتومي فهناك 2 جولة إجبارية
    'KUT': 2  // إذا كان الوصول كوتايسي فهناك 2 جولة إجبارية
  },
  
  departureRules: {
    'TBS': 0, // إذا كانت المغادرة من تبليسي فلا توجد جولات إجبارية
    'BUS': 2, // إذا كانت المغادرة من باتومي فهناك 2 جولة إجبارية
    'KUT': 2  // إذا كانت المغادرة من كوتايسي فهناك 2 جولة إجبارية
  }
};

// ربط المطارات بالمدن
export const airportCityMapping: Record<string, string> = {
  'TBS': 'تبليسي',
  'BUS': 'باتومي',
  'KUT': 'كوتايسي'
};

// تطبيق قواعد الجولات الإجبارية المطورة
export const calculateMandatoryTours = (
  cityName: string, 
  arrivalAirport: string, 
  departureAirport: string,
  isFirstCity: boolean = false,
  isLastCity: boolean = false
): number => {
  let mandatoryTours = 0;

  // القاعدة الأساسية: باتومي = 2 جولات، باقي المدن = 1 جولة
  if (cityName === 'باتومي') {
    mandatoryTours = 2;
  } else {
    mandatoryTours = 1;
  }

  // تطبيق قواعد المطارات على المدينة الأولى والأخيرة فقط
  if (isFirstCity) {
    // إذا كانت المدينة الأولى وكان مطار الوصول تبليسي
    if (arrivalAirport === 'TBS') {
      mandatoryTours = 0;
    }
    // إذا كان مطار الوصول باتومي أو كوتايسي
    else if (arrivalAirport === 'BUS' || arrivalAirport === 'KUT') {
      mandatoryTours = 2;
    }
  }
  
  if (isLastCity) {
    // إذا كانت المدينة الأخيرة وكان مطار المغادرة تبليسي
    if (departureAirport === 'TBS') {
      mandatoryTours = 0;
    }
    // إذا كان مطار المغادرة باتومي أو كوتايسي
    else if (departureAirport === 'BUS' || departureAirport === 'KUT') {
      mandatoryTours = 2;
    }
  }

  return mandatoryTours;
};

// دالة للتحقق من تطابق المدينة مع المطار
export const validateCityAirportMatch = (
  cityName: string,
  airportCode: string,
  isArrival: boolean = true
): { isValid: boolean; message: string } => {
  const expectedCity = airportCityMapping[airportCode];
  
  if (!expectedCity) {
    return {
      isValid: false,
      message: `مطار غير معروف: ${airportCode}`
    };
  }
  
  if (cityName !== expectedCity) {
    const directionText = isArrival ? 'الوصول' : 'المغادرة';
    return {
      isValid: false,
      message: `يجب أن تكون مدينة ${directionText} مطابقة لمطار ${directionText}: ${expectedCity}`
    };
  }
  
  return {
    isValid: true,
    message: 'المدينة مطابقة للمطار'
  };
};

// دالة حساب إجمالي الليالي المطلوبة
export const calculateRequiredNights = (arrivalDate: string, departureDate: string): number => {
  if (!arrivalDate || !departureDate) return 0;
  
  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);
  const diffInMs = departure.getTime() - arrival.getTime();
  const nights = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  return Math.max(0, nights);
};

// دالة التحقق من توزيع الليالي
export const validateNightsDistribution = (
  selectedCities: Array<{ city: string; nights: number }>,
  requiredNights: number
): { isValid: boolean; message: string; totalNights: number } => {
  const totalNights = selectedCities.reduce((sum, city) => sum + city.nights, 0);
  
  if (totalNights !== requiredNights) {
    return {
      isValid: false,
      message: `إجمالي الليالي (${totalNights}) يجب أن يكون مساوياً لمدة الرحلة (${requiredNights} ليالي)`,
      totalNights
    };
  }
  
  return {
    isValid: true,
    message: 'توزيع الليالي صحيح',
    totalNights
  };
};

// دالة محسّنة لحساب تكاليف النقل
export const calculateTransportServicesCosts = (
  arrivalAirport: string,
  departureAirport: string,
  carType: string
): { reception: number; farewell: number; total: number } => {
  const carPricing = transportPricing[carType as keyof typeof transportPricing];
  
  if (!carPricing) {
    return { reception: 0, farewell: 0, total: 0 };
  }

  // تحديد ما إذا كانت المطارات متطابقة
  const isSameAirport = arrivalAirport === departureAirport;
  
  const receptionCost = carPricing.reception[isSameAirport ? 'sameCity' : 'differentCity'];
  const farewellCost = carPricing.farewell[isSameAirport ? 'sameCity' : 'differentCity'];
  
  return {
    reception: receptionCost,
    farewell: farewellCost,
    total: receptionCost + farewellCost
  };
};
