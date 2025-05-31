
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { generateVerificationCode, createWhatsAppURL, validateVerificationCode } from '@/utils/phoneVerification';

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

  // إنشاء رابط الواتساب مع رمز التحقق
  const whatsappUrl = createWhatsAppURL(phoneNumber);
  
  // إنشاء QR Code للواتساب
  const qrCodeValue = whatsappUrl;

  // الحصول على رمز التحقق المتوقع (للعرض فقط)
  const expectedCode = generateVerificationCode(phoneNumber);

  const sendVerificationCode = async () => {
    setLoading(true);
    try {
      // محاكاة إرسال رمز التحقق
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCodeSent(true);
      // فتح الواتساب تلقائياً
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error sending verification code:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      // محاكاة التحقق من الرمز
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (validateVerificationCode(phoneNumber, verificationCode)) {
        setIsVerified(true);
        onVerificationComplete(true);
      } else {
        alert('رمز التحقق غير صحيح. تأكد من إدخال آخر 4 أرقام من رقم هاتفك معكوسة.');
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
            تم التحقق بنجاح!
          </h3>
          <p className="text-center text-green-700">
            تم تأكيد رقم الهاتف عبر الواتساب بنجاح. يمكنك الآن إتمام عملية الحجز.
          </p>
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
              سيتم إرسال رمز التحقق إلى رقم الواتساب: <strong>{phoneNumber}</strong>
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
                      value={qrCodeValue}
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
                      <MessageCircle className="w-4 h-4 mr-2" />
                    )}
                    إرسال رمز التحقق عبر الواتساب
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    سيتم فتح تطبيق الواتساب مع الرسالة جاهزة للإرسال
                  </p>
                </div>
              </div>
              
              {/* شرح آلية التحقق */}
              <Alert className="bg-yellow-50 border-yellow-200">
                <MessageCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>كيفية التحقق:</strong> رمز التحقق هو آخر 4 أرقام من رقم هاتفك معكوسة.<br/>
                  مثال: إذا كان رقمك ينتهي بـ 1234، فالرمز سيكون 4321
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  تم إرسال رسالة التحقق عبر الواتساب. أدخل الرمز المكون من 4 أرقام أدناه.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label htmlFor="verificationCode">رمز التحقق (آخر 4 أرقام من هاتفك معكوسة)</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="أدخل الرمز المكون من 4 أرقام"
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
                  تحقق من الرمز
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsCodeSent(false)}
                  className="text-sm"
                >
                  إعادة إرسال الرسالة
                </Button>
              </div>
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
