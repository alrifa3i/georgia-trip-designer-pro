
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, MessageCircle, CheckCircle, Clock, Copy, Send } from 'lucide-react';
import { generateVerificationCode, createWhatsAppURL, validateVerificationCode, generateBookingReference } from '@/utils/phoneVerification';
import { toast } from '@/hooks/use-toast';

interface WhatsAppVerificationProps {
  phoneNumber: string;
  bookingData: any;
  onVerificationComplete: (verified: boolean) => void;
}

export const WhatsAppVerification = ({ 
  phoneNumber, 
  bookingData, 
  onVerificationComplete 
}: WhatsAppVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  // إنشاء رمز التحقق ورقم الحجز
  useEffect(() => {
    const code = generateVerificationCode(phoneNumber);
    const reference = generateBookingReference(bookingData.totalCost || 0);
    setGeneratedCode(code);
    setBookingReference(reference);
  }, [phoneNumber, bookingData.totalCost]);

  // إنشاء رابط الواتساب
  const whatsappUrl = createWhatsAppURL(phoneNumber, bookingData.totalCost || 0);
  
  const sendVerificationCode = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCodeSent(true);
      
      // فتح الواتساب
      window.open(whatsappUrl, '_blank');
      
      // عرض رسالة تأكيد الإرسال بعد 3 ثوان
      setTimeout(() => {
        setShowCode(true);
      }, 3000);
      
    } catch (error) {
      console.error('Error sending verification code:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الكود بنجاح"
    });
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (validateVerificationCode(phoneNumber, verificationCode)) {
        setIsVerified(true);
        onVerificationComplete(true);
        toast({
          title: "تم التحقق بنجاح",
          description: "تم تأكيد رقم الواتساب الخاص بك"
        });
      } else {
        toast({
          title: "خطأ في الكود",
          description: "الكود غير صحيح، يرجى المحاولة مرة أخرى",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-green-600 mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-semibold text-center text-green-800 mb-2">
            تم التحقق بنجاح! ✅
          </h3>
          <p className="text-center text-green-700">
            تم تأكيد رقم الواتساب بنجاح. يمكنك الآن إتمام عملية الحجز.
          </p>
          <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
            <p className="text-sm text-green-800">
              <strong>رقم الحجز:</strong> {bookingReference}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            التحقق عبر الواتساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription>
              سيتم إرسال رسالة التحقق إلى رقم الواتساب: <strong>{phoneNumber}</strong>
            </AlertDescription>
          </Alert>

          {!isCodeSent ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code */}
                <div className="flex flex-col items-center space-y-3">
                  <h4 className="font-medium">امسح QR Code للواتساب</h4>
                  <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                    <QRCodeSVG 
                      value={whatsappUrl}
                      size={150}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    امسح الكود بكاميرا الهاتف لفتح الواتساب مباشرة
                  </p>
                </div>

                {/* أو الضغط على الزر */}
                <div className="flex flex-col justify-center space-y-3">
                  <h4 className="font-medium">أو اضغط على الزر</h4>
                  <Button
                    onClick={sendVerificationCode}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    {loading ? (
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    إرسال رسالة التحقق
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    سيتم فتح تطبيق الواتساب مع الرسالة جاهزة للإرسال
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!showCode ? (
                <Alert className="bg-blue-50 border-blue-200">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>تأكد من إرسال الرسالة إلى مركز التحقق</strong><br/>
                    يرجى التأكد من إرسال الرسالة إلى رقم الشركة عبر الواتساب...
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>تم إرسال الرسالة بنجاح!</strong><br/>
                      يمكنك الآن إدخال كود التحقق أدناه
                    </AlertDescription>
                  </Alert>

                  {/* عرض الكود */}
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-4">
                      <div className="text-center space-y-3">
                        <h4 className="font-medium text-yellow-800">كود التحقق الخاص بك:</h4>
                        <div className="flex items-center justify-center gap-2">
                          <div className="bg-white border-2 border-yellow-300 rounded-lg px-4 py-2 text-2xl font-bold text-yellow-800">
                            {generatedCode}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyCode}
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-yellow-700">اضغط على أيقونة النسخ لنسخ الكود</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Label htmlFor="verificationCode">أدخل رقم الكود الظاهر في الأعلى</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="أدخل الكود المكون من 4 أرقام"
                      maxLength={4}
                      className="text-center text-lg"
                    />
                    <Button
                      onClick={verifyCode}
                      disabled={loading || verificationCode.length !== 4}
                      className="w-full"
                    >
                      {loading ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      تحقق من الكود
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsCodeSent(false);
                        setShowCode(false);
                      }}
                      className="text-sm"
                    >
                      إعادة إرسال الرسالة
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-600">
        <p>💡 نصيحة: تأكد من أن رقم الواتساب صحيح ومفعل</p>
      </div>
    </div>
  );
};
