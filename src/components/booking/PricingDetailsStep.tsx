
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { additionalServicesData } from '@/data/hotels';
import { currencies, convertFromUSD, formatCurrency, additionalCurrencies } from '@/data/currencies';
import { transportPricing } from '@/data/transportRules';
import { useHotelData } from '@/hooks/useHotelData';
import { DollarSign, AlertTriangle, CheckCircle, MapPin, Building2, Car, Plane } from 'lucide-react';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const PricingDetailsStep = ({ data, updateData, onValidationChange }: PricingDetailsStepProps) => {
  const { hotels: databaseHotels, loading: hotelsLoading } = useHotelData();
  
  const allCurrencies = [...currencies, ...additionalCurrencies];
  const selectedCurrency = allCurrencies.find(c => c.code === data.currency) || allCurrencies[0];

  // Airport to city mapping
  const airportCityMapping: Record<string, string> = {
    'TBS': 'تبليسي',
    'BUS': 'باتومي', 
    'KUT': 'كوتايسي'
  };

  const calculateHotelCosts = () => {
    const cityBreakdown: Array<{
      city: string;
      nights: number;
      roomCost: number;
      totalCost: number;
      roomDetails: string[];
    }> = [];

    let totalHotelCost = 0;
    
    console.log('=== HOTEL COST CALCULATION (UPDATED) ===');
    
    data.selectedCities.forEach((cityStay, cityIndex) => {
      console.log(`Processing city ${cityIndex + 1}: ${cityStay.city}`);
      
      if (cityStay.city && cityStay.hotel && cityStay.roomSelections && cityStay.roomSelections.length > 0) {
        const hotel = databaseHotels[cityStay.city]?.find(h => h.name === cityStay.hotel);
        console.log('Found hotel from database:', hotel?.name);
        
        if (hotel) {
          let totalRoomCostPerNight = 0;
          const roomDetails: string[] = [];
          
          // حساب تكلفة كل غرفة حسب النوع المختار
          cityStay.roomSelections.forEach((room, roomIndex) => {
            console.log(`Room ${roomIndex + 1} type: ${room.roomType}`);
            
            let roomPrice = 0;
            let roomTypeName = '';
            
            switch (room.roomType) {
              case 'single':
                roomPrice = hotel.single_price || 0;
                roomTypeName = 'غرفة مفردة';
                break;
              case 'single_v':
                roomPrice = hotel.single_view_price || 0;
                roomTypeName = 'غرفة مفردة مع إطلالة';
                break;
              case 'dbl_wv':
                roomPrice = hotel.double_without_view_price || 0;
                roomTypeName = 'غرفة مزدوجة بدون إطلالة';
                break;
              case 'dbl_v':
                roomPrice = hotel.double_view_price || 0;
                roomTypeName = 'غرفة مزدوجة مع إطلالة';
                break;
              case 'trbl_wv':
                roomPrice = hotel.triple_without_view_price || 0;
                roomTypeName = 'غرفة ثلاثية بدون إطلالة';
                break;
              case 'trbl_v':
                roomPrice = hotel.triple_view_price || 0;
                roomTypeName = 'غرفة ثلاثية مع إطلالة';
                break;
              default:
                roomPrice = 0;
                roomTypeName = 'غير محدد';
            }
            
            console.log(`Room ${roomIndex + 1} price per night: $${roomPrice}`);
            totalRoomCostPerNight += roomPrice;
            roomDetails.push(`الغرفة ${roomIndex + 1}: ${roomTypeName} ($${roomPrice}/ليلة)`);
          });

          // المدينة = (عدد الليالي * (الغرفة الأولى + الغرفة الثانية + الغرفة الثالثة))
          const cityTotal = cityStay.nights * totalRoomCostPerNight;
          totalHotelCost += cityTotal;
          
          console.log(`${cityStay.city}: ${cityStay.nights} nights × $${totalRoomCostPerNight} (total rooms) = $${cityTotal}`);

          cityBreakdown.push({
            city: cityStay.city,
            nights: cityStay.nights,
            roomCost: totalRoomCostPerNight,
            totalCost: cityTotal,
            roomDetails
          });
        }
      }
    });
    
    console.log('Total hotel cost:', totalHotelCost);
    return { total: totalHotelCost, breakdown: cityBreakdown };
  };

  const calculateTourCosts = () => {
    const transport = transportPricing[data.carType as keyof typeof transportPricing];
    console.log('=== TOUR COST CALCULATION (UPDATED) ===');
    console.log('Selected car type:', data.carType);
    console.log('Transport pricing:', transport);
    
    if (!transport) {
      console.log('No transport pricing found');
      return { total: 0, breakdown: [], reception: 0, farewell: 0 };
    }

    const cityBreakdown: Array<{
      city: string;
      regularTours: number;
      mandatoryTours: number;
      totalTours: number;
      totalCost: number;
      hasAirportTransfer: boolean;
    }> = [];

    let totalTourCost = 0;

    // Airport to city mapping
    const arrivalCity = airportCityMapping[data.arrivalAirport];
    const departureCity = airportCityMapping[data.departureAirport];

    // حساب تكلفة الجولات لكل مدينة
    data.selectedCities.forEach((cityStay, index) => {
      const regularTours = cityStay.tours || 0;
      const mandatoryTours = cityStay.mandatoryTours || 0;
      
      // Check if this city needs airport transfer
      const isFirstCity = index === 0;
      const isLastCity = index === data.selectedCities.length - 1;
      const hasAirportTransfer = (isFirstCity && cityStay.city === arrivalCity) || 
                                (isLastCity && cityStay.city === departureCity);
      
      const totalTours = regularTours + mandatoryTours;
      const cityTourCost = totalTours * transport.dailyPrice;
      
      console.log(`${cityStay.city}: ${totalTours} tours (${regularTours} regular + ${mandatoryTours} mandatory) × $${transport.dailyPrice} = $${cityTourCost}`);
      if (hasAirportTransfer) {
        console.log(`  - includes airport transfer`);
      }
      
      totalTourCost += cityTourCost;

      if (totalTours > 0 || hasAirportTransfer) {
        cityBreakdown.push({
          city: cityStay.city,
          regularTours,
          mandatoryTours,
          totalTours,
          totalCost: cityTourCost,
          hasAirportTransfer
        });
      }
    });

    // حساب تكلفة الاستقبال والتوديع
    const isSameAirport = data.arrivalAirport === data.departureAirport;
    const receptionCost = isSameAirport ? transport.reception.sameCity : transport.reception.differentCity;
    const farewellCost = isSameAirport ? transport.farewell.sameCity : transport.farewell.differentCity;
    
    console.log(`Reception cost: $${receptionCost} (${isSameAirport ? 'same city' : 'different city'})`);
    console.log(`Farewell cost: $${farewellCost} (${isSameAirport ? 'same city' : 'different city'})`);
    console.log('Total tour cost (cities only):', totalTourCost);
    
    return { 
      total: totalTourCost, 
      breakdown: cityBreakdown, 
      reception: receptionCost, 
      farewell: farewellCost 
    };
  };

  const calculateAdditionalServicesCosts = () => {
    let totalCost = 0;
    const duration = getDuration();

    console.log('=== ADDITIONAL SERVICES CALCULATION ===');
    console.log('Trip duration (days):', duration);
    console.log('Additional services:', data.additionalServices);

    if (data.additionalServices.travelInsurance.enabled) {
      const insuranceCost = data.additionalServices.travelInsurance.persons * 
                           additionalServicesData.travelInsurance.pricePerPersonPerDay * 
                           duration;
      totalCost += insuranceCost;
      console.log(`Travel Insurance: ${data.additionalServices.travelInsurance.persons} persons × $${additionalServicesData.travelInsurance.pricePerPersonPerDay}/day × ${duration} days = $${insuranceCost}`);
    }

    if (data.additionalServices.phoneLines.enabled) {
      const phoneLinesCost = data.additionalServices.phoneLines.quantity * 
                            additionalServicesData.phoneLines.pricePerLine;
      totalCost += phoneLinesCost;
      console.log(`Phone Lines: ${data.additionalServices.phoneLines.quantity} lines × $${additionalServicesData.phoneLines.pricePerLine} = $${phoneLinesCost}`);
    }

    if (data.additionalServices.roomDecoration.enabled) {
      totalCost += additionalServicesData.roomDecoration.price;
      console.log(`Room Decoration: $${additionalServicesData.roomDecoration.price}`);
    }

    if (data.additionalServices.airportReception.enabled) {
      const receptionCost = data.additionalServices.airportReception.persons * 
                           additionalServicesData.airportReception.pricePerPerson;
      totalCost += receptionCost;
      console.log(`VIP Airport Reception: ${data.additionalServices.airportReception.persons} persons × $${additionalServicesData.airportReception.pricePerPerson} = $${receptionCost}`);
    }

    if (data.additionalServices.photoSession.enabled) {
      totalCost += additionalServicesData.photoSession.price;
      console.log(`Photo Session: $${additionalServicesData.photoSession.price}`);
    }

    if (data.additionalServices.flowerReception.enabled) {
      totalCost += additionalServicesData.flowerReception.price;
      console.log(`Flower Reception: $${additionalServicesData.flowerReception.price}`);
    }

    console.log('Total additional services cost:', totalCost);
    return totalCost;
  };

  const getDuration = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      const diffInMs = departure.getTime() - arrival.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      return Math.max(1, diffInDays);
    }
    return 1;
  };

  // حساب التكاليف - يجب أن يتم دائماً حتى أثناء التحميل
  const hotelCostData = calculateHotelCosts();
  const tourCostData = calculateTourCosts();
  const additionalServicesCosts = calculateAdditionalServicesCosts();
  
  // إجمالي الجولات = الاستقبال + جولات المدن + التوديع
  const totalToursAndTransport = tourCostData.reception + tourCostData.total + tourCostData.farewell;
  
  // حساب المجموع قبل هامش الربح
  const subtotal = hotelCostData.total + totalToursAndTransport + additionalServicesCosts;
  
  // تطبيق هامش الربح 22%
  const profitMargin = 0.22;
  const totalCostUSD = subtotal * (1 + profitMargin);
  const totalCostLocal = convertFromUSD(totalCostUSD, selectedCurrency.code);

  console.log('=== FINAL COST BREAKDOWN (UPDATED) ===');
  console.log('Hotel costs: $', hotelCostData.total);
  console.log('Tour costs (cities): $', tourCostData.total);
  console.log('Reception cost: $', tourCostData.reception);
  console.log('Farewell cost: $', tourCostData.farewell);
  console.log('Total tours + transport: $', totalToursAndTransport);
  console.log('Additional services: $', additionalServicesCosts);
  console.log('Subtotal: $', subtotal);
  console.log('Profit margin (22%): $', subtotal * profitMargin);
  console.log('Total USD: $', totalCostUSD);
  console.log('Total Local Currency:', totalCostLocal, selectedCurrency.code);

  useEffect(() => {
    updateData({ totalCost: totalCostUSD });
  }, [totalCostUSD, updateData]);

  const budgetInUSD = data.budget / selectedCurrency.exchangeRate;
  const isOverBudget = totalCostUSD > budgetInUSD;

  // إظهار حالة التحميل فقط بعد تعريف جميع المتغيرات
  if (hotelsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الفنادق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">حساب الأسعار والميزانية</h2>
        <p className="text-gray-600">مراجعة تكلفة رحلتك والمقارنة مع الميزانية</p>
      </div>

      {/* USD Payment Notice */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <DollarSign className="w-5 h-5" />
            معلومات الدفع المهمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">الأسعار محسوبة بـ {selectedCurrency.nameAr} للوضوح</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">الدفع سيتم بالدولار الأمريكي عند الوصول إلى جورجيا</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">لا يوجد دفع مسبق أو دفع عبر الإنترنت</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget vs Cost Comparison */}
      {data.budget > 0 && (
        <Card className={`border-2 ${isOverBudget ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              مقارنة الميزانية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">الميزانية المحددة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(data.budget, selectedCurrency.code)}
                </p>
                {selectedCurrency.code !== 'USD' && (
                  <p className="text-sm text-gray-500">≈ ${Math.round(budgetInUSD)} USD</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">التكلفة الإجمالية</p>
                <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(totalCostLocal, selectedCurrency.code)}
                </p>
                {selectedCurrency.code !== 'USD' && (
                  <p className="text-sm text-gray-500">≈ ${Math.round(totalCostUSD)} USD</p>
                )}
              </div>
            </div>
            
            {isOverBudget ? (
              <div className="mt-4 p-4 bg-red-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">تجاوزت التكلفة الميزانية المحددة</span>
                </div>
                <p className="text-red-700 text-sm">
                  الفرق: {formatCurrency(totalCostLocal - data.budget, selectedCurrency.code)}
                  {selectedCurrency.code !== 'USD' && ` (≈ $${Math.round(totalCostUSD - budgetInUSD)} USD)`}
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">التكلفة تناسب ميزانيتك</span>
                </div>
                <p className="text-green-700 text-sm">
                  المتبقي: {formatCurrency(data.budget - totalCostLocal, selectedCurrency.code)}
                  {selectedCurrency.code !== 'USD' && ` (≈ $${Math.round(budgetInUSD - totalCostUSD)} USD)`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص التكلفة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>إجمالي الفنادق</span>
              <div className="text-left">
                <span className="font-medium">{formatCurrency(convertFromUSD(hotelCostData.total, selectedCurrency.code), selectedCurrency.code)}</span>
                {selectedCurrency.code !== 'USD' && (
                  <div className="text-xs text-gray-500">${Math.round(hotelCostData.total)} USD</div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>إجمالي الجولات والنقل</span>
              <div className="text-left">
                <span className="font-medium">{formatCurrency(convertFromUSD(totalToursAndTransport, selectedCurrency.code), selectedCurrency.code)}</span>
                {selectedCurrency.code !== 'USD' && (
                  <div className="text-xs text-gray-500">${Math.round(totalToursAndTransport)} USD</div>
                )}
              </div>
            </div>
            {additionalServicesCosts > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>الخدمات الإضافية</span>
                <div className="text-left">
                  <span className="font-medium">{formatCurrency(convertFromUSD(additionalServicesCosts, selectedCurrency.code), selectedCurrency.code)}</span>
                  {selectedCurrency.code !== 'USD' && (
                    <div className="text-xs text-gray-500">${Math.round(additionalServicesCosts)} USD</div>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b">
              <span>هامش الربح (22%)</span>
              <div className="text-left">
                <span className="font-medium">{formatCurrency(convertFromUSD(subtotal * profitMargin, selectedCurrency.code), selectedCurrency.code)}</span>
                {selectedCurrency.code !== 'USD' && (
                  <div className="text-xs text-gray-500">${Math.round(subtotal * profitMargin)} USD</div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2 text-lg font-bold border-t-2">
              <span>الإجمالي النهائي</span>
              <div className="text-left">
                <span>{formatCurrency(totalCostLocal, selectedCurrency.code)}</span>
                <div className="text-sm text-green-600 font-medium">
                  الدفع: ${Math.round(totalCostUSD)} USD
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Hotel Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            تفاصيل تكلفة الفنادق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotelCostData.breakdown.length > 0 ? (
              hotelCostData.breakdown.map((city, index) => (
                <div key={index} className="py-3 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{city.city}</span>
                    <span className="font-medium">
                      ${Math.round(city.totalCost)} USD
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {city.roomDetails.map((detail, detailIndex) => (
                      <div key={detailIndex}>• {detail}</div>
                    ))}
                    <div className="font-medium">
                      {city.nights} ليلة × ${city.roomCost} (إجمالي الغرف) = ${city.totalCost} USD
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                لم يتم اختيار فنادق أو غرف بعد
              </div>
            )}
            <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2">
              <span>إجمالي الفنادق</span>
              <span>${Math.round(hotelCostData.total)} USD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tour Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            تفاصيل تكلفة الجولات والنقل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Reception */}
            <div className="py-3 border-b">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  الاستقبال من المطار ({airportCityMapping[data.arrivalAirport]})
                </span>
                <span className="font-medium">
                  ${Math.round(tourCostData.reception)} USD
                </span>
              </div>
            </div>

            {/* City Tours */}
            {tourCostData.breakdown.length > 0 ? (
              tourCostData.breakdown.map((city, index) => (
                <div key={index} className="py-3 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{city.city}</span>
                    <span className="font-medium">
                      ${Math.round(city.totalCost)} USD
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {city.hasAirportTransfer && (
                      <div>• نقل من أو إلى المطار: 1</div>
                    )}
                    {city.mandatoryTours > 0 && (
                      <div>• جولات إجبارية: {city.mandatoryTours}</div>
                    )}
                    {city.regularTours > 0 && (
                      <div>• جولات إضافية: {city.regularTours}</div>
                    )}
                    <div className="font-medium">• إجمالي الجولات: {city.totalTours}</div>
                    <div className="font-medium">
                      {city.totalTours} جولات × ${transportPricing[data.carType as keyof typeof transportPricing]?.dailyPrice || 0}/جولة
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                لم يتم اختيار جولات أو نوع سيارة بعد
              </div>
            )}

            {/* Farewell */}
            <div className="py-3 border-b">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  التوديع إلى المطار ({airportCityMapping[data.departureAirport]})
                </span>
                <span className="font-medium">
                  ${Math.round(tourCostData.farewell)} USD
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2">
              <span>إجمالي الجولات والنقل</span>
              <span>${Math.round(totalToursAndTransport)} USD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transport Rules Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">قواعد الاستقبال والتوديع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-700 text-sm space-y-2">
            <p><strong>قواعد الاستقبال:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>نفس المدينة (مطار الوصول = مطار المغادرة): {data.carType ? `$${transportPricing[data.carType as keyof typeof transportPricing]?.reception.sameCity || 0}` : '$0'}</li>
              <li>مدن مختلفة (مطار الوصول ≠ مطار المغادرة): {data.carType ? `$${transportPricing[data.carType as keyof typeof transportPricing]?.reception.differentCity || 0}` : '$0'}</li>
            </ul>
            <p><strong>قواعد التوديع:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>نفس المدينة: {data.carType ? `$${transportPricing[data.carType as keyof typeof transportPricing]?.farewell.sameCity || 0}` : '$0'}</li>
              <li>مدن مختلفة: {data.carType ? `$${transportPricing[data.carType as keyof typeof transportPricing]?.farewell.differentCity || 0}` : '$0'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">خصوصية معلوماتك مضمونة</span>
          </div>
          <p className="text-green-700 text-sm">
            لا يتم مشاركة معلوماتك مع أي جهة خارجية. فقط الفنادق المختارة ستحصل على بياناتك لتأكيد الحجز.
            الدفع سيتم بالدولار الأمريكي عند الوصول إلى جورجيا مباشرة.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
