
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, Phone } from 'lucide-react';
import { BookingData } from '@/types/booking';
import { useBookings } from '@/hooks/useBookings';
import { WhatsAppVerification } from './WhatsAppVerification';

interface FinalConfirmationStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const FinalConfirmationStep = ({ data, updateData }: FinalConfirmationStepProps) => {
  const { saveBooking, loading } = useBookings();
  const [isVerified, setIsVerified] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ success: boolean; referenceNumber?: string; error?: string } | null>(null);

  const handleConfirmBooking = async () => {
    if (!isVerified) {
      alert('يرجى إكمال التحقق من رقم الهاتف أولاً');
      return;
    }

    try {
      const result = await saveBooking(data);
      if (result.success && result.data?.reference_number) {
        setBookingResult({ 
          success: true, 
          referenceNumber: result.data.reference_number 
        });
      } else {
        setBookingResult({ 
          success: false, 
          error: result.error || 'فشل في حفظ الحجز' 
        });
      }
    } catch (error) {
      setBookingResult({ 
        success: false, 
        error: 'حدث خطأ أثناء حفظ الحجز' 
      });
    }
  };

  // التأكد من وجود رقم الهاتف
  const phoneNumber = data.phoneNumber || '+966501234567'; // رقم افتراضي للاختبار

  if (bookingResult?.success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">تم تأكيد الحجز بنجاح!</h2>
          <p className="text-gray-600 mb-4">رقم المرجع الخاص بك هو:</p>
          <div className="inline-block bg-green-100 text-green-800 text-xl font-bold py-3 px-6 rounded-lg border-2 border-green-300">
            {bookingResult.referenceNumber}
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Phone className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            سيتم التواصل معك عبر الواتساب خلال 24 ساعة لتأكيد تفاصيل الرحلة والدفع.
            احتفظ برقم المرجع للمراجعة المستقبلية.
          </AlertDescription>
        </Alert>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">الخطوات التالية:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✅ تم حفظ بياناتك بنجاح</li>
            <li>📱 سيتم التواصل معك عبر الواتساب</li>
            <li>💰 الدفع نقداً عند الوصول إلى جورجيا</li>
            <li>✈️ سنرسل لك جدول الرحلة المفصل</li>
          </ul>
        </div>
      </div>
    );
  }

  if (bookingResult?.error) {
    return (
      <div className="text-center space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            حدث خطأ: {bookingResult.error}
          </AlertDescription>
        </Alert>
        <Button onClick={() => setBookingResult(null)}>
          المحاولة مرة أخرى
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">التأكيد النهائي</h2>
        <p className="text-gray-600">تحقق من رقم الهاتف وأكد الحجز</p>
      </div>

      {/* عرض ملخص الحجز */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الحجز</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>الاسم:</strong> {data.customerName}
            </div>
            <div>
              <strong>رقم الهاتف:</strong> {phoneNumber}
            </div>
            <div>
              <strong>عدد الأشخاص:</strong> {data.adults} بالغ
              {data.children.length > 0 && ` + ${data.children.length} طفل`}
            </div>
            <div>
              <strong>المدة:</strong> من {data.arrivalDate} إلى {data.departureDate}
            </div>
            <div>
              <strong>المدن:</strong> {data.selectedCities.map(c => c.city).join('، ')}
            </div>
            <div>
              <strong>الميزانية:</strong> {data.budget} {data.currency}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التحقق من الواتساب */}
      <WhatsAppVerification
        phoneNumber={phoneNumber}
        bookingData={data}
        onVerificationComplete={setIsVerified}
      />

      {/* زر التأكيد النهائي */}
      <div className="text-center">
        <Button
          onClick={handleConfirmBooking}
          disabled={loading || !isVerified}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              جاري حفظ الحجز...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              تأكيد الحجز النهائي
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>بالضغط على "تأكيد الحجز النهائي" فإنك توافق على شروط وأحكام الخدمة</p>
      </div>
    </div>
  );
};
