
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, currencies, additionalServicesData } from '@/data/hotels';
import { DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface PricingStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const PricingStep = ({ data, updateData }: PricingStepProps) => {
  const calculateHotelCosts = () => {
    let totalHotelCost = 0;
    
    data.selectedCities.forEach(cityStay => {
      if (cityStay.city && cityStay.hotel) {
        const hotel = hotelData[cityStay.city]?.find(h => h.name === cityStay.hotel);
        if (hotel) {
          let nightlyCost = 0;
          data.roomTypes.forEach(roomType => {
            if (roomType === 'dbl_v') nightlyCost += hotel.dbl_v;
            if (roomType === 'dbl_wv') nightlyCost += hotel.dbl_wv;
            if (roomType === 'trbl_v') nightlyCost += hotel.trbl_v;
            if (roomType === 'trbl_wv') nightlyCost += hotel.trbl_wv;
            if (roomType === 'single') nightlyCost += hotel.dbl_v; // Single room same as double
          });
          totalHotelCost += nightlyCost * cityStay.nights;
        }
      }
    });
    
    return totalHotelCost;
  };

  const calculateTransportCosts = () => {
    const transport = transportData.find(t => t.type === data.carType);
    if (!transport) return 0;

    let totalTransportCost = 0;

    // Reception and farewell costs (internal pricing - not shown to customer)
    const isSameCity = data.arrivalAirport === data.departureAirport;
    const receptionCost = transport.reception[isSameCity ? 'sameCity' : 'differentCity'];
    const farewellCost = transport.farewell[isSameCity ? 'sameCity' : 'differentCity'];
    
    totalTransportCost += receptionCost + farewellCost;

    return totalTransportCost;
  };

  const calculateTourCosts = () => {
    const transport = transportData.find(t => t.type === data.carType);
    if (!transport) return 0;

    // Tour pricing based on vehicle type (internal pricing - not shown to customer)
    const totalTours = data.selectedCities.reduce((total, city) => total + city.tours, 0);
    return totalTours * transport.price;
  };

  const calculateAdditionalServicesCosts = () => {
    let totalCost = 0;
    const duration = getDuration();

    // Travel Insurance (5$ per person per day)
    if (data.additionalServices.travelInsurance.enabled) {
      totalCost += data.additionalServices.travelInsurance.persons * 
                   additionalServicesData.travelInsurance.pricePerPersonPerDay * 
                   duration;
    }

    // Phone Lines (15$ per line for 7 days)
    if (data.additionalServices.phoneLines.enabled) {
      totalCost += data.additionalServices.phoneLines.quantity * 
                   additionalServicesData.phoneLines.pricePerLine;
    }

    // Room Decoration (100$ - internal price)
    if (data.additionalServices.roomDecoration.enabled) {
      totalCost += additionalServicesData.roomDecoration.price;
    }

    // Airport Reception (240$ per person - internal price)
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

  const hotelCosts = calculateHotelCosts();
  const transportCosts = calculateTransportCosts();
  const tourCosts = calculateTourCosts();
  const additionalServicesCosts = calculateAdditionalServicesCosts();
  const subtotal = hotelCosts + transportCosts + tourCosts + additionalServicesCosts;
  
  // Add 22% profit margin
  const profitMargin = 0.22;
  const totalCost = subtotal * (1 + profitMargin);

  useEffect(() => {
    updateData({ totalCost });
  }, [totalCost]);

  const selectedCurrency = currencies.find(c => c.code === data.currency);
  const isOverBudget = totalCost > data.budget;

  const suggestions = [
    'تقليل عدد الليالي في بعض المدن',
    'اختيار فنادق بفئة أقل',
    'تقليل عدد الجولات السياحية',
    'تغيير نوع السيارة لخيار أوفر',
    'إلغاء بعض الخدمات الإضافية'
  ];

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

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل التكلفة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة الفنادق</span>
              <span className="font-medium">{Math.round(hotelCosts)} {selectedCurrency?.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة النقل والاستقبال</span>
              <span className="font-medium">{Math.round(transportCosts)} {selectedCurrency?.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة الجولات</span>
              <span className="font-medium">{Math.round(tourCosts)} {selectedCurrency?.symbol}</span>
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

      {/* Suggestions if over budget */}
      {isOverBudget && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <p className="font-medium mb-2">اقتراحات لتقليل التكلفة:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Trip Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الرحلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>المسافرون:</strong> {data.adults} بالغ، {data.children.length} طفل</p>
              <p><strong>المدة:</strong> {getDuration()} أيام، {data.selectedCities.reduce((total, city) => total + city.nights, 0)} ليلة</p>
              <p><strong>عدد الغرف:</strong> {data.rooms}</p>
            </div>
            <div>
              <p><strong>نوع السيارة:</strong> {data.carType}</p>
              <p><strong>مطار الوصول:</strong> {data.arrivalAirport}</p>
              <p><strong>مطار المغادرة:</strong> {data.departureAirport}</p>
              <p><strong>إجمالي الجولات:</strong> {data.selectedCities.reduce((total, city) => total + city.tours, 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
