
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2, Copy, Check } from 'lucide-react';
import { BookingData } from '@/types/booking';
import { useBookings } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';

interface FinalConfirmationStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const FinalConfirmationStep = ({ data, updateData }: FinalConfirmationStepProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { saveBooking, loading } = useBookings();
  const { toast } = useToast();

  const handleConfirmBooking = async () => {
    try {
      const result = await saveBooking(data);
      if (result.success) {
        setIsConfirmed(true);
        setReferenceNumber(result.referenceNumber || '');
        updateData({ referenceNumber: result.referenceNumber });
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const copyReferenceNumber = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      toast({
        title: "تم النسخ! 📋",
        description: "تم نسخ الرقم المرجعي بنجاح",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (isConfirmed) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600">
            🎉 تم تأكيد حجزك بنجاح!
          </h2>
          
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">
                رقم الحجز المرجعي
              </h3>
              
              <div className="flex items-center justify-center gap-3 bg-white p-4 rounded-lg border-2 border-green-300">
                <span className="text-2xl font-bold text-green-700 tracking-wide">
                  {referenceNumber}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyReferenceNumber}
                  className="text-green-600 hover:text-green-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <p className="text-sm text-green-700">
                احتفظ بهذا الرقم لمراجعة حجزك لاحقاً
              </p>
            </div>
          </Card>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">الخطوات التالية:</h4>
            <ul className="text-sm text-blue-700 space-y-1 text-right">
              <li>• سيتم التواصل معك خلال 24 ساعة لتأكيد التفاصيل</li>
              <li>• ستتلقى برنامجاً مفصلاً للرحلة</li>
              <li>• سيتم إرسال تفاصيل الدفع والتأكيد النهائي</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          مراجعة نهائية وتأكيد الحجز
        </h2>
        <p className="text-gray-600">
          يرجى مراجعة جميع التفاصيل قبل تأكيد الحجز
        </p>
      </div>

      {/* ملخص الحجز */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-emerald-600">معلومات المسافر</h3>
          <div className="space-y-2 text-sm">
            <p><strong>الاسم:</strong> {data.customerName}</p>
            <p><strong>البالغين:</strong> {data.adults}</p>
            <p><strong>الأطفال:</strong> {data.children.length}</p>
            <p><strong>الغرف:</strong> {data.rooms}</p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-emerald-600">تفاصيل السفر</h3>
          <div className="space-y-2 text-sm">
            <p><strong>تاريخ الوصول:</strong> {data.arrivalDate}</p>
            <p><strong>تاريخ المغادرة:</strong> {data.departureDate}</p>
            <p><strong>مطار الوصول:</strong> {data.arrivalAirport}</p>
            <p><strong>مطار المغادرة:</strong> {data.departureAirport}</p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-emerald-600">المدن والسيارة</h3>
          <div className="space-y-2 text-sm">
            <p><strong>المدن:</strong> {data.selectedCities.join(', ') || 'لم يتم الاختيار'}</p>
            <p><strong>نوع السيارة:</strong> {data.carType || 'لم يتم الاختيار'}</p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-emerald-600">التكلفة</h3>
          <div className="space-y-2 text-sm">
            <p><strong>الميزانية:</strong> {data.budget} {data.currency}</p>
            <p><strong>التكلفة الإجمالية:</strong> {data.totalCost} {data.currency}</p>
          </div>
        </Card>
      </div>

      {/* الخدمات الإضافية */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-emerald-600">الخدمات الإضافية</h3>
        <div className="grid gap-2 text-sm">
          {data.additionalServices.travelInsurance.enabled && (
            <p>• التأمين الصحي: {data.additionalServices.travelInsurance.persons} أشخاص</p>
          )}
          {data.additionalServices.phoneLines.enabled && (
            <p>• خطوط الاتصال: {data.additionalServices.phoneLines.quantity} خط</p>
          )}
          {data.additionalServices.roomDecoration.enabled && (
            <p>• تزيين الغرف</p>
          )}
          {data.additionalServices.airportReception.enabled && (
            <p>• استقبال المطار VIP: {data.additionalServices.airportReception.persons} أشخاص</p>
          )}
          {data.additionalServices.photoSession.enabled && (
            <p>• جلسة تصوير</p>
          )}
          {data.additionalServices.flowerReception.enabled && (
            <p>• استقبال بالزهور</p>
          )}
        </div>
      </Card>

      <div className="text-center">
        <Button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              جاري حفظ الحجز...
            </>
          ) : (
            'تأكيد الحجز نهائياً'
          )}
        </Button>
      </div>
    </div>
  );
};
