
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { currencies } from '@/data/hotels';
import { CheckCircle, Upload, Phone, User, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConfirmationStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const ConfirmationStep = ({ data, updateData }: ConfirmationStepProps) => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [ticketFile, setTicketFile] = useState<File | null>(null);

  const selectedCurrency = currencies.find(c => c.code === data.currency);

  const sendVerificationCode = () => {
    if (!phone.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate sending WhatsApp verification code
    setIsCodeSent(true);
    toast({
      title: "تم الإرسال",
      description: "تم إرسال كود التحقق عبر الواتساب"
    });
  };

  const verifyCode = () => {
    if (verificationCode === '1234') { // Demo verification code
      setIsVerified(true);
      toast({
        title: "تم التحقق",
        description: "تم تأكيد رقم الهاتف بنجاح"
      });
    } else {
      toast({
        title: "خطأ",
        description: "كود التحقق غير صحيح",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (type: 'passport' | 'ticket', file: File | null) => {
    if (type === 'passport') {
      setPassportFile(file);
    } else {
      setTicketFile(file);
    }
  };

  const confirmBooking = () => {
    if (!isVerified) {
      toast({
        title: "مطلوب التحقق",
        description: "يرجى التحقق من رقم الهاتف أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!passportFile) {
      toast({
        title: "مطلوب",
        description: "يرجى رفع صورة جواز السفر",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم تأكيد الحجز",
      description: "سيتم التواصل معك خلال 24 ساعة عمل لتأكيد التفاصيل"
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تأكيد الحجز</h2>
        <p className="text-gray-600">المرحلة الأخيرة لإتمام حجز رحلتك إلى جورجيا</p>
      </div>

      {/* Booking Summary */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            ملخص الحجز
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p><strong>اسم العميل:</strong> {data.customerName}</p>
              <p><strong>عدد المسافرين:</strong> {data.adults} بالغ، {data.children.length} طفل</p>
              <p><strong>تاريخ السفر:</strong> {data.arrivalDate} إلى {data.departureDate}</p>
              <p><strong>عدد الغرف:</strong> {data.rooms}</p>
            </div>
            <div className="space-y-2">
              <p><strong>مطار الوصول:</strong> {data.airport}</p>
              <p><strong>نوع السيارة:</strong> {data.carType}</p>
              <p><strong>عدد المدن:</strong> {data.selectedCities.length}</p>
              <p className="text-lg font-bold text-emerald-600">
                <strong>التكلفة الإجمالية:</strong> {Math.round(data.totalCost)} {selectedCurrency?.symbol}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            التحقق من رقم الهاتف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="رقم الهاتف مع رمز الدولة"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isVerified}
              className="flex-1"
            />
            <Button 
              onClick={sendVerificationCode}
              disabled={isCodeSent || isVerified}
              variant="outline"
            >
              إرسال الكود
            </Button>
          </div>
          
          {isCodeSent && !isVerified && (
            <div className="flex gap-2">
              <Input
                placeholder="كود التحقق"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={4}
              />
              <Button onClick={verifyCode}>
                تحقق
              </Button>
            </div>
          )}
          
          {isVerified && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>تم التحقق من رقم الهاتف بنجاح</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع المستندات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="passport">صورة جواز السفر (مطلوب)</Label>
            <Input
              id="passport"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('passport', e.target.files?.[0] || null)}
              className="mt-1"
            />
            {passportFile && (
              <p className="text-sm text-green-600 mt-1">
                تم رفع: {passportFile.name}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="tickets">تذاكر السفر (اختياري)</Label>
            <Input
              id="tickets"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('ticket', e.target.files?.[0] || null)}
              className="mt-1"
            />
            {ticketFile && (
              <p className="text-sm text-green-600 mt-1">
                تم رفع: {ticketFile.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Alert */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">معلومات مهمة:</p>
            <ul className="text-sm space-y-1">
              <li>• سيتم تأكيد الحجز خلال 24 ساعة عمل</li>
              <li>• أيام السبت والأحد عطلة رسمية</li>
              <li>• سيتم التواصل معك عبر الواتساب المحدد</li>
              <li>• يمكن تعديل التفاصيل قبل التأكيد النهائي</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Confirm Button */}
      <div className="text-center">
        <Button
          onClick={confirmBooking}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-lg"
          disabled={!isVerified || !passportFile}
        >
          تأكيد الحجز النهائي
        </Button>
      </div>
    </div>
  );
};
