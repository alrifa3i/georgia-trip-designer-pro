
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { Shield, Phone, Heart, UserCheck, Camera, Flower, Info } from 'lucide-react';
import { Plus, Minus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OptionalServicesStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const OptionalServicesStep = ({ data, updateData, onValidationChange }: OptionalServicesStepProps) => {
  const totalPeopleForInsurance = data.adults + data.children.length;

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  const updateService = (service: string, field: string, value: any) => {
    console.log(`Updating service ${service}, field ${field}, value:`, value);
    updateData({
      additionalServices: {
        ...data.additionalServices,
        [service]: {
          ...data.additionalServices[service as keyof typeof data.additionalServices],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الخدمات الإضافية</h2>
        <p className="text-gray-600">خدمات اختيارية لجعل رحلتك أكثر راحة ومتعة</p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>ملاحظة:</strong> جميع الخدمات في هذه المرحلة اختيارية تماماً. يمكنك تجاوز هذه المرحلة دون اختيار أي خدمة إضافية والضغط على زر "التالي" مباشرة.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Travel Insurance */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-bold text-blue-800">تأمين السفر</h3>
                <p className="text-sm text-blue-600">حماية شاملة طوال فترة الرحلة (اختياري)</p>
              </div>
            </div>
            <Switch
              checked={data.additionalServices.travelInsurance.enabled || false}
              onCheckedChange={(checked) => {
                console.log('Travel insurance toggle:', checked);
                updateService('travelInsurance', 'enabled', checked);
                if (checked) {
                  updateService('travelInsurance', 'persons', 1);
                } else {
                  updateService('travelInsurance', 'persons', 0);
                }
              }}
            />
          </div>

          {data.additionalServices.travelInsurance.enabled && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">عدد الأشخاص المؤمن عليهم</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = data.additionalServices.travelInsurance.persons || 1;
                      const newPersons = Math.max(1, current - 1);
                      console.log('Decreasing insurance persons to:', newPersons);
                      updateService('travelInsurance', 'persons', newPersons);
                    }}
                    disabled={(data.additionalServices.travelInsurance.persons || 1) <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold bg-white py-2 px-3 rounded border">
                    {data.additionalServices.travelInsurance.persons || 1}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = data.additionalServices.travelInsurance.persons || 1;
                      const newPersons = Math.min(totalPeopleForInsurance, current + 1);
                      console.log('Increasing insurance persons to:', newPersons);
                      updateService('travelInsurance', 'persons', newPersons);
                    }}
                    disabled={(data.additionalServices.travelInsurance.persons || 1) >= totalPeopleForInsurance}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  الحد الأقصى: {totalPeopleForInsurance} أشخاص (إجمالي المسافرين)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Phone Lines */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold text-green-800">خطوط الاتصال</h3>
                <p className="text-sm text-green-600">خطوط هاتف محلية للتواصل المريح (اختياري)</p>
              </div>
            </div>
            <Switch
              checked={data.additionalServices.phoneLines.enabled || false}
              onCheckedChange={(checked) => {
                updateService('phoneLines', 'enabled', checked);
                if (checked && (data.additionalServices.phoneLines.quantity || 0) === 0) {
                  updateService('phoneLines', 'quantity', 1);
                } else if (!checked) {
                  updateService('phoneLines', 'quantity', 0);
                }
              }}
            />
          </div>

          {data.additionalServices.phoneLines.enabled && (
            <div>
              <Label className="text-sm font-medium">عدد الخطوط المطلوبة</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.additionalServices.phoneLines.quantity || 1;
                    updateService('phoneLines', 'quantity', Math.max(1, current - 1));
                  }}
                  disabled={(data.additionalServices.phoneLines.quantity || 1) <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold bg-white py-2 px-3 rounded border">
                  {data.additionalServices.phoneLines.quantity || 1}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.additionalServices.phoneLines.quantity || 1;
                    updateService('phoneLines', 'quantity', current + 1);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Room Decoration */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-600" />
              <div>
                <h3 className="font-bold text-pink-800">تزيين الغرف (شهر العسل)</h3>
                <p className="text-sm text-pink-600">تزيين رومانسي خاص للأزواج الجدد (اختياري)</p>
              </div>
            </div>
            <Switch
              checked={data.additionalServices.roomDecoration.enabled || false}
              onCheckedChange={(checked) => updateService('roomDecoration', 'enabled', checked)}
            />
          </div>
        </div>

        {/* Flower Reception */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flower className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-bold text-purple-800">الاستقبال بالورود</h3>
                <p className="text-sm text-purple-600">استقبال خاص بباقة ورود جميلة (اختياري)</p>
              </div>
            </div>
            <Switch
              checked={data.additionalServices.flowerReception?.enabled || false}
              onCheckedChange={(checked) => 
                updateData({
                  additionalServices: {
                    ...data.additionalServices,
                    flowerReception: { enabled: checked }
                  }
                })
              }
            />
          </div>
        </div>

        {/* VIP Airport Reception */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="font-bold text-yellow-800">الاستقبال من المطار VIP</h3>
                <p className="text-sm text-yellow-600">استقبال مميز من المطار مع مرافق شخصي (اختياري)</p>
              </div>
            </div>
            <Switch
              checked={data.additionalServices.airportReception.enabled || false}
              onCheckedChange={(checked) => {
                updateService('airportReception', 'enabled', checked);
                if (checked && (data.additionalServices.airportReception.persons || 0) === 0) {
                  updateService('airportReception', 'persons', Math.min(data.adults, 1));
                } else if (!checked) {
                  updateService('airportReception', 'persons', 0);
                }
              }}
            />
          </div>

          {data.additionalServices.airportReception.enabled && (
            <div>
              <Label className="text-sm font-medium">عدد الأشخاص</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.additionalServices.airportReception.persons || 1;
                    updateService('airportReception', 'persons', Math.max(1, current - 1));
                  }}
                  disabled={(data.additionalServices.airportReception.persons || 1) <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold bg-white py-2 px-3 rounded border">
                  {data.additionalServices.airportReception.persons || 1}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.additionalServices.airportReception.persons || 1;
                    updateService('airportReception', 'persons', current + 1);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Photo Session */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="font-bold text-indigo-800">جلسة تصوير (شهر العسل)</h3>
                <p className="text-sm text-indigo-600">جلسة تصوير احترافية لذكريات لا تُنسى (اختياري)</p>
              </div>
            </div>
            <Switch
              checked={data.additionalServices.photoSession?.enabled || false}
              onCheckedChange={(checked) => 
                updateData({
                  additionalServices: {
                    ...data.additionalServices,
                    photoSession: { enabled: checked }
                  }
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Services Summary */}
      {Object.values(data.additionalServices).some(service => service.enabled) ? (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="font-bold text-gray-800 mb-4">ملخص الخدمات المختارة:</h3>
          <div className="space-y-2 text-sm">
            {data.additionalServices.travelInsurance.enabled && (
              <div className="flex justify-between">
                <span>• تأمين السفر ({data.additionalServices.travelInsurance.persons || 1} أشخاص)</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
            {data.additionalServices.phoneLines.enabled && (
              <div className="flex justify-between">
                <span>• خطوط الاتصال ({data.additionalServices.phoneLines.quantity || 1} خط)</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
            {data.additionalServices.roomDecoration.enabled && (
              <div className="flex justify-between">
                <span>• تزيين الغرف</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
            {data.additionalServices.flowerReception?.enabled && (
              <div className="flex justify-between">
                <span>• الاستقبال بالورود</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
            {data.additionalServices.airportReception.enabled && (
              <div className="flex justify-between">
                <span>• الاستقبال VIP ({data.additionalServices.airportReception.persons || 1} أشخاص)</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
            {data.additionalServices.photoSession?.enabled && (
              <div className="flex justify-between">
                <span>• جلسة التصوير</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <h3 className="font-medium text-green-800 mb-2">لم يتم اختيار خدمات إضافية</h3>
            <p className="text-sm text-green-600">يمكنك المتابعة إلى المرحلة التالية بالضغط على زر "التالي" أو اختيار خدمات إضافية حسب رغبتك</p>
          </div>
        </div>
      )}
    </div>
  );
};
