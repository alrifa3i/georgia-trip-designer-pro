
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Copy, Check, Clock, ArrowLeft } from 'lucide-react';
import { generateBookingReference, getVerificationCode } from '@/utils/phoneVerification';

interface WhatsAppVerificationProps {
  phoneNumber: string;
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

export const WhatsAppVerification = ({ phoneNumber, onVerificationSuccess, onCancel }: WhatsAppVerificationProps) => {
  const [step, setStep] = useState(1); // 1: confirm send, 2: show code, 3: enter code
  const [verificationCode, setVerificationCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [bookingRef] = useState(generateBookingReference(840)); // Example price: $840

  const whatsappMessage = `مرحباً، هذه رسالة تحقق من أداة تصميم البرنامج السياحي. رقم الحجز: ${bookingRef}. عد إلى صفحة الأداة بعد إرسال هذه الرسالة للحصول على كود التحقق.`;

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 2 && timeLeft === 0) {
      const code = getVerificationCode(phoneNumber);
      setVerificationCode(code);
      setStep(3);
    }
  }, [step, timeLeft, phoneNumber]);

  const handleSendToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    setStep(2);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setIsCodeCopied(true);
    setTimeout(() => setIsCodeCopied(false), 2000);
  };

  const handleVerify = () => {
    if (userInputCode === verificationCode) {
      onVerificationSuccess();
    } else {
      alert('كود التحقق غير صحيح. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          تحقق من رقم الواتساب
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                سيتم إرسال رسالة تحقق إلى رقم الواتساب: {phoneNumber}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={handleSendToWhatsApp} className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                إرسال رسالة التحقق
              </Button>
              <Button onClick={onCancel} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-center">
            <Alert>
              <Clock className="w-4 h-4" />
              <AlertDescription>
                تأكد من إرسال الرسالة إلى مركز التحقق (رقم الشركة)
                <br />
                سيظهر الكود خلال {timeLeft} ثانية...
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>كود التحقق: <strong>{verificationCode}</strong></span>
                  <Button
                    onClick={copyCode}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    {isCodeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="verificationCode">أدخل رقم الكود الظاهر في الأعلى</Label>
              <Input
                id="verificationCode"
                value={userInputCode}
                onChange={(e) => setUserInputCode(e.target.value)}
                placeholder="أدخل كود التحقق"
                className="text-center"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleVerify} className="flex-1">
                تحقق
              </Button>
              <Button onClick={onCancel} variant="outline">
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
