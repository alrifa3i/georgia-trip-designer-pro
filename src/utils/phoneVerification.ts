
// نظام التحقق من الهاتف باستخدام كود عشوائي ورقم معكوس

export const generateVerificationCode = (phoneNumber: string): string => {
  // استخراج أول رقم بعد كود الدولة وآخر 3 أرقام
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // إزالة كود الدولة (افتراض أن كود الدولة يتراوح من 1-4 أرقام)
  let localNumber = digitsOnly;
  if (digitsOnly.startsWith('966')) localNumber = digitsOnly.slice(3); // السعودية
  else if (digitsOnly.startsWith('971')) localNumber = digitsOnly.slice(3); // الإمارات
  else if (digitsOnly.startsWith('974')) localNumber = digitsOnly.slice(3); // قطر
  else if (digitsOnly.startsWith('965')) localNumber = digitsOnly.slice(3); // الكويت
  else if (digitsOnly.startsWith('973')) localNumber = digitsOnly.slice(3); // البحرين
  else if (digitsOnly.startsWith('968')) localNumber = digitsOnly.slice(3); // عمان
  else if (digitsOnly.startsWith('1')) localNumber = digitsOnly.slice(1); // أمريكا/كندا
  else if (digitsOnly.length > 7) localNumber = digitsOnly.slice(-10); // افتراضي
  
  // أول رقم + آخر 3 أرقام معكوسة
  const firstDigit = localNumber.charAt(0) || '5';
  const lastThreeDigits = localNumber.slice(-3);
  const reversedLastThree = lastThreeDigits.split('').reverse().join('');
  
  return firstDigit + reversedLastThree;
};

export const generateBookingReference = (totalCost: number): string => {
  // توليد 4 أحرف عشوائية
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomLetters = '';
  for (let i = 0; i < 4; i++) {
    randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // إضافة السعر
  const price = Math.round(totalCost);
  
  return `${randomLetters}${price}`;
};

export const createWhatsAppVerificationMessage = (phoneNumber: string, totalCost: number = 0): string => {
  const bookingReference = generateBookingReference(totalCost);
  
  const message = `مرحباً،

أهلاً بك في خدمة الحجز السياحي لجورجيا 🇬🇪

رقم الحجز: ${bookingReference}

يرجى إرسال هذه الرسالة لتأكيد رقم الواتساب الخاص بك.

بعد الإرسال، ارجع للموقع لإكمال عملية التحقق.

شكراً لثقتك بنا! 🌟`;

  return encodeURIComponent(message);
};

export const createWhatsAppURL = (phoneNumber: string, totalCost: number = 0): string => {
  const message = createWhatsAppVerificationMessage(phoneNumber, totalCost);
  return `https://api.whatsapp.com/send?phone=995514000668&text=${message}`;
};

export const validateVerificationCode = (phoneNumber: string, enteredCode: string): boolean => {
  const expectedCode = generateVerificationCode(phoneNumber);
  return expectedCode === enteredCode;
};
