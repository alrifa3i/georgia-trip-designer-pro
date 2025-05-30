
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, currencies } from '@/data/hotels';
import { Calculator, Users, Hotel, Car, MapPin, Calendar } from 'lucide-react';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const PricingDetailsStep = ({ data, updateData }: PricingDetailsStepProps) => {
  const [calculations, setCalculations] = useState({
    accommodationTotal: 0,
    toursTotal: 0,
    transportTotal: 0,
    additionalServicesTotal: 0,
    subtotal: 0,
    finalTotal: 0
  });

  const selectedCurrency = currencies.find(c => c.code === data.currency);

  const calculatePricing = () => {
    let accommodationTotal = 0;
    let toursTotal = 0;

    // حساب تكلفة الإقامة
    data.selectedCities.forEach(city => {
      if (city.hotel && city.roomSelections) {
        const hotel = hotelData[city.city]?.find(h => h.name === city.hotel);
        if (hotel) {
          city.roomSelections.forEach(room => {
            const roomPrice = hotel[room.roomType as keyof typeof hotel] as number || 0;
            accommodationTotal += roomPrice * city.nights;
          });
        }
      }
    });

    // حساب تكلفة الجولات
    const transport = transportData.find(t => t.type === data.carType);
    if (transport) {
      data.selectedCities.forEach(city => {
        const totalTours = city.tours + (city.mandatoryTours || 0);
        toursTotal += totalTours * transport.price;
      });
    }

    // حساب تكلفة النقل (الاستقبال والتوديع)
    let transportTotal = 0;
    if (transport) {
      transportTotal = transport.reception.sameCity + transport.farewell.sameCity;
    }

    // حساب الخدمات الإضافية
    let additionalServicesTotal = 0;
    const tripDays = calculateTripDays();

    if (data.additionalServices.travelInsurance.enabled) {
      additionalServicesTotal += 5 * tripDays * data.additionalServices.travelInsurance.persons;
    }

    if (data.additionalServices.phoneLines.enabled) {
      additionalServicesTotal += 15 * data.additionalServices.phoneLines.quantity;
    }

    if (data.additionalServices.roomDecoration.enabled) {
      additionalServicesTotal += 50;
    }

    if (data.additionalServices.airportReception.enabled) {
      additionalServicesTotal += 280 * data.additionalServices.airportReception.persons;
    }

    if (data.additionalServices.photoSession?.enabled) {
      additionalServicesTotal += 150;
    }

    const subtotal = accommodationTotal + toursTotal + transportTotal + additionalServicesTotal;
    const finalTotal = subtotal * 1.22; // هامش ربح 22%

    setCalculations({
      accommodationTotal,
      toursTotal,
      transportTotal,
      additionalServicesTotal,
      subtotal,
      finalTotal
    });

    updateData({ totalCost: finalTotal });
  };

  const calculateTripDays = () => {
    if (!data.arrivalDate || !data.departureDate) return 0;
    const arrival = new Date(data.arrivalDate);
    const departure = new Date(data.departureDate);
    return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getTotalNights = () => {
    return data.selectedCities.reduce((total, city) => total + city.nights, 0);
  };

  const getTotalPeople = () => {
    return data.adults + data.children.filter(child => child.age > 6).length;
  };

  useEffect(() => {
    calculatePricing();
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل الأسعار والملخص النهائي</h2>
        <p className="text-gray-600">مراجعة شاملة لتكلفة رحلتك</p>
      </div>

      {/* Trip Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calculator className="w-5 h-5" />
            ملخص الرحلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الأيام:</strong> {calculateTripDays()} أيام</span>
              </div>
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الليالي:</strong> {getTotalNights()} ليلة</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الأشخاص:</strong> {getTotalPeople()} شخص</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الغرف:</strong> {data.rooms} غرفة</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span><strong>نوع السيارة:</strong> {data.carType}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span><strong>عدد المدن:</strong> {data.selectedCities.length} مدينة</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Types Summary */}
      {data.selectedCities.some(city => city.roomSelections && city.roomSelections.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل أنواع الغرف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.selectedCities.map((city, cityIndex) => (
                city.roomSelections && city.roomSelections.length > 0 && (
                  <div key={cityIndex} className="border-l-4 border-emerald-500 pl-4">
                    <h4 className="font-medium text-gray-800 mb-2">{city.city} - {city.hotel}</h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      {city.roomSelections.map((room, roomIndex) => (
                        <div key={roomIndex} className="flex justify-between">
                          <span>الغرفة {room.roomNumber}:</span>
                          <span className="text-gray-600">
                            {room.roomType === 'single' && 'غرفة مفردة (بدون إطلالة)'}
                            {room.roomType === 'single_v' && 'غرفة مفردة (مع إطلالة)'}
                            {room.roomType === 'dbl_wv' && 'غرفة مزدوجة (بدون إطلالة)'}
                            {room.roomType === 'dbl_v' && 'غرفة مزدوجة (مع إطلالة)'}
                            {room.roomType === 'trbl_wv' && 'غرفة ثلاثية (بدون إطلالة)'}
                            {room.roomType === 'trbl_v' && 'غرفة ثلاثية (مع إطلالة)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Breakdown */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Calculator className="w-5 h-5" />
            تفصيل التكاليف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>إجمالي تكلفة الإقامة</span>
              <span className="font-medium">{Math.round(calculations.accommodationTotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>إجمالي تكلفة الجولات السياحية</span>
              <span className="font-medium">{Math.round(calculations.toursTotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>تكلفة النقل (استقبال + توديع)</span>
              <span className="font-medium">{Math.round(calculations.transportTotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>الخدمات الإضافية</span>
              <span className="font-medium">{Math.round(calculations.additionalServicesTotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">المجموع الفرعي</span>
              <span className="font-bold">{Math.round(calculations.subtotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>هامش الربح (22%)</span>
              <span>+{Math.round(calculations.finalTotal - calculations.subtotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center text-2xl font-bold text-emerald-600 bg-emerald-50 p-4 rounded-lg">
              <span>المبلغ الكلي النهائي</span>
              <span>{Math.round(calculations.finalTotal)} {selectedCurrency?.symbol}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Notice */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-bold text-green-800 text-lg">تذكير مهم</h3>
            <p className="text-green-700">الدفع يتم فقط عند الوصول واستلام الغرفة</p>
            <p className="text-green-600 text-sm">لا يوجد أي مدفوعات مسبقة أو عبر الموقع</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
