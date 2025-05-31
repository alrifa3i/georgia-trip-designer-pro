
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { Shield, Phone, Heart, UserCheck, Camera, Flower, Info, Plus, Minus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OptionalServicesStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const OptionalServicesStep = ({ data, updateData, onValidationChange }: OptionalServicesStepProps) => {
  const totalPeopleForInsurance = data.adults + data.children.length;

  // حساب عدد الأيام
  const calculateDays = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      const diffTime = Math.abs(departure.getTime() - arrival.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 1;
  };

  const insuranceDays = calculateDays();
  const insurancePricePerPersonPerDay = 5; // 5$ للشخص الواحد في اليوم

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
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-bold text-blue-800">تأمين السفر</h3>
              <p className="text-sm text-blue-600">حماية شاملة طوال فترة الرحلة (5$ للشخص يومياً)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">عدد الأشخاص المؤمن عليهم</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.additionalServices.travelInsurance.persons || 0;
                    const newPersons = Math.max(0, current - 1);
                    console.log('Decreasing insurance persons to:', newPersons);
                    updateService('travelInsurance', 'persons', newPersons);
                    updateService('travelInsurance', 'enabled', newPersons > 0);
                  }}
                  disabled={(data.additionalServices.travelInsurance.persons || 0) <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold bg-white py-2 px-3 rounded border">
                  {data.additionalServices.travelInsurance.persons || 0}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.additionalServices.travelInsurance.persons || 0;
                    const newPersons = Math.min(totalPeopleForInsurance, current + 1);
                    console.log('Increasing insurance persons to:', newPersons);
                    updateService('travelInsurance', 'persons', newPersons);
                    updateService('travelInsurance', 'enabled', newPersons > 0);
                  }}
                  disabled={(data.additionalServices.travelInsurance.persons || 0) >= totalPeopleForInsurance}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                الحد الأقصى: {totalPeopleForInsurance} أشخاص (إجمالي المسافرين)
              </p>
              {(data.additionalServices.travelInsurance.persons || 0) > 0 && (
                <div className="mt-2 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    التكلفة الإجمالية: {(data.additionalServices.travelInsurance.persons || 0) * insuranceDays * insurancePricePerPersonPerDay}$ 
                    ({(data.additionalServices.travelInsurance.persons || 0)} أشخاص × {insuranceDays} أيام × {insurancePricePerPersonPerDay}$)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phone Lines */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-bold text-green-800">خطوط الاتصال</h3>
              <p className="text-sm text-green-600">خطوط هاتف محلية للتواصل المريح (اختياري)</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">عدد الخطوط المطلوبة</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = data.additionalServices.phoneLines.quantity || 0;
                  const newQuantity = Math.max(0, current - 1);
                  updateService('phoneLines', 'quantity', newQuantity);
                  updateService('phoneLines', 'enabled', newQuantity > 0);
                }}
                disabled={(data.additionalServices.phoneLines.quantity || 0) <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-semibold bg-white py-2 px-3 rounded border">
                {data.additionalServices.phoneLines.quantity || 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = data.additionalServices.phoneLines.quantity || 0;
                  const newQuantity = current + 1;
                  updateService('phoneLines', 'quantity', newQuantity);
                  updateService('phoneLines', 'enabled', newQuantity > 0);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* VIP Airport Reception */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-4">
            <UserCheck className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-bold text-yellow-800">الاستقبال من المطار VIP</h3>
              <p className="text-sm text-yellow-600">استقبال مميز من المطار مع مرافق شخصي (اختياري)</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">عدد الأشخاص</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = data.additionalServices.airportReception.persons || 0;
                  const newPersons = Math.max(0, current - 1);
                  updateService('airportReception', 'persons', newPersons);
                  updateService('airportReception', 'enabled', newPersons > 0);
                }}
                disabled={(data.additionalServices.airportReception.persons || 0) <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-semibold bg-white py-2 px-3 rounded border">
                {data.additionalServices.airportReception.persons || 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = data.additionalServices.airportReception.persons || 0;
                  const newPersons = current + 1;
                  updateService('airportReception', 'persons', newPersons);
                  updateService('airportReception', 'enabled', newPersons > 0);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Room Decoration */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-600" />
              <div>
                <h3 className="font-bold text-pink-800">تزيين الغرف (شهر العسل)</h3>
                <p className="text-sm text-pink-600">تزيين رومانسي خاص للأزواج الجدد (اختياري)</p>
                <div className="mt-2">
                  <Button
                    type="button"
                    variant={data.additionalServices.roomDecoration.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateService('roomDecoration', 'enabled', !data.additionalServices.roomDecoration.enabled)}
                  >
                    {data.additionalServices.roomDecoration.enabled ? 'مضاف' : 'إضافة'}
                  </Button>
                </div>
              </div>
            </div>
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
                <div className="mt-2">
                  <Button
                    type="button"
                    variant={data.additionalServices.flowerReception?.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      updateData({
                        additionalServices: {
                          ...data.additionalServices,
                          flowerReception: { enabled: !data.additionalServices.flowerReception?.enabled }
                        }
                      })
                    }
                  >
                    {data.additionalServices.flowerReception?.enabled ? 'مضاف' : 'إضافة'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Session */}
        <div className="p-6 border rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="font-bold text-indigo-800">جلسة تصوير (شهر العسل)</h3>
              <p className="text-sm text-indigo-600">جلسة تصوير احترافية لذكريات لا تُنسى (اختياري)</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">عدد الجلسات</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = data.additionalServices.photoSession?.quantity || 0;
                  const newQuantity = Math.max(0, current - 1);
                  updateData({
                    additionalServices: {
                      ...data.additionalServices,
                      photoSession: { 
                        enabled: newQuantity > 0,
                        quantity: newQuantity
                      }
                    }
                  });
                }}
                disabled={(data.additionalServices.photoSession?.quantity || 0) <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-semibold bg-white py-2 px-3 rounded border">
                {data.additionalServices.photoSession?.quantity || 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = data.additionalServices.photoSession?.quantity || 0;
                  const newQuantity = current + 1;
                  updateData({
                    additionalServices: {
                      ...data.additionalServices,
                      photoSession: { 
                        enabled: newQuantity > 0,
                        quantity: newQuantity
                      }
                    }
                  });
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
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
                <span>• تأمين السفر ({data.additionalServices.travelInsurance.persons || 0} أشخاص)</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
            {data.additionalServices.phoneLines.enabled && (
              <div className="flex justify-between">
                <span>• خطوط الاتصال ({data.additionalServices.phoneLines.quantity || 0} خط)</span>
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
                <span>• الاستقبال VIP ({data.additionalServices.airportReception.persons || 0} أشخاص)</span>
                <span className="text-green-600">✓</span>
              </div>
            )}
            {data.additionalServices.photoSession?.enabled && (
              <div className="flex justify-between">
                <span>• جلسة التصوير ({data.additionalServices.photoSession?.quantity || 0} جلسات)</span>
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
