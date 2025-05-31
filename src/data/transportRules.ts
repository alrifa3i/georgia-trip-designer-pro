
// قواعد احتساب أسعار الاستقبال والتوديع والسيارات

export const transportPricing = {
  sedan: {
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
  minivan: {
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
  van: {
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
  sprinter: {
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
    tbilisi: 0, // إذا كان الوصول تبليسي
    batumi: 2,  // إذا كان الوصول باتومي
    kutaisi: 2  // إذا كان الوصول كوتايسي
  },
  
  departureRules: {
    tbilisi: 0, // إذا كانت المغادرة من تبليسي
    batumi: 2,  // إذا كانت المغادرة من باتومي
    kutaisi: 2  // إذا كانت المغادرة من كوتايسي
  }
};
