
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// التحقق من وجود مفتاح API
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  referenceNumber: string;
  customerName: string;
  phoneNumber: string;
  arrivalDate: string;
  departureDate: string;
  arrivalAirport: string;
  departureAirport: string;
  selectedCities: any[];
  carType: string;
  totalCost: number;
  currency: string;
  adults: number;
  children: any[];
}

const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return 'غير محدد';
  
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  if (phoneNumber.startsWith('00')) {
    return '+' + phoneNumber.substring(2);
  }
  
  if (phoneNumber.startsWith('5')) {
    return '+966' + phoneNumber;
  }
  
  if (phoneNumber.startsWith('9')) {
    return '+995' + phoneNumber;
  }
  
  return '+995' + phoneNumber;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // التحقق من وجود مفتاح API
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const bookingData: BookingEmailRequest = await req.json();
    
    console.log('Received booking data for email:', bookingData.referenceNumber);

    const formattedPhone = formatPhoneNumber(bookingData.phoneNumber);
    
    // إنشاء محتوى الإيميل
    const citiesDetails = bookingData.selectedCities.map(city => {
      const totalTours = (city.tours || 0) + (city.mandatoryTours || 0);
      const roomDetails = city.roomSelections?.map((room: any) => {
        const roomTypeText = 
          room.roomType === 'single' ? 'مفردة' :
          room.roomType === 'single_v' ? 'مفردة مع إطلالة' :
          room.roomType === 'dbl_wv' ? 'مزدوجة بدون إطلالة' :
          room.roomType === 'dbl_v' ? 'مزدوجة مع إطلالة' :
          room.roomType === 'trbl_wv' ? 'ثلاثية بدون إطلالة' :
          room.roomType === 'trbl_v' ? 'ثلاثية مع إطلالة' : 'غير محدد';
        return `الغرفة ${room.roomNumber}: ${roomTypeText}`;
      }).join(', ') || 'غير محدد';
      
      return `
🏨 ${city.city} - ${city.hotel}
- ${city.nights} ليالي
- ${totalTours} جولات
- الغرف: ${roomDetails}`;
    }).join('\n');

    const emailContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حجز جديد - ${bookingData.referenceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #10b981; }
        .section-title { color: #059669; font-weight: bold; font-size: 18px; margin-bottom: 15px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #e5e5e5; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; }
        .cities-list { background-color: white; padding: 15px; border-radius: 6px; margin-top: 10px; }
        .city-item { margin-bottom: 15px; padding: 10px; border: 1px solid #e5e5e5; border-radius: 6px; }
        .total-cost { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; border-radius: 8px; font-size: 20px; font-weight: bold; }
        .reference { background-color: #fef3c7; color: #92400e; padding: 15px; text-align: center; border-radius: 8px; font-weight: bold; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 حجز جديد من موقع جورجيا</h1>
            <p>تم استلام حجز جديد من العميل</p>
        </div>
        
        <div class="content">
            <div class="reference">
                📋 رقم الحجز المرجعي: ${bookingData.referenceNumber}
            </div>
            
            <div class="section">
                <div class="section-title">👤 بيانات العميل</div>
                <div class="info-row">
                    <span class="label">الاسم:</span>
                    <span class="value">${bookingData.customerName}</span>
                </div>
                <div class="info-row">
                    <span class="label">رقم الهاتف:</span>
                    <span class="value">${formattedPhone}</span>
                </div>
                <div class="info-row">
                    <span class="label">عدد البالغين:</span>
                    <span class="value">${bookingData.adults}</span>
                </div>
                <div class="info-row">
                    <span class="label">عدد الأطفال:</span>
                    <span class="value">${bookingData.children.length}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">✈️ تفاصيل السفر</div>
                <div class="info-row">
                    <span class="label">تاريخ الوصول:</span>
                    <span class="value">${bookingData.arrivalDate}</span>
                </div>
                <div class="info-row">
                    <span class="label">تاريخ المغادرة:</span>
                    <span class="value">${bookingData.departureDate}</span>
                </div>
                <div class="info-row">
                    <span class="label">مطار الوصول:</span>
                    <span class="value">${bookingData.arrivalAirport}</span>
                </div>
                <div class="info-row">
                    <span class="label">مطار المغادرة:</span>
                    <span class="value">${bookingData.departureAirport}</span>
                </div>
                <div class="info-row">
                    <span class="label">نوع السيارة:</span>
                    <span class="value">${bookingData.carType}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🏨 المدن والفنادق</div>
                <div class="cities-list">
                    ${bookingData.selectedCities.map(city => {
                      const totalTours = (city.tours || 0) + (city.mandatoryTours || 0);
                      const roomDetails = city.roomSelections?.map((room: any) => {
                        const roomTypeText = 
                          room.roomType === 'single' ? 'مفردة' :
                          room.roomType === 'single_v' ? 'مفردة مع إطلالة' :
                          room.roomType === 'dbl_wv' ? 'مزدوجة بدون إطلالة' :
                          room.roomType === 'dbl_v' ? 'مزدوجة مع إطلالة' :
                          room.roomType === 'trbl_wv' ? 'ثلاثية بدون إطلالة' :
                          room.roomType === 'trbl_v' ? 'ثلاثية مع إطلالة' : 'غير محدد';
                        return `الغرفة ${room.roomNumber}: ${roomTypeText}`;
                      }).join(', ') || 'غير محدد';
                      
                      return `
                        <div class="city-item">
                            <h4 style="color: #059669; margin: 0 0 10px 0;">🏨 ${city.city} - ${city.hotel}</h4>
                            <p style="margin: 5px 0;"><strong>عدد الليالي:</strong> ${city.nights}</p>
                            <p style="margin: 5px 0;"><strong>الجولات:</strong> ${totalTours} جولة</p>
                            <p style="margin: 5px 0;"><strong>الغرف:</strong> ${roomDetails}</p>
                        </div>
                      `;
                    }).join('')}
                </div>
            </div>

            <div class="total-cost">
                💰 إجمالي التكلفة: ${bookingData.totalCost} ${bookingData.currency}
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // إرسال الإيميل
    const emailResponse = await resend.emails.send({
      from: "نظام الحجز <onboarding@resend.dev>",
      to: ["info@lwiat.com"], // تم تغيير الإيميل هنا
      subject: `حجز جديد - ${bookingData.referenceNumber} - ${bookingData.customerName}`,
      html: emailContent,
    });

    console.log("Booking email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال الإيميل بنجاح",
        emailId: emailResponse.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending booking email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
