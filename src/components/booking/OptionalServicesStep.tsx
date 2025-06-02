
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingData } from '@/types/booking';
import { additionalServicesData, airports } from '@/data/hotels';
import { Shield, Phone, Heart, UserCheck, Plus, Minus, Info, Flower } from 'lucide-react';

interface OptionalServicesStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const OptionalServicesStep = ({ data, updateData, onValidationChange }: OptionalServicesStepProps) => {
  const [localServices, setLocalServices] = useState(data.additionalServices);

  // Function to get incomplete fields
  const getIncompleteFields = () => {
    const incompleteFields = [];
    
    // هذه المرحلة اختيارية، لكن يمكن إضافة بعض التوجيهات
    if (!localServices.travelInsurance.enabled && 
        !localServices.phoneLines.enabled && 
        !localServices.roomDecoration.enabled && 
        !localServices.airportReception.enabled && 
        !localServices.photoSession.enabled && 
        !localServices.flowerReception.enabled) {
      incompleteFields.push('لم يتم اختيار أي خدمة إضافية (اختياري)');
    }
    
    return incompleteFields;
  };

  const isAirportTrip = airports.some(airport => airport.code === data.arrivalAirport);
  
  const hasDoubleRoom = data.roomTypes?.includes('dbl_v') || data.roomTypes?.includes('dbl_wv');
  
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

  // Always validate as true for optional services
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الخدمات الإضافية</h2>
        <p className="text-gray-600">اختر الخدمات الإضافية التي تريد إضافتها لرحلتك (اختياري)</p>
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
            <div className="flex items-center justify-between">
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
              <Button
                onClick={() => updateAdditionalServices('travelInsurance', { 
                  enabled: !data.additionalServices.travelInsurance.enabled,
                  persons: !data.additionalServices.travelInsurance.enabled ? data.adults : 0
                })}
                variant={data.additionalServices.travelInsurance.enabled ? "default" : "outline"}
                size="sm"
              >
                <Plus className="w-4 h-4 ml-1" />
                {data.additionalServices.travelInsurance.enabled ? "مضاف" : "إضافة"}
              </Button>
            </div>
            
            {data.additionalServices.travelInsurance.enabled && (
              <div className="flex items-center gap-4 mt-4 bg-blue-50 p-4 rounded-lg">
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
                  <span className="w-12 text-center font-semibold">{data.additionalServices.travelInsurance.persons}</span>
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
                  ({additionalServicesData.travelInsurance.pricePerPersonPerDay}$ للشخص يومياً × {getDuration()} أيام)
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
          <div className="flex items-center justify-between">
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
            <Button
              onClick={() => updateAdditionalServices('phoneLines', { 
                enabled: !data.additionalServices.phoneLines.enabled,
                quantity: !data.additionalServices.phoneLines.enabled ? 1 : 0
              })}
              variant={data.additionalServices.phoneLines.enabled ? "default" : "outline"}
              size="sm"
            >
              <Plus className="w-4 h-4 ml-1" />
              {data.additionalServices.phoneLines.enabled ? "مضاف" : "إضافة"}
            </Button>
          </div>
          
          {data.additionalServices.phoneLines.enabled && (
            <div className="flex items-center gap-4 mt-4 bg-green-50 p-4 rounded-lg">
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
                <span className="w-12 text-center font-semibold">{data.additionalServices.phoneLines.quantity}</span>
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
            <div className="flex items-center justify-between">
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
              <Button
                onClick={() => updateAdditionalServices('roomDecoration', { 
                  enabled: !data.additionalServices.roomDecoration.enabled 
                })}
                variant={data.additionalServices.roomDecoration.enabled ? "default" : "outline"}
                size="sm"
              >
                <Heart className="w-4 h-4 ml-1" />
                {data.additionalServices.roomDecoration.enabled ? "مضاف" : "إضافة"}
              </Button>
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
              خدمة الاستقبال من الطائرة VIP
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
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
              <Button
                onClick={() => updateAdditionalServices('airportReception', { 
                  enabled: !data.additionalServices.airportReception.enabled,
                  persons: !data.additionalServices.airportReception.enabled ? data.adults : 0
                })}
                variant={data.additionalServices.airportReception.enabled ? "default" : "outline"}
                size="sm"
              >
                <Plus className="w-4 h-4 ml-1" />
                {data.additionalServices.airportReception.enabled ? "مضاف" : "إضافة"}
              </Button>
            </div>
            
            {data.additionalServices.airportReception.enabled && (
              <div className="flex items-center gap-4 mt-4 bg-purple-50 p-4 rounded-lg">
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
                  <span className="w-12 text-center font-semibold">{data.additionalServices.airportReception.persons}</span>
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

      {/* Flower Reception */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flower className="w-5 h-5 text-rose-600" />
            الاستقبال بالورود
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="flowerReception"
                checked={data.additionalServices.flowerReception.enabled}
                onCheckedChange={(checked) => 
                  updateAdditionalServices('flowerReception', { enabled: checked })
                }
              />
              <Label htmlFor="flowerReception" className="text-sm cursor-pointer">
                استقبال رومانسي بالورود والهدايا التذكارية
              </Label>
            </div>
            <Button
              onClick={() => updateAdditionalServices('flowerReception', { 
                enabled: !data.additionalServices.flowerReception.enabled 
              })}
              variant={data.additionalServices.flowerReception.enabled ? "default" : "outline"}
              size="sm"
            >
              <Flower className="w-4 h-4 ml-1" />
              {data.additionalServices.flowerReception.enabled ? "مضاف" : "إضافة"}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            * خدمة خاصة للمناسبات الرومانسية والاحتفالات
          </p>
        </CardContent>
      </Card>

      {/* Photo Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            جلسة تصوير احترافية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="photoSession"
                checked={data.additionalServices.photoSession.enabled}
                onCheckedChange={(checked) => 
                  updateAdditionalServices('photoSession', { enabled: checked })
                }
              />
              <Label htmlFor="photoSession" className="text-sm cursor-pointer">
                جلسة تصوير احترافية في أجمل المواقع السياحية
              </Label>
            </div>
            <Button
              onClick={() => updateAdditionalServices('photoSession', { 
                enabled: !data.additionalServices.photoSession.enabled 
              })}
              variant={data.additionalServices.photoSession.enabled ? "default" : "outline"}
              size="sm"
            >
              <Plus className="w-4 h-4 ml-1" />
              {data.additionalServices.photoSession.enabled ? "مضاف" : "إضافة"}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            * تشمل 50 صورة محررة احترافياً ومصور متخصص
          </p>
        </CardContent>
      </Card>

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
          <li>• يمكن إضافة أو حذف أي خدمة حتى قبل السفر بـ 48 ساعة</li>
        </ul>
      </div>

      {/* Incomplete Fields Indicator */}
      {getIncompleteFields().length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-semibold text-blue-800 mb-2">معلومات هذه المرحلة:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {getIncompleteFields().map((field, index) => (
                  <Badge key={index} variant="outline" className="border-blue-300 text-blue-700 bg-white">
                    {field}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-blue-600 mt-2">
                هذه المرحلة اختيارية ويمكنك المتابعة للمرحلة التالية
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
