
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { WhatsAppVerification } from './WhatsAppVerification';
import { generateBookingReference } from '@/utils/phoneVerification';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode.react';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  Car, 
  DollarSign,
  Phone,
  MessageCircle,
  Copy,
  Save,
  Download,
  Printer
} from 'lucide-react';

interface FinalConfirmationStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const FinalConfirmationStep = ({ data, updateData }: FinalConfirmationStepProps) => {
  const [showWhatsAppVerification, setShowWhatsAppVerification] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmitBooking = () => {
    if (data.phoneNumber) {
      // إنشاء رقم مرجعي
      const reference = generateBookingReference(data.totalCost || 0);
      setBookingReference(reference);
      updateData({ referenceNumber: reference });
      setShowWhatsAppVerification(true);
    } else {
      alert('الرجاء إدخال رقم الهاتف أولاً في المرحلة الأولى');
    }
  };

  const saveBookingToDatabase = async () => {
    setIsSaving(true);
    try {
      const bookingToSave = {
        reference_number: bookingReference,
        customer_name: data.customerName,
        phone_number: data.phoneNumber,
        adults: data.adults,
        children: JSON.stringify(data.children),
        arrival_date: data.arrivalDate,
        departure_date: data.departureDate,
        arrival_airport: data.arrivalAirport,
        departure_airport: data.departureAirport,
        rooms: data.rooms,
        budget: data.budget || 0,
        currency: data.currency,
        car_type: data.carType,
        room_types: JSON.stringify(data.roomTypes || []),
        selected_cities: JSON.stringify(data.selectedCities),
        total_cost: data.totalCost || 0,
        additional_services: JSON.stringify(data.additionalServices),
        status: 'confirmed'
      };

      const { data: savedBooking, error } = await supabase
        .from('bookings')
        .insert(bookingToSave)
        .select()
        .single();

      if (error) {
        console.error('Error saving booking:', error);
        throw error;
      }

      console.log('Booking saved successfully:', savedBooking);
      return savedBooking;
    } catch (error) {
      console.error('Failed to save booking:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      // حفظ الحجز في قاعدة البيانات
      await saveBookingToDatabase();
      
      setShowWhatsAppVerification(false);
      setIsVerificationComplete(true);
      
      console.log('Booking verified and saved:', data);
    } catch (error) {
      alert('حدث خطأ أثناء حفظ الحجز. الرجاء المحاولة مرة أخرى.');
    }
  };

  const copyReferenceNumber = () => {
    navigator.clipboard.writeText(bookingReference);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateBookingDetails = () => {
    const details = {
      referenceNumber: bookingReference,
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      adults: data.adults,
      children: data.children.length,
      arrivalDate: data.arrivalDate,
      departureDate: data.departureDate,
      arrivalAirport: data.arrivalAirport,
      departureAirport: data.departureAirport,
      cities: data.selectedCities.map(city => ({
        name: city.city,
        hotel: city.hotel,
        nights: city.nights,
        tours: city.tours + (city.mandatoryTours || 0)
      })),
      carType: data.carType,
      totalCost: Math.round(data.totalCost || 0)
    };

    return encodeURIComponent(JSON.stringify(details));
  };

  const sendWhatsAppBookingDetails = () => {
    const message = `
🌟 تأكيد حجز رحلة جورجيا 🌟

📋 رقم الحجز: ${bookingReference}
👤 اسم العميل: ${data.customerName}
📱 رقم الهاتف: ${data.phoneNumber}

👥 تفاصيل المسافرين:
• البالغين: ${data.adults}
• الأطفال: ${data.children.length}

📅 تواريخ السفر:
• الوصول: ${data.arrivalDate}
• المغادرة: ${data.departureDate}

✈️ المطارات:
• مطار الوصول: ${data.arrivalAirport}
• مطار المغادرة: ${data.departureAirport}

🏨 المدن والفنادق:
${data.selectedCities.map((city, index) => 
  `${index + 1}. ${city.city} - ${city.hotel} (${city.nights} ليالي)`
).join('\n')}

🚗 نوع السيارة: ${data.carType}

💰 إجمالي التكلفة: $${Math.round(data.totalCost || 0)} USD

📞 للاستفسارات والتأكيد النهائي، يرجى التواصل معنا.

شكراً لاختياركم خدماتنا! 🙏
    `;

    const phoneNumber = data.phoneNumber?.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showWhatsAppVerification) {
    return (
      <div className="space-y-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-blue-800">رقم الحجز المرجعي</h3>
                <p className="text-2xl font-bold text-blue-600">{bookingReference}</p>
              </div>
              <Button
                onClick={copyReferenceNumber}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                نسخ
              </Button>
            </div>
            <p className="text-blue-700 text-sm">
              احتفظ برقم الحجز هذا للمراجع المستقبلية
            </p>
          </CardContent>
        </Card>

        <WhatsAppVerification
          phoneNumber={data.phoneNumber || ''}
          onVerificationSuccess={handleVerificationSuccess}
          onCancel={() => setShowWhatsAppVerification(false)}
        />
      </div>
    );
  }

  if (isVerificationComplete) {
    return (
      <div className="space-y-6 print-section">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800">تم تأكيد الحجز بنجاح!</h2>
        </div>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-green-800">رقم الحجز:</span>
                  <span className="text-lg font-bold text-green-600">{bookingReference}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 text-sm">تم حفظ الحجز في النظام بنجاح</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <QRCode value={generateBookingDetails()} size={100} />
                <span className="text-xs text-gray-600">QR كود الحجز</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Summary for Print */}
        <Card className="print-visible">
          <CardHeader>
            <CardTitle>تفاصيل الحجز الكاملة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <strong>معلومات العميل:</strong>
                <p>الاسم: {data.customerName}</p>
                <p>الهاتف: {data.phoneNumber}</p>
                <p>البالغين: {data.adults}</p>
                <p>الأطفال: {data.children.length}</p>
              </div>
              <div>
                <strong>تفاصيل السفر:</strong>
                <p>الوصول: {data.arrivalDate}</p>
                <p>المغادرة: {data.departureDate}</p>
                <p>مطار الوصول: {data.arrivalAirport}</p>
                <p>مطار المغادرة: {data.departureAirport}</p>
              </div>
            </div>
            
            <div>
              <strong>المدن والفنادق:</strong>
              {data.selectedCities.map((city, index) => (
                <div key={index} className="ml-4 mb-2">
                  <p>{index + 1}. {city.city} - {city.hotel}</p>
                  <p className="text-sm text-gray-600">
                    {city.nights} ليالي، {(city.tours || 0) + (city.mandatoryTours || 0)} جولات
                  </p>
                </div>
              ))}
            </div>
            
            <div>
              <strong>نوع السيارة:</strong> {data.carType}
            </div>
            
            <div className="text-lg font-bold border-t pt-2">
              <strong>إجمالي التكلفة: ${Math.round(data.totalCost || 0)} USD</strong>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center print-hidden">
          <Button
            onClick={copyReferenceNumber}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            نسخ رقم الحجز
          </Button>
          
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            طباعة التفاصيل
          </Button>
          
          <Button
            onClick={sendWhatsAppBookingDetails}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            تأكيد الحجز عبر الواتساب
          </Button>
        </div>

        <Card className="bg-blue-50 border-blue-200 print-hidden">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-bold text-blue-800 mb-2">الخطوات التالية</h3>
              <p className="text-blue-700 text-sm mb-4">
                تم إرسال تفاصيل الحجز إلى رقم الواتساب الخاص بك.
                سيتم التواصل معك من قبل فريق خدمة العملاء خلال 24 ساعة لتأكيد الحجز نهائياً.
              </p>
              <p className="text-blue-600 text-xs">
                * الدفع سيتم بالدولار الأمريكي نقداً عند الوصول إلى جورجيا
              </p>
            </div>
          </CardContent>
        </Card>

        <style jsx>{`
          @media print {
            .print-hidden {
              display: none !important;
            }
            .print-visible {
              display: block !important;
            }
            .print-section {
              margin: 0;
              padding: 20px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">التأكيد النهائي للحجز</h2>
        <p className="text-gray-600">مراجعة نهائية لتفاصيل رحلتك قبل التأكيد</p>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            معلومات العميل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">الاسم: </span>
              <span className="font-medium">{data.customerName}</span>
            </div>
            <div>
              <span className="text-gray-600">رقم الهاتف: </span>
              <span className="font-medium">{data.phoneNumber || 'غير محدد'}</span>
            </div>
            <div>
              <span className="text-gray-600">عدد البالغين: </span>
              <span className="font-medium">{data.adults}</span>
            </div>
            <div>
              <span className="text-gray-600">عدد الأطفال: </span>
              <span className="font-medium">{data.children.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            تفاصيل الرحلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">تاريخ الوصول: </span>
              <span className="font-medium">{data.arrivalDate}</span>
            </div>
            <div>
              <span className="text-gray-600">تاريخ المغادرة: </span>
              <span className="font-medium">{data.departureDate}</span>
            </div>
            <div>
              <span className="text-gray-600">مطار الوصول: </span>
              <span className="font-medium">{data.arrivalAirport}</span>
            </div>
            <div>
              <span className="text-gray-600">مطار المغادرة: </span>
              <span className="font-medium">{data.departureAirport}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cities and Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            المدن والفنادق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.selectedCities.map((city, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{city.city}</span>
                  <span className="text-sm text-gray-600">{city.nights} ليلة</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>الفندق: {city.hotel || 'غير محدد'}</div>
                  <div>الجولات: {(city.tours || 0) + (city.mandatoryTours || 0)} جولة</div>
                  <div>عدد الغرف: {city.roomSelections?.length || 0}</div>
                  {city.roomSelections && (
                    <div className="mt-1">
                      الغرف: {city.roomSelections.map((room, roomIndex) => 
                        `الغرفة ${room.roomNumber}: ${
                          room.roomType === 'single' ? 'مفردة' :
                          room.roomType === 'single_v' ? 'مفردة مع إطلالة' :
                          room.roomType === 'dbl_wv' ? 'مزدوجة بدون إطلالة' :
                          room.roomType === 'dbl_v' ? 'مزدوجة مع إطلالة' :
                          room.roomType === 'trbl_wv' ? 'ثلاثية بدون إطلالة' :
                          room.roomType === 'trbl_v' ? 'ثلاثية مع إطلالة' :
                          'غير محدد'
                        }`
                      ).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            وسائل النقل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <span className="text-gray-600">نوع السيارة: </span>
            <span className="font-medium">{data.carType || 'غير محدد'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            ملخص التكلفة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${Math.round(data.totalCost || 0)} USD
            </div>
            <p className="text-gray-600">التكلفة الإجمالية للرحلة</p>
            <p className="text-sm text-gray-500 mt-2">
              * الدفع نقداً بالدولار الأمريكي عند الوصول إلى جورجيا
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Button */}
      <div className="text-center">
        <Button
          onClick={handleSubmitBooking}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          disabled={!data.phoneNumber || isSaving}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          {isSaving ? 'جاري الحفظ...' : 'تأكيد الحجز والتحقق من الواتساب'}
        </Button>
        
        {!data.phoneNumber && (
          <p className="text-red-600 text-sm mt-2">
            الرجاء إدخال رقم الهاتف في المرحلة الأولى لتأكيد الحجز
          </p>
        )}
      </div>
    </div>
  );
};
