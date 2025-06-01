
// إنشاء رقم مرجعي للحجز
export const generateBookingReference = (totalPrice: number): string => {
  const timestamp = Date.now().toString().slice(-6);
  const priceCode = Math.floor(totalPrice).toString().slice(-3);
  return `GEO${timestamp}${priceCode}`;
};

// إنشاء كود التحقق
export const generateVerificationCode = (phoneNumber: string): string => {
  const timestamp = Date.now();
  const phoneDigits = phoneNumber.replace(/\D/g, '').slice(-4);
  const code = ((timestamp % 10000) + parseInt(phoneDigits)).toString().slice(-4);
  return code.padStart(4, '0');
};

// الحصول على كود التحقق (نفس الدالة مع اسم مختلف للتوافق)
export const getVerificationCode = generateVerificationCode;
