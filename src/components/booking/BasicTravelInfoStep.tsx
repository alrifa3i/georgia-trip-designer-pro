
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { airports } from '@/data/hotels';
import { Plus, Minus, User, Users, Calendar, Plane, Shield, CheckCircle } from 'lucide-react';

interface BasicTravelInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const BasicTravelInfoStep = ({ data, updateData }: BasicTravelInfoStepProps) => {
  const [dateError, setDateError] = useState('');

  const addChild = () => {
    updateData({
      children: [...data.children, { age: 0 }]
    });
  };

  const removeChild = (index: number) => {
    const newChildren = data.children.filter((_, i) => i !== index);
    updateData({ children: newChildren });
  };

  const updateChildAge = (index: number, age: number) => {
    const newChildren = [...data.children];
    newChildren[index] = { age };
    updateData({ children: newChildren });
  };

  const validateDateDuration = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      const diffInDays = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays < 3) {
        setDateError('الحد الأدنى للإقامة 3 أيام لضمان أفضل تجربة');
        return false;
      } else {
        setDateError('');
        return true;
      }
    }
    return true;
  };

  useEffect(() => {
    validateDateDuration();
  }, [data.arrivalDate, data.departureDate]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات السفر الأساسية</h2>
        <p className="text-gray-600">معلومات بسيطة لبدء تصميم رحلتك المثالية</p>
      </div>

      {/* Security Notice */}
      <div className="bg-emerald-50 p-6 rounded-xl border-2 border-emerald-200 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-emerald-800 text-lg">لا يوجد دفع عبر الموقع</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">الدفع فقط عند الوصول واستلام الغرفة</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">خصوصية معلوماتك مضمونة</span>
          </div>
        </div>
      </div>

      {/* Travel Dates and Airports */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="arrivalDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            تاريخ الوصول *
          </Label>
          <Input
            id="arrivalDate"
            type="date"
            value={data.arrivalDate}
            onChange={(e) => updateData({ arrivalDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Plane className="w-4 h-4" />
            مطار الوصول *
          </Label>
          <Select
            value={data.arrivalAirport}
            onValueChange={(value) => updateData({ arrivalAirport: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مطار الوصول" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport} value={airport}>
                  {airport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departureDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            تاريخ المغادرة *
          </Label>
          <Input
            id="departureDate"
            type="date"
            value={data.departureDate}
            onChange={(e) => updateData({ departureDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Plane className="w-4 h-4" />
            مطار المغادرة *
          </Label>
          <Select
            value={data.departureAirport}
            onValueChange={(value) => updateData({ departureAirport: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مطار المغادرة" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport} value={airport}>
                  {airport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Validation Alert */}
      {dateError && (
        <Alert variant="destructive">
          <Calendar className="h-4 w-4" />
          <AlertDescription>{dateError}</AlertDescription>
        </Alert>
      )}

      {/* People Count */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            عدد البالغين *
          </Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateData({ adults: Math.max(1, data.adults - 1) })}
              disabled={data.adults <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-semibold text-lg">{data.adults}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateData({ adults: data.adults + 1 })}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              الأطفال
            </Label>
            <Button type="button" onClick={addChild} variant="outline" size="sm">
              <Plus className="w-4 h-4 ml-2" />
              إضافة طفل
            </Button>
          </div>
        </div>
      </div>

      {/* Children Section */}
      {data.children.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">سياسة الأطفال:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• الأطفال أقل من 6 سنوات لا يحتاجون سرير منفصل</li>
              <li>• يُسمح بطفلين كحد أقصى (أقل من 6 سنوات) في الغرفة الواحدة</li>
            </ul>
          </div>
          
          {data.children.map((child, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Label>الطفل {index + 1} - العمر:</Label>
              <Select
                value={child.age.toString()}
                onValueChange={(value) => updateChildAge(index, parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 18 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {child.age <= 6 && (
                <span className="text-sm text-green-600 font-medium">
                  (لا يحتاج سرير منفصل)
                </span>
              )}
              {child.age > 6 && (
                <span className="text-sm text-orange-600 font-medium">
                  (سيتم اضافة سرير)
                </span>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeChild(index)}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Budget Notice */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
        <h3 className="font-bold text-purple-800 text-lg mb-2">الميزانية</h3>
        <p className="text-purple-700">سيتم حساب التكلفة الإجمالية تلقائياً بناءً على اختياراتك في الخطوات التالية</p>
      </div>
    </div>
  );
};
