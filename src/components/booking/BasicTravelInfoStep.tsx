import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WhatsAppVerification } from './WhatsAppVerification';
import { PhoneInput } from '@/components/ui/phone-input';
import { BookingData } from '@/types/booking';
import { Plus, Minus, Users, Calendar, Phone, User, Baby, Info, Hotel } from 'lucide-react';

interface BasicTravelInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const BasicTravelInfoStep = ({ data, updateData, onValidationChange }: BasicTravelInfoStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
  const [selectedCountry, setSelectedCountry] = useState('SA'); // افتراضي للسعودية
  const [showVerification, setShowVerification] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Calculate total people
  const totalPeople = data.adults + data.children.length;
  
  // Calculate minimum rooms needed
  const getMinimumRoomsNeeded = () => {
    // Adults + children over 6 need bed space
    const peopleNeedingBeds = data.adults + data.children.filter(child => child.age > 6).length;
    return Math.ceil(peopleNeedingBeds / 3); // Maximum 3 people per room (triple)
  };

  const minimumRooms = getMinimumRoomsNeeded();

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
    // Ensure minimum rooms when people count changes
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
    // إعادة تعيين رقم الهاتف عند تغيير الدولة
    setPhoneNumber('');
    updateData({ phoneNumber: '' });
  };

  const handleVerifyPhone = () => {
    if (phoneNumber.trim()) {
      setShowVerification(true);
    }
  };

  const handleVerificationSuccess = () => {
    setIsPhoneVerified(true);
    setShowVerification(false);
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

  // Available airports
  const airports = [
    { code: 'TBS', name: 'مطار تبليسي الدولي', city: 'تبليسي' },
    { code: 'BUS', name: 'مطار باتومي الدولي', city: 'باتومي' },
    { code: 'KUT', name: 'مطار كوتايسي الدولي', city: 'كوتايسي' }
  ];

  if (showVerification) {
    return (
      <WhatsAppVerification
        phoneNumber={`+${selectedCountry === 'SA' ? '966' : '995'}${phoneNumber}`}
        onVerificationSuccess={handleVerificationSuccess}
        onCancel={() => setShowVerification(false)}
      />
    );
  }

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
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleVerifyPhone}
                  variant="outline"
                  size="sm"
                  disabled={!phoneNumber.trim()}
                >
                  تحقق من الرقم
                </Button>
                {isPhoneVerified && (
                  <p className="text-green-600 text-sm">✅ تم التحقق من رقم الهاتف</p>
                )}
              </div>
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
          {/* Adults */}
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

          {/* Children */}
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
