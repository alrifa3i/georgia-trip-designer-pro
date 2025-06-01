
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, additionalServicesData, currencies } from '@/data/hotels';
import { transportPricing } from '@/data/transportRules';
import { Calculator, DollarSign, Users, Building, MapPin, Car, Plane } from 'lucide-react';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const PricingDetailsStep = ({ data, updateData, onValidationChange }: PricingDetailsStepProps) => {
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<any>({});

  // حساب التكاليف
  useEffect(() => {
    let hotelsCost = 0;
    let toursCost = 0;
    let transportServicesCost = 0;
    let additionalServicesCost = 0;

    // حساب تكلفة الفنادق
    data.selectedCities.forEach(city => {
      const cityHotels = hotelData[city.city] || [];
      const selectedHotel = cityHotels.find(hotel => hotel.name === city.hotel);
      
      if (selectedHotel && city.roomSelections) {
        city.roomSelections.forEach(room => {
          let roomPrice = 0;
          switch (room.roomType) {
            case 'single':
              roomPrice = selectedHotel.single_price || 0;
              break;
            case 'single_v':
              roomPrice = selectedHotel.single_view_price || 0;
              break;
            case 'dbl_wv':
              roomPrice = selectedHotel.double_without_view_price || 0;
              break;
            case 'dbl_v':
              roomPrice = selectedHotel.double_view_price || 0;
              break;
            case 'trbl_wv':
              roomPrice = selectedHotel.triple_without_view_price || 0;
              break;
            case 'trbl_v':
              roomPrice = selectedHotel.triple_view_price || 0;
              break;
          }
          hotelsCost += roomPrice * city.nights;
        });
      }
    });

    // حساب تكلفة الجولات
    const selectedTransport = transportData.find(t => t.type === data.carType);
    if (selectedTransport) {
      data.selectedCities.forEach(city => {
        const totalTours = (city.tours || 0) + (city.mandatoryTours || 0);
        toursCost += totalTours * selectedTransport.daily_price;
      });
    }

    // حساب تكلفة خدمات النقل (الاستقبال والتوديع)
    if (data.carType && transportPricing[data.carType as keyof typeof transportPricing]) {
      const carPricing = transportPricing[data.carType as keyof typeof transportPricing];
      
      // تكلفة الاستقبال
      if (data.selectedCities.length > 0) {
        const firstCity = data.selectedCities[0];
        const arrivalAirportCity = data.arrivalAirport === 'TBS' ? 'تبليسي' : 
                                   data.arrivalAirport === 'BUS' ? 'باتومي' : 
                                   data.arrivalAirport === 'KUT' ? 'كوتايسي' : '';
        const isSameCity = firstCity.city === arrivalAirportCity;
        transportServicesCost += isSameCity ? carPricing.reception.sameCity : carPricing.reception.differentCity;
      }

      // تكلفة التوديع
      if (data.selectedCities.length > 0) {
        const lastCity = data.selectedCities[data.selectedCities.length - 1];
        const departureAirportCity = data.departureAirport === 'TBS' ? 'تبليسي' : 
                                     data.departureAirport === 'BUS' ? 'باتومي' : 
                                     data.departureAirport === 'KUT' ? 'كوتايسي' : '';
        const isSameCity = lastCity.city === departureAirportCity;
        transportServicesCost += isSameCity ? carPricing.farewell.sameCity : carPricing.farewell.differentCity;
      }
    }

    // حساب تكلفة الخدمات الإضافية
    const services = data.additionalServices;
    
    if (services.travelInsurance.enabled) {
      additionalServicesCost += services.travelInsurance.persons * additionalServicesData.travelInsurance.pricePerPerson;
    }
    
    if (services.phoneLines.enabled) {
      additionalServicesCost += services.phoneLines.quantity * additionalServicesData.phoneLines.pricePerLine;
    }
    
    if (services.roomDecoration.enabled) {
      additionalServicesCost += additionalServicesData.roomDecoration.price;
    }
    
    if (services.airportReception.enabled) {
      additionalServicesCost += services.airportReception.persons * additionalServicesData.airportReception.pricePerPerson;
    }
    
    if (services.photoSession.enabled) {
      additionalServicesCost += additionalServicesData.photoSession.price;
    }
    
    if (services.flowerReception.enabled) {
      additionalServicesCost += additionalServicesData.flowerReception.price;
    }

    const subtotal = hotelsCost + toursCost + transportServicesCost + additionalServicesCost;
    const discountAmount = data.discountAmount || 0;
    const finalTotal = subtotal - discountAmount;

    setTotalCost(finalTotal);
    setBreakdown({
      hotels: hotelsCost,
      tours: toursCost,
      transportServices: transportServicesCost,
      additionalServices: additionalServicesCost,
      subtotal,
      discount: discountAmount,
      total: finalTotal
    });

    updateData({ totalCost: finalTotal });

    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [data.selectedCities, data.carType, data.additionalServices, data.discountAmount, updateData, onValidationChange]);

  const currentCurrency = currencies.find(c => c.code === data.currency);
  const exchangeRate = currentCurrency?.exchangeRate || 1;

  const formatPrice = (amount: number) => {
    const convertedAmount = amount * exchangeRate;
    return `${convertedAmount.toFixed(2)} ${currentCurrency?.symbol || '$'}`;
  };

  // حساب عدد الأشخاص
  const totalPeople = data.adults + data.children.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل الأسعار</h2>
        <p className="text-gray-600">مراجعة تفصيلية لتكاليف رحلتك</p>
      </div>

      {/* ملخص الرحلة */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calculator className="w-5 h-5" />
            ملخص الرحلة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">عدد الأشخاص:</span>
                <Badge variant="secondary">{totalPeople} شخص</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">عدد الغرف:</span>
                <Badge variant="secondary">{data.rooms} غرفة</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">نوع السيارة:</span>
                <Badge variant="secondary">{data.carType}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">مطار الوصول:</span>
                <Badge variant="outline">{data.arrivalAirport}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-600 rotate-180" />
                <span className="text-sm text-gray-600">مطار المغادرة:</span>
                <Badge variant="outline">{data.departureAirport}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">عدد المدن:</span>
                <Badge variant="secondary">{data.selectedCities.length} مدينة</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل المدن */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            تفاصيل المدن والفنادق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.selectedCities.map((city, index) => {
              const totalTours = (city.tours || 0) + (city.mandatoryTours || 0);
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{city.city}</h4>
                      <p className="text-sm text-gray-600">{city.hotel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{city.nights} ليالي</p>
                      <p className="text-sm text-gray-600">{totalTours} جولات</p>
                    </div>
                  </div>
                  {city.roomSelections && (
                    <div className="text-xs text-gray-600">
                      الغرف: {city.roomSelections.map((room, roomIndex) => 
                        `الغرفة ${room.roomNumber}: ${
                          room.roomType === 'single' ? 'مفردة' :
                          room.roomType === 'single_v' ? 'مفردة مع إطلالة' :
                          room.roomType === 'dbl_wv' ? 'مزدوجة بدون إطلالة' :
                          room.roomType === 'dbl_v' ? 'مزدوجة مع إطلالة' :
                          room.roomType === 'trbl_wv' ? 'ثلاثية بدون إطلالة' :
                          room.roomType === 'trbl_v' ? 'ثلاثية مع إطلالة' :
                          'غير محدد'
                        }`
                      ).join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل التكاليف */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            تفصيل التكاليف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                تكلفة الفنادق
              </span>
              <span className="font-semibold">{formatPrice(breakdown.hotels || 0)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                تكلفة الجولات السياحية
              </span>
              <span className="font-semibold">{formatPrice(breakdown.tours || 0)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-600" />
                خدمات النقل (الاستقبال والتوديع)
              </span>
              <span className="font-semibold">{formatPrice(breakdown.transportServices || 0)}</span>
            </div>
            
            {breakdown.additionalServices > 0 && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  الخدمات الإضافية
                </span>
                <span className="font-semibold">{formatPrice(breakdown.additionalServices)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">المجموع الفرعي</span>
              <span className="font-bold">{formatPrice(breakdown.subtotal || 0)}</span>
            </div>
            
            {breakdown.discount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>الخصم</span>
                <span>-{formatPrice(breakdown.discount)}</span>
              </div>
            )}
            
            <Separator className="border-t-2" />
            
            <div className="flex justify-between items-center text-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
              <span className="font-bold text-green-800">المجموع النهائي</span>
              <span className="font-bold text-green-800">{formatPrice(breakdown.total || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل خدمات النقل */}
      {data.carType && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Car className="w-5 h-5" />
              تفاصيل خدمات النقل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.selectedCities.length > 0 && (
                <>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-semibold">خدمة الاستقبال</p>
                      <p className="text-sm text-gray-600">من مطار {data.arrivalAirport} إلى {data.selectedCities[0]?.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatPrice(
                          data.carType && transportPricing[data.carType as keyof typeof transportPricing] ? 
                          (data.selectedCities[0]?.city === (
                            data.arrivalAirport === 'TBS' ? 'تبليسي' : 
                            data.arrivalAirport === 'BUS' ? 'باتومي' : 
                            data.arrivalAirport === 'KUT' ? 'كوتايسي' : ''
                          ) ? 
                          transportPricing[data.carType as keyof typeof transportPricing].reception.sameCity :
                          transportPricing[data.carType as keyof typeof transportPricing].reception.differentCity) : 0
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-semibold">خدمة التوديع</p>
                      <p className="text-sm text-gray-600">
                        من {data.selectedCities[data.selectedCities.length - 1]?.city} إلى مطار {data.departureAirport}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        {formatPrice(
                          data.carType && transportPricing[data.carType as keyof typeof transportPricing] ? 
                          (data.selectedCities[data.selectedCities.length - 1]?.city === (
                            data.departureAirport === 'TBS' ? 'تبليسي' : 
                            data.departureAirport === 'BUS' ? 'باتومي' : 
                            data.departureAirport === 'KUT' ? 'كوتايسي' : ''
                          ) ? 
                          transportPricing[data.carType as keyof typeof transportPricing].farewell.sameCity :
                          transportPricing[data.carType as keyof typeof transportPricing].farewell.differentCity) : 0
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* معلومات إضافية */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-blue-800 font-semibold mb-2">
              تم حساب جميع التكاليف بناءً على التفاصيل المحددة
            </p>
            <p className="text-sm text-blue-600">
              الأسعار تشمل: الإقامة في الفنادق، الجولات السياحية، خدمات الاستقبال والتوديع، والخدمات الإضافية المختارة
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
