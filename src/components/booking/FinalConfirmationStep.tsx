
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { WhatsAppVerification } from './WhatsAppVerification';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  Car, 
  DollarSign,
  Phone,
  MessageCircle
} from 'lucide-react';

interface FinalConfirmationStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const FinalConfirmationStep = ({ data, updateData }: FinalConfirmationStepProps) => {
  const [showWhatsAppVerification, setShowWhatsAppVerification] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);

  const handleSubmitBooking = () => {
    if (data.phoneNumber) {
      setShowWhatsAppVerification(true);
    } else {
      alert('الرجاء إدخال رقم الهاتف أولاً');
    }
  };

  const handleVerificationSuccess = () => {
    setShowWhatsAppVerification(false);
    setIsVerificationComplete(true);
    
    // Here you would submit the booking to the database
    console.log('Booking verified and submitted:', data);
    
    alert('تم تأكيد الحجز بنجاح! سيتم التواصل معك قريباً.');
  };

  if (showWhatsAppVerification) {
    return (
      <WhatsAppVerification
        phoneNumber={data.phoneNumber || ''}
        onVerificationSuccess={handleVerificationSuccess}
        onCancel={() => setShowWhatsAppVerification(false)}
      />
    );
  }

  if (isVerificationComplete) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">تم تأكيد الحجز بنجاح!</h2>
        <p className="text-gray-600">
          تم إرسال تفاصيل الحجز إلى رقم الواتساب الخاص بك.
          <br />
          سيتم التواصل معك من قبل فريق خدمة العملاء خلال 24 ساعة.
        </p>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800 font-medium">
            رقم الحجز: GEO{Date.now().toString().slice(-8)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">التأكيد النهائي للحجز</h2>
        <p className="text-gray-600">مراجعة نهائية لتفاصيل رحلتك قبل التأكيد</p>
      </div>

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
              <span className="text-gray-600">الاسم: </span>
              <span className="font-medium">{data.customerName}</span>
            </div>
            <div>
              <span className="text-gray-600">رقم الهاتف: </span>
              <span className="font-medium">{data.phoneNumber || 'غير محدد'}</span>
            </div>
            <div>
              <span className="text-gray-600">عدد البالغين: </span>
              <span className="font-medium">{data.adults}</span>
            </div>
            <div>
              <span className="text-gray-600">عدد الأطفال: </span>
              <span className="font-medium">{data.children.length}</span>
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
              <span className="text-gray-600">تاريخ الوصول: </span>
              <span className="font-medium">{data.arrivalDate}</span>
            </div>
            <div>
              <span className="text-gray-600">تاريخ المغادرة: </span>
              <span className="font-medium">{data.departureDate}</span>
            </div>
            <div>
              <span className="text-gray-600">مطار الوصول: </span>
              <span className="font-medium">{data.arrivalAirport}</span>
            </div>
            <div>
              <span className="text-gray-600">مطار المغادرة: </span>
              <span className="font-medium">{data.departureAirport}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cities and Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            المدن والفنادق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.selectedCities.map((city, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{city.city}</span>
                  <span className="text-sm text-gray-600">{city.nights} ليلة</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>الفندق: {city.hotel || 'غير محدد'}</div>
                  <div>الجولات: {city.tours + (city.mandatoryTours || 0)} جولة</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            وسائل النقل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <span className="text-gray-600">نوع السيارة: </span>
            <span className="font-medium">{data.carType || 'غير محدد'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            ملخص التكلفة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${Math.round(data.totalCost || 0)} USD
            </div>
            <p className="text-gray-600">التكلفة الإجمالية للرحلة</p>
            <p className="text-sm text-gray-500 mt-2">
              * الدفع نقداً بالدولار الأمريكي عند الوصول إلى جورجيا
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Button */}
      <div className="text-center">
        <Button
          onClick={handleSubmitBooking}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          disabled={!data.phoneNumber}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          تأكيد الحجز عبر الواتساب
        </Button>
        
        {!data.phoneNumber && (
          <p className="text-red-600 text-sm mt-2">
            الرجاء إدخال رقم الهاتف في المرحلة الأولى لتأكيد الحجز
          </p>
        )}
      </div>
    </div>
  );
};
