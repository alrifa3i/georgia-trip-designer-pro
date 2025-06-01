
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhoneInput } from '@/components/ui/phone-input';
import { BookingData } from '@/types/booking';
import { Plus, Minus, Users, Calendar, Phone, User, Baby, Info, Hotel, DollarSign } from 'lucide-react';
import { currencies, formatCurrency } from '@/data/currencies';

// إضافة العملات الإضافية مع العلم
const additionalCurrencies = [
  { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س', exchangeRate: 3.75, flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', exchangeRate: 3.67, flag: '🇦🇪' },
  { code: 'QAR', name: 'Qatari Riyal', nameAr: 'ريال قطري', symbol: 'ر.ق', exchangeRate: 3.64, flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي', symbol: 'د.ك', exchangeRate: 0.30, flag: '🇰🇼' },
  { code: 'BHD', name: 'Bahraini Dinar', nameAr: 'دينار بحريني', symbol: 'د.ب', exchangeRate: 0.38, flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial', nameAr: 'ريال عماني', symbol: 'ر.ع', exchangeRate: 0.38, flag: '🇴🇲' },
  { code: 'EGP', name: 'Egyptian Pound', nameAr: 'جنيه مصري', symbol: 'ج.م', exchangeRate: 30.9, flag: '🇪🇬' },
  { code: 'JOD', name: 'Jordanian Dinar', nameAr: 'دينار أردني', symbol: 'د.أ', exchangeRate: 0.71, flag: '🇯🇴' },
  { code: 'LBP', name: 'Lebanese Pound', nameAr: 'ليرة لبنانية', symbol: 'ل.ل', exchangeRate: 15000, flag: '🇱🇧' },
  { code: 'TRY', name: 'Turkish Lira', nameAr: 'ليرة تركية', symbol: '₺', exchangeRate: 29.4, flag: '🇹🇷' }
];

interface BasicTravelInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const BasicTravelInfoStep = ({ data, updateData, onValidationChange }: BasicTravelInfoStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [customBudget, setCustomBudget] = useState(data.budget || 0);
  const [selectedCurrency, setSelectedCurrency] = useState(data.currency || 'USD');

  // Calculate total people
  const totalPeople = data.adults + data.children.length;
  
  // Calculate minimum rooms needed
  const getMinimumRoomsNeeded = () => {
    const peopleNeedingBeds = data.adults + data.children.filter(child => child.age > 6).length;
    return Math.ceil(peopleNeedingBeds / 3);
  };

  const minimumRooms = getMinimumRoomsNeeded();

  // دمج العملات الأساسية مع الإضافية وإضافة العلم للعملات الأساسية
  const baseCurrenciesWithFlags = currencies.map(curr => ({
    ...curr,
    flag: curr.code === 'USD' ? '🇺🇸' : curr.code === 'EUR' ? '🇪🇺' : curr.code === 'GBP' ? '🇬🇧' : '🌍'
  }));
  
  const allCurrencies = [...baseCurrenciesWithFlags, ...additionalCurrencies];

  const validateForm = () => {
    const isValid = 
      data.customerName.trim() !== '' &&
      data.adults >= 1 &&
      data.arrivalDate !== '' &&
      data.departureDate !== '' &&
      data.arrivalAirport !== '' &&
      data.departureAirport !== '' &&
      phoneNumber.trim() !== '' &&
      data.rooms >= minimumRooms;
    
    return isValid;
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validateForm());
    }
  }, [data, phoneNumber, onValidationChange]);

  useEffect(() => {
    if (data.rooms < minimumRooms) {
      updateData({ rooms: minimumRooms });
    }
  }, [minimumRooms, data.rooms, updateData]);

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    updateData({ phoneNumber: value });
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setPhoneNumber('');
    updateData({ phoneNumber: '' });
  };

  const handleCustomBudgetSubmit = () => {
    updateData({ 
      budget: customBudget,
      currency: selectedCurrency 
    });
    setShowCustomBudget(false);
  };

  const addChild = () => {
    const newChild = { age: 1 };
    updateData({
      children: [...data.children, newChild]
    });
  };

  const removeChild = (index: number) => {
    const newChildren = data.children.filter((_, i) => i !== index);
    updateData({ children: newChildren });
  };

  const updateChild = (index: number, age: number) => {
    const newChildren = data.children.map((child, i) => 
      i === index ? { ...child, age } : child
    );
    updateData({ children: newChildren });
  };

  const airports = [
    { code: 'TBS', name: 'مطار تبليسي الدولي', city: 'تبليسي' },
    { code: 'BUS', name: 'مطار باتومي الدولي', city: 'باتومي' },
    { code: 'KUT', name: 'مطار كوتايسي الدولي', city: 'كوتايسي' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات السفر الأساسية</h2>
        <p className="text-gray-600">أدخل التفاصيل الأساسية لرحلتك السياحية</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">الاسم الكامل *</Label>
              <Input
                id="customerName"
                value={data.customerName}
                onChange={(e) => updateData({ customerName: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف *
              </Label>
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                placeholder="رقم الهاتف"
                disabled={false}
              />
              <p className="text-xs text-gray-500">
                سيتم حفظ رقم الهاتف تلقائياً عند الانتقال للمرحلة التالية
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Travel Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              مواعيد السفر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalDate">تاريخ الوصول *</Label>
              <Input
                id="arrivalDate"
                type="date"
                value={data.arrivalDate}
                onChange={(e) => updateData({ arrivalDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureDate">تاريخ المغادرة *</Label>
              <Input
                id="departureDate"
                type="date"
                value={data.departureDate}
                onChange={(e) => updateData({ departureDate: e.target.value })}
                min={data.arrivalDate}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Airports */}
      <Card>
        <CardContent className="pt-6">
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
                      {airport.name}
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
                      {airport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* People Count */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            عدد المسافرين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>البالغين (12 سنة فأكثر) *</Label>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Baby className="w-4 h-4" />
                الأطفال (تحت 12 سنة)
              </Label>
              <Button
                onClick={addChild}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                إضافة طفل
              </Button>
            </div>

            {data.children.map((child, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">طفل {index + 1}:</span>
                <Select
                  value={child.age.toString()}
                  onValueChange={(value) => updateChild(index, parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => i + 1).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">سنة</span>
                <Button
                  onClick={() => removeChild(index)}
                  variant="destructive"
                  size="sm"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p><strong>إجمالي المسافرين:</strong> {totalPeople} شخص</p>
            <p className="text-xs mt-1">
              • الأطفال فوق 6 سنوات يحتاجون سرير منفصل
              • الأطفال 6 سنوات فما دون يمكنهم مشاركة السرير مع الوالدين
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Room Count Selection */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-purple-600" />
            عدد الغرف المطلوبة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">عدد الغرف</p>
                <p className="text-sm text-gray-600">الحد الأدنى: {minimumRooms} غرف لعدد {totalPeople} أشخاص</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateData({ rooms: Math.max(minimumRooms, data.rooms - 1) })}
                  disabled={data.rooms <= minimumRooms}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg bg-white py-2 px-3 rounded border">
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

            {data.rooms < minimumRooms && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  تحتاج إلى {minimumRooms} غرف على الأقل لعدد {totalPeople} أشخاص.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Selection */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            الميزانية المتوقعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-green-800 text-sm font-medium mb-2">
                💡 الميزانية التي ستدخلها ستساعدنا في تصميم رحلة مثالية تناسب احتياجاتك وتطلعاتك
              </p>
              <p className="text-green-700 text-xs">
                هذه المعلومة ستمكننا من اقتراح أفضل الخيارات المناسبة لك وضمان تجربة سفر استثنائية
              </p>
            </div>

            {!showCustomBudget ? (
              <div className="text-center">
                <Button
                  onClick={() => setShowCustomBudget(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  اكتب ميزانيتك المخصصة
                </Button>
                {data.budget > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-lg border">
                    <p className="text-green-700 font-medium">
                      الميزانية الحالية: {formatCurrency(data.budget, data.currency)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>المبلغ</Label>
                    <Input
                      type="number"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(Number(e.target.value))}
                      placeholder="أدخل ميزانيتك"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>العملة</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {allCurrencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.flag} {currency.nameAr} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCustomBudgetSubmit} className="flex-1">
                    حفظ الميزانية
                  </Button>
                  <Button onClick={() => setShowCustomBudget(false)} variant="outline">
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      {!validateForm() && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            الرجاء إكمال جميع الحقول المطلوبة (★) للمتابعة إلى الخطوة التالية.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
