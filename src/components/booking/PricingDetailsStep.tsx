
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  DollarSign, 
  Calculator, 
  Car, 
  Hotel, 
  MapPin, 
  Users,
  Percent,
  Tag
} from 'lucide-react';
import { BookingData } from '@/types/booking';

interface PricingDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const PricingDetailsStep: React.FC<PricingDetailsStepProps> = ({
  data,
  updateData,
  onValidationChange
}) => {
  const [discountCode, setDiscountCode] = useState(data?.discountCoupon || '');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const { toast } = useToast();

  // تطبيق الخصم المحفوظ مسبقاً عند تحميل المكون
  useEffect(() => {
    if (data?.discountCoupon && data?.discountAmount && data.discountAmount > 0) {
      setDiscountCode(data.discountCoupon);
      setDiscountApplied(true);
      // حساب نسبة الخصم من المبلغ المحفوظ
      const percentage = (data.discountAmount / (data.totalCost || 0)) * 100;
      setDiscountPercentage(percentage);
    }
  }, [data?.discountCoupon, data?.discountAmount, data?.totalCost]);

  // تحديث حالة التحقق دائماً
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كود الخصم",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingCode(true);
    
    try {
      const { data: discountData, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !discountData) {
        toast({
          title: "كود خصم غير صالح",
          description: "الكود المدخل غير موجود أو غير فعال",
          variant: "destructive",
        });
        return;
      }

      // فحص انتهاء الصلاحية
      if (discountData.expires_at && new Date(discountData.expires_at) < new Date()) {
        toast({
          title: "كود منتهي الصلاحية",
          description: "كود الخصم المدخل منتهي الصلاحية",
          variant: "destructive",
        });
        return;
      }

      // فحص الحد الأقصى للاستخدام
      if (discountData.max_uses && discountData.current_uses >= discountData.max_uses) {
        toast({
          title: "كود مستنفد",
          description: "تم استنفاد عدد مرات استخدام هذا الكود",
          variant: "destructive",
        });
        return;
      }

      // تطبيق الخصم
      setDiscountPercentage(discountData.discount_percentage);
      setDiscountApplied(true);
      
      // تحديث البيانات
      const discountAmount = (data?.totalCost || 0) * (discountData.discount_percentage / 100);
      updateData({
        discountCoupon: discountCode.toUpperCase(),
        discountAmount: discountAmount
      });
      
      toast({
        title: "تم تطبيق الخصم",
        description: `تم تطبيق خصم ${discountData.discount_percentage}% بنجاح`,
      });

    } catch (error) {
      console.error('Error validating discount code:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التحقق من كود الخصم",
        variant: "destructive",
      });
    } finally {
      setIsValidatingCode(false);
    }
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountPercentage(0);
    setDiscountApplied(false);
    
    updateData({
      discountCoupon: '',
      discountAmount: 0
    });
    
    toast({
      title: "تم إلغاء الخصم",
      description: "تم إلغاء كود الخصم",
    });
  };

  const calculateDiscountAmount = () => {
    if (!discountApplied || discountPercentage === 0) return 0;
    return (data?.totalCost || 0) * (discountPercentage / 100);
  };

  const calculateFinalTotal = () => {
    const baseTotal = data?.totalCost || 0;
    const discountAmount = calculateDiscountAmount();
    return baseTotal - discountAmount;
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${data?.currency || 'USD'}`;
  };

  if (!data) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <Calculator className="w-6 h-6" />
            تفاصيل الأسعار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* كود الخصم */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              كود الخصم
            </h3>
            
            {!discountApplied ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="discount-code">أدخل كود الخصم</Label>
                  <Input
                    id="discount-code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="أدخل كود الخصم"
                    disabled={isValidatingCode}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={validateDiscountCode}
                    disabled={isValidatingCode || !discountCode.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isValidatingCode ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      'تطبيق'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">
                    كود الخصم: {discountCode} ({discountPercentage}% خصم)
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeDiscount}
                  className="text-red-600 hover:text-red-700"
                >
                  إلغاء
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* الإجمالي النهائي */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ملخص التكلفة</h3>
            
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              {/* عرض الخصم إذا كان مطبقاً */}
              {discountApplied && calculateDiscountAmount() > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>المجموع قبل الخصم:</span>
                    <span>{formatCurrency(data.totalCost || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>خصم ({discountPercentage}%):</span>
                    <span>-{formatCurrency(calculateDiscountAmount())}</span>
                  </div>
                  <Separator />
                </>
              )}
              
              {/* الإجمالي النهائي */}
              <div className="flex justify-between text-xl font-bold text-emerald-600">
                <span>الإجمالي النهائي:</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  <span>{formatCurrency(calculateFinalTotal())}</span>
                </div>
              </div>
            </div>

            {/* ملاحظة مهمة */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>ملاحظة:</strong> لا يوجد دفع عبر الموقع - الدفع فقط عند الوصول
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
