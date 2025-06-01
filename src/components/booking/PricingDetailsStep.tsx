
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { hotelData } from '@/data/hotels';
import { transportPricing, mandatoryToursRules } from '@/data/transportRules';
import { DollarSign, Eye, EyeOff, Calculator, Hotel, Car, MapPin, Users, Calendar } from 'lucide-react';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const PricingDetailsStep = ({ data, updateData, onValidationChange }: PricingDetailsStepProps) => {
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  // Calculate hotel costs
  const calculateHotelCosts = () => {
    let totalHotelCost = 0;
    const hotelDetails: any[] = [];

    console.log('=== HOTEL COST CALCULATION ===');
    console.log('Selected cities:', data.selectedCities);

    data.selectedCities.forEach((cityStay, cityIndex) => {
      if (!cityStay.city || !cityStay.hotel) return;

      const cityHotels = hotelData[cityStay.city] || [];
      const selectedHotel = cityHotels.find(h => h.name === cityStay.hotel);
      
      console.log(`Processing ${cityStay.city} - ${cityStay.hotel}`);
      console.log('Selected hotel:', selectedHotel);
      
      if (!selectedHotel || !cityStay.roomSelections) return;

      let cityTotal = 0;
      const roomDetails: any[] = [];

      cityStay.roomSelections.forEach((room, roomIndex) => {
        if (!room.roomType) return;

        let roomPrice = 0;
        switch (room.roomType) {
          case 'single':
            roomPrice = selectedHotel.single_price || selectedHotel.double_without_view_price || 0;
            break;
          case 'single_v':
            roomPrice = selectedHotel.single_view_price || selectedHotel.double_view_price || 0;
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

        const roomTotal = roomPrice * cityStay.nights;
        cityTotal += roomTotal;

        console.log(`Room ${roomIndex + 1}: ${room.roomType} = $${roomPrice}/night × ${cityStay.nights} nights = $${roomTotal}`);

        roomDetails.push({
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          pricePerNight: roomPrice,
          nights: cityStay.nights,
          total: roomTotal
        });
      });

      totalHotelCost += cityTotal;
      hotelDetails.push({
        city: cityStay.city,
        hotel: cityStay.hotel,
        nights: cityStay.nights,
        rooms: roomDetails,
        cityTotal
      });

      console.log(`${cityStay.city} total: $${cityTotal}`);
    });

    console.log('Total hotel cost:', totalHotelCost);
    return { totalHotelCost, hotelDetails };
  };

  // Calculate tour costs
  const calculateTourCosts = () => {
    const transport = transportPricing[data.carType as keyof typeof transportPricing];
    console.log('=== TOUR COST CALCULATION ===');
    console.log('Selected car type:', data.carType);
    console.log('Transport pricing:', transport);
    
    if (!transport) {
      console.log('No transport pricing found');
      return { totalTourCost: 0, tourDetails: [] };
    }

    const tourDetails: any[] = [];
    let totalTourCost = 0;

    data.selectedCities.forEach((cityStay, index) => {
      const regularTours = cityStay.tours || 0;
      
      // حساب الجولات الإجبارية حسب القواعد الجديدة
      let mandatoryTours = 0;
      
      if (cityStay.city === 'باتومي') {
        mandatoryTours = mandatoryToursRules.batumi;
      } else {
        mandatoryTours = mandatoryToursRules.default;
      }
      
      // تطبيق قواعد المطارات
      const isFirstCity = index === 0;
      const isLastCity = index === data.selectedCities.length - 1;
      
      if (isFirstCity) {
        const arrivalAirport = data.arrivalAirport;
        if (mandatoryToursRules.arrivalRules[arrivalAirport as keyof typeof mandatoryToursRules.arrivalRules] !== undefined) {
          mandatoryTours = mandatoryToursRules.arrivalRules[arrivalAirport as keyof typeof mandatoryToursRules.arrivalRules];
        }
      }
      
      if (isLastCity) {
        const departureAirport = data.departureAirport;
        if (mandatoryToursRules.departureRules[departureAirport as keyof typeof mandatoryToursRules.departureRules] !== undefined) {
          mandatoryTours = mandatoryToursRules.departureRules[departureAirport as keyof typeof mandatoryToursRules.departureRules];
        }
      }
      
      const totalTours = regularTours + mandatoryTours;
      const cityTourCost = totalTours * transport.dailyPrice;
      
      console.log(`${cityStay.city}: ${totalTours} tours (${regularTours} regular + ${mandatoryTours} mandatory) × $${transport.dailyPrice} = $${cityTourCost}`);
      
      totalTourCost += cityTourCost;

      if (totalTours > 0) {
        tourDetails.push({
          city: cityStay.city,
          regularTours,
          mandatoryTours,
          totalTours,
          totalCost: cityTourCost
        });
      }
    });

    console.log('Total tour cost:', totalTourCost);
    return { totalTourCost, tourDetails };
  };

  // Calculate additional services
  const calculateAdditionalServices = () => {
    let totalServicesCost = 0;
    const serviceDetails: any[] = [];

    if (data.additionalServices?.travelInsurance?.enabled) {
      const cost = (data.additionalServices.travelInsurance.persons || 0) * 50;
      totalServicesCost += cost;
      serviceDetails.push({
        name: 'تأمين السفر',
        quantity: data.additionalServices.travelInsurance.persons,
        unitPrice: 50,
        total: cost
      });
    }

    if (data.additionalServices?.phoneLines?.enabled) {
      const cost = (data.additionalServices.phoneLines.quantity || 0) * 25;
      totalServicesCost += cost;
      serviceDetails.push({
        name: 'خطوط هاتف',
        quantity: data.additionalServices.phoneLines.quantity,
        unitPrice: 25,
        total: cost
      });
    }

    if (data.additionalServices?.roomDecoration?.enabled) {
      totalServicesCost += 75;
      serviceDetails.push({
        name: 'تزيين الغرفة',
        quantity: 1,
        unitPrice: 75,
        total: 75
      });
    }

    if (data.additionalServices?.airportReception?.enabled) {
      const cost = (data.additionalServices.airportReception.persons || 0) * 30;
      totalServicesCost += cost;
      serviceDetails.push({
        name: 'استقبال المطار',
        quantity: data.additionalServices.airportReception.persons,
        unitPrice: 30,
        total: cost
      });
    }

    if (data.additionalServices?.photoSession?.enabled) {
      totalServicesCost += 150;
      serviceDetails.push({
        name: 'جلسة تصوير',
        quantity: 1,
        unitPrice: 150,
        total: 150
      });
    }

    if (data.additionalServices?.flowerReception?.enabled) {
      totalServicesCost += 40;
      serviceDetails.push({
        name: 'استقبال بالورود',
        quantity: 1,
        unitPrice: 40,
        total: 40
      });
    }

    return { totalServicesCost, serviceDetails };
  };

  // Calculate transport costs (reception and farewell)
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

  const { totalHotelCost, hotelDetails } = calculateHotelCosts();
  const { totalTourCost, tourDetails } = calculateTourCosts();
  const transportCosts = calculateTransportCosts();
  const { totalServicesCost, serviceDetails } = calculateAdditionalServices();

  const grandTotal = totalHotelCost + totalTourCost + transportCosts + totalServicesCost;

  // Update total cost in booking data
  useEffect(() => {
    updateData({ totalCost: grandTotal });
  }, [grandTotal]);

  const getRoomTypeLabel = (roomType: string) => {
    const labels: { [key: string]: string } = {
      'single': 'غرفة مفردة',
      'single_v': 'غرفة مفردة مع إطلالة',
      'dbl_wv': 'غرفة مزدوجة بدون إطلالة',
      'dbl_v': 'غرفة مزدوجة مع إطلالة',
      'trbl_wv': 'غرفة ثلاثية بدون إطلالة',
      'trbl_v': 'غرفة ثلاثية مع إطلالة'
    };
    return labels[roomType] || roomType;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل الأسعار</h2>
        <p className="text-gray-600">مراجعة التكاليف والأسعار النهائية</p>
      </div>

      {/* Total Cost Summary */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-600" />
              <span>إجمالي التكلفة</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              ${grandTotal.toLocaleString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">${totalHotelCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">الفنادق</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">${totalTourCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">الجولات</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-semibold text-green-600">${transportCosts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">النقل</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-semibold text-orange-600">${totalServicesCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">الخدمات الإضافية</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show/Hide Details Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="gap-2"
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showDetails ? 'إخفاء التفاصيل' : 'إظهار التفاصيل'}
        </Button>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="space-y-6">
          {/* Hotel Details */}
          {hotelDetails.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-blue-600" />
                  تفاصيل تكاليف الفنادق
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotelDetails.map((hotel, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800 mb-3">
                      {hotel.city} - {hotel.hotel} ({hotel.nights} ليالي)
                    </div>
                    <div className="space-y-2">
                      {hotel.rooms.map((room: any, roomIndex: number) => (
                        <div key={roomIndex} className="flex justify-between text-sm">
                          <span>الغرفة {room.roomNumber}: {getRoomTypeLabel(room.roomType)}</span>
                          <span>${room.pricePerNight} × {room.nights} ليالي = ${room.total}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 font-medium text-blue-700">
                        إجمالي {hotel.city}: ${hotel.cityTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tour Details */}
          {tourDetails.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-purple-600" />
                  تفاصيل تكاليف الجولات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tourDetails.map((tour, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800 mb-3">{tour.city}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>جولات إجبارية</span>
                        <span>{tour.mandatoryTours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>جولات اختيارية</span>
                        <span>{tour.regularTours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>إجمالي الجولات</span>
                        <span>{tour.totalTours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>سعر الجولة الواحدة ({data.carType})</span>
                        <span>${transportPricing[data.carType as keyof typeof transportPricing]?.dailyPrice || 0}</span>
                      </div>
                      <div className="border-t pt-2 font-medium text-purple-700">
                        <div className="flex justify-between">
                          <span>المجموع</span>
                          <span>${tour.totalCost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Transport Details */}
          {transportCosts > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-green-600" />
                  تفاصيل تكاليف النقل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>استقبال من المطار ({data.carType})</span>
                      <span>${transportPricing[data.carType as keyof typeof transportPricing]?.reception[data.arrivalAirport === data.departureAirport ? 'sameCity' : 'differentCity'] || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>توديع إلى المطار ({data.carType})</span>
                      <span>${transportPricing[data.carType as keyof typeof transportPricing]?.farewell[data.arrivalAirport === data.departureAirport ? 'sameCity' : 'differentCity'] || 0}</span>
                    </div>
                    <div className="border-t pt-2 font-medium text-green-700">
                      <div className="flex justify-between">
                        <span>إجمالي النقل</span>
                        <span>${transportCosts}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Services Details */}
          {serviceDetails.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  تفاصيل الخدمات الإضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceDetails.map((service, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium text-orange-800">{service.name}</span>
                    <span className="text-orange-700">
                      {service.quantity > 1 ? `${service.quantity} × $${service.unitPrice} = ` : ''}
                      ${service.total}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Trip Summary */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                ملخص الرحلة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>المسافرين:</span>
                  <span>{data.adults + data.children.length} شخص</span>
                </div>
                <div className="flex justify-between">
                  <span>الغرف:</span>
                  <span>{data.rooms} غرفة</span>
                </div>
                <div className="flex justify-between">
                  <span>المدن:</span>
                  <span>{data.selectedCities.length} مدينة</span>
                </div>
                <div className="flex justify-between">
                  <span>الليالي:</span>
                  <span>{data.selectedCities.reduce((total, city) => total + city.nights, 0)} ليلة</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Warning if no data */}
      {grandTotal === 0 && (
        <Alert>
          <AlertDescription>
            لم يتم اختيار أي مدن أو فنادق بعد. الرجاء العودة إلى الخطوات السابقة لإكمال اختياراتك.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
