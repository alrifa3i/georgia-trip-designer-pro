import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BasicInfoStep } from './booking/BasicInfoStep';
import { TripDetailsStep } from './booking/TripDetailsStep';
import { CitySelectionStep } from './booking/CitySelectionStep';
import { AdditionalServicesStep } from './booking/AdditionalServicesStep';
import { PricingStep } from './booking/PricingStep';
import { ConfirmationStep } from './booking/ConfirmationStep';
import { BookingData } from '@/types/booking';

export const BookingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    customerName: '',
    adults: 1,
    children: [],
    arrivalDate: '',
    departureDate: '',
    arrivalAirport: '',
    departureAirport: '',
    rooms: 1,
    budget: 1000,
    currency: 'USD',
    roomTypes: [],
    carType: '',
    selectedCities: [],
    totalCost: 0,
    additionalServices: {
      travelInsurance: { enabled: false, persons: 0 },
      phoneLines: { enabled: false, quantity: 0 },
      roomDecoration: { enabled: false },
      airportReception: { enabled: false, persons: 0 }
    }
  });

  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const steps = [
    { number: 1, title: 'المعلومات الأساسية' },
    { number: 2, title: 'تفاصيل الرحلة' },
    { number: 3, title: 'اختيار المدن' },
    { number: 4, title: 'الخدمات الإضافية' },
    { number: 5, title: 'حساب الأسعار' },
    { number: 6, title: 'تأكيد الحجز' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={bookingData} updateData={updateBookingData} />;
      case 2:
        return <TripDetailsStep data={bookingData} updateData={updateBookingData} />;
      case 3:
        return <CitySelectionStep data={bookingData} updateData={updateBookingData} />;
      case 4:
        return <AdditionalServicesStep data={bookingData} updateData={updateBookingData} />;
      case 5:
        return <PricingStep data={bookingData} updateData={updateBookingData} />;
      case 6:
        return <ConfirmationStep data={bookingData} updateData={updateBookingData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {/* Enhanced Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-emerald-600 scale-110'
                    : 'bg-gray-400'
                }`}
              >
                {step.number}
              </div>
              <span className="text-sm mt-2 text-gray-700 font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Enhanced Step Content */}
      <Card className="p-8 mb-8 shadow-2xl bg-white/98 backdrop-blur-sm border-2 border-white/50">
        {renderStep()}
      </Card>

      {/* Enhanced Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center gap-2 bg-white/90 hover:bg-white border-2 border-gray-300 shadow-lg"
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </Button>
        <Button
          onClick={nextStep}
          disabled={currentStep === totalSteps}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
        >
          التالي
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
