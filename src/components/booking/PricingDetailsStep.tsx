import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, additionalServicesData, currencies } from '@/data/hotels';
import { Calculator, Receipt, Percent, Gift } from 'lucide-react';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const PricingDetailsStep = ({ data, updateData }: PricingDetailsStepProps) => {
  const [totalCost, setTotalCost] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);

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
    const totalPeople = data.adults + data.children.length;

    if (services.travelInsurance.enabled) {
      const tripNights = data.selectedCities.reduce((sum, city) => sum + city.nights, 0);
      total += services.travelInsurance.persons * additionalServicesData.travelInsurance.pricePerPersonPerDay * tripNights;
    }

    if (services.phoneLines.enabled) {
      total += services.phoneLines.quantity * additionalServicesData.phoneLines.pricePerLine;
    }

    if (services.roomDecoration.enabled) {
      total += additionalServicesData.roomDecoration.price;
    }

    if (services.flowerReception?.enabled) {
      total += additionalServicesData.flowerReception.price;
    }

    if (services.airportReception.enabled) {
      total += services.airportReception.persons * additionalServicesData.airportReception.pricePerPerson;
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
        discount = transportCost; // Free reception
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
    
    // Add 20% profit margin to accommodation and tours
    const profitMargin = (roomCost + toursCost) * 0.20;
    
    const subtotal = roomCost + toursCost + transportCost + servicesCost + profitMargin;
    const finalTotal = subtotal - (data.discountAmount || 0);
    
    setTotalCost(finalTotal);
    updateData({ totalCost: finalTotal });
  }, [data.selectedCities, data.carType, data.additionalServices, data.discountAmount]);

  const selectedCurrency = currencies.find(c => c.code === data.currency);
  const roomCost = calculateRoomCost();
  const toursCost = calculateTotalTours();
  const transportCost = calculateCarAndTransport();
  const servicesCost = calculateAdditionalServices();
  const profitMargin = (roomCost + toursCost) * 0.20;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل الأسعار</h2>
        <p className="text-gray-600">مراجعة تفاصيل التكلفة النهائية</p>
      </div>

      {/* Discount Coupon Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            كوبون الخصم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="أدخل كود الخصم"
              value={data.discountCoupon || ''}
              onChange={(e) => updateData({ discountCoupon: e.target.value })}
            />
            <Button 
              onClick={() => data.discountCoupon && applyDiscount(data.discountCoupon)}
              disabled={!data.discountCoupon}
            >
              تطبيق
            </Button>
          </div>
          {data.discountAmount && data.discountAmount > 0 && (
            <div className="text-green-600 font-medium">
              تم تطبيق خصم بقيمة {data.discountAmount} {selectedCurrency?.symbol}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            تفصيل التكاليف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Room Details */}
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">تفاصيل الإقامة</h4>
            {data.selectedCities.map((city, index) => (
              <div key={index} className="text-sm text-gray-600 mb-1">
                {city.city} - {city.hotel} ({city.nights} ليالي)
                {city.roomSelections?.map((room, roomIndex) => {
                  const cityHotels = hotelData[city.city] || [];
                  const selectedHotel = cityHotels.find(h => h.name === city.hotel);
                  const roomPrice = selectedHotel?.[room.roomType as keyof typeof selectedHotel] as number || 0;
                  return (
                    <div key={roomIndex} className="mr-4">
                      الغرفة {room.roomNumber}: {roomPrice} × {city.nights} = {roomPrice * city.nights} {selectedCurrency?.symbol}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="font-medium">
              إجمالي تكلفة الإقامة: {roomCost} {selectedCurrency?.symbol}
            </div>
          </div>

          {/* Tours Cost */}
          <div className="border-b pb-4">
            <h4 className="font-medium">إجمالي الجولات السياحية</h4>
            <div className="text-sm text-gray-600">
              إجمالي الجولات: {data.selectedCities.reduce((sum, city) => sum + city.tours, 0)} جولة
            </div>
            <div className="font-medium">
              التكلفة: {toursCost} {selectedCurrency?.symbol}
            </div>
          </div>

          {/* Transport Cost */}
          <div className="border-b pb-4">
            <h4 className="font-medium">السيارة مع الاستقبال والتوديع</h4>
            <div className="text-sm text-gray-600">
              نوع السيارة: {data.carType}
            </div>
            <div className="font-medium">
              التكلفة: {transportCost} {selectedCurrency?.symbol}
            </div>
          </div>

          {/* Additional Services */}
          {servicesCost > 0 && (
            <div className="border-b pb-4">
              <h4 className="font-medium">الخدمات الإضافية</h4>
              <div className="font-medium">
                التكلفة: {servicesCost} {selectedCurrency?.symbol}
              </div>
            </div>
          )}

          {/* Discount */}
          {data.discountAmount && data.discountAmount > 0 && (
            <div className="border-b pb-4 text-green-600">
              <h4 className="font-medium">الخصم المطبق</h4>
              <div className="font-medium">
                - {data.discountAmount} {selectedCurrency?.symbol}
              </div>
            </div>
          )}

          {/* Final Total */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-bold text-emerald-800">
              <span>المبلغ النهائي:</span>
              <span>{totalCost} {selectedCurrency?.symbol}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            مقارنة مع الميزانية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>ميزانيتك المحددة</Label>
              <div className="text-lg font-semibold text-blue-600">
                {data.budget} {selectedCurrency?.symbol}
              </div>
            </div>
            <div>
              <Label>التكلفة الفعلية</Label>
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
              <div className="text-red-600 font-medium">
                ⚠️ التكلفة تتجاوز ميزانيتك بـ {totalCost - data.budget} {selectedCurrency?.symbol}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
