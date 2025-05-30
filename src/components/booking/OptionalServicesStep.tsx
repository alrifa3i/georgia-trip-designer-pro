
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingData } from '@/types/booking';
import { Shield, Phone, Heart, Plane, Camera, Plus, Minus, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OptionalServicesStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const OptionalServicesStep = ({ data, updateData }: OptionalServicesStepProps) => {
  const updateService = (service: keyof typeof data.additionalServices, field: string, value: any) => {
    updateData({
      additionalServices: {
        ...data.additionalServices,
        [service]: {
          ...data.additionalServices[service],
          [field]: value
        }
      }
    });
  };

  const totalPeople = data.adults + data.children.filter(child => child.age > 6).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الخدمات الإضافية</h2>
        <p className="text-gray-600">خدمات اختيارية لتحسين تجربة سفرك (يمكن تخطي هذه الخطوة)</p>
      </div>

      {/* Optional Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          جميع الخدمات في هذه الصفحة اختيارية ويمكن تخطيها والانتقال للخطوة التالية مباشرة
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Travel Insurance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              تأمين السفر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>تفعيل التأمين</Label>
              <Switch
                checked={data.additionalServices.travelInsurance.enabled}
                onCheckedChange={(checked) => updateService('travelInsurance', 'enabled', checked)}
              />
            </div>
            {data.additionalServices.travelInsurance.enabled && (
              <div className="space-y-2">
                <Label>عدد الأشخاص المؤمن عليهم</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateService('travelInsurance', 'persons', Math.max(0, data.additionalServices.travelInsurance.persons - 1))}
                    disabled={data.additionalServices.travelInsurance.persons <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{data.additionalServices.travelInsurance.persons}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateService('travelInsurance', 'persons', data.additionalServices.travelInsurance.persons + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">5$ لكل شخص لكل يوم</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phone Lines */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              خطوط اتصال محلية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>تفعيل الخطوط</Label>
              <Switch
                checked={data.additionalServices.phoneLines.enabled}
                onCheckedChange={(checked) => updateService('phoneLines', 'enabled', checked)}
              />
            </div>
            {data.additionalServices.phoneLines.enabled && (
              <div className="space-y-2">
                <Label>عدد الخطوط</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateService('phoneLines', 'quantity', Math.max(0, data.additionalServices.phoneLines.quantity - 1))}
                    disabled={data.additionalServices.phoneLines.quantity <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{data.additionalServices.phoneLines.quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateService('phoneLines', 'quantity', data.additionalServices.phoneLines.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">15$ لكل خط</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Room Decoration */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              تزيين الغرف (شهر العسل)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>تفعيل التزيين</Label>
              <Switch
                checked={data.additionalServices.roomDecoration.enabled}
                onCheckedChange={(checked) => updateService('roomDecoration', 'enabled', checked)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">50$ (ثابت)</p>
          </CardContent>
        </Card>

        {/* Airport Reception */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-purple-600" />
              استقبال VIP من المطار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>تفعيل الاستقبال</Label>
              <Switch
                checked={data.additionalServices.airportReception.enabled}
                onCheckedChange={(checked) => updateService('airportReception', 'enabled', checked)}
              />
            </div>
            {data.additionalServices.airportReception.enabled && (
              <div className="space-y-2">
                <Label>عدد الأشخاص</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateService('airportReception', 'persons', Math.max(0, data.additionalServices.airportReception.persons - 1))}
                    disabled={data.additionalServices.airportReception.persons <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{data.additionalServices.airportReception.persons}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateService('airportReception', 'persons', data.additionalServices.airportReception.persons + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">280$ لكل شخص</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Session */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-600" />
              جلسة تصوير (شهر العسل)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>تفعيل جلسة التصوير</Label>
              <Switch
                checked={data.additionalServices.photoSession?.enabled || false}
                onCheckedChange={(checked) => updateService('photoSession', 'enabled', checked)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">150$ (جلسة واحدة)</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">ملخص الخدمات المختارة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {data.additionalServices.travelInsurance.enabled && (
              <div className="flex justify-between">
                <span>تأمين السفر ({data.additionalServices.travelInsurance.persons} أشخاص)</span>
                <span className="font-medium">تم التفعيل</span>
              </div>
            )}
            {data.additionalServices.phoneLines.enabled && (
              <div className="flex justify-between">
                <span>خطوط اتصال ({data.additionalServices.phoneLines.quantity} خطوط)</span>
                <span className="font-medium">تم التفعيل</span>
              </div>
            )}
            {data.additionalServices.roomDecoration.enabled && (
              <div className="flex justify-between">
                <span>تزيين الغرف</span>
                <span className="font-medium">تم التفعيل</span>
              </div>
            )}
            {data.additionalServices.airportReception.enabled && (
              <div className="flex justify-between">
                <span>استقبال VIP ({data.additionalServices.airportReception.persons} أشخاص)</span>
                <span className="font-medium">تم التفعيل</span>
              </div>
            )}
            {data.additionalServices.photoSession?.enabled && (
              <div className="flex justify-between">
                <span>جلسة تصوير</span>
                <span className="font-medium">تم التفعيل</span>
              </div>
            )}
            {!data.additionalServices.travelInsurance.enabled && 
             !data.additionalServices.phoneLines.enabled && 
             !data.additionalServices.roomDecoration.enabled && 
             !data.additionalServices.airportReception.enabled && 
             !data.additionalServices.photoSession?.enabled && (
              <p className="text-gray-600">لم يتم اختيار أي خدمات إضافية</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
