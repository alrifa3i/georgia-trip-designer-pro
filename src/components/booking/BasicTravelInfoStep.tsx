
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { BookingData, Child } from '@/types/booking';
import { currencies } from '@/data/currencies';

interface BasicTravelInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const BasicTravelInfoStep = ({ data, updateData, onValidationChange }: BasicTravelInfoStepProps) => {
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();

  // تحويل التواريخ من string إلى Date عند التحميل
  useEffect(() => {
    if (data.arrivalDate) {
      setArrivalDate(new Date(data.arrivalDate));
    }
    if (data.departureDate) {
      setDepartureDate(new Date(data.departureDate));
    }
  }, []);

  // التحقق من صحة البيانات
  useEffect(() => {
    const isValid = Boolean(
      data.customerName.trim() &&
      data.arrivalDate &&
      data.departureDate &&
      data.arrivalAirport &&
      data.departureAirport &&
      data.adults > 0 &&
      data.rooms > 0 &&
      data.budget > 0
    );
    
    console.log('Basic info validation:', {
      customerName: data.customerName.trim(),
      arrivalDate: data.arrivalDate,
      departureDate: data.departureDate,
      arrivalAirport: data.arrivalAirport,
      departureAirport: data.departureAirport,
      adults: data.adults,
      rooms: data.rooms,
      budget: data.budget,
      isValid
    });
    
    onValidationChange(isValid);
  }, [data, onValidationChange]);

  const addChild = () => {
    const newChild: Child = { age: 5 };
    updateData({ children: [...data.children, newChild] });
  };

  const removeChild = (index: number) => {
    const newChildren = data.children.filter((_, i) => i !== index);
    updateData({ children: newChildren });
  };

  const updateChildAge = (index: number, age: number) => {
    const newChildren = data.children.map((child, i) => 
      i === index ? { ...child, age } : child
    );
    updateData({ children: newChildren });
  };

  const handleArrivalDateSelect = (date: Date | undefined) => {
    if (date) {
      setArrivalDate(date);
      updateData({ arrivalDate: format(date, 'yyyy-MM-dd') });
    }
  };

  const handleDepartureDateSelect = (date: Date | undefined) => {
    if (date) {
      setDepartureDate(date);
      updateData({ departureDate: format(date, 'yyyy-MM-dd') });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات السفر الأساسية</h2>
        <p className="text-gray-600">أدخل التفاصيل الأساسية لرحلتك</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* معلومات المسافر */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600">معلومات المسافر الرئيسي</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">الاسم الكامل *</Label>
              <Input
                id="customerName"
                type="text"
                value={data.customerName}
                onChange={(e) => updateData({ customerName: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phoneNumber">رقم الهاتف</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={data.phoneNumber || ''}
                onChange={(e) => updateData({ phoneNumber: e.target.value })}
                placeholder="مثال: +966501234567"
                className="mt-1"
                dir="ltr"
              />
            </div>
          </div>
        </Card>

        {/* عدد المسافرين */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600">عدد المسافرين</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>البالغين *</Label>
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
                <span className="w-8 text-center font-semibold">{data.adults}</span>
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>الأطفال</Label>
                <Button type="button" variant="outline" size="sm" onClick={addChild}>
                  إضافة طفل
                </Button>
              </div>
              {data.children.map((child, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    value={child.age}
                    onChange={(e) => updateChildAge(index, parseInt(e.target.value) || 0)}
                    placeholder="العمر"
                    min="0"
                    max="17"
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">سنة</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeChild(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Label>عدد الغرف *</Label>
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
                <span className="w-8 text-center font-semibold">{data.rooms}</span>
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
          </div>
        </Card>

        {/* تواريخ السفر */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600">تواريخ السفر</h3>
          <div className="space-y-4">
            <div>
              <Label>تاريخ الوصول *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-right mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {arrivalDate ? format(arrivalDate, 'PPP', { locale: ar }) : "اختر تاريخ الوصول"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={arrivalDate}
                    onSelect={handleArrivalDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>تاريخ المغادرة *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-right mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, 'PPP', { locale: ar }) : "اختر تاريخ المغادرة"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={handleDepartureDateSelect}
                    disabled={(date) => date < (arrivalDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        {/* المطارات */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600">المطارات</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="arrivalAirport">مطار الوصول *</Label>
              <Select value={data.arrivalAirport} onValueChange={(value) => updateData({ arrivalAirport: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر مطار الوصول" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tbilisi">مطار تبليسي الدولي</SelectItem>
                  <SelectItem value="batumi">مطار باتومي الدولي</SelectItem>
                  <SelectItem value="kutaisi">مطار كوتايسي الدولي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="departureAirport">مطار المغادرة *</Label>
              <Select value={data.departureAirport} onValueChange={(value) => updateData({ departureAirport: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر مطار المغادرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tbilisi">مطار تبليسي الدولي</SelectItem>
                  <SelectItem value="batumi">مطار باتومي الدولي</SelectItem>
                  <SelectItem value="kutaisi">مطار كوتايسي الدولي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* الميزانية */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-emerald-600">الميزانية</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="budget">الميزانية المتوقعة *</Label>
              <Input
                id="budget"
                type="number"
                value={data.budget || ''}
                onChange={(e) => updateData({ budget: parseFloat(e.target.value) || 0 })}
                placeholder="أدخل الميزانية"
                min="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="currency">العملة</Label>
              <Select value={data.currency} onValueChange={(value) => updateData({ currency: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر العملة" />
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
        </Card>
      </div>
    </div>
  );
};
