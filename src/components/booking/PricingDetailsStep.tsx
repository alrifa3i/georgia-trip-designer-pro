
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, additionalServicesData, currencies } from '@/data/hotels';
import { transportPricing, calculateTransportServicesCosts } from '@/data/transportRules';
import { Calculator, DollarSign, Users, Building, MapPin, Car, Plane } from 'lucide-react';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const PricingDetailsStep = ({ data, updateData, onValidationChange }: PricingDetailsStepProps) => {
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<any>({});

  // Function to get incomplete fields
  const getIncompleteFields = useCallback(() => {
    const incompleteFields = [];
    
    if (totalCost <= 0) incompleteFields.push('حساب التكلفة الإجمالية');
    if (!data.currency) incompleteFields.push('العملة');
    
    // التحقق من اكتمال بيانات المدن
    if (data.selectedCities.length === 0) {
      incompleteFields.push('بيانات المدن من المرحلة السابقة');
    }
    
    return incompleteFields;
  }, [totalCost, data.currency, data.selectedCities.length]);

  // Memoized cost calculations to prevent infinite loops
  const costCalculations = useMemo(() => {
    let hotelsCost = 0;
    let toursCost = 0;
    let transportServicesCost = 0;
    let additionalServicesCost = 0;

    console.log('=== CALCULATING COSTS ===');
    console.log('Selected cities:', data.selectedCities);

    // حساب تكلفة الفنادق - Fixed calculation
    data.selectedCities.forEach((city, cityIndex) => {
      console.log(`Processing city ${cityIndex + 1}: ${city.city}`);
      
      const cityHotels = hotelData[city.city] || [];
      const selectedHotel = cityHotels.find(hotel => hotel.name === city.hotel);
      
      if (selectedHotel && city.roomSelections && city.roomSelections.length > 0) {
        let cityRoomCostPerNight = 0;
        
        // حساب تكلفة جميع الغرف في هذه المدينة
        city.roomSelections.forEach((room, roomIndex) => {
          let roomPrice = 0;
          
          console.log(`Room ${roomIndex + 1} type: ${room.roomType}`);
          
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
          
          console.log(`Room ${roomIndex + 1} price per night: $${roomPrice}`);
          cityRoomCostPerNight += roomPrice;
        });

        // المجموع = (مجموع أسعار الغرف) × عدد الليالي
        const cityTotalCost = cityRoomCostPerNight * city.nights;
        hotelsCost += cityTotalCost;
        
        console.log(`City ${city.city}: $${cityRoomCostPerNight}/night × ${city.nights} nights = $${cityTotalCost}`);
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
    if (data.carType && data.arrivalAirport && data.departureAirport) {
      const transportCosts = calculateTransportServicesCosts(
        data.arrivalAirport,
        data.departureAirport,
        data.carType
      );
      transportServicesCost = transportCosts.total;
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
    
    // إضافة هامش الربح 22% مع التقريب لأقرب 10
    const afterDiscount = subtotal - discountAmount;
    const withProfitMargin = afterDiscount * 1.22;
    const finalTotal = Math.round(withProfitMargin / 10) * 10;

    console.log('Total hotel cost:', hotelsCost);
    console.log('Total tour cost:', toursCost);
    console.log('Total transport cost:', transportServicesCost);
    console.log('Total additional services:', additionalServicesCost);
    console.log('Final total:', finalTotal);

    return {
      hotels: hotelsCost,
      tours: toursCost,
      transportServices: transportServicesCost,
      additionalServices: additionalServicesCost,
      subtotal,
      discount: discountAmount,
      total: finalTotal
    };
  }, [
    data.selectedCities,
    data.carType,
    data.arrivalAirport,
    data.departureAirport,
    data.additionalServices,
    data.discountAmount
  ]);

  // Update state only when calculations change
  useEffect(() => {
    setTotalCost(costCalculations.total);
    setBreakdown(costCalculations);
  }, [costCalculations]);

  // Update parent data only when total cost changes
  useEffect(() => {
    updateData({ totalCost: costCalculations.total });
  }, [costCalculations.total, updateData]);

  // Validation check
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

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
        <p className="text-gray-600">مراجعة تكلفة رحلتك التفصيلية</p>
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

      {/* تفاصيل خدمات النقل - بدون أسعار */}
      {data.carType && data.arrivalAirport && data.departureAirport && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Car className="w-5 h-5" />
              تفاصيل خدمات النقل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-semibold">خدمة الاستقبال</p>
                  <p className="text-sm text-gray-600">من مطار {data.arrivalAirport}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">متضمن</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-semibold">الجولات السياحية</p>
                  <p className="text-sm text-gray-600">
                    إجمالي {data.selectedCities.reduce((total, city) => total + (city.tours || 0) + (city.mandatoryTours || 0), 0)} جولة
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">شامل البرنامج</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-semibold">خدمة التوديع</p>
                  <p className="text-sm text-gray-600">إلى مطار {data.departureAirport}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">متضمن</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* السعر النهائي فقط */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            السعر الإجمالي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {breakdown.discount > 0 && (
              <>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">المجموع قبل الخصم</span>
                  <span className="font-bold">{formatPrice(breakdown.subtotal || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center text-green-600">
                  <span>الخصم</span>
                  <span>-{formatPrice(breakdown.discount)}</span>
                </div>
                
                <Separator className="border-t-2" />
              </>
            )}
            
            <div className="flex justify-between items-center text-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
              <span className="font-bold text-green-800">المجموع النهائي</span>
              <span className="font-bold text-green-800">{formatPrice(breakdown.total || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Incomplete Fields Indicator */}
      {getIncompleteFields().length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-semibold text-red-800 mb-2">مشاكل في حساب الأسعار:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {getIncompleteFields().map((field, index) => (
                  <Badge key={index} variant="outline" className="border-red-300 text-red-700 bg-white">
                    {field}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-red-600 mt-2">
                يرجى التأكد من إكمال المراحل السابقة بشكل صحيح
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
