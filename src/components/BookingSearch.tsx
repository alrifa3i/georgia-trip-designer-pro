
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { formatCurrency } from '@/data/currencies';

export const BookingSearch = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const { getBookingByReference, isLoading } = useBookings();
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    if (!referenceNumber.trim()) {
      setSearchError('يرجى إدخال الرقم المرجعي');
      return;
    }

    try {
      setSearchError('');
      const booking = await getBookingByReference(referenceNumber);
      if (booking) {
        setSearchResult(booking);
      } else {
        setSearchError('لم يتم العثور على حجز بهذا الرقم المرجعي');
        setSearchResult(null);
      }
    } catch (error) {
      setSearchError('حدث خطأ أثناء البحث');
      setSearchResult(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ar });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث عن حجز موجود
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="أدخل الرقم المرجعي (مثال: GEO-2024-001)"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'جارٍ البحث...' : 'بحث'}
            </Button>
          </div>
          
          {searchError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {searchError}
            </div>
          )}
        </CardContent>
      </Card>

      {searchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">تم العثور على الحجز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">اسم العميل:</span>
                  <span>{searchResult.customer_name}</span>
                </div>
                
                {searchResult.phone_number && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">رقم الهاتف:</span>
                    <span>{searchResult.phone_number}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">تاريخ الوصول:</span>
                  <span>{formatDate(searchResult.arrival_date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">تاريخ المغادرة:</span>
                  <span>{formatDate(searchResult.departure_date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">عدد المسافرين:</span>
                  <span>{searchResult.adults} بالغ</span>
                  {searchResult.children && searchResult.children.length > 0 && (
                    <span>+ {searchResult.children.length} طفل</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">التكلفة الإجمالية:</span>
                  <span className="text-green-600 font-bold">
                    {formatCurrency(searchResult.total_cost || 0, searchResult.currency || 'USD')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">الحالة:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    searchResult.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    searchResult.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {searchResult.status === 'confirmed' ? 'مؤكد' :
                     searchResult.status === 'pending' ? 'قيد المراجعة' : 'غير محدد'}
                  </span>
                </div>

                {searchResult.selected_cities && searchResult.selected_cities.length > 0 && (
                  <div>
                    <span className="font-medium">المدن المختارة:</span>
                    <div className="mt-1 space-y-1">
                      {searchResult.selected_cities.map((city: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{city.city || 'غير محدد'} - {city.nights || 0} ليالي</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 text-sm">
                <strong>ملاحظة:</strong> الدفع سيتم بالدولار الأمريكي نقداً عند الوصول إلى جورجيا
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
