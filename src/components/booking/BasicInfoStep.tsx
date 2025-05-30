
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { currencies } from '@/data/hotels';
import { Plus, Minus, User, Users, Calendar, AlertTriangle } from 'lucide-react';

interface BasicInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const BasicInfoStep = ({ data, updateData }: BasicInfoStepProps) => {
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">المعلومات الأساسية للحجز</h2>
        <p className="text-gray-600">يرجى إدخال بياناتك الأساسية لبدء تصميم رحلتك</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Name */}
        <div className="space-y-2">
          <Label htmlFor="customerName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            اسم العميل *
          </Label>
          <Input
            id="customerName"
            value={data.customerName}
            onChange={(e) => updateData({ customerName: e.target.value })}
            placeholder="أدخل اسمك الكامل"
            className="text-right"
            required
          />
        </div>

        {/* Adults Count */}
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
            <span className="w-12 text-center font-semibold">{data.adults}</span>
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
      </div>

      {/* Children Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium">الأطفال</Label>
          <Button type="button" onClick={addChild} variant="outline" size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة طفل
          </Button>
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
                (لا يحتاج سرير)
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Arrival Date */}
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

        {/* Departure Date */}
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
      </div>

      {/* Date Validation Alert */}
      {dateError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{dateError}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Number of Rooms */}
        <div className="space-y-2">
          <Label>عدد الغرف المطلوبة *</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateData({ rooms: Math.max(1, data.rooms - 1) })}
              disabled={data.rooms <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-semibold">{data.rooms}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateData({ rooms: data.rooms + 1 })}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label>العملة *</Label>
          <Select
            value={data.currency}
            onValueChange={(value) => updateData({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <Label htmlFor="budget">الميزانية المطلوبة *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="budget"
            type="number"
            value={data.budget}
            onChange={(e) => updateData({ budget: parseInt(e.target.value) || 0 })}
            placeholder="أدخل الميزانية"
            required
          />
          <span className="text-gray-600">
            {currencies.find(c => c.code === data.currency)?.symbol}
          </span>
        </div>
      </div>

      {/* Payment Security Notice */}
      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="font-medium text-green-800">دفعك آمن معنا</span>
        </div>
        <p className="text-green-700 text-sm">
          لن يتم خصم أي مبالغ إلا بعد وصولك واستلام الغرفة. الموقع آمن تماماً ومحمي بأحدث تقنيات الأمان.
        </p>
      </div>
    </div>
  );
};
