
import React, { useState, useEffect } from 'react';
import { MapPin, Building, Home, Mountain, Trees, Car, Castle } from 'lucide-react';

const cityStats = [
  { name: 'تبليسي', hotels: 26, displayText: '26 فندق' },
  { name: 'باتومي', hotels: 16, displayText: '16 فندق' },
  { name: 'كوداوري', hotels: 4, displayText: '4 فنادق' },
  { name: 'داش باش', hotels: 1, displayText: 'منتجع واحد' },
  { name: 'باكورياني', hotels: 4, displayText: '4 فنادق و منتجعات' },
  { name: 'كوتايسي', hotels: 2, displayText: 'فندقان' },
  { name: 'كاخيتي', hotels: 2, displayText: 'منتجعان' }
];

const accommodationTypes = [
  { key: 'hotels', name: 'فنادق', icon: Building, color: 'emerald' },
  { key: 'chalets', name: 'أكواخ', icon: Home, color: 'blue' },
  { key: 'resorts', name: 'منتجعات', icon: Trees, color: 'green' },
  { key: 'apartments', name: 'شقق', icon: Mountain, color: 'purple' },
  { key: 'villas', name: 'الفلل والشاليهات', icon: Castle, color: 'indigo' },
  { key: 'cars', name: 'سيارات', icon: Car, color: 'orange' }
];

export const HotelStats = () => {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  useEffect(() => {
    const cityInterval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cityStats.length);
    }, 3000);

    return () => {
      clearInterval(cityInterval);
    };
  }, []);

  const currentCity = cityStats[currentCityIndex];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'text-emerald-300',
      blue: 'text-blue-300',
      green: 'text-green-300',
      purple: 'text-purple-300',
      indigo: 'text-indigo-300',
      orange: 'text-orange-300'
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="text-center mt-6 sm:mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center justify-center gap-2 animate-fade-in">
          <Building className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          مرافقنا المتاحة في جميع أنحاء جورجيا
        </h3>
        
        {/* Single Rotating Card for Cities - Visible on all screen sizes */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-emerald-300" />
              <span className="text-white font-bold text-xl">
                مدينة {currentCity.name}
              </span>
            </div>
            
            <div className="text-center">
              <span className="text-white text-xl font-bold">
                {currentCity.displayText}
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
          {accommodationTypes.map((type, index) => {
            const Icon = type.icon;
            let totalCount;
            
            // الأعداد الإجمالية المحدثة
            if (type.key === 'hotels') {
              totalCount = 46;
            } else if (type.key === 'chalets') {
              totalCount = 19;
            } else if (type.key === 'resorts') {
              totalCount = 13;
            } else if (type.key === 'apartments') {
              totalCount = 40;
            } else if (type.key === 'villas') {
              totalCount = 15;
            } else if (type.key === 'cars') {
              totalCount = 100;
            }
            
            return (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in hover:bg-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 animate-pulse ${getColorClasses(type.color)}`} />
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
