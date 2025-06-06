import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { additionalServicesData } from '@/data/hotels';
import { currencies, convertFromUSD, formatCurrency, additionalCurrencies } from '@/data/currencies';
import { transportPricing, mandatoryToursRules } from '@/data/transportRules';
import { useHotelData } from '@/hooks/useHotelData';
import { DollarSign, AlertTriangle, CheckCircle, MapPin, Building2, Car } from 'lucide-react';

interface PricingStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const PricingStep = ({ data, updateData }: PricingStepProps) => {
  const { hotels: databaseHotels, loading: hotelsLoading } = useHotelData();
  
  // دمج العملات الأساسية مع العملات الإضافية
  const allCurrencies = [...currencies, ...additionalCurrencies];
  const selectedCurrency = allCurrencies.find(c => c.code === data.currency) || allCurrencies[0];

  const calculateHotelCosts = () => {
    const cityBreakdown: Array<{
      city: string;
      nights: number;
      roomCost: number;
      totalCost: number;
      roomDetails: string[];
    }> = [];

    let totalHotelCost = 0;
    
    console.log('=== HOTEL COST CALCULATION START ===');
    console.log('Selected cities:', data.selectedCities);
    console.log('Database hotels loaded:', !hotelsLoading);
    console.log('Database hotels available:', Object.keys(databaseHotels || {}).length > 0);
    
    if (hotelsLoading || !databaseHotels) {
      console.log('Hotels still loading or not available');
      return { total: 0, breakdown: [] };
    }
    
    data.selectedCities.forEach((cityStay, cityIndex) => {
      console.log(`Processing city ${cityIndex + 1}: ${cityStay.city}`);
      console.log(`Hotel: ${cityStay.hotel}`);
      console.log(`Nights: ${cityStay.nights}`);
      console.log(`Room selections:`, cityStay.roomSelections);
      
      if (cityStay.city && cityStay.hotel && cityStay.roomSelections && cityStay.roomSelections.length > 0) {
        // البحث في قاعدة البيانات
        const cityHotels = databaseHotels[cityStay.city];
        console.log(`Available hotels in ${cityStay.city}:`, cityHotels?.map(h => h.name) || 'No hotels found');
        
        const hotel = cityHotels?.find(h => h.name === cityStay.hotel);
        console.log('Found hotel from database:', hotel ? hotel.name : 'Not found');
        
        if (hotel) {
          console.log('Hotel prices from database:', {
            single: hotel.single_price,
            single_view: hotel.single_view_price,
            double_without_view: hotel.double_without_view_price,
            double_view: hotel.double_view_price,
            triple_without_view: hotel.triple_without_view_price,
            triple_view: hotel.triple_view_price
          });
          
          let roomCostPerNight = 0;
          const roomDetails: string[] = [];
          
          // حساب تكلفة كل غرفة حسب النوع المختار
          cityStay.roomSelections.forEach((room, roomIndex) => {
            console.log(`Processing room ${roomIndex + 1} with type: ${room.roomType}`);
            
            let roomPrice = 0;
            let roomTypeName = '';
            
            // استخدام الأسعار من قاعدة البيانات مع معالجة أفضل للقيم المفقودة
            switch (room.roomType) {
              case 'single':
                roomPrice = Number(hotel.single_price) || Number(hotel.double_without_view_price) || 0;
                roomTypeName = 'غرفة مفردة';
                break;
              case 'single_v':
                roomPrice = Number(hotel.single_view_price) || Number(hotel.double_view_price) || Number(hotel.single_price) || 0;
                roomTypeName = 'غرفة مفردة (مع إطلالة)';
                break;
              case 'dbl_wv':
                roomPrice = Number(hotel.double_without_view_price) || Number(hotel.single_price) || 0;
                roomTypeName = 'غرفة مزدوجة (بدون إطلالة)';
                break;
              case 'dbl_v':
                roomPrice = Number(hotel.double_view_price) || Number(hotel.double_without_view_price) || 0;
                roomTypeName = 'غرفة مزدوجة (مع إطلالة)';
                break;
              case 'trbl_wv':
                roomPrice = Number(hotel.triple_without_view_price) || Number(hotel.double_without_view_price) || 0;
                roomTypeName = 'غرفة ثلاثية (بدون إطلالة)';
                break;
              case 'trbl_v':
                roomPrice = Number(hotel.triple_view_price) || Number(hotel.triple_without_view_price) || Number(hotel.double_view_price) || 0;
                roomTypeName = 'غرفة ثلاثية (مع إطلالة)';
                break;
              default:
                roomPrice = 0;
                roomTypeName = 'غير محدد';
            }
            
            console.log(`Room ${roomIndex + 1} - Type: ${room.roomType}, Price: $${roomPrice}, Name: ${roomTypeName}`);
            
            if (roomPrice > 0) {
              roomCostPerNight += roomPrice;
              roomDetails.push(`الغرفة ${roomIndex + 1}: ${roomTypeName} ($${roomPrice}/ليلة)`);
            } else {
              console.warn(`No price found for room type ${room.roomType} in hotel ${hotel.name}`);
              // حتى لو لم يكن هناك سعر، نضيف تفاصيل الغرفة
              roomDetails.push(`الغرفة ${roomIndex + 1}: ${roomTypeName} (السعر غير متاح)`);
            }
          });

          const cityTotal = roomCostPerNight * (cityStay.nights || 1);
          totalHotelCost += cityTotal;
          
          console.log(`City ${cityStay.city} calculation: $${roomCostPerNight}/night × ${cityStay.nights} nights = $${cityTotal}`);

          cityBreakdown.push({
            city: cityStay.city,
            nights: cityStay.nights || 1,
            roomCost: roomCostPerNight,
            totalCost: cityTotal,
            roomDetails
          });
        } else {
          console.error(`Hotel "${cityStay.hotel}" not found in database for city "${cityStay.city}"`);
          console.log(`Available hotels in ${cityStay.city}:`, cityHotels?.map(h => h.name) || 'None');
          
          // إضافة معلومات للمدينة حتى لو لم نجد الفندق
          cityBreakdown.push({
            city: cityStay.city,
            nights: cityStay.nights || 1,
            roomCost: 0,
            totalCost: 0,
            roomDetails: [`الفندق "${cityStay.hotel}" غير موجود في قاعدة البيانات`]
          });
        }
      } else {
        console.log(`Missing required data for city ${cityStay.city}:`, {
          hasCity: !!cityStay.city,
          hasHotel: !!cityStay.hotel,
          hasRoomSelections: !!cityStay.roomSelections,
          roomSelectionsLength: cityStay.roomSelections?.length || 0
        });
      }
    });
    
    console.log('=== HOTEL COST CALCULATION END ===');
    console.log('Total hotel cost calculated:', totalHotelCost);
    console.log('City breakdown:', cityBreakdown);
    
    return { total: totalHotelCost, breakdown: cityBreakdown };
  };

