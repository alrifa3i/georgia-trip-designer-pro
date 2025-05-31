import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { currencies } from '@/data/hotels';
import { CheckCircle, Upload, Phone, User, Clock, Shield, IdCard, MessageCircle, Plus, Minus, AlertTriangle, QrCode, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PhoneInput, countries } from '@/components/ui/phone-input';
import { 
  getReversedLastFourDigits, 
  verifyCode, 
  createCompanyWhatsAppLink 
} from '@/utils/verification';

interface FinalConfirmationStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const FinalConfirmationStep = ({ data, updateData }: FinalConfirmationStepProps) => {
  const [passportName, setPassportName] = useState('');
  const [receptionName, setReceptionName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('SA'); // السعودية افتراضياً
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passportFiles, setPassportFiles] = useState<File[]>([]);
  const [ticketFiles, setTicketFiles] = useState<File[]>([]);
  const [showReferenceNumber, setShowReferenceNumber] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const selectedCurrency = currencies.find(c => c.code === data.currency);
  const totalPeople = data.adults + data.children.length;

  const generateReferenceNumber = () => {
    return Math.random().toString().slice(2, 14).padStart(12, '0');
  };

  const getFullPhoneNumber = () => {
    const country = countries.find(c => c.code === selectedCountry);
    return `${country?.dialCode}${phoneNumber}`;
  };

  const generateBookingDetails = () => {
    const roomTypes = data.roomTypes.join(', ') || 'غير محدد';
    const hotelNames = data.selectedCities.map(city => city.hotel).join(', ') || 'غير محدد';
    const cityNames = data.selectedCities.map(city => city.city).join(', ') || 'غير محدد';
    
    return `
حجز رحلة جورجيا - الرقم المرجعي: ${referenceNumber}

📋 تفاصيل الحجز:
• اسم العميل: ${passportName}
• عدد البالغين: ${data.adults}
• عدد الأطفال: ${data.children.length}
• تاريخ الوصول: ${data.arrivalDate}
• تاريخ المغادرة: ${data.departureDate}
• مطار الوصول: ${data.arrivalAirport}
• مطار المغادرة: ${data.departureAirport}

🏨 الإقامة:
• عدد الغرف: ${data.rooms}
• نوع الغرف: ${roomTypes}
• أسماء الفنادق: ${hotelNames}
• عدد المدن: ${data.selectedCities.length}
• أسماء المدن: ${cityNames}

🚗 النقل:
• نوع السيارة: ${data.carType}

💰 التكلفة:
• التكلفة الإجمالية: ${data.totalCost} ${selectedCurrency?.symbol}
• العملة: ${data.currency}

📞 للاستفسار: +995514000668
    `.trim();
  };

  const generateQRCode = async () => {
    try {
      // Dynamically import QRCode to avoid build issues
      const QRCode = await import('qrcode');
      const bookingDetails = generateBookingDetails();
      const qrDataUrl = await QRCode.toDataURL(bookingDetails, {
        width: 300,
        margin: 2,
        color: {
          dark: '#059669', // emerald-600
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    if (showReferenceNumber && referenceNumber) {
      generateQRCode();
    }
  }, [showReferenceNumber, referenceNumber]);

  const sendVerificationCode = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف",
        variant: "destructive"
      });
      return;
    }

    const fullPhoneNumber = getFullPhoneNumber();
    
    // إنشاء رابط الواتساب للشركة
    const whatsappLink = createCompanyWhatsAppLink(fullPhoneNumber);
    
    // فتح رابط الواتساب
    window.open(whatsappLink, '_blank');
    
    setIsCodeSent(true);
    toast({
      title: "تم الإرسال",
      description: "تم إرسال طلب التحقق إلى الشركة عبر الواتساب"
    });
  };

  const handleVerifyCode = () => {
    const fullPhoneNumber = getFullPhoneNumber();
    
    if (verifyCode(verificationCode, fullPhoneNumber)) {
      setIsVerified(true);
      toast({
        title: "تم التحقق بنجاح! ✅",
        description: "تم تأكيد رقم الهاتف"
      });
    } else {
      toast({
        title: "كود خاطئ",
        description: "يرجى إدخال الكود الصحيح الظاهر في رسالة الواتساب",
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
    const bookingDetails = generateBookingDetails();
    const message = `${bookingDetails}\n\nالسلام عليكم لقد قمت بحجز مبدئي على اداة تصميم الحجز الرجاء تأكيد الحجز و بانتظار الحجوزات`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=995514000668&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `booking-${referenceNumber}.png`;
      link.href = qrCodeUrl;
      link.click();
      
      toast({
        title: "تم التحميل",
        description: "تم حفظ QR Code الحجز بنجاح"
      });
    }
  };

  if (showReferenceNumber) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-800 mb-4">تم تأكيد الحجز بنجاح! 🎉</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Reference Number */}
            <div className="bg-white p-6 rounded-lg border-2 border-green-300">
              <p className="text-gray-700 text-lg mb-2">رقمك المرجعي</p>
              <p className="text-4xl font-bold text-green-600 tracking-wider">{referenceNumber}</p>
            </div>
            
            {/* QR Code */}
            <div className="bg-white p-6 rounded-lg border-2 border-green-300">
              <p className="text-gray-700 text-lg mb-4">QR Code الحجز</p>
              {qrCodeUrl && (
                <div className="space-y-3">
                  <img src={qrCodeUrl} alt="QR Code للحجز" className="mx-auto" />
                  <Button
                    onClick={downloadQRCode}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    حفظ كصورة
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <div className="flex items-center gap-2 justify-center mb-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800 font-semibold">نصيحة مهمة</p>
            </div>
            <p className="text-blue-700 text-sm">
              احفظ QR Code كصورة في هاتفك للمراجعة السريعة. يحتوي على جميع تفاصيل حجزك
            </p>
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
                <strong>التكلفة الإجمالية:</strong> {data.totalCost} {selectedCurrency?.symbol}
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

      {/* Enhanced Phone Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            رقم الواتساب للتواصل *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>رقم الواتساب مع رمز الدولة</Label>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              placeholder="رقم الهاتف (بدون رمز الدولة)"
              disabled={isVerified}
            />
            
            <Button 
              onClick={sendVerificationCode}
              disabled={isCodeSent || isVerified || !phoneNumber.trim()}
              variant="outline"
              className="w-full"
            >
              إرسال طلب التحقق للشركة
            </Button>
          </div>
          
          {isCodeSent && !isVerified && (
            <div className="space-y-3">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">تم تكوين الكود الخاص بك</p>
                    <p className="text-sm">رقمك الكامل: <strong className="text-blue-600">{getFullPhoneNumber()}</strong></p>
                    <p className="text-sm">الكود المطلوب: <strong className="text-green-600">{getReversedLastFourDigits(getFullPhoneNumber())}</strong></p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Input
                  placeholder="اكتب الكود الظاهر أعلى هذه الرسالة"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={4}
                />
                <Button onClick={handleVerifyCode}>
                  تحقق
                </Button>
              </div>
            </div>
          )}
          
          {isVerified && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
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
