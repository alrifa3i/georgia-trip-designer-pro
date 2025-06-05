
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBookingManagement } from '@/hooks/useBookingManagement';
import { 
  Search, 
  Calendar, 
  Users, 
  Phone, 
  MapPin, 
  DollarSign,
  RefreshCw,
  CheckCircle,
  Clock,
  X,
  FileText,
  Download,
  Tag
} from 'lucide-react';

export const BookingSearch = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { searchBookingByReference } = useBookingManagement();

  const handleSearch = async () => {
    if (!referenceNumber.trim()) {
      setError('الرجاء إدخال رقم الحجز المرجعي');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const result = await searchBookingByReference(referenceNumber.trim());
      
      if (result) {
        setSearchResult(result);
      } else {
        setError('لم يتم العثور على حجز بهذا الرقم المرجعي');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث. الرجاء المحاولة مرة أخرى.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'في الانتظار';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDateArabic = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseJsonField = (field: any, defaultValue: any = []) => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث عن حجز
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="أدخل رقم الحجز المرجعي (مثال: GEO-2024-001)"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !referenceNumber.trim()}
              className="min-w-[120px]"
            >
              {isSearching ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {isSearching ? 'جاري البحث...' : 'بحث'}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <div className="space-y-6">
          {/* Booking Status */}
          <Card className="border-2 border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-emerald-800">
                    رقم الحجز: {searchResult.reference_number}
                  </h3>
                  <p className="text-emerald-700">
                    تم العثور على حجزك بنجاح
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(searchResult.status)}`}>
                  {getStatusIcon(searchResult.status)}
                  <span className="font-medium">{getStatusText(searchResult.status)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">الاسم:</span>
                  <p className="text-lg font-medium">{searchResult.customer_name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">رقم الهاتف:</span>
                  <p className="text-lg font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {searchResult.phone_number}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">عدد البالغين:</span>
                  <p className="text-lg font-medium">{searchResult.adults}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">عدد الأطفال:</span>
                  <p className="text-lg font-medium">{parseJsonField(searchResult.children, []).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                تفاصيل الرحلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">تاريخ الوصول:</span>
                  <p className="text-lg font-medium">{formatDateArabic(searchResult.arrival_date)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">تاريخ المغادرة:</span>
                  <p className="text-lg font-medium">{formatDateArabic(searchResult.departure_date)}</p>
                </div>
                {searchResult.arrival_airport && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">مطار الوصول:</span>
                    <p className="text-lg font-medium">{searchResult.arrival_airport}</p>
                  </div>
                )}
                {searchResult.departure_airport && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">مطار المغادرة:</span>
                    <p className="text-lg font-medium">{searchResult.departure_airport}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">عدد الغرف:</span>
                  <p className="text-lg font-medium">{searchResult.rooms}</p>
                </div>
                {searchResult.car_type && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">نوع السيارة:</span>
                    <p className="text-lg font-medium">{searchResult.car_type}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cities and Hotels */}
          {searchResult.selected_cities && parseJsonField(searchResult.selected_cities, []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  المدن المختارة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parseJsonField(searchResult.selected_cities, []).map((city: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{city.city || city}</span>
                        {city.nights && (
                          <Badge variant="outline">{city.nights} ليلة</Badge>
                        )}
                      </div>
                      {city.hotel && (
                        <p className="text-sm text-gray-600 mt-1">الفندق: {city.hotel}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Uploaded Files */}
          {searchResult.booking_files && searchResult.booking_files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  الملفات المرفقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Passport Files */}
                  {searchResult.booking_files.filter((file: any) => file.file_type === 'passport').length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">جوازات السفر:</h4>
                      <div className="grid gap-2">
                        {searchResult.booking_files
                          .filter((file: any) => file.file_type === 'passport')
                          .map((file: any) => (
                            <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{file.file_name}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadFile(file.file_url, file.file_name)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                تحميل
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Ticket Files */}
                  {searchResult.booking_files.filter((file: any) => file.file_type === 'ticket').length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">تذاكر الطيران:</h4>
                      <div className="grid gap-2">
                        {searchResult.booking_files
                          .filter((file: any) => file.file_type === 'ticket')
                          .map((file: any) => (
                            <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{file.file_name}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadFile(file.file_url, file.file_name)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                تحميل
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                ملخص التكلفة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {searchResult.budget && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">الميزانية المحددة:</span>
                      <div className="text-xl font-bold text-blue-600">
                        {searchResult.budget.toLocaleString()} {searchResult.currency}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">التكلفة الإجمالية:</span>
                    <div className="text-xl font-bold text-emerald-600">
                      {(searchResult.total_cost || 0).toLocaleString()} {searchResult.currency}
                    </div>
                  </div>
                </div>
                
                {/* إظهار كود الخصم إذا كان موجوداً */}
                {searchResult.discount_coupon && searchResult.discount_amount && searchResult.discount_amount > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 font-medium">كود الخصم المطبق: {searchResult.discount_coupon}</span>
                      </div>
                      <span className="text-green-600 font-bold">
                        -{searchResult.discount_amount.toFixed(2)} {searchResult.currency}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500 mt-4">
                  تاريخ الحجز: {formatDateArabic(searchResult.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
