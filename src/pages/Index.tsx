
import { useState } from 'react';
import { BookingWizard } from '@/components/BookingWizard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            صمم رحلتك السياحية إلى جورجيا
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف جمال جورجيا وصمم برنامجك السياحي المثالي بكل سهولة
          </p>
        </div>
        <BookingWizard />
      </div>
    </div>
  );
};

export default Index;
