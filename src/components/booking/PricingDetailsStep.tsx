import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, additionalServicesData, currencies } from '@/data/hotels';
import { Gift, FileCheck, Plane, CreditCard } from 'lucide-react';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

// دالة التقريب لأقرب عشرة
const roundToNearestTen = (amount: number): number => {
  return Math.ceil(amount / 10) * 10;
};

export const PricingDetailsStep = ({ data, updateData, onValidationChange }: PricingDetailsStepProps) => {
  const [totalCost, setTotalCost] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);

  // تفعيل زر التالي دائماً
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  const calculateRoomCost = () => {
    let total = 0;
    data.selectedCities.forEach(city => {
      const cityHotels = hotelData[city.city] || [];
      const selectedHotel = cityHotels.find(h => h.name === city.hotel);
      if (selectedHotel && city.roomSelections) {
        city.roomSelections.forEach(room => {
          const roomPrice = selectedHotel[room.roomType as keyof typeof selectedHotel] as number || 0;
          total += roomPrice * city.nights;
        });
      }
    });
    return total;
  };

  const calculateTotalTours = () => {
    const totalTours = data.selectedCities.reduce((sum, city) => sum + city.tours, 0);
    const selectedTransport = transportData.find(t => t.type === data.carType);
    return totalTours * (selectedTransport?.price || 0);
  };

  const calculateCarAndTransport = () => {
    const selectedTransport = transportData.find(t => t.type === data.carType);
    if (!selectedTransport) return 0;

    const arrivalReception = data.arrivalAirport === data.departureAirport 
      ? selectedTransport.reception.sameCity 
      : selectedTransport.reception.differentCity;
    
    const departureFarewell = data.arrivalAirport === data.departureAirport 
      ? selectedTransport.farewell.sameCity 
      : selectedTransport.farewell.differentCity;

    return arrivalReception + departureFarewell;
  };

  const calculateAdditionalServices = () => {
    let total = 0;
    const services = data.additionalServices;

    if (services.travelInsurance.enabled) {
      const tripDays = data.arrivalDate && data.departureDate 
        ? Math.ceil((new Date(data.departureDate).getTime() - new Date(data.arrivalDate).getTime()) / (1000 * 60 * 60 * 24))
        : 1;
      total += (services.travelInsurance.persons || 0) * 5 * tripDays; // 5$ للشخص يومياً
    }

    if (services.phoneLines.enabled) {
      total += (services.phoneLines.quantity || 0) * additionalServicesData.phoneLines.pricePerLine;
    }

    if (services.roomDecoration.enabled) {
      total += additionalServicesData.roomDecoration.price;
    }

    if (services.flowerReception?.enabled) {
      total += additionalServicesData.flowerReception.price;
    }

    if (services.airportReception.enabled) {
      total += (services.airportReception.persons || 0) * additionalServicesData.airportReception.pricePerPerson;
    }

    if (services.photoSession?.enabled) {
      total += additionalServicesData.photoSession.price;
    }

    return total;
  };

  const applyDiscount = (coupon: string) => {
    let discount = 0;
    const roomCost = calculateRoomCost();
    const toursCost = calculateTotalTours();
    const transportCost = calculateCarAndTransport();
    const servicesCost = calculateAdditionalServices();
    const subtotal = roomCost + toursCost + transportCost + servicesCost;

    switch (coupon.toLowerCase()) {
      case 'lwiat10%':
        discount = subtotal * 0.10;
        break;
      case 'lwiat15%com':
        discount = subtotal * 0.15;
        break;
      case 'alfakhama':
        discount = transportCost;
        break;
      default:
        discount = 0;
    }

    setDiscountValue(discount);
    updateData({ discountAmount: discount });
    return discount;
  };

  useEffect(() => {
    const roomCost = calculateRoomCost();
    const toursCost = calculateTotalTours();
    const transportCost = calculateCarAndTransport();
    const servicesCost = calculateAdditionalServices();
    
    const profitMargin = (roomCost + toursCost) * 0.20;
    
    const subtotal = roomCost + toursCost + transportCost + servicesCost + profitMargin;
    const beforeRounding = subtotal - (data.discountAmount || 0);
    
    // تطبيق التقريب لأقرب عشرة
    const finalTotal = roundToNearestTen(beforeRounding);
    
    setTotalCost(finalTotal);
    updateData({ totalCost: finalTotal });
  }, [data.selectedCities, data.carType, data.additionalServices, data.discountAmount]);

  const selectedCurrency = currencies.find(c => c.code === data.currency);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل الأسعار</h2>
        <p className="text-gray-600">مراجعة التكلفة النهائية لرحلتك</p>
      </div>

      {/* Final Total - Main Display */}
      <Card className="border-2 border-emerald-200">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-lg">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>المبلغ النهائي:</span>
                <span>{totalCost} {selectedCurrency?.symbol}</span>
              </div>
            </div>
            
            {/* Budget Comparison */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">ميزانيتك المحددة</p>
                  <div className="text-lg font-semibold text-blue-600">
                    {data.budget} {selectedCurrency?.symbol}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">التكلفة الفعلية</p>
                  <div className="text-lg font-semibold text-emerald-600">
                    {totalCost} {selectedCurrency?.symbol}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                {totalCost <= data.budget ? (
                  <div className="text-green-600 font-medium">
                    ✅ التكلفة ضمن ميزانيتك المحددة
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-orange-800 font-medium mb-2">
                      📍 تجاوزت التكلفة ميزانيتك بمبلغ {totalCost - data.budget} {selectedCurrency?.symbol}
                    </div>
                    <div className="text-orange-700 text-sm leading-relaxed">
                      الفنادق المختارة هي من أفضل الفنادق في جورجيا وتوفر مستوى راحة استثنائي. 
                      الفرق البسيط في السعر يستحق الاستثمار مقابل الجودة العالية والخدمة المميزة التي ستحصل عليها. 
                      راحتكم وسعادتكم أهم من توفير مبلغ صغير! 🌟
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount Coupon Section - Small and Optional */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="w-4 h-4" />
            كوبون الخصم (اختياري)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Input
              placeholder="أدخل كود الخصم (اختياري)"
              value={data.discountCoupon || ''}
              onChange={(e) => updateData({ discountCoupon: e.target.value })}
              className="text-sm"
            />
            <Button 
              onClick={() => data.discountCoupon && applyDiscount(data.discountCoupon)}
              disabled={!data.discountCoupon}
              size="sm"
            >
              تطبيق
            </Button>
          </div>
          {data.discountAmount && data.discountAmount > 0 && (
            <div className="text-green-600 font-medium text-sm mt-2">
              تم تطبيق خصم بقيمة {Math.round(data.discountAmount)} {selectedCurrency?.symbol}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            معلومات التأكيد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">المستندات المطلوبة للتأكيد:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <FileCheck className="w-3 h-3" />
                جواز السفر
              </li>
              <li className="flex items-center gap-2">
                <Plane className="w-3 h-3" />
                تذكرة الطيران
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-3 h-3" />
                الدفع بعد الوصول إلى جورجيا
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
