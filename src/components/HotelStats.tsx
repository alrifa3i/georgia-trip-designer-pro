
import React from 'react';
import { MapPin, Building } from 'lucide-react';

const cityStats = [
  { name: 'تبليسي', count: 16 },
  { name: 'باتومي', count: 10 },
  { name: 'كوداوري', count: 5 },
  { name: 'باكورياني', count: 3 },
  { name: 'برجومي', count: 3 },
  { name: 'كوتايسي', count: 2 },
  { name: 'كاخيتي', count: 2 },
  { name: 'داش باش', count: 1 }
];

export const HotelStats = () => {
  return (
    <div className="text-center mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-white text-xl sm:text-2xl font-bold mb-6 flex items-center justify-center gap-2 animate-fade-in">
          <Building className="w-6 h-6 animate-pulse" />
          فنادقنا المتاحة في جميع أنحاء جورجيا
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              <div className="text-emerald-200 text-xs sm:text-sm">
                {city.count === 1 ? 'فندق واحد' : 
                 city.count === 2 ? 'فندقان' : 
                 `${city.count} فنادق`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
