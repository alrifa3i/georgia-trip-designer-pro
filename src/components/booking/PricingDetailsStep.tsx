
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

  // حساب تكلفة الفنادق المحدث - الطريقة الصحيحة
  const calculateHotelCosts = useMemo(() => {
    let totalHotelCost = 0;

    console.log('=== بداية حساب تكلفة الفنادق ===');
    console.log('المدن المختارة:', data.selectedCities);

    data.selectedCities.forEach((city, cityIndex) => {
      console.log(`معالجة المدينة ${cityIndex + 1}: ${city.city}`);
      
      if (city.city && city.hotel && city.roomSelections && city.roomSelections.length > 0) {
        // البحث عن الفندق في hotelData
        const cityHotels = hotelData[city.city] || [];
        const selectedHotel = cityHotels.find(hotel => hotel.name === city.hotel);
        
        if (selectedHotel) {
          console.log(`تم العثور على الفندق: ${selectedHotel.name}`);
          
          // حساب مجموع تكلفة جميع الغرف في هذه المدينة لليلة الواحدة
          let totalRoomCostPerNight = 0;
          
          city.roomSelections.forEach((room, roomIndex) => {
            let roomPrice = 0;
            
            console.log(`الغرفة ${roomIndex + 1} نوع: ${room.roomType}`);
            
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
            
            console.log(`الغرفة ${roomIndex + 1} سعر الليلة: $${roomPrice}`);
            totalRoomCostPerNight += roomPrice;
          });

          // حساب التكلفة الإجمالية = مجموع الغرف × عدد الليالي
          const cityTotalCost = totalRoomCostPerNight * city.nights;
          totalHotelCost += cityTotalCost;
          
          console.log(`${city.city}: مجموع الغرف $${totalRoomCostPerNight}/ليلة × ${city.nights} ليالي = $${cityTotalCost}`);
        } else {
          console.log(`لم يتم العثور على الفندق: ${city.hotel} في المدينة: ${city.city}`);
        }
      }
    });

    console.log('إجمالي تكلفة الفنادق:', totalHotelCost);
    return totalHotelCost;
  }, [data.selectedCities]);

  // حساب تكلفة الجولات المحدث - الطريقة الصحيحة
  const calculateTourCosts = useMemo(() => {
    console.log('=== بداية حساب تكلفة الجولات ===');
    console.log('نوع السيارة المختار:', data.carType);
    
    // استخدام transportData بدلاً من transportPricing
    const selectedTransport = transportData.find(t => t.type === data.carType);
    if (!selectedTransport) {
      console.log('لم يتم العثور على معلومات السيارة');
      return 0;
    }

    let totalTourCost = 0;
    
    data.selectedCities.forEach(city => {
      const regularTours = city.tours || 0;
      const mandatoryTours = city.mandatoryTours || 1;
      const totalTours = regularTours + mandatoryTours;
      
      const cityTourCost = totalTours * selectedTransport.daily_price;
      totalTourCost += cityTourCost;
      
      console.log(`${city.city}: ${totalTours} جولات (${regularTours} اختيارية + ${mandatoryTours} إجبارية) × $${selectedTransport.daily_price} = $${cityTourCost}`);
    });

    console.log('إجمالي تكلفة الجولات:', totalTourCost);
    return totalTourCost;
  }, [data.selectedCities, data.carType]);

  // حساب تكلفة خدمات النقل (الاستقبال والتوديع) المحدث - الطريقة الصحيحة
  const calculateTransportCosts = useMemo(() => {
    console.log('=== بداية حساب تكلفة خدمات النقل ===');
    
    if (!data.carType || !data.arrivalAirport || !data.departureAirport) {
      console.log('بيانات النقل غير مكتملة');
      return 0;
    }

    const transportCosts = calculateTransportServicesCosts(
      data.arrivalAirport,
      data.departureAirport,
      data.carType
    );

    console.log('تكلفة الاستقبال:', transportCosts.reception);
    console.log('تكلفة التوديع:', transportCosts.farewell);
    console.log('إجمالي تكلفة النقل:', transportCosts.total);
    
    return transportCosts.total;
  }, [data.carType, data.arrivalAirport, data.departureAirport]);

  // حساب تكلفة الخدمات الإضافية
  const calculateAdditionalServicesCosts = useMemo(() => {
    let totalCost = 0;
    const services = data.additionalServices;

    console.log('=== بداية حساب تكلفة الخدمات الإضافية ===');
    
    if (services.travelInsurance.enabled) {
      const cost = services.travelInsurance.persons * additionalServicesData.travelInsurance.pricePerPerson;
      totalCost += cost;
      console.log(`تأمين السفر: ${services.travelInsurance.persons} أشخاص × $${additionalServicesData.travelInsurance.pricePerPerson} = $${cost}`);
    }
    
    if (services.phoneLines.enabled) {
      const cost = services.phoneLines.quantity * additionalServicesData.phoneLines.pricePerLine;
      totalCost += cost;
      console.log(`خطوط الهاتف: ${services.phoneLines.quantity} خطوط × $${additionalServicesData.phoneLines.pricePerLine} = $${cost}`);
    }
    
    if (services.roomDecoration.enabled) {
      totalCost += additionalServicesData.roomDecoration.price;
      console.log(`تزيين الغرفة: $${additionalServicesData.roomDecoration.price}`);
    }
    
    if (services.airportReception.enabled) {
      const cost = services.airportReception.persons * additionalServicesData.airportReception.pricePerPerson;
      totalCost += cost;
      console.log(`استقبال المطار VIP: ${services.airportReception.persons} أشخاص × $${additionalServicesData.airportReception.pricePerPerson} = $${cost}`);
    }
    
    if (services.photoSession.enabled) {
      totalCost += additionalServicesData.photoSession.price;
      console.log(`جلسة تصوير: $${additionalServicesData.photoSession.price}`);
    }
    
    if (services.flowerReception.enabled) {
      totalCost += additionalServicesData.flowerReception.price;
      console.log(`استقبال بالورود: $${additionalServicesData.flowerReception.price}`);
    }

    console.log('إجمالي تكلفة الخدمات الإضافية:', totalCost);
    return totalCost;
  }, [data.additionalServices]);

  // حساب التكلفة الإجمالية النهائية
  const finalCalculations = useMemo(() => {
    const hotelsCost = calculateHotelCosts;
    const toursCost = calculateTourCosts;
    const transportServicesCost = calculateTransportCosts;
    const additionalServicesCost = calculateAdditionalServicesCosts;
    
    // المجموع الفرعي
    const subtotal = hotelsCost + toursCost + transportServicesCost + additionalServicesCost;
    
    // تطبيق الخصم إن وجد
    const discountAmount = data.discountAmount || 0;
    const afterDiscount = subtotal - discountAmount;
    
    // إضافة هامش الربح 22%
    const withProfitMargin = afterDiscount * 1.22;
    
    // التقريب لأقرب 10
    const finalTotal = Math.round(withProfitMargin / 10) * 10;

    console.log('=== الحساب النهائي ===');
    console.log('تكلفة الفنادق:', hotelsCost);
    console.log('تكلفة الجولات:', toursCost);
    console.log('تكلفة خدمات النقل:', transportServicesCost);
    console.log('تكلفة الخدمات الإضافية:', additionalServicesCost);
    console.log('المجموع الفرعي:', subtotal);
    console.log('الخصم:', discountAmount);
    console.log('بعد الخصم:', afterDiscount);
    console.log('مع هامش الربح 22%:', withProfitMargin);
    console.log('الإجمالي النهائي:', finalTotal);

    return {
      hotels: hotelsCost,
      tours: toursCost,
      transportServices: transportServicesCost,
      additionalServices: additionalServicesCost,
      subtotal,
      discount: discountAmount,
      total: finalTotal
    };
  }, [calculateHotelCosts, calculateTourCosts, calculateTransportCosts, calculateAdditionalServicesCosts, data.discountAmount]);

  // تحديث الحالة عند تغير الحسابات
  useEffect(() => {
    setTotalCost(finalCalculations.total);
    setBreakdown(finalCalculations);
    updateData({ totalCost: finalCalculations.total });
  }, [finalCalculations, updateData]);

  // التحقق من صحة البيانات
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
