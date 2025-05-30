
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BasicInfoStep } from './booking/BasicInfoStep';
import { TripDetailsStep } from './booking/TripDetailsStep';
import { CitySelectionStep } from './booking/CitySelectionStep';
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
    rooms: 1,
    budget: 1000,
    currency: 'USD',
    airport: '',
    roomTypes: [],
    carType: '',
    selectedCities: [],
    totalCost: 0
  });

  const totalSteps = 5;

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
    { number: 4, title: 'حساب الأسعار' },
    { number: 5, title: 'تأكيد الحجز' }
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
        return <PricingStep data={bookingData} updateData={updateBookingData} />;
      case 5:
        return <ConfirmationStep data={bookingData} updateData={updateBookingData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  currentStep >= step.number
                    ? 'bg-emerald-600'
                    : 'bg-gray-300'
                }`}
              >
                {step.number}
              </div>
              <span className="text-sm mt-2 text-gray-600">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8 mb-8 shadow-lg">
        {renderStep()}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </Button>
        <Button
          onClick={nextStep}
          disabled={currentStep === totalSteps}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          التالي
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
