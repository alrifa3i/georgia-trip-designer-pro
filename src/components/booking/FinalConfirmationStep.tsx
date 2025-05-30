
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { currencies } from '@/data/hotels';
import { CheckCircle, Upload, Phone, User, Clock, Shield, IdCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FinalConfirmationStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const FinalConfirmationStep = ({ data, updateData }: FinalConfirmationStepProps) => {
  const [passportName, setPassportName] = useState('');
  const [receptionName, setReceptionName] = useState('');
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
    
    setIsCodeSent(true);
    toast({
      title: "تم الإرسال",
      description: "تم إرسال كود التحقق عبر الواتساب"
    });
  };

  const verifyCode = () => {
    if (verificationCode === '1234') {
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
    if (!passportName.trim()) {
      toast({
        title: "مطلوب",
        description: "يرجى إدخال الاسم كما في جواز السفر",
        variant: "destructive"
      });
      return;
    }

    if (!receptionName.trim()) {
      toast({
        title: "مطلوب",
        description: "يرجى إدخال الاسم كما سيظهر في لوحة الاستقبال",
        variant: "destructive"
      });
      return;
    }

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

    // تحديث البيانات النهائية
    updateData({ 
      customerName: passportName 
    });

    toast({
      title: "تم تأكيد الحجز بنجاح! 🎉",
      description: "سيتم التواصل معك خلال 24 ساعة عمل لتأكيد التفاصيل"
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">التأكيد النهائي</h2>
        <p className="text-gray-600">آخر خطوة لإتمام حجز رحلتك إلى جورجيا</p>
      </div>

      {/* Final Booking Summary */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <CheckCircle className="w-5 h-5" />
            ملخص الحجز النهائي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p><strong>عدد المسافرين:</strong> {data.adults} بالغ، {data.children.length} طفل</p>
              <p><strong>تاريخ السفر:</strong> {data.arrivalDate} إلى {data.departureDate}</p>
              <p><strong>عدد الغرف:</strong> {data.rooms}</p>
              <p><strong>مطار الوصول:</strong> {data.arrivalAirport}</p>
            </div>
            <div className="space-y-2">
              <p><strong>مطار المغادرة:</strong> {data.departureAirport}</p>
              <p><strong>نوع السيارة:</strong> {data.carType}</p>
              <p><strong>عدد المدن:</strong> {data.selectedCities.length}</p>
              <p className="text-xl font-bold text-emerald-600">
                <strong>التكلفة الإجمالية:</strong> {Math.round(data.totalCost)} {selectedCurrency?.symbol}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Names Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="w-5 h-5" />
            بيانات الأسماء المطلوبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passportName">الاسم كما في جواز السفر *</Label>
            <Input
              id="passportName"
              value={passportName}
              onChange={(e) => setPassportName(e.target.value)}
              placeholder="أدخل الاسم بالضبط كما هو مكتوب في جواز السفر"
              className="text-right"
              required
            />
            <p className="text-xs text-gray-500">تأكد من كتابة الاسم بنفس طريقة كتابته في جواز السفر</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receptionName">الاسم كما سيظهر في لوحة الاستقبال *</Label>
            <Input
              id="receptionName"
              value={receptionName}
              onChange={(e) => setReceptionName(e.target.value)}
              placeholder="الاسم الذي تريده أن يظهر في لوحة استقبال المطار"
              className="text-right"
              required
            />
            <p className="text-xs text-gray-500">يمكن أن يكون مختلف عن اسم جواز السفر (مثل: اسم مختصر أو لقب)</p>
          </div>
        </CardContent>
      </Card>

      {/* Phone Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            رقم الواتساب للتواصل *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="رقم الواتساب مع رمز الدولة (+995...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isVerified}
              className="flex-1"
              required
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
                placeholder="كود التحقق (1234 للتجربة)"
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
              <span>تم التحقق من رقم الواتساب بنجاح</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع المستندات المطلوبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="passport">صورة جواز السفر (مطلوب) *</Label>
            <Input
              id="passport"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('passport', e.target.files?.[0] || null)}
              className="mt-1"
              required
            />
            {passportFile && (
              <p className="text-sm text-green-600 mt-1">
                ✅ تم رفع: {passportFile.name}
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
                ✅ تم رفع: {ticketFile.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security and Payment Reminder */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Shield className="w-5 h-5" />
            ضمان الأمان والدفع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-green-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>دفعك آمن معنا - لن يتم خصم أي مبالغ إلا بعد وصولك واستلام الغرفة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>إمكانية الإلغاء المجاني حتى 48 ساعة قبل السفر</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>ضمان استرداد كامل في حالة عدم الحصول على الخدمة</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Confirmation */}
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
          className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-lg font-bold"
          disabled={!isVerified || !passportFile || !passportName.trim() || !receptionName.trim()}
        >
          🎉 تأكيد الحجز النهائي 🎉
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          بالضغط على "تأكيد الحجز" فإنك توافق على شروط وأحكام الخدمة
        </p>
      </div>
    </div>
  );
};
