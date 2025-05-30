import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, currencies, additionalServicesData } from '@/data/hotels';
import { DollarSign, AlertTriangle, CheckCircle, MapPin, Building2, Car } from 'lucide-react';

interface PricingStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const PricingStep = ({ data, updateData }: PricingStepProps) => {
  const calculateHotelCosts = () => {
    const cityBreakdown: Array<{
      city: string;
      nights: number;
      roomCost: number;
      totalCost: number;
    }> = [];

    let totalHotelCost = 0;
    
    data.selectedCities.forEach(cityStay => {
      if (cityStay.city && cityStay.hotel) {
        const hotel = hotelData[cityStay.city]?.find(h => h.name === cityStay.hotel);
        if (hotel) {
          let roomCostPerNight = 0;
          
          // حساب تكلفة الغرف حسب النوع المختار
          data.roomTypes.forEach(roomType => {
            if (roomType === 'dbl_v') roomCostPerNight += hotel.dbl_v;
            if (roomType === 'dbl_wv') roomCostPerNight += hotel.dbl_wv;
            if (roomType === 'trbl_v') roomCostPerNight += hotel.trbl_v;
            if (roomType === 'trbl_wv') roomCostPerNight += hotel.trbl_wv;
            if (roomType === 'single') roomCostPerNight += hotel.dbl_v;
          });

          const cityTotal = roomCostPerNight * cityStay.nights;
          totalHotelCost += cityTotal;

          cityBreakdown.push({
            city: cityStay.city,
            nights: cityStay.nights,
            roomCost: roomCostPerNight,
            totalCost: cityTotal
          });
        }
      }
    });
    
    return { total: totalHotelCost, breakdown: cityBreakdown };
  };

  const calculateTourCosts = () => {
    const transport = transportData.find(t => t.type === data.carType);
    if (!transport) return { total: 0, breakdown: [] };

    const cityBreakdown: Array<{
      city: string;
      regularTours: number;
      mandatoryTours: number;
      totalTours: number;
      totalCost: number;
    }> = [];

    let totalTourCost = 0;

    data.selectedCities.forEach(cityStay => {
      const regularTours = cityStay.tours || 0;
      const mandatoryTours = cityStay.mandatoryTours || 0;
      const totalTours = regularTours + mandatoryTours;
      const cityTourCost = totalTours * transport.price;
      
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

    return { total: totalTourCost, breakdown: cityBreakdown };
  };

  const calculateTransportCosts = () => {
    const transport = transportData.find(t => t.type === data.carType);
    if (!transport) return 0;

    const isSameCity = data.arrivalAirport === data.departureAirport;
    const receptionCost = transport.reception[isSameCity ? 'sameCity' : 'differentCity'];
    const farewellCost = transport.farewell[isSameCity ? 'sameCity' : 'differentCity'];
    
    return receptionCost + farewellCost;
  };

  const calculateAdditionalServicesCosts = () => {
    let totalCost = 0;
    const duration = getDuration();

    if (data.additionalServices.travelInsurance.enabled) {
      totalCost += data.additionalServices.travelInsurance.persons * 
                   additionalServicesData.travelInsurance.pricePerPersonPerDay * 
                   duration;
    }

    if (data.additionalServices.phoneLines.enabled) {
      totalCost += data.additionalServices.phoneLines.quantity * 
                   additionalServicesData.phoneLines.pricePerLine;
    }

    if (data.additionalServices.roomDecoration.enabled) {
      totalCost += additionalServicesData.roomDecoration.price;
    }

    if (data.additionalServices.airportReception.enabled) {
      totalCost += data.additionalServices.airportReception.persons * 
                   additionalServicesData.airportReception.pricePerPerson;
    }

    return totalCost;
  };

  const getDuration = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const hotelCostData = calculateHotelCosts();
  const tourCostData = calculateTourCosts();
  const transportCosts = calculateTransportCosts();
  const additionalServicesCosts = calculateAdditionalServicesCosts();
  const subtotal = hotelCostData.total + tourCostData.total + transportCosts + additionalServicesCosts;
  
  const profitMargin = 0.22;
  const totalCost = subtotal * (1 + profitMargin);

  useEffect(() => {
    updateData({ totalCost });
  }, [totalCost]);

  const selectedCurrency = currencies.find(c => c.code === data.currency);
  const isOverBudget = totalCost > data.budget;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">حساب الأسعار والميزانية</h2>
        <p className="text-gray-600">مراجعة تكلفة رحلتك والمقارنة مع الميزانية</p>
      </div>

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
                {data.budget} {selectedCurrency?.symbol}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">التكلفة الإجمالية</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                {Math.round(totalCost)} {selectedCurrency?.symbol}
              </p>
            </div>
          </div>
          
          {isOverBudget ? (
            <div className="mt-4 p-4 bg-red-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">تجاوزت التكلفة الميزانية المحددة</span>
              </div>
              <p className="text-red-700 text-sm">
                الفرق: {Math.round(totalCost - data.budget)} {selectedCurrency?.symbol}
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">التكلفة تناسب ميزانيتك</span>
              </div>
              <p className="text-green-700 text-sm">
                المتبقي: {Math.round(data.budget - totalCost)} {selectedCurrency?.symbol}
              </p>
            </div>
          )}
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
            {hotelCostData.breakdown.map((city, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{city.city}</span>
                  <span className="text-sm text-gray-600 mr-2">
                    ({city.roomCost} × {city.nights} ليلة)
                  </span>
                </div>
                <span className="font-medium">
                  {Math.round(city.totalCost)} {selectedCurrency?.symbol}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2">
              <span>إجمالي الإقامة</span>
              <span>{Math.round(hotelCostData.total)} {selectedCurrency?.symbol}</span>
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
            {tourCostData.breakdown.map((city, index) => (
              <div key={index} className="py-3 border-b">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{city.city}</span>
                  <span className="font-medium">
                    {Math.round(city.totalCost)} {selectedCurrency?.symbol}
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
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2">
              <span>إجمالي الجولات</span>
              <span>{Math.round(tourCostData.total)} {selectedCurrency?.symbol}</span>
            </div>
          </div>
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
              <span className="font-medium">{Math.round(hotelCostData.total)} {selectedCurrency?.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة الجولات</span>
              <span className="font-medium">{Math.round(tourCostData.total)} {selectedCurrency?.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة النقل والاستقبال</span>
              <span className="font-medium">{Math.round(transportCosts)} {selectedCurrency?.symbol}</span>
            </div>
            {additionalServicesCosts > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>الخدمات الإضافية</span>
                <span className="font-medium">{Math.round(additionalServicesCosts)} {selectedCurrency?.symbol}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b font-medium">
              <span>المجموع الفرعي</span>
              <span>{Math.round(subtotal)} {selectedCurrency?.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-lg font-bold">
              <span>الإجمالي النهائي</span>
              <span>{Math.round(totalCost)} {selectedCurrency?.symbol}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">دفعك آمن معنا</span>
          </div>
          <p className="text-green-700 text-sm">
            لن يتم خصم أي مبالغ إلا بعد وصولك واستلام الغرفة. نحن نضمن لك أفضل تجربة وأعلى مستويات الأمان.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
