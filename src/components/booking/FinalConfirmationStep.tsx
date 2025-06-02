import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingData } from '@/types/booking';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface FinalConfirmationStepProps {
  data: BookingData;
  onConfirm: () => void;
}

export const FinalConfirmationStep = ({ data, onConfirm }: FinalConfirmationStepProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

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

  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate booking confirmation process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConfirming(false);
    onConfirm();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">التأكيد النهائي</h2>
        <p className="text-gray-600">مراجعة أخيرة لتفاصيل حجزك قبل التأكيد</p>
      </div>

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
              <div className="text-lg">{data.phoneNumber || 'غير محدد'}</div>
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
              <div className="text-sm font-semibold text-gray-600">المدن المختارة:</div>
              <div className="text-lg">
                {data.selectedCities.map((city) => city.city).join(', ') || 'غير محدد'}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600">نوع السيارة:</div>
              <div className="text-lg">{data.carType || 'غير محدد'}</div>
            </div>
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

      {/* Confirmation Button */}
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded"
        onClick={handleConfirm}
        disabled={isConfirming || getIncompleteFields().length > 0}
      >
        {isConfirming ? 'جارٍ التأكيد...' : 'تأكيد الحجز'}
      </Button>
    </div>
  );
};
