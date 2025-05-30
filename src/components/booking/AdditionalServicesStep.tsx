import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingData } from '@/types/booking';
import { additionalServicesData, airports } from '@/data/hotels';
import { Shield, Phone, Heart, UserCheck, Plus, Minus, Info } from 'lucide-react';

interface AdditionalServicesStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const AdditionalServicesStep = ({ data, updateData }: AdditionalServicesStepProps) => {
  const isAirportTrip = airports.some(airport => airport.code === data.arrivalAirport);
  const hasDoubleRoom = data.roomTypes.includes('dbl_v') || data.roomTypes.includes('dbl_wv');
  
  const getDuration = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const updateAdditionalServices = (serviceType: keyof typeof data.additionalServices, updates: any) => {
    updateData({
      additionalServices: {
        ...data.additionalServices,
        [serviceType]: {
          ...data.additionalServices[serviceType],
          ...updates
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الخدمات الإضافية</h2>
        <p className="text-gray-600">اختر الخدمات الإضافية لتحسين تجربة رحلتك</p>
      </div>

      {/* Travel Insurance */}
      {isAirportTrip && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              تأمين السفر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="travelInsurance"
                checked={data.additionalServices.travelInsurance.enabled}
                onCheckedChange={(checked) => 
                  updateAdditionalServices('travelInsurance', { 
                    enabled: checked,
                    persons: checked ? data.adults : 0
                  })
                }
              />
              <Label htmlFor="travelInsurance" className="text-sm cursor-pointer">
                تأمين شامل ضد إلغاء الرحلة والطوارئ الطبية
              </Label>
            </div>
            
            {data.additionalServices.travelInsurance.enabled && (
              <div className="flex items-center gap-4 mt-4">
                <Label>عدد الأشخاص:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateAdditionalServices('travelInsurance', {
                      persons: Math.max(1, data.additionalServices.travelInsurance.persons - 1)
                    })}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{data.additionalServices.travelInsurance.persons}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateAdditionalServices('travelInsurance', {
                      persons: data.additionalServices.travelInsurance.persons + 1
                    })}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  ({additionalServicesData.travelInsurance.pricePerPerson}$ للشخص يومياً × {getDuration()} أيام)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phone Lines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            خطوط الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="phoneLines"
              checked={data.additionalServices.phoneLines.enabled}
              onCheckedChange={(checked) => 
                updateAdditionalServices('phoneLines', { 
                  enabled: checked,
                  quantity: checked ? 1 : 0
                })
              }
            />
            <Label htmlFor="phoneLines" className="text-sm cursor-pointer">
              خط اتصال مع إنترنت مفتوح لمدة 7 أيام
            </Label>
          </div>
          
          {data.additionalServices.phoneLines.enabled && (
            <div className="flex items-center gap-4 mt-4">
              <Label>عدد الخطوط:</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateAdditionalServices('phoneLines', {
                    quantity: Math.max(1, data.additionalServices.phoneLines.quantity - 1)
                  })}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center">{data.additionalServices.phoneLines.quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateAdditionalServices('phoneLines', {
                    quantity: data.additionalServices.phoneLines.quantity + 1
                  })}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                ({additionalServicesData.phoneLines.pricePerLine}$ للخط الواحد)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Decoration */}
      {hasDoubleRoom && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              تزيين الغرف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="roomDecoration"
                checked={data.additionalServices.roomDecoration.enabled}
                onCheckedChange={(checked) => 
                  updateAdditionalServices('roomDecoration', { enabled: checked })
                }
              />
              <Label htmlFor="roomDecoration" className="text-sm cursor-pointer">
                تزيين رومانسي للغرفة مع ورود وشموع
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              * متاح فقط للغرف المزدوجة - مناسب للمناسبات الخاصة
            </p>
          </CardContent>
        </Card>
      )}

      {/* Airport Reception */}
      {isAirportTrip && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              خدمة الاستقبال من الطائرة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="airportReception"
                checked={data.additionalServices.airportReception.enabled}
                onCheckedChange={(checked) => 
                  updateAdditionalServices('airportReception', { 
                    enabled: checked,
                    persons: checked ? data.adults : 0
                  })
                }
              />
              <Label htmlFor="airportReception" className="text-sm cursor-pointer">
                استقبال VIP مع التخليص الفوري عبر ممر خاص
              </Label>
            </div>
            
            {data.additionalServices.airportReception.enabled && (
              <div className="flex items-center gap-4 mt-4">
                <Label>عدد الأشخاص:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateAdditionalServices('airportReception', {
                      persons: Math.max(1, data.additionalServices.airportReception.persons - 1)
                    })}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{data.additionalServices.airportReception.persons}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateAdditionalServices('airportReception', {
                      persons: data.additionalServices.airportReception.persons + 1
                    })}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  ({additionalServicesData.airportReception.pricePerPerson}$ للشخص)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Notice */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-800">معلومات مهمة</span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• جميع الخدمات الإضافية اختيارية ويمكن إلغاؤها في أي وقت</li>
          <li>• أسعار الخدمات شاملة للضرائب والرسوم</li>
          <li>• يتم تفعيل الخدمات عند الوصول إلى جورجيا</li>
        </ul>
      </div>
    </div>
  );
};
