
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Loader2, User, Calendar, MapPin, DollarSign, Phone } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { BookingData } from '@/types/booking';

export const BookingSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundBooking, setFoundBooking] = useState<BookingData | null>(null);
  const { searchBooking, loading } = useBookings();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    const result = await searchBooking(searchTerm);
    if (result.success && result.data) {
      setFoundBooking(result.data);
    } else {
      setFoundBooking(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          البحث عن حجز
        </h1>
        <p className="text-gray-600">
          أدخل الرقم المرجعي للحجز للعثور على تفاصيل رحلتك
        </p>
      </div>

      {/* مربع البحث */}
      <Card className="p-6 mb-8">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="أدخل الرقم المرجعي للحجز (مثال: GEO123456ABCD)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className="flex-1 text-center font-mono text-lg"
          />
          <Button 
            onClick={handleSearch}
            disabled={loading || !searchTerm.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                بحث
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* نتائج البحث */}
      {foundBooking && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">
              تم العثور على الحجز! ✅
            </h2>
            <p className="text-lg font-semibold text-gray-700">
              رقم الحجز: {foundBooking.referenceNumber}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* معلومات المسافر */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-600 border-b pb-2">
                <User className="w-5 h-5 inline ml-2" />
                معلومات المسافر
              </h3>
              <div className="space-y-2">
                <p><strong>الاسم:</strong> {foundBooking.customerName}</p>
                {foundBooking.phoneNumber && (
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 ml-2" />
                    {foundBooking.phoneNumber}
                  </p>
                )}
                <p><strong>البالغين:</strong> {foundBooking.adults}</p>
                <p><strong>الأطفال:</strong> {foundBooking.children.length}</p>
                <p><strong>الغرف:</strong> {foundBooking.rooms}</p>
              </div>
            </div>

            {/* تفاصيل السفر */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-600 border-b pb-2">
                <Calendar className="w-5 h-5 inline ml-2" />
                تفاصيل السفر
              </h3>
              <div className="space-y-2">
                <p><strong>تاريخ الوصول:</strong> {foundBooking.arrivalDate}</p>
                <p><strong>تاريخ المغادرة:</strong> {foundBooking.departureDate}</p>
                <p><strong>مطار الوصول:</strong> {foundBooking.arrivalAirport}</p>
                <p><strong>مطار المغادرة:</strong> {foundBooking.departureAirport}</p>
              </div>
            </div>

            {/* المدن والمواصلات */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-600 border-b pb-2">
                <MapPin className="w-5 h-5 inline ml-2" />
                المدن والمواصلات
              </h3>
              <div className="space-y-2">
                <p><strong>المدن المختارة:</strong></p>
                <ul className="list-disc list-inside mr-4">
                  {foundBooking.selectedCities.length > 0 ? (
                    foundBooking.selectedCities.map((city, index) => (
                      <li key={index}>{city}</li>
                    ))
                  ) : (
                    <li>لم يتم اختيار مدن</li>
                  )}
                </ul>
                <p><strong>نوع السيارة:</strong> {foundBooking.carType || 'لم يتم الاختيار'}</p>
              </div>
            </div>

            {/* التكلفة */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-600 border-b pb-2">
                <DollarSign className="w-5 h-5 inline ml-2" />
                التكلفة
              </h3>
              <div className="space-y-2">
                <p><strong>الميزانية:</strong> {foundBooking.budget} {foundBooking.currency}</p>
                <p><strong>التكلفة الإجمالية:</strong> {foundBooking.totalCost} {foundBooking.currency}</p>
                {foundBooking.discountAmount && foundBooking.discountAmount > 0 && (
                  <p><strong>الخصم:</strong> {foundBooking.discountAmount} {foundBooking.currency}</p>
                )}
                <p><strong>الحالة:</strong> 
                  <span className={`mr-2 px-2 py-1 rounded text-sm ${
                    foundBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    foundBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {foundBooking.status === 'confirmed' ? 'مؤكد' :
                     foundBooking.status === 'pending' ? 'قيد المراجعة' : foundBooking.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* الخدمات الإضافية */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-emerald-600 border-b pb-2">
              الخدمات الإضافية
            </h3>
            <div className="grid gap-2">
              {foundBooking.additionalServices.travelInsurance.enabled && (
                <p>• التأمين الصحي: {foundBooking.additionalServices.travelInsurance.persons} أشخاص</p>
              )}
              {foundBooking.additionalServices.phoneLines.enabled && (
                <p>• خطوط الاتصال: {foundBooking.additionalServices.phoneLines.quantity} خط</p>
              )}
              {foundBooking.additionalServices.roomDecoration.enabled && (
                <p>• تزيين الغرف</p>
              )}
              {foundBooking.additionalServices.airportReception.enabled && (
                <p>• استقبال المطار VIP: {foundBooking.additionalServices.airportReception.persons} أشخاص</p>
              )}
              {foundBooking.additionalServices.photoSession.enabled && (
                <p>• جلسة تصوير</p>
              )}
              {foundBooking.additionalServices.flowerReception.enabled && (
                <p>• استقبال بالزهور</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
