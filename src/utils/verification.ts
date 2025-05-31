
// دالة توليد كود التحقق العشوائي
export const generateVerificationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// دالة استخراج آخر 4 أرقام معكوسة من رقم الهاتف
export const getReversedLastFourDigits = (phoneNumber: string): string => {
  // إزالة كل شيء ما عدا الأرقام
  const numbersOnly = phoneNumber.replace(/\D/g, '');
  
  // أخذ آخر 4 أرقام
  const lastFour = numbersOnly.slice(-4);
  
  // عكس الأرقام
  return lastFour.split('').reverse().join('');
};

// دالة التحقق من الكود
export const verifyCode = (enteredCode: string, phoneNumber: string): boolean => {
  const expectedCode = getReversedLastFourDigits(phoneNumber);
  return enteredCode === expectedCode;
};

// دالة إنشاء رسالة الواتساب للشركة
export const createCompanyMessage = (phoneNumber: string, verificationCode: string): string => {
  return `هذه الرسالة مرسلة من أداة تصميم البرنامج السياحي لمطابقة الكود

رقم العميل: ${phoneNumber}
كود التحقق: ${verificationCode}

عُد إلى صفحة الأداة بعد إرسالك هذه الرسالة`;
};

// دالة إنشاء رابط الواتساب للشركة
export const createCompanyWhatsAppLink = (phoneNumber: string): string => {
  const verificationCode = generateVerificationCode();
  const message = createCompanyMessage(phoneNumber, verificationCode);
  return `https://api.whatsapp.com/send?phone=995514000668&text=${encodeURIComponent(message)}`;
};