  const calculateTourCosts = () => {
    // استخدام نظام النقل الجديد
    const transport = transportPricing[data.carType as keyof typeof transportPricing];
    console.log('=== TOUR COST CALCULATION ===');
    console.log('Selected car type:', data.carType);
    console.log('Transport pricing:', transport);
    
    if (!transport) {
      console.log('No transport pricing found');
      return { total: 0, breakdown: [] };
    }

    const cityBreakdown: Array<{
      city: string;
      regularTours: number;
      mandatoryTours: number;
      totalTours: number;
      totalCost: number;
    }> = [];

    let totalTourCost = 0;

    data.selectedCities.forEach((cityStay, index) => {
      const regularTours = cityStay.tours || 0;
      
      // حساب الجولات الإجبارية حسب القواعد الجديدة
      let mandatoryTours = 0;
      
      // استخدام النظام الجديد للجولات الإجبارية
      if (mandatoryToursRules.doubleTourCities.includes(cityStay.city)) {
        mandatoryTours = 2; // باتومي وكوتايسي = 2 جولات
      } else if (mandatoryToursRules.singleTourCities.includes(cityStay.city)) {
        mandatoryTours = 1; // باقي المدن = 1 جولة
      } else {
        mandatoryTours = mandatoryToursRules.default; // افتراضي = 1 جولة
      }
      
      const totalTours = regularTours + mandatoryTours;
      const cityTourCost = totalTours * transport.dailyPrice;
      
      console.log(`${cityStay.city}: ${totalTours} tours (${regularTours} regular + ${mandatoryTours} mandatory) × $${transport.dailyPrice} = $${cityTourCost}`);
      
      totalTourCost += cityTourCost;

      if (totalTours > 0) {
        cityBreakdown.push({
          city: cityStay.city,
          regularTours,
          mandatoryTours,
          totalTours,
          totalCost: cityTourCost
        });
      }
    });

    console.log('Total tour cost:', totalTourCost);
    return { total: totalTourCost, breakdown: cityBreakdown };
  };

