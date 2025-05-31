
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BasicTravelInfoStep } from './booking/BasicTravelInfoStep';
import { CityHotelSelectionStep } from './booking/CityHotelSelectionStep';
import { OptionalServicesStep } from './booking/OptionalServicesStep';
import { PricingDetailsStep } from './booking/PricingDetailsStep';
import { FinalConfirmationStep } from './booking/FinalConfirmationStep';
import { AdvertisementSection } from './booking/AdvertisementSection';
import { BookingData } from '@/types/booking';

interface BookingWizardProps {
  onBookingStart?: () => void;
}

export const BookingWizard = ({ onBookingStart }: BookingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidations, setStepValidations] = useState<{[key: number]: boolean}>({});
  const [hasStartedBooking, setHasStartedBooking] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    customerName: '',
    adults: 2,
    children: [],
    arrivalDate: '',
    departureDate: '',
    arrivalAirport: '',
    departureAirport: '',
    rooms: 1,
    budget: 0,
    currency: 'USD',
    roomTypes: [],
    carType: '',
    selectedCities: [],
    totalCost: 0,
    additionalServices: {
      travelInsurance: { enabled: false, persons: 0 },
      phoneLines: { enabled: false, quantity: 0 },
      roomDecoration: { enabled: false },
      airportReception: { enabled: false, persons: 0 },
      photoSession: { enabled: false },
      flowerReception: { enabled: false }
    }
  });

  const totalSteps = 5;

  // إشعار المكون الأب عند بدء الحجز
  useEffect(() => {
    if (!hasStartedBooking) {
      setHasStartedBooking(true);
      onBookingStart?.();
    }
  }, [hasStartedBooking, onBookingStart]);

  const updateStepValidation = (step: number, isValid: boolean) => {
    console.log(`Step ${step} validation:`, isValid);
    setStepValidations(prev => ({ ...prev, [step]: isValid }));
  };

  const nextStep = () => {
    const isCurrentStepValid = (currentStep === 3 || currentStep === 4) ? true : stepValidations[currentStep];
    
    if (currentStep < totalSteps && isCurrentStepValid) {
      console.log(`Moving from step ${currentStep} to ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    } else {
      console.log(`Cannot move to next step. Current step: ${currentStep}, Valid: ${isCurrentStepValid}`);
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
    { number: 1, title: 'معلومات السفر الأساسية' },
    { number: 2, title: 'المدن والفنادق' },
    { number: 3, title: 'الخدمات الإضافية' },
    { number: 4, title: 'تفاصيل الأسعار' },
    { number: 5, title: 'التأكيد النهائي' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicTravelInfoStep 
          data={bookingData} 
          updateData={updateBookingData}
          onValidationChange={(isValid) => updateStepValidation(1, isValid)}
        />;
      case 2:
        return <CityHotelSelectionStep 
          data={bookingData} 
          updateData={updateBookingData}
          onValidationChange={(isValid) => updateStepValidation(2, isValid)}
        />;
      case 3:
        return <OptionalServicesStep 
          data={bookingData} 
          updateData={updateBookingData}
          onValidationChange={(isValid) => updateStepValidation(3, isValid)}
        />;
      case 4:
        return <PricingDetailsStep 
          data={bookingData} 
          updateData={updateBookingData}
          onValidationChange={(isValid) => updateStepValidation(4, isValid)}
        />;
      case 5:
        return <FinalConfirmationStep data={bookingData} updateData={updateBookingData} />;
      default:
        return null;
    }
  };

  const totalPeople = bookingData.adults + bookingData.children.length;

  const isNextButtonEnabled = () => {
    if (currentStep === 3 || currentStep === 4) return true;
    return stepValidations[currentStep];
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4" dir="rtl">
      {/* Enhanced Progress Bar - محسن للموبايل */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4 overflow-x-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center min-w-0 flex-1">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-emerald-600 scale-110'
                    : 'bg-gray-400'
                }`}
              >
                {step.number}
              </div>
              <span className="text-xs sm:text-sm mt-2 text-gray-700 font-medium text-center px-1 leading-tight">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2 sm:h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 sm:h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content - محسن للموبايل */}
      <Card className="p-4 sm:p-8 mb-6 sm:mb-8 shadow-2xl bg-white/98 backdrop-blur-sm border-2 border-white/50">
        {renderStep()}
      </Card>

      {/* Navigation Buttons - محسن للموبايل */}
      <div className="flex justify-between mb-6 sm:mb-8 gap-4">
        <Button
          onClick={prevStep}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center gap-2 bg-white/90 hover:bg-white border-2 border-gray-300 shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="hidden sm:inline">السابق</span>
          <span className="sm:hidden">◀</span>
        </Button>
        <Button
          onClick={nextStep}
          disabled={currentStep === totalSteps || !isNextButtonEnabled()}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg disabled:opacity-50 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
        >
          <span className="hidden sm:inline">التالي</span>
          <span className="sm:hidden">▶</span>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Advertisement Section - فقط في المرحلة الأولى ومحسن للموبايل */}
      {currentStep === 1 && (
        <div className="px-2 sm:px-0">
          <AdvertisementSection peopleCount={totalPeople} />
        </div>
      )}
    </div>
  );
};
