import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { BookingData, Child } from '@/types/booking';
import { currencies, additionalCurrencies } from '@/data/currencies';
import { PhoneInput } from '@/components/ui/phone-input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Plus, Minus, Users, Calendar, DollarSign, MapPin, Info, AlertTriangle } from 'lucide-react';

interface BasicTravelInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const BasicTravelInfoStep = ({ data, updateData, onValidationChange }: BasicTravelInfoStepProps) => {
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [customBudgetAmount, setCustomBudgetAmount] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('SA'); // افتراضي السعودية
  const [phoneNumber, setPhoneNumber] = useState('');

  const allCurrencies = [...currencies, ...additionalCurrencies];

  // التحقق من صحة البيانات
  useEffect(() => {
    const isValid = !!(
      data.customerName?.trim() &&
      phoneNumber?.trim() &&
      data.adults > 0 &&
      data.arrivalDate &&
      data.departureDate &&
      data.arrivalAirport &&
      data.departureAirport &&
      data.rooms > 0 &&
      data.budget > 0 &&
      data.currency
    );
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [data, phoneNumber, onValidationChange]);

  // حفظ رقم الهاتف في البيانات عند تغييره
  useEffect(() => {
    if (phoneNumber) {
      updateData({ phoneNumber });
    }
  }, [phoneNumber, updateData]);

  // Function to get incomplete fields
  const getIncompleteFields = () => {
    const incompleteFields = [];
    
    if (!data.customerName?.trim()) incompleteFields.push('الاسم الكامل');
    if (!phoneNumber?.trim()) incompleteFields.push('رقم الهاتف');
    if (!data.arrivalDate) incompleteFields.push('تاريخ الوصول');
    if (!data.departureDate) incompleteFields.push('تاريخ المغادرة');
    if (!data.arrivalAirport) incompleteFields.push('مطار الوصول');
    if (!data.departureAirport) incompleteFields.push('مطار المغادرة');
    if (data.adults <= 0) incompleteFields.push('عدد البالغين');
    if (data.rooms <= 0) incompleteFields.push('عدد الغرف');
    if (data.budget <= 0) incompleteFields.push('الميزانية');
    if (!data.currency) incompleteFields.push('العملة');
    
    return incompleteFields;
  };

  const airports = [
    { code: 'TBS', name: 'مطار تبليسي الدولي', city: 'تبليسي' },
    { code: 'BUS', name: 'مطار باتومي الدولي', city: 'باتومي' },
    { code: 'KUT', name: 'مطار كوتايسي الدولي', city: 'كوتايسي' }
  ];

  const predefinedBudgets = [
    { label: '500 - 800 دولار', min: 500, max: 800, value: 650 },
    { label: '800 - 1200 دولار', min: 800, max: 1200, value: 1000 },
    { label: '1200 - 1800 دولار', min: 1200, max: 1800, value: 1500 },
    { label: '1800 - 2500 دولار', min: 1800, max: 2500, value: 2150 },
    { label: '2500 - 3500 دولار', min: 2500, max: 3500, value: 3000 },
    { label: '3500+ دولار', min: 3500, max: 5000, value: 4000 }
  ];

  const handleCustomBudget = () => {
    const amount = parseFloat(customBudgetAmount);
    if (amount && amount > 0) {
      const selectedCurrency = allCurrencies.find(c => c.code === data.currency) || allCurrencies[0];
      const budgetInSelectedCurrency = amount * selectedCurrency.exchangeRate;
      updateData({ budget: budgetInSelectedCurrency });
      setShowCustomBudget(false);
      setCustomBudgetAmount('');
    }
  };

  const handlePredefinedBudget = (budgetValue: number) => {
    const selectedCurrency = allCurrencies.find(c => c.code === data.currency) || allCurrencies[0];
    const budgetInSelectedCurrency = budgetValue * selectedCurrency.exchangeRate;
    updateData({ budget: budgetInSelectedCurrency });
  };

  const handleDateChange = (arrivalDate: string, departureDate: string) => {
    updateData({ arrivalDate, departureDate });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات السفر الأساسية</h2>
        <p className="text-gray-600">أدخل تفاصيل رحلتك وبياناتك الشخصية</p>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            معلومات العميل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">الاسم الكامل *</Label>
              <Input
                id="customerName"
                value={data.customerName}
                onChange={(e) => updateData({ customerName: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>رقم الهاتف (واتساب) *</Label>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
                placeholder="رقم الهاتف"
              />
              {/* Phone Number Warning */}
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  أدخل رقم هاتفك بعناية لأنه سيرتبط بالحجز مباشرة. إدخال رقم خاطئ قد يؤدي إلى إلغاء الحجز.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            تواريخ السفر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateRangePicker
            arrivalDate={data.arrivalDate}
            departureDate={data.departureDate}
            onDateChange={handleDateChange}
            label="اختر تواريخ الوصول والمغادرة"
            required
          />
        </CardContent>
      </Card>

      {/* Airport Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            المطارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>مطار الوصول *</Label>
              <Select
                value={data.arrivalAirport}
                onValueChange={(value) => updateData({ arrivalAirport: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مطار الوصول" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map((airport) => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.name} ({airport.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>مطار المغادرة *</Label>
              <Select
                value={data.departureAirport}
                onValueChange={(value) => updateData({ departureAirport: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مطار المغادرة" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map((airport) => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.name} ({airport.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travelers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            عدد المسافرين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عدد البالغين *</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateData({ adults: Math.max(1, data.adults - 1) })}
                  disabled={data.adults <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold bg-gray-50 py-2 px-3 rounded border">
                  {data.adults}
                </span>
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
              <Label>عدد الغرف *</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateData({ rooms: Math.max(1, data.rooms - 1) })}
                  disabled={data.rooms <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold bg-gray-50 py-2 px-3 rounded border">
                  {data.rooms}
                </span>
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

          {/* Children */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>الأطفال (أقل من 12 سنة)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateData({ children: [...data.children, { age: 5 }] })}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة طفل
              </Button>
            </div>
            
            {data.children.map((child, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">طفل {index + 1}:</span>
                <Select
                  value={child.age.toString()}
                  onValueChange={(value) => {
                    const updatedChildren = data.children.map((c, i) => 
                      i === index ? { ...c, age: parseInt(value) } : c
                    );
                    updateData({ children: updatedChildren });
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(age => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">سنة</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const updatedChildren = data.children.filter((_, i) => i !== index);
                    updateData({ children: updatedChildren });
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            الميزانية والعملة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label>العملة المفضلة *</Label>
            <Select
              value={data.currency}
              onValueChange={(value) => updateData({ currency: value, budget: 0 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر العملة" />
              </SelectTrigger>
              <SelectContent>
                {allCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{currency.flag}</span>
                      <span>{currency.nameAr} ({currency.symbol})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              الميزانية التي ستدخلها تساعدنا في تخصيص أفضل العروض والخيارات المناسبة لك، وستكون مرجعاً لنا لتقديم تجربة سفر تناسب توقعاتك تماماً
            </AlertDescription>
          </Alert>

          {/* Budget Selection - اجبارية */}
          <div className="space-y-3">
            <Label>اختر نطاق الميزانية * (إجباري)</Label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {predefinedBudgets.map((budget, index) => {
                const selectedCurrency = allCurrencies.find(c => c.code === data.currency) || allCurrencies[0];
                const convertedMin = Math.round(budget.min * selectedCurrency.exchangeRate);
                const convertedMax = Math.round(budget.max * selectedCurrency.exchangeRate);
                const convertedValue = Math.round(budget.value * selectedCurrency.exchangeRate);
                
                return (
                  <Button
                    key={index}
                    type="button"
                    variant={data.budget === convertedValue ? "default" : "outline"}
                    className="h-auto p-3 text-right"
                    onClick={() => handlePredefinedBudget(budget.value)}
                  >
                    <div className="text-center w-full">
                      <div className="font-semibold text-sm">
                        {convertedMin.toLocaleString()} - {convertedMax.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedCurrency.nameAr}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {/* Custom Budget Option */}
            <div className="border-t pt-3">
              {!showCustomBudget ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomBudget(true)}
                  className="w-full"
                >
                  اكتب ميزانيتك المخصصة
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label>ميزانيتك المخصصة (بالدولار الأمريكي)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={customBudgetAmount}
                      onChange={(e) => setCustomBudgetAmount(e.target.value)}
                      placeholder="أدخل المبلغ بالدولار"
                      min="0"
                    />
                    <Button onClick={handleCustomBudget} disabled={!customBudgetAmount}>
                      تأكيد
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCustomBudget(false);
                        setCustomBudgetAmount('');
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {data.budget > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <span className="text-green-800 font-semibold">الميزانية المختارة: </span>
                <span className="text-green-600 font-bold text-lg">
                  {Math.round(data.budget).toLocaleString()} {allCurrencies.find(c => c.code === data.currency)?.symbol}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incomplete Fields Indicator */}
      {getIncompleteFields().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-semibold text-orange-800 mb-2">الحقول المتبقية لإكمال المرحلة الأولى:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {getIncompleteFields().map((field, index) => (
                  <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 bg-white">
                    {field}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-orange-600 mt-2">
                يرجى إكمال هذه الحقول للانتقال إلى المرحلة التالية
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
