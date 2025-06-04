
import React, { useState, useEffect } from 'react';
import { MapPin, Building, Home, Mountain, Trees, Car } from 'lucide-react';

const cityStats = [
  { name: 'تبليسي', hotels: 16, chalets: 8, resorts: 5, apartments: 15, cars: 25 },
  { name: 'باتومي', hotels: 12, chalets: 6, resorts: 4, apartments: 12, cars: 20 },
  { name: 'كوداوري', hotels: 8, chalets: 3, resorts: 2, apartments: 8, cars: 15 },
  { name: 'باكورياني', hotels: 6, chalets: 2, resorts: 1, apartments: 6, cars: 12 },
  { name: 'برجومي', hotels: 5, chalets: 1, resorts: 1, apartments: 4, cars: 10 },
  { name: 'كوتايسي', hotels: 4, chalets: 1, resorts: 0, apartments: 3, cars: 8 },
  { name: 'كاخيتي', hotels: 3, chalets: 1, resorts: 0, apartments: 2, cars: 6 },
  { name: 'داش باش', hotels: 2, chalets: 1, resorts: 0, apartments: 1, cars: 4 }
];

const accommodationTypes = [
  { key: 'hotels', name: 'فنادق', icon: Building, color: 'emerald' },
  { key: 'chalets', name: 'أكواخ', icon: Home, color: 'blue' },
  { key: 'resorts', name: 'منتجعات', icon: Trees, color: 'green' },
  { key: 'apartments', name: 'شقق', icon: Mountain, color: 'purple' },
  { key: 'cars', name: 'سيارات', icon: Car, color: 'orange' }
];

export const HotelStats = () => {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  useEffect(() => {
    const cityInterval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cityStats.length);
    }, 3000);

    const typeInterval = setInterval(() => {
      setCurrentTypeIndex((prev) => (prev + 1) % accommodationTypes.length);
    }, 2000);

    return () => {
      clearInterval(cityInterval);
      clearInterval(typeInterval);
    };
  }, []);

  const currentCity = cityStats[currentCityIndex];
  const currentType = accommodationTypes[currentTypeIndex];
  const CurrentIcon = currentType.icon;
  const currentCount = currentCity[currentType.key as keyof typeof currentCity] as number;

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'from-emerald-500 to-emerald-600 text-emerald-100',
      blue: 'from-blue-500 to-blue-600 text-blue-100',
      green: 'from-green-500 to-green-600 text-green-100',
      purple: 'from-purple-500 to-purple-600 text-purple-100',
      orange: 'from-orange-500 to-orange-600 text-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const formatCount = (count: number, type: string) => {
    if (count === 1) {
      if (type === 'فنادق') return 'فندق واحد';
      if (type === 'أكواخ') return 'كوخ واحد';
      if (type === 'منتجعات') return 'منتجع واحد';
      if (type === 'شقق') return 'شقة واحدة';
      if (type === 'سيارات') return 'سيارة واحدة';
    } else if (count === 2) {
      if (type === 'فنادق') return 'فندقان';
      if (type === 'أكواخ') return 'كوخان';
      if (type === 'منتجعات') return 'منتجعان';
      if (type === 'شقق') return 'شقتان';
      if (type === 'سيارات') return 'سيارتان';
    }
    return `${count} ${type}`;
  };

  return (
    <div className="text-center mt-6 sm:mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center justify-center gap-2 animate-fade-in">
          <Building className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          مرافقنا المتاحة في جميع أنحاء جورجيا
        </h3>
        
        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cityStats.map((city, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span className="text-white font-semibold text-sm sm:text-base">
                  {city.name}
                </span>
              </div>
              <div className="text-emerald-200 text-xs sm:text-sm space-y-1">
                <div>{formatCount(city.hotels, 'فنادق')}</div>
                <div>{formatCount(city.chalets, 'أكواخ')}</div>
                <div>{formatCount(city.resorts, 'منتجعات')}</div>
                <div>{formatCount(city.apartments, 'شقق')}</div>
                <div>{formatCount(city.cars, 'سيارات')}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Single Rotating Card */}
        <div className="md:hidden mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-emerald-300" />
              <span className="text-white font-bold text-xl">
                {currentCity.name}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <CurrentIcon className={`w-8 h-8 animate-pulse ${
                currentType.color === 'emerald' ? 'text-emerald-300' :
                currentType.color === 'blue' ? 'text-blue-300' :
                currentType.color === 'green' ? 'text-green-300' :
                currentType.color === 'purple' ? 'text-purple-300' :
                'text-orange-300'
              }`} />
              <span className="text-white font-semibold text-lg">
                {currentType.name}
              </span>
            </div>
            
            <div className="text-center">
              <span className="text-white text-2xl font-bold">
                {formatCount(currentCount, currentType.name)}
              </span>
            </div>
            
            {/* Progress indicators */}
            <div className="flex justify-center mt-4 gap-2">
              {cityStats.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentCityIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {accommodationTypes.map((type, index) => {
            const Icon = type.icon;
            const totalCount = cityStats.reduce((sum, city) => sum + (city[type.key as keyof typeof city] as number), 0);
            
            return (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in hover:bg-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 animate-pulse ${
                    type.color === 'emerald' ? 'text-emerald-300' :
                    type.color === 'blue' ? 'text-blue-300' :
                    type.color === 'green' ? 'text-green-300' :
                    type.color === 'purple' ? 'text-purple-300' :
                    'text-orange-300'
                  }`} />
                  <span className="font-semibold text-sm sm:text-base text-white">
                    {type.name}
                  </span>
                </div>
                <div className="text-center text-xl sm:text-2xl font-bold text-white">
                  {totalCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
