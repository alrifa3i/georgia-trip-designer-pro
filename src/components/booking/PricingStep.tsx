
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, currencies } from '@/data/hotels';
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
          // Calculate based on room types selected
          let nightlyCost = 0;
          data.roomTypes.forEach(roomType => {
            if (roomType === 'dbl_v') nightlyCost += hotel.dbl_v;
            if (roomType === 'dbl_wv') nightlyCost += hotel.dbl_wv;
            if (roomType === 'trbl_v') nightlyCost += hotel.trbl_v;
            if (roomType === 'trbl_wv') nightlyCost += hotel.trbl_wv;
            if (roomType === 'single') nightlyCost += hotel.dbl_v * 0.7; // Single room discount
          });
          totalHotelCost += nightlyCost * cityStay.nights;
        }
      }
    });
    
    return totalHotelCost;
  };

  const calculateTransportCosts = () => {
    const transport = transportData.find(t => t.type === data.carType);
    const totalDays = data.selectedCities.reduce((total, city) => total + city.nights, 0) + 1; // +1 for arrival day
    return transport ? transport.price * totalDays : 0;
  };

  const calculateTourCosts = () => {
    const tourPricePerDay = 50; // Base tour price per day
    const totalTours = data.selectedCities.reduce((total, city) => total + city.tours, 0);
    return totalTours * tourPricePerDay;
  };

  const hotelCosts = calculateHotelCosts();
  const transportCosts = calculateTransportCosts();
  const tourCosts = calculateTourCosts();
  const subtotal = hotelCosts + transportCosts + tourCosts;
  
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
    'تغيير نوع السيارة لخيار أوفر'
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
              <span>تكلفة النقل</span>
              <span className="font-medium">{Math.round(transportCosts)} {selectedCurrency?.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>تكلفة الجولات</span>
              <span className="font-medium">{Math.round(tourCosts)} {selectedCurrency?.symbol}</span>
            </div>
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
              <p><strong>المدة:</strong> {data.selectedCities.reduce((total, city) => total + city.nights, 0)} ليلة</p>
              <p><strong>عدد الغرف:</strong> {data.rooms}</p>
            </div>
            <div>
              <p><strong>نوع السيارة:</strong> {data.carType}</p>
              <p><strong>المطار:</strong> {data.airport}</p>
              <p><strong>إجمالي الجولات:</strong> {data.selectedCities.reduce((total, city) => total + city.tours, 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
