
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

// قواعد الجولات الإجبارية المحدثة
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

// تطبيق قواعد الجولات الإجبارية
export const calculateMandatoryTours = (
  cityName: string, 
  arrivalAirport: string, 
  departureAirport: string,
  isFirstCity: boolean = false,
  isLastCity: boolean = false
): number => {
  let mandatoryTours = 0;

  // قواعد المدن العامة
  if (cityName === 'باتومي') {
    mandatoryTours = 2;
  } else {
    mandatoryTours = 1;
  }

  // قواعد المطارات - تطبق فقط على المدينة الأولى والأخيرة
  if (isFirstCity && arrivalAirport === 'TBS') {
    mandatoryTours = 0;
  }
  
  if (isLastCity && departureAirport === 'TBS') {
    mandatoryTours = 0;
  }

  if (isFirstCity && (arrivalAirport === 'BUS' || arrivalAirport === 'KUT')) {
    mandatoryTours = 2;
  }
  
  if (isLastCity && (departureAirport === 'BUS' || departureAirport === 'KUT')) {
    mandatoryTours = 2;
  }

  return mandatoryTours;
};
