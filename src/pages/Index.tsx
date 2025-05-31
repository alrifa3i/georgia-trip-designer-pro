
import { useState } from 'react';
import { BookingWizard } from '@/components/BookingWizard';
import { VideoBackground } from '@/components/VideoBackground';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      
      {/* Main content with enhanced styling for video background */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-emerald-50/90 via-teal-50/85 to-cyan-50/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
              صمم رحلتك السياحية إلى جورجيا
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto drop-shadow-md font-medium">
              اكتشف جمال جورجيا وصمم برنامجك السياحي المثالي بكل سهولة
            </p>
          </div>
          
          {/* Enhanced BookingWizard container for better visibility */}
          <div className="backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl p-2">
            <BookingWizard />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="relative z-10 mt-8 py-6 bg-gray-800/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/90 text-sm">
              هذا الموقع مصمم خصيصاً لشركة عالم الفخامة في جورجيا وكل الحقوق محفوظة
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
