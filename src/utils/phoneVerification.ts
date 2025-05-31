
// نظام التحقق من الهاتف باستخدام آخر 4 أرقام معكوسة

export const generateVerificationCode = (phoneNumber: string): string => {
  // استخراج آخر 4 أرقام من رقم الهاتف
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const lastFourDigits = digitsOnly.slice(-4);
  
  // عكس الأرقام
  const reversedDigits = lastFourDigits.split('').reverse().join('');
  
  return reversedDigits;
};

export const createWhatsAppVerificationMessage = (phoneNumber: string): string => {
  const verificationCode = generateVerificationCode(phoneNumber);
  
  const message = `مرحباً،

هذه الرسالة مرسلة من أداة تصميم البرنامج السياحي لمطابقة الكود.

رمز التحقق الخاص بك: ${verificationCode}

عد إلى صفحة الأداة بعد إرسالك هذه الرسالة.

---
آخر أربعة أرقام من رقم العميل (معكوسة): ${verificationCode}`;

  return encodeURIComponent(message);
};

export const createWhatsAppURL = (phoneNumber: string): string => {
  const message = createWhatsAppVerificationMessage(phoneNumber);
  return `https://api.whatsapp.com/send?phone=995514000668&text=${message}`;
};

export const validateVerificationCode = (phoneNumber: string, enteredCode: string): boolean => {
  const expectedCode = generateVerificationCode(phoneNumber);
  return expectedCode === enteredCode;
};
