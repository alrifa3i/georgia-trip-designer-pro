
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  Calendar, 
  Users, 
  MapPin, 
  Hotel, 
  Car, 
  DollarSign,
  Phone,
  User,
  FileText,
  Upload,
  Trash2,
  Download
} from 'lucide-react';
import { BookingData } from '@/types/booking';

interface FinalConfirmationStepProps {
  bookingData: BookingData;
  onNext: () => void;
  onPrevious: () => void;
}

export const FinalConfirmationStep: React.FC<FinalConfirmationStepProps> = ({
  bookingData,
  onNext,
  onPrevious
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateReferenceNumber = () => {
    const prefix = 'TR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const calculateFinalCost = () => {
    const baseTotal = bookingData.totalCost || 0;
    const discountAmount = bookingData.discountAmount || 0;
    return baseTotal - discountAmount;
  };

  const handlePassportUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPassportFile(file);
      toast({
        title: "تم تحديد ملف الجواز",
        description: "سيتم رفع الملف عند تأكيد الحجز",
      });
    }
  };

  const handleTicketUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTicketFile(file);
      toast({
        title: "تم تحديد ملف التذكرة",
        description: "سيتم رفع الملف عند تأكيد الحجز",
      });
    }
  };

  const removePassportFile = () => {
    setPassportFile(null);
  };

  const removeTicketFile = () => {
    setTicketFile(null);
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    
    try {
      const referenceNumber = generateReferenceNumber();
      
      // إعداد بيانات الحجز للحفظ
      const bookingDataToSave = {
        reference_number: referenceNumber,
        customer_name: bookingData.customerName,
        phone_number: bookingData.phoneNumber,
        adults: bookingData.adults,
        children: bookingData.children || [],
        arrival_date: bookingData.arrivalDate,
        departure_date: bookingData.departureDate,
        arrival_airport: bookingData.arrivalAirport,
        departure_airport: bookingData.departureAirport,
        rooms: bookingData.rooms,
        budget: bookingData.budget,
        currency: bookingData.currency || 'USD',
        car_type: bookingData.carType,
        room_types: bookingData.roomTypes || [],
        selected_cities: bookingData.selectedCities || [],
        total_cost: calculateFinalCost(),
        additional_services: bookingData.additionalServices || {},
        discount_amount: bookingData.discountAmount || 0,
        discount_coupon: bookingData.discountCoupon || null,
        status: 'pending'
      };

      // حفظ الحجز في قاعدة البيانات
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingDataToSave)
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: "تم تأكيد الحجز بنجاح! 🎉",
        description: `رقم الحجز المرجعي: ${referenceNumber}`,
      });

      // الانتقال للخطوة التالية
      onNext();
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "خطأ في تأكيد الحجز",
        description: "حدث خطأ أثناء تأكيد الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="w-6 h-6" />
            التأكيد النهائي للحجز
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* معلومات العميل */}
          <div>
            <h3 className="text-lg font-semibold mb-3">معلومات العميل</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{bookingData.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{bookingData.phoneNumber}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* تفاصيل السفر */}
          <div>
            <h3 className="text-lg font-semibold mb-3">تفاصيل السفر</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">الوصول</div>
                  <div className="text-sm text-gray-600">{formatDate(bookingData.arrivalDate)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">المغادرة</div>
                  <div className="text-sm text-gray-600">{formatDate(bookingData.departureDate)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{bookingData.adults} بالغ</span>
                {bookingData.children && bookingData.children.length > 0 && (
                  <span>+ {bookingData.children.length} أطفال</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-gray-500" />
                <span>{bookingData.rooms} غرفة</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* المدن والفنادق */}
          <div>
            <h3 className="text-lg font-semibold mb-3">المدن والفنادق المختارة</h3>
            <div className="space-y-3">
              {bookingData.selectedCities?.map((city, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">{city.name}</span>
                    <Badge variant="outline">{city.nights} ليلة</Badge>
                  </div>
                  {city.selectedHotelId && (
                    <div className="text-sm text-gray-600 mr-6">
                      <Hotel className="w-3 h-3 inline mr-1" />
                      فندق محدد في {city.name}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* النقل */}
          {bookingData.carType && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">النقل</h3>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span>{bookingData.carType}</span>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* التكلفة الإجمالية */}
          <div>
            <h3 className="text-lg font-semibold mb-3">التكلفة الإجمالية</h3>
            <div className="space-y-2">
              {bookingData.discountAmount && bookingData.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>المجموع قبل الخصم:</span>
                  <span>{bookingData.totalCost?.toFixed(2)} {bookingData.currency}</span>
                </div>
              )}
              {bookingData.discountAmount && bookingData.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>خصم ({bookingData.discountCoupon}):</span>
                  <span>-{bookingData.discountAmount.toFixed(2)} {bookingData.currency}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-emerald-600">
                <span>المجموع النهائي:</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  <span>{calculateFinalCost().toFixed(2)} {bookingData.currency}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* رفع الملفات */}
          <div>
            <h3 className="text-lg font-semibold mb-3">رفع الوثائق (اختياري)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* رفع الجواز */}
              <div className="space-y-2">
                <Label>صورة الجواز</Label>
                {!passportFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePassportUpload}
                      className="hidden"
                      id="passport-upload"
                    />
                    <label htmlFor="passport-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">انقر لرفع صورة الجواز</p>
                    </label>
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{passportFile.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removePassportFile}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* رفع التذكرة */}
              <div className="space-y-2">
                <Label>صورة التذكرة</Label>
                {!ticketFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleTicketUpload}
                      className="hidden"
                      id="ticket-upload"
                    />
                    <label htmlFor="ticket-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">انقر لرفع صورة التذكرة</p>
                    </label>
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{ticketFile.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeTicketFile}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* أزرار التنقل */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              السابق
            </Button>
            <Button 
              onClick={submitBooking}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري التأكيد...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  تأكيد الحجز
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
