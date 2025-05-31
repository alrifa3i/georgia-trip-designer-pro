import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { currencies } from '@/data/hotels';
import { CheckCircle, Upload, Phone, User, Clock, Shield, IdCard, MessageCircle, Plus, Minus } from 'lucide-react';
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
  const [passportFiles, setPassportFiles] = useState<File[]>([]);
  const [ticketFiles, setTicketFiles] = useState<File[]>([]);
  const [showReferenceNumber, setShowReferenceNumber] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  const selectedCurrency = currencies.find(c => c.code === data.currency);
  const totalPeople = data.adults + data.children.length;

  const generateReferenceNumber = () => {
    return Math.random().toString().slice(2, 14).padStart(12, '0');
  };

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

  const handlePassportUpload = (index: number, file: File | null) => {
    const newFiles = [...passportFiles];
    if (file) {
      newFiles[index] = file;
    } else {
      newFiles.splice(index, 1);
    }
    setPassportFiles(newFiles);
  };

  const handleTicketUpload = (index: number, file: File | null) => {
    const newFiles = [...ticketFiles];
    if (file) {
      newFiles[index] = file;
    } else {
      newFiles.splice(index, 1);
    }
    setTicketFiles(newFiles);
  };

  const addPassportSlot = () => {
    if (passportFiles.length < totalPeople) {
      setPassportFiles([...passportFiles, new File([], '')]);
    }
  };

  const addTicketSlot = () => {
    if (ticketFiles.length < 2) {
      setTicketFiles([...ticketFiles, new File([], '')]);
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

    if (passportFiles.length === 0 || !passportFiles[0] || passportFiles[0].size === 0) {
      toast({
        title: "مطلوب",
        description: "يرجى رفع جواز السفر الأول على الأقل",
        variant: "destructive"
      });
      return;
    }

    if (ticketFiles.length === 0 || !ticketFiles[0] || ticketFiles[0].size === 0) {
      toast({
        title: "مطلوب",
        description: "يرجى رفع تذكرة السفر",
        variant: "destructive"
      });
      return;
    }

    // Generate reference number
    const refNumber = generateReferenceNumber();
    setReferenceNumber(refNumber);
    setShowReferenceNumber(true);

    // Update booking data
    updateData({ 
      customerName: passportName,
      referenceNumber: refNumber
    });

    toast({
      title: "تم تأكيد الحجز بنجاح! 🎉",
      description: `رقمك المرجعي: ${refNumber}`
    });
  };

  const sendToWhatsApp = () => {
    const message = `السلام عليكم لقد قمت بحجز مبدئي على اداة تصميم الحجز برقم مرجعي (${referenceNumber}) الرجاء تأكيد الحجز و بانتظار الحجوزات`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=995514000668&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showReferenceNumber) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-800 mb-4">تم تأكيد الحجز بنجاح! 🎉</h2>
          <div className="bg-white p-6 rounded-lg border-2 border-green-300 mb-6">
            <p className="text-gray-700 text-lg mb-2">رقمك المرجعي</p>
            <p className="text-4xl font-bold text-green-600 tracking-wider">{referenceNumber}</p>
          </div>
          <p className="text-green-700 mb-6">احفظ هذا الرقم للمراجعة</p>
          
          <Button
            onClick={sendToWhatsApp}
            size="lg"
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-bold"
          >
            <MessageCircle className="w-5 h-5 ml-2" />
            إرسال للواتساب
          </Button>
        </div>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            سيتم التواصل معك خلال 24 ساعة عمل لتأكيد التفاصيل النهائية
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <CardContent className="space-y-6">
          {/* Passport Upload */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>جوازات السفر (الأول مطلوب) *</Label>
              <Button
                onClick={addPassportSlot}
                variant="outline"
                size="sm"
                disabled={passportFiles.length >= totalPeople}
              >
                <Plus className="w-4 h-4 ml-1" />
                إضافة جواز
              </Button>
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: Math.max(1, passportFiles.length) }, (_, index) => (
                <div key={index}>
                  <Label htmlFor={`passport-${index}`}>
                    جواز السفر {index + 1} {index === 0 ? '(مطلوب)' : '(اختياري)'}
                  </Label>
                  <Input
                    id={`passport-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePassportUpload(index, e.target.files?.[0] || null)}
                    className="mt-1"
                    required={index === 0}
                  />
                  {passportFiles[index] && passportFiles[index].size > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ تم رفع: {passportFiles[index].name}
                    </p>
                  )}
                </div>
              ))}
              
              {passportFiles.length < totalPeople && (
                <p className="text-xs text-gray-500">
                  يمكن رفع حتى {totalPeople} جواز سفر (عدد المسافرين)
                </p>
              )}
            </div>
          </div>
          
          {/* Ticket Upload */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>تذاكر السفر (الأولى مطلوبة) *</Label>
              <Button
                onClick={addTicketSlot}
                variant="outline"
                size="sm"
                disabled={ticketFiles.length >= 2}
              >
                <Plus className="w-4 h-4 ml-1" />
                إضافة تذكرة
              </Button>
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: Math.max(1, ticketFiles.length) }, (_, index) => (
                <div key={index}>
                  <Label htmlFor={`ticket-${index}`}>
                    تذكرة السفر {index + 1} {index === 0 ? '(مطلوبة)' : '(اختيارية)'}
                  </Label>
                  <Input
                    id={`ticket-${index}`}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleTicketUpload(index, e.target.files?.[0] || null)}
                    className="mt-1"
                    required={index === 0}
                  />
                  {ticketFiles[index] && ticketFiles[index].size > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ تم رفع: {ticketFiles[index].name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security and Payment Reminder */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Shield className="w-5 h-5" />
            معلومات الدفع والأمان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-green-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>الدفع يتم بعد الوصول إلى جورجيا نقداً</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>إمكانية الإلغاء المجاني حتى 72 ساعة قبل السفر</span>
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
          disabled={!isVerified || passportFiles.length === 0 || ticketFiles.length === 0 || !passportName.trim() || !receptionName.trim()}
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