  const calculateTransportCosts = () => {
    const transport = transportPricing[data.carType as keyof typeof transportPricing];
    if (!transport) return 0;

    console.log('=== TRANSPORT COST CALCULATION ===');
    const isSameCity = data.arrivalAirport === data.departureAirport;
    const receptionCost = transport.reception[isSameCity ? 'sameCity' : 'differentCity'];
    const farewellCost = transport.farewell[isSameCity ? 'sameCity' : 'differentCity'];
    
    const totalTransportCost = receptionCost + farewellCost;
    console.log(`Airport reception: $${receptionCost}`);
    console.log(`Airport farewell: $${farewellCost}`);
    console.log(`Total transport: $${totalTransportCost}`);
    
    return totalTransportCost;
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
      return Math.max(1, diffInDays); // ضمان الحد الأدنى يوم واحد
    }
    return 1;
  };

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

  const hotelCostData = calculateHotelCosts();
  const tourCostData = calculateTourCosts();
  const transportCosts = calculateTransportCosts();
  const additionalServicesCosts = calculateAdditionalServicesCosts();
  
  // حساب المجموع قبل هامش الربح
  const subtotal = hotelCostData.total + tourCostData.total + transportCosts + additionalServicesCosts;
  
  // تطبيق هامش الربح 22%
  const profitMargin = 0.22;
  const totalCostUSD = subtotal * (1 + profitMargin);
  const totalCostLocal = convertFromUSD(totalCostUSD, selectedCurrency.code);

  console.log('=== FINAL COST BREAKDOWN ===');
  console.log('Hotel costs: $', hotelCostData.total);
  console.log('Tour costs: $', tourCostData.total);
  console.log('Transport costs: $', transportCosts);
  console.log('Additional services: $', additionalServicesCosts);
  console.log('Subtotal: $', subtotal);
  console.log('Profit margin (22%): $', subtotal * profitMargin);
  console.log('Total USD: $', totalCostUSD);
  console.log('Total Local Currency:', totalCostLocal, selectedCurrency.code);

  useEffect(() => {
    updateData({ totalCost: totalCostUSD });
  }, [totalCostUSD]);

  const budgetInUSD = data.budget / selectedCurrency.exchangeRate;
  const isOverBudget = totalCostUSD > budgetInUSD;

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

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص التكلفة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة الإقامة</span>
              <div className="text-left">
                <span className="font-medium">{formatCurrency(convertFromUSD(hotelCostData.total, selectedCurrency.code), selectedCurrency.code)}</span>
                {selectedCurrency.code !== 'USD' && (
                  <div className="text-xs text-gray-500">${Math.round(hotelCostData.total)} USD</div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة الجولات</span>
              <div className="text-left">
                <span className="font-medium">{formatCurrency(convertFromUSD(tourCostData.total, selectedCurrency.code), selectedCurrency.code)}</span>
                {selectedCurrency.code !== 'USD' && (
                  <div className="text-xs text-gray-500">${Math.round(tourCostData.total)} USD</div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة النقل والاستقبال</span>
              <div className="text-left">
                <span className="font-medium">{formatCurrency(convertFromUSD(transportCosts, selectedCurrency.code), selectedCurrency.code)}</span>
                {selectedCurrency.code !== 'USD' && (
                  <div className="text-xs text-gray-500">${Math.round(transportCosts)} USD</div>
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
            تفاصيل تكلفة الإقامة
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
                      إجمالي الليلة: ${city.roomCost} USD × {city.nights} ليلة = ${city.totalCost} USD
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
              <span>إجمالي الإقامة</span>
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
            تفاصيل تكلفة الجولات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                    {city.regularTours > 0 && (
                      <div>• جولات اختيارية: {city.regularTours}</div>
                    )}
                    {city.mandatoryTours > 0 && (
                      <div>• جولات إجبارية: {city.mandatoryTours}</div>
                    )}
                    <div>• إجمالي الجولات: {city.totalTours}</div>
                    <div className="font-medium">
                      ${city.totalTours} جولات × ${transportPricing[data.carType as keyof typeof transportPricing]?.dailyPrice || 0}/جولة
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                لم يتم اختيار جولات أو نوع سيارة بعد
              </div>
            )}
            <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2">
              <span>إجمالي الجولات</span>
              <span>${Math.round(tourCostData.total)} USD</span>
            </div>
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
