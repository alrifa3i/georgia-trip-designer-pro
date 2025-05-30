
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { hotelData, transportData, currencies } from '@/data/hotels';
import { Calculator, Users, Hotel, Car, MapPin, Calendar, Percent, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const PricingDetailsStep = ({ data, updateData }: PricingDetailsStepProps) => {
  const [calculations, setCalculations] = useState({
    accommodationTotal: 0,
    toursTotal: 0,
    transportTotal: 0,
    additionalServicesTotal: 0,
    subtotal: 0,
    discountAmount: 0,
    finalTotal: 0
  });
  const [couponCode, setCouponCode] = useState('');

  const selectedCurrency = currencies.find(c => c.code === data.currency);

  const discountCoupons = {
    'lwiat10%': { type: 'percentage', value: 10, description: 'خصم 10%' },
    'lwiat15%com': { type: 'percentage', value: 15, description: 'خصم 15%' },
    'alfakhama': { type: 'service', value: 'airportReception', description: 'استقبال مجاناً' }
  };

  const calculatePricing = () => {
    let accommodationTotal = 0;
    let toursTotal = 0;

    // حساب تكلفة الإقامة
    data.selectedCities.forEach(city => {
      if (city.hotel && city.roomSelections) {
        const hotel = hotelData[city.city]?.find(h => h.name === city.hotel);
        if (hotel) {
          city.roomSelections.forEach(room => {
            const roomPrice = hotel[room.roomType as keyof typeof hotel] as number || 0;
            accommodationTotal += roomPrice * city.nights;
          });
        }
      }
    });

    // إضافة هامش الربح على الإقامة (22%)
    accommodationTotal = accommodationTotal * 1.22;

    // حساب تكلفة الجولات
    const transport = transportData.find(t => t.type === data.carType);
    if (transport) {
      data.selectedCities.forEach(city => {
        const totalTours = city.tours + (city.mandatoryTours || 0);
        toursTotal += totalTours * transport.price;
      });

      // إضافة تكلفة النقل (الاستقبال والتوديع)
      toursTotal += transport.reception.sameCity + transport.farewell.sameCity;
    }

    // إضافة هامش الربح على الجولات (22%)
    toursTotal = toursTotal * 1.22;

    // حساب الخدمات الإضافية
    let additionalServicesTotal = 0;
    const tripDays = calculateTripDays();

    if (data.additionalServices.travelInsurance.enabled) {
      additionalServicesTotal += 5 * tripDays * data.additionalServices.travelInsurance.persons;
    }

    if (data.additionalServices.phoneLines.enabled) {
      additionalServicesTotal += 15 * data.additionalServices.phoneLines.quantity;
    }

    if (data.additionalServices.roomDecoration.enabled) {
      additionalServicesTotal += 100;
    }

    if (data.additionalServices.flowerReception?.enabled) {
      additionalServicesTotal += 50;
    }

    let airportReceptionCost = 0;
    if (data.additionalServices.airportReception.enabled) {
      airportReceptionCost = 280 * data.additionalServices.airportReception.persons;
      // Check if alfakhama coupon is applied
      if (data.discountCoupon !== 'alfakhama') {
        additionalServicesTotal += airportReceptionCost;
      }
    }

    if (data.additionalServices.photoSession?.enabled) {
      additionalServicesTotal += 150;
    }

    const subtotal = accommodationTotal + toursTotal + additionalServicesTotal;
    
    // حساب الخصم
    let discountAmount = 0;
    if (data.discountCoupon && discountCoupons[data.discountCoupon as keyof typeof discountCoupons]) {
      const coupon = discountCoupons[data.discountCoupon as keyof typeof discountCoupons];
      if (coupon.type === 'percentage') {
        discountAmount = subtotal * (coupon.value / 100);
      }
    }

    const finalTotal = subtotal - discountAmount;

    setCalculations({
      accommodationTotal,
      toursTotal,
      transportTotal: 0,
      additionalServicesTotal,
      subtotal,
      discountAmount,
      finalTotal
    });

    updateData({ totalCost: finalTotal });
  };

  const applyCoupon = () => {
    if (discountCoupons[couponCode as keyof typeof discountCoupons]) {
      updateData({ discountCoupon: couponCode });
      toast({
        title: "تم تطبيق الكوبون",
        description: discountCoupons[couponCode as keyof typeof discountCoupons].description
      });
    } else {
      toast({
        title: "كود خطأ",
        description: "كود الخصم غير صحيح",
        variant: "destructive"
      });
    }
  };

  const removeCoupon = () => {
    updateData({ discountCoupon: '', discountAmount: 0 });
    setCouponCode('');
    toast({
      title: "تم إلغاء الكوبون",
      description: "تم إزالة كود الخصم"
    });
  };

  const calculateTripDays = () => {
    if (!data.arrivalDate || !data.departureDate) return 0;
    const arrival = new Date(data.arrivalDate);
    const departure = new Date(data.departureDate);
    return Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getTotalNights = () => {
    return data.selectedCities.reduce((total, city) => total + city.nights, 0);
  };

  const getTotalPeople = () => {
    return data.adults + data.children.filter(child => child.age > 6).length;
  };

  useEffect(() => {
    calculatePricing();
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل الأسعار والملخص النهائي</h2>
        <p className="text-gray-600">مراجعة شاملة لتكلفة رحلتك</p>
      </div>

      {/* Trip Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calculator className="w-5 h-5" />
            ملخص الرحلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الأيام:</strong> {calculateTripDays()} أيام</span>
              </div>
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الليالي:</strong> {getTotalNights()} ليلة</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الأشخاص:</strong> {getTotalPeople()} شخص</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-blue-600" />
                <span><strong>عدد الغرف:</strong> {data.rooms} غرفة</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span><strong>نوع السيارة:</strong> {data.carType}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span><strong>عدد المدن:</strong> {data.selectedCities.length} مدينة</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Types Summary with Nights */}
      {data.selectedCities.some(city => city.roomSelections && city.roomSelections.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل أنواع الغرف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.selectedCities.map((city, cityIndex) => (
                city.roomSelections && city.roomSelections.length > 0 && (
                  <div key={cityIndex} className="border-l-4 border-emerald-500 pl-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      {city.city} - {city.hotel} ({city.nights} ليالي)
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      {city.roomSelections.map((room, roomIndex) => (
                        <div key={roomIndex} className="flex justify-between">
                          <span>الغرفة {room.roomNumber}:</span>
                          <span className="text-gray-600">
                            {room.roomType === 'single' && 'غرفة مفردة (بدون إطلالة)'}
                            {room.roomType === 'single_v' && 'غرفة مفردة (مع إطلالة)'}
                            {room.roomType === 'dbl_wv' && 'غرفة مزدوجة (بدون إطلالة)'}
                            {room.roomType === 'dbl_v' && 'غرفة مزدوجة (مع إطلالة)'}
                            {room.roomType === 'trbl_wv' && 'غرفة ثلاثية (بدون إطلالة)'}
                            {room.roomType === 'trbl_v' && 'غرفة ثلاثية (مع إطلالة)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discount Coupon Section */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Tag className="w-5 h-5" />
            كوبون الخصم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!data.discountCoupon ? (
            <div className="flex gap-2">
              <Input
                placeholder="أدخل كود الخصم"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={applyCoupon} variant="outline">
                <Percent className="w-4 h-4 ml-2" />
                تطبيق
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-green-800 font-medium">
                  {discountCoupons[data.discountCoupon as keyof typeof discountCoupons]?.description}
                </span>
              </div>
              <Button onClick={removeCoupon} variant="outline" size="sm">
                إلغاء
              </Button>
            </div>
          )}
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-700 font-medium mb-2">الكوبونات المتاحة:</p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• lwiat10% - خصم 10%</li>
              <li>• lwiat15%com - خصم 15%</li>
              <li>• alfakhama - استقبال مجاناً</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Calculator className="w-5 h-5" />
            تفصيل التكاليف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>إجمالي تكلفة الإقامة</span>
              <span className="font-medium">{Math.round(calculations.accommodationTotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>إجمالي الجولات السياحية</span>
              <span className="font-medium">{Math.round(calculations.toursTotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            {calculations.additionalServicesTotal > 0 && (
              <div className="flex justify-between items-center">
                <span>إجمالي الخدمات الإضافية</span>
                <span className="font-medium">{Math.round(calculations.additionalServicesTotal)} {selectedCurrency?.symbol}</span>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>المجموع الفرعي</span>
              <span>{Math.round(calculations.subtotal)} {selectedCurrency?.symbol}</span>
            </div>
            
            {calculations.discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>قيمة الخصم</span>
                <span>-{Math.round(calculations.discountAmount)} {selectedCurrency?.symbol}</span>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center text-2xl font-bold text-emerald-600 bg-emerald-50 p-4 rounded-lg">
              <span>المبلغ الكلي النهائي</span>
              <span>{Math.round(calculations.finalTotal)} {selectedCurrency?.symbol}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">سياسة الخصوصية والشروط</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <ul className="space-y-2">
            <li>• الإلغاء مجاناً قبل 72 ساعة من موعد السفر</li>
            <li>• لا يمكن اختيار خدمة دون أخرى في الباقة الواحدة</li>
            <li>• يجب أن تكون المدخلات صحيحة للمعلومات المقدمة</li>
            <li>• في حال كان الفندق غير متوفر تحتفظ الشركة المنفذة بحق تغيير الفندق مع إشعاركم قبل الوصول</li>
            <li>• جميع الأسعار شاملة للضرائب والرسوم</li>
            <li>• الدفع فقط عند الوصول واستلام الغرفة</li>
            <li>• خصوصية معلوماتك مضمونة ولن يتم مشاركتها مع أطراف ثالثة</li>
          </ul>
        </CardContent>
      </Card>

      {/* Payment Notice */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-bold text-green-800 text-lg">تذكير مهم</h3>
            <p className="text-green-700">الدفع يتم فقط عند الوصول واستلام الغرفة</p>
            <p className="text-green-600 text-sm">لا يوجد أي مدفوعات مسبقة أو عبر الموقع</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
