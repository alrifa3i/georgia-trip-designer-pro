
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';
import { BookingData, Child } from '@/types/booking';
import { currencies } from '@/data/currencies';
import { DateInput } from '@/components/ui/date-input';
import { PhoneInput, countries } from '@/components/ui/phone-input';

interface BasicTravelInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const BasicTravelInfoStep = ({ data, updateData, onValidationChange }: BasicTravelInfoStepProps) => {
  const [selectedCountry, setSelectedCountry] = useState('SA');

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
      data.budget > 0 &&
      data.phoneNumber?.trim()
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
      phoneNumber: data.phoneNumber,
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

  const handleArrivalDateChange = (date: string) => {
    updateData({ arrivalDate: date });
    // إذا كان تاريخ المغادرة أقل من تاريخ الوصول، قم بإعادة تعيينه
    if (data.departureDate && new Date(date) >= new Date(data.departureDate)) {
      const newDepartureDate = new Date(date);
      newDepartureDate.setDate(newDepartureDate.getDate() + 1);
      updateData({ departureDate: newDepartureDate.toISOString().split('T')[0] });
    }
  };

  const handleDepartureDateChange = (date: string) => {
    updateData({ departureDate: date });
  };

  const handlePhoneChange = (phone: string) => {
    const currentCountry = countries.find(c => c.code === selectedCountry);
    const fullPhone = currentCountry ? `${currentCountry.dialCode}${phone}` : phone;
    updateData({ phoneNumber: fullPhone });
  };

  // الحصول على العملة المختارة
  const selectedCurrency = currencies.find(c => c.code === data.currency) || currencies[0];

  // حساب عدد الليالي
  const calculateNights = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      const diffTime = Math.abs(departure.getTime() - arrival.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const nights = calculateNights();

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
              <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
              <PhoneInput
                value={data.phoneNumber?.replace(/^\+\d{1,4}/, '') || ''}
                onChange={handlePhoneChange}
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
                placeholder="رقم الهاتف"
                className="mt-1"
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
            <DateInput
              value={data.arrivalDate}
              onChange={handleArrivalDateChange}
              label="تاريخ الوصول"
              required
              minDate={new Date()}
            />

            <DateInput
              value={data.departureDate}
              onChange={handleDepartureDateChange}
              label="تاريخ المغادرة"
              required
              disabled={(date) => data.arrivalDate ? date <= new Date(data.arrivalDate) : date < new Date()}
            />

            {nights > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>عدد الليالي:</strong> {nights} ليلة
                </p>
              </div>
            )}
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
              <Label htmlFor="currency">العملة *</Label>
              <Select value={data.currency} onValueChange={(value) => updateData({ currency: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.nameAr} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">الميزانية المتوقعة *</Label>
              <Input
                id="budget"
                type="number"
                value={data.budget || ''}
                onChange={(e) => updateData({ budget: parseFloat(e.target.value) || 0 })}
                placeholder={`أدخل الميزانية بـ ${selectedCurrency.nameAr}`}
                min="0"
                className="mt-1"
              />
              {data.budget > 0 && data.currency !== 'USD' && (
                <p className="text-xs text-gray-500 mt-1">
                  ≈ ${Math.round(data.budget / selectedCurrency.exchangeRate)} دولار أمريكي
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">معلومات الدفع المهمة:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• الأسعار معروضة بـ {selectedCurrency.nameAr} للوضوح</li>
              <li>• الدفع سيتم بالدولار الأمريكي نقداً عند الوصول إلى جورجيا</li>
              <li>• لا يوجد دفع مسبق أو دفع عبر الإنترنت</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};
