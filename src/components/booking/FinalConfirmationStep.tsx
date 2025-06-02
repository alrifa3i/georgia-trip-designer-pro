
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '@/types/booking';
import { CheckCircle, MapPin, Building, Car, Calendar, Users, Phone, Mail, User, CreditCard } from 'lucide-react';

interface FinalConfirmationStepProps {
  data: BookingData;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const FinalConfirmationStep = ({ data, onConfirm, isSubmitting }: FinalConfirmationStepProps) => {
  // تنسيق رقم الهاتف مع كود الدولة
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // إزالة أي مسافات أو رموز إضافية
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    // إذا كان الرقم يبدأ بـ + فهو يحتوي على كود الدولة
    if (cleanPhone.startsWith('+')) {
      return cleanPhone;
    }
    
    // إذا كان الرقم يبدأ بـ 00 نستبدلها بـ +
    if (cleanPhone.startsWith('00')) {
      return '+' + cleanPhone.substring(2);
    }
    
    // إذا كان الرقم لا يحتوي على كود دولة، نضيف كود السعودية افتراضياً
    if (cleanPhone.length === 9 && cleanPhone.startsWith('5')) {
      return '+966' + cleanPhone;
    }
    
    // في الحالات الأخرى نعرض الرقم كما هو
    return cleanPhone;
  };

  const formattedPhone = formatPhoneNumber(data.phoneNumber || '');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تأكيد الحجز النهائي</h2>
        <p className="text-gray-600">مراجعة تفاصيل حجزك قبل التأكيد النهائي</p>
      </div>

      {/* معلومات المسافر */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <User className="w-5 h-5" />
            معلومات المسافر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">الاسم:</span>
            <span>{data.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">رقم الهاتف:</span>
            <span className="font-mono text-lg">{formattedPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">عدد المسافرين:</span>
            <span>{data.adults} بالغ</span>
            {data.children && data.children.length > 0 && (
              <span>, {data.children.length} طفل</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل الرحلة */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calendar className="w-5 h-5" />
            تفاصيل الرحلة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-semibold">تاريخ الوصول:</span>
              <span>{data.arrivalDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-semibold">تاريخ المغادرة:</span>
              <span>{data.departureDate}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-semibold">مطار الوصول:</span>
              <span>{data.arrivalAirport}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-semibold">مطار المغادرة:</span>
              <span>{data.departureAirport}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">نوع السيارة:</span>
            <span>{data.carType}</span>
          </div>
        </CardContent>
      </Card>

      {/* المدن والفنادق */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Building className="w-5 h-5" />
            المدن والفنادق المختارة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.selectedCities?.map((city, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{city.city}</h4>
                <Badge variant="secondary">{city.nights} ليلة</Badge>
              </div>
              <div className="text-gray-600 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                {city.hotel}
              </div>
              <div className="text-sm text-gray-500">
                الجولات: {city.tours} اختيارية + {city.mandatoryTours} إجبارية
              </div>
              {city.roomSelections && city.roomSelections.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium">الغرف:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {city.roomSelections.map((room, roomIndex) => (
                      <Badge key={roomIndex} variant="outline" className="text-xs">
                        غرفة {room.roomNumber}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* التكلفة الإجمالية */}
      {data.totalCost && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <CreditCard className="w-5 h-5" />
              التكلفة الإجمالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-800">
                {data.totalCost} {data.currency || 'USD'}
              </div>
              {data.discountAmount && data.discountAmount > 0 && (
                <div className="text-sm text-green-600 mt-1">
                  خصم: {data.discountAmount} {data.currency || 'USD'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* رقم المرجع */}
      {data.referenceNumber && (
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">رقم المرجع:</span>
              <div className="text-xl font-mono font-bold text-gray-800 mt-1">
                {data.referenceNumber}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* زر التأكيد النهائي */}
      <div className="text-center">
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              جاري تأكيد الحجز...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              تأكيد الحجز النهائي
            </>
          )}
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          بالضغط على "تأكيد الحجز النهائي" فإنك توافق على شروط وأحكام الخدمة
        </p>
      </div>
    </div>
  );
};
