
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

// قواعد الجولات الإجبارية
export const mandatoryToursRules = {
  // القواعد العامة للمدن
  batumi: 2, // باتومي دائماً 2 جولة إجبارية
  default: 1, // باقي المدن 1 جولة إجبارية
  
  // قواعد خاصة حسب مطار الوصول والمغادرة
  arrivalRules: {
    'TBS': 0, // إذا كان الوصول تبليسي
    'BUS': 2,  // إذا كان الوصول باتومي
    'KUT': 2  // إذا كان الوصول كوتايسي
  },
  
  departureRules: {
    'TBS': 0, // إذا كانت المغادرة من تبليسي
    'BUS': 2,  // إذا كانت المغادرة من باتومي
    'KUT': 2  // إذا كانت المغادرة من كوتايسي
  }
};
