
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingData } from '@/types/booking';
import { CheckCircle, AlertTriangle, QrCode, Download, Share2, MessageCircle } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { WhatsAppVerification } from './WhatsAppVerification';
import { FileUploadSection } from './FileUploadSection';
import { QRCodeSVG } from 'qrcode.react';

interface FinalConfirmationStepProps {
  data: BookingData;
  onConfirm: () => void;
}

export const FinalConfirmationStep = ({ data, onConfirm }: FinalConfirmationStepProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [showWhatsAppVerification, setShowWhatsAppVerification] = useState(false);
  const [isWhatsAppVerified, setIsWhatsAppVerified] = useState(false);
  const { saveBooking, loading } = useBookings();

  // Generate unique reference number with random letters
  const generateUniqueReference = () => {
    const year = new Date().getFullYear();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomLetters = '';
    for (let i = 0; i < 4; i++) {
      randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return `GEO-${year}-${randomLetters}`;
  };

  // Generate and save booking when component mounts
  useEffect(() => {
    const saveBookingData = async () => {
      if (!referenceNumber) {
        console.log('Saving booking data...');
        const uniqueRef = generateUniqueReference();
        const bookingDataWithRef = { ...data, referenceNumber: uniqueRef };
        const result = await saveBooking(bookingDataWithRef);
        if (result.success && result.data) {
          setReferenceNumber(result.data.reference_number);
          setBookingId(result.data.id);
          console.log('Booking saved with reference:', result.data.reference_number);
        }
      }
    };

    saveBookingData();
  }, [data, saveBooking, referenceNumber]);

  // Format phone number with country code
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return 'غير محدد';
    
    // إذا كان الرقم يبدأ بـ + فهو يحتوي على كود الدولة بالفعل
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // إذا كان الرقم يبدأ بـ 00 نستبدله بـ +
    if (phoneNumber.startsWith('00')) {
      return '+' + phoneNumber.substring(2);
    }
    
    // إذا كان الرقم يبدأ بـ 5 نفترض أنه رقم سعودي
    if (phoneNumber.startsWith('5')) {
      return '+966' + phoneNumber;
    }
    
    // إذا كان الرقم يبدأ بـ 9 نفترض أنه رقم جورجي
    if (phoneNumber.startsWith('9')) {
      return '+995' + phoneNumber;
    }
    
    // إذا لم يتطابق مع أي نمط، نضيف كود دولة افتراضي (+995 لجورجيا)
    return '+995' + phoneNumber;
  };

  // Function to get incomplete fields
  const getIncompleteFields = () => {
    const incompleteFields = [];
    
    if (!data.customerName?.trim()) incompleteFields.push('اسم العميل');
    if (!data.phoneNumber?.trim()) incompleteFields.push('رقم الهاتف');
    if (!data.arrivalDate) incompleteFields.push('تاريخ الوصول');
    if (!data.departureDate) incompleteFields.push('تاريخ المغادرة');
    if (data.selectedCities.length === 0) incompleteFields.push('المدن المختارة');
    if (!data.carType) incompleteFields.push('نوع السيارة');
    if (data.totalCost <= 0) incompleteFields.push('التكلفة الإجمالية');
    
    return incompleteFields;
  };

  // Generate QR Code data - only show reference number
  const generateQRData = () => {
    if (!referenceNumber) return '';
    
    return `رقم الحجز المرجعي: ${referenceNumber}`;
  };

  // Download QR Code
  const downloadQRCode = () => {
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 200;
      canvas.height = 200;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `booking-qr-${referenceNumber}.png`;
        link.href = canvas.toDataURL();
        link.click();
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    }
  };

  // Share QR Code
  const shareQRCode = async () => {
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (svg && navigator.share) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 200;
      canvas.height = 200;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = async () => {
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `booking-qr-${referenceNumber}.png`, { type: 'image/png' });
            try {
              await navigator.share({
                title: `QR Code للحجز ${referenceNumber}`,
                files: [file]
              });
            } catch (error) {
              console.log('Error sharing QR code:', error);
            }
          }
        });
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    } else {
      alert('مشاركة الملفات غير مدعومة في هذا المتصفح');
    }
  };

  // Send booking to company via WhatsApp
  const sendBookingToCompany = () => {
    const formattedPhone = formatPhoneNumber(data.phoneNumber);
    
    const bookingDetails = `
*حجز جديد - ${referenceNumber}*

*بيانات العميل:*
الاسم: ${data.customerName}
الهاتف: ${formattedPhone}

*تفاصيل السفر:*
تاريخ الوصول: ${data.arrivalDate}
تاريخ المغادرة: ${data.departureDate}
مطار الوصول: ${data.arrivalAirport}
مطار المغادرة: ${data.departureAirport}

*المدن والفنادق:*
${data.selectedCities.map(city => `
🏨 ${city.city} - ${city.hotel}
- ${city.nights} ليالي
- ${(city.tours || 0) + (city.mandatoryTours || 0)} جولات
- الغرف: ${city.roomSelections?.map(room => 
  `الغرفة ${room.roomNumber}: ${
    room.roomType === 'single' ? 'مفردة' :
    room.roomType === 'single_v' ? 'مفردة مع إطلالة' :
    room.roomType === 'dbl_wv' ? 'مزدوجة بدون إطلالة' :
    room.roomType === 'dbl_v' ? 'مزدوجة مع إطلالة' :
    room.roomType === 'trbl_wv' ? 'ثلاثية بدون إطلالة' :
    room.roomType === 'trbl_v' ? 'ثلاثية مع إطلالة' : 'غير محدد'
  }`
).join(', ') || 'غير محدد'}`).join('\n')}

*نوع السيارة:* ${data.carType}

*التكلفة الإجمالية:* ${data.totalCost} ${data.currency}

*رقم الحجز:* ${referenceNumber}

*QR Code:* متاح في النظام
    `.trim();

    const companyPhone = '+995514000668'; // رقم الشركة المحدث
    const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodeURIComponent(bookingDetails)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppVerification = () => {
    setShowWhatsAppVerification(true);
  };

  const handleVerificationSuccess = () => {
    setIsWhatsAppVerified(true);
    setShowWhatsAppVerification(false);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    
    // Send booking details to company
    sendBookingToCompany();
    
    // Simulate final confirmation process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConfirming(false);
    onConfirm();
  };

  if (showWhatsAppVerification) {
    return (
      <WhatsAppVerification
        phoneNumber={data.phoneNumber}
        onVerificationSuccess={handleVerificationSuccess}
        onCancel={() => setShowWhatsAppVerification(false)}
      />
    );
  }

  // Check if travel insurance is enabled
  const hasTravelInsurance = data.additionalServices?.travelInsurance?.enabled || false;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">التأكيد النهائي</h2>
        <p className="text-gray-600">مراجعة أخيرة لتفاصيل حجزك قبل التأكيد</p>
      </div>

      {/* Reference Number - Only in green section */}
      {referenceNumber && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">رقم الحجز المرجعي</h3>
            <div className="text-2xl font-bold text-emerald-600 bg-white p-3 rounded-lg border-2 border-emerald-300">
              {referenceNumber}
            </div>
            <p className="text-sm text-emerald-700 mt-2">احتفظ بهذا الرقم للمراجعة المستقبلية</p>
          </CardContent>
        </Card>
      )}

      {/* File Upload Section */}
      {bookingId && (
        <FileUploadSection 
          bookingId={bookingId}
          adults={data.adults}
          hasTravelInsurance={hasTravelInsurance}
        />
      )}

      {/* QR Code - Shows only reference number */}
      {referenceNumber && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code للحجز
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div id="qr-code" className="flex justify-center">
              <QRCodeSVG 
                value={generateQRData()} 
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600">
              امسح الكود لعرض رقم الحجز المرجعي
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={downloadQRCode} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                تحميل
              </Button>
              <Button onClick={shareQRCode} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                مشاركة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الحجز</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-600">اسم العميل:</div>
              <div className="text-lg">{data.customerName || 'غير محدد'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">رقم الهاتف:</div>
              <div className="text-lg">{formatPhoneNumber(data.phoneNumber)}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">تاريخ الوصول:</div>
              <div className="text-lg">{data.arrivalDate || 'غير محدد'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">تاريخ المغادرة:</div>
              <div className="text-lg">{data.departureDate || 'غير محدد'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">مطار الوصول:</div>
              <div className="text-lg">{data.arrivalAirport || 'غير محدد'}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">مطار المغادرة:</div>
              <div className="text-lg">{data.departureAirport || 'غير محدد'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cities and Hotels Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل المدن والفنادق والجولات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.selectedCities.map((city, index) => {
              const totalTours = (city.tours || 0) + (city.mandatoryTours || 0);
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-blue-800">{city.city}</h4>
                      <p className="text-sm text-gray-600">🏨 {city.hotel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{city.nights} ليالي</p>
                      <p className="text-sm text-gray-600">🎯 {totalTours} جولات</p>
                    </div>
                  </div>
                  
                  {/* Room Details */}
                  {city.roomSelections && city.roomSelections.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">🛏️ تفاصيل الغرف:</h5>
                      <div className="space-y-1">
                        {city.roomSelections.map((room, roomIndex) => (
                          <div key={roomIndex} className="text-xs bg-white p-2 rounded border">
                            <span className="font-semibold">الغرفة {room.roomNumber}:</span> {
                              room.roomType === 'single' ? 'مفردة' :
                              room.roomType === 'single_v' ? 'مفردة مع إطلالة' :
                              room.roomType === 'dbl_wv' ? 'مزدوجة بدون إطلالة' :
                              room.roomType === 'dbl_v' ? 'مزدوجة مع إطلالة' :
                              room.roomType === 'trbl_wv' ? 'ثلاثية بدون إطلالة' :
                              room.roomType === 'trbl_v' ? 'ثلاثية مع إطلالة' :
                              'غير محدد'
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tours Details */}
                  {totalTours > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">🗺️ الجولات السياحية:</h5>
                      <div className="text-xs bg-blue-50 p-2 rounded border">
                        {city.tours > 0 && <p>• جولات اختيارية: {city.tours}</p>}
                        {city.mandatoryTours > 0 && <p>• جولات إجبارية: {city.mandatoryTours}</p>}
                        <p className="font-semibold mt-1">إجمالي الجولات: {totalTours} جولة في {city.city}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Car Type */}
      <Card>
        <CardHeader>
          <CardTitle>نوع السيارة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-center p-3 bg-blue-50 rounded-lg">
            🚗 {data.carType || 'غير محدد'}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الأسعار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">إجمالي التكلفة:</div>
            <div className="text-2xl font-bold text-emerald-600">
              {data.totalCost} {data.currency}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="text-yellow-800 font-semibold mb-2">
            ⚠️ إشعار مهم
          </div>
          <p className="text-yellow-700">
            الموقع لا يطلب منك أي دفع أو أي وسيلة دفع أخرى. جميع المدفوعات تتم مع الشركة مباشرة.
          </p>
        </CardContent>
      </Card>

      {/* Incomplete Fields Indicator */}
      {getIncompleteFields().length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-semibold text-red-800 mb-2">يجب إكمال الحقول التالية قبل التأكيد:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {getIncompleteFields().map((field, index) => (
                  <Badge key={index} variant="outline" className="border-red-300 text-red-700 bg-white">
                    {field}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-red-600 mt-2">
                يرجى العودة للمراحل السابقة لإكمال هذه البيانات
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Verification */}
      {!isWhatsAppVerified && data.phoneNumber && getIncompleteFields().length === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <h4 className="font-semibold text-green-800 mb-3">التحقق من رقم الواتساب</h4>
            <p className="text-sm text-green-700 mb-4">
              يرجى التحقق من رقم الواتساب قبل تأكيد الحجز النهائي
            </p>
            <Button
              onClick={handleWhatsAppVerification}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              التحقق من الواتساب
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Button */}
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded"
        onClick={handleConfirm}
        disabled={isConfirming || getIncompleteFields().length > 0 || !isWhatsAppVerified}
      >
        {isConfirming ? 'جارٍ إرسال الحجز للشركة...' : 'تأكيد الحجز وإرسال للشركة'}
      </Button>

      {isWhatsAppVerified && (
        <div className="text-center text-green-600 text-sm">
          ✅ تم التحقق من رقم الواتساب بنجاح
        </div>
      )}
    </div>
  );
};
