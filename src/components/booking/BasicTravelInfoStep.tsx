
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData } from '@/types/booking';
import { Calendar, Users, Plane, Phone, User, Info, Lightbulb, CheckCircle2 } from 'lucide-react';
import { airports } from '@/data/hotels';

interface BasicTravelInfoStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const BasicTravelInfoStep = ({ data, updateData, onValidationChange }: BasicTravelInfoStepProps) => {
  const [childAges, setChildAges] = useState<number[]>(data.children?.map(child => child.age) || []);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);

  const generateSmartSuggestions = () => {
    const totalAdults = data.adults + data.children.filter(child => child.age > 6).length;
    const suggestions: string[] = [];

    if (totalAdults === 1) {
      suggestions.push('غرفة مفردة واحدة');
    } else if (totalAdults === 2) {
      suggestions.push('غرفة مزدوجة واحدة');
      suggestions.push('غرفتين مفردة');
    } else if (totalAdults === 3) {
      suggestions.push('غرفة ثلاثية واحدة');
      suggestions.push('غرفة مفردة + غرفة مزدوجة');
      suggestions.push('3 غرف مفردة');
    } else if (totalAdults === 4) {
      suggestions.push('غرفتين مزدوجة');
      suggestions.push('4 غرف مفردة');
      suggestions.push('غرفة ثلاثية + غرفة مفردة');
    } else if (totalAdults === 5) {
      suggestions.push('غرفة ثلاثية + غرفة مزدوجة');
      suggestions.push('5 غرف مفردة');
      suggestions.push('غرفتين مزدوجة + غرفة مفردة');
    } else if (totalAdults === 6) {
      suggestions.push('غرفتين ثلاثية');
      suggestions.push('3 غرف مزدوجة');
      suggestions.push('6 غرف مفردة');
    } else if (totalAdults > 6) {
      const roomsNeeded = Math.ceil(totalAdults / 3);
      suggestions.push(`${roomsNeeded} غرف ثلاثية`);
      suggestions.push(`${Math.ceil(totalAdults / 2)} غرف مزدوجة`);
      suggestions.push(`${totalAdults} غرف مفردة`);
    }

    suggestions.push('غير ذلك');
    setSmartSuggestions(suggestions);
  };

  useEffect(() => {
    generateSmartSuggestions();
  }, [data.adults, data.children]);

  // التحقق من صحة البيانات
  useEffect(() => {
    const isValid = !!(
      data.customerName &&
      data.phoneNumber &&
      data.adults > 0 &&
      data.arrivalDate &&
      data.departureDate &&
      data.arrivalAirport &&
      data.departureAirport &&
      data.rooms > 0
    );

    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [data, onValidationChange]);

  const applySuggestion = (suggestion: string) => {
    if (suggestion === 'غير ذلك') {
      return;
    }
    
    if (suggestion.includes('مفردة واحدة')) {
      updateData({ rooms: 1 });
    } else if (suggestion.includes('مزدوجة واحدة')) {
      updateData({ rooms: 1 });
    } else if (suggestion.includes('ثلاثية واحدة')) {
      updateData({ rooms: 1 });
    } else if (suggestion.includes('غرفتين مفردة')) {
      updateData({ rooms: 2 });
    } else if (suggestion.includes('غرفتين مزدوجة')) {
      updateData({ rooms: 2 });
    } else if (suggestion.includes('غرفتين ثلاثية')) {
      updateData({ rooms: 2 });
    } else if (suggestion.includes('3 غرف مزدوجة')) {
      updateData({ rooms: 3 });
    }
  };

  const addChild = () => {
    const newChildAges = [...childAges, 5];
    setChildAges(newChildAges);
    updateData({
      children: newChildAges.map(age => ({ age }))
    });
  };

  const removeChild = (index: number) => {
    const newChildAges = childAges.filter((_, i) => i !== index);
    setChildAges(newChildAges);
    updateData({
      children: newChildAges.map(age => ({ age }))
    });
  };

  const updateChildAge = (index: number, age: number) => {
    const newChildAges = [...childAges];
    newChildAges[index] = age;
    setChildAges(newChildAges);
    updateData({
      children: newChildAges.map(age => ({ age }))
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات السفر الأساسية</h2>
        <p className="text-gray-600">أدخل معلومات السفر والمسافرين</p>
      </div>

      {/* معلومات العميل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            معلومات العميل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">اسم العميل *</Label>
              <Input
                id="customerName"
                value={data.customerName}
                onChange={(e) => updateData({ customerName: e.target.value })}
                placeholder="أدخل اسم العميل"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف *
              </Label>
              <Input
                id="phoneNumber"
                value={data.phoneNumber || ''}
                onChange={(e) => updateData({ phoneNumber: e.target.value })}
                placeholder="أدخل رقم الهاتف"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تواريخ السفر والمطارات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            تفاصيل السفر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              يمكنك اختيار مطار وصول مختلف عن مطار المغادرة حسب برنامجك السياحي
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* عدد المسافرين */}
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
              <Label htmlFor="adults">عدد البالغين *</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                value={data.adults}
                onChange={(e) => updateData({ adults: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>عدد الأطفال</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{childAges.length} طفل</span>
                <Button
                  type="button"
                  onClick={addChild}
                  variant="outline"
                  size="sm"
                >
                  إضافة طفل
                </Button>
              </div>
            </div>
          </div>

          {/* أعمار الأطفال */}
          {childAges.length > 0 && (
            <div className="space-y-3">
              <Label>أعمار الأطفال</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {childAges.map((age, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={age.toString()}
                      onValueChange={(value) => updateChildAge(index, parseInt(value))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(18)].map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i === 0 ? 'أقل من سنة' : `${i} سنة`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={() => removeChild(index)}
                      variant="outline"
                      size="sm"
                    >
                      حذف
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* عدد الغرف */}
      <Card>
        <CardHeader>
          <CardTitle>عدد الغرف المطلوبة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rooms">عدد الغرف *</Label>
            <Input
              id="rooms"
              type="number"
              min="1"
              value={data.rooms}
              onChange={(e) => updateData({ rooms: parseInt(e.target.value) || 1 })}
            />
          </div>

          {/* اقتراحات ذكية لتوزيع الغرف */}
          {smartSuggestions.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-800">اقتراحات ذكية لتوزيع الغرف</h3>
              </div>
              <p className="text-blue-700 mb-4 text-sm">
                بناءً على عدد الأشخاص ({data.adults + data.children.filter(child => child.age > 6).length}), إليك أفضل خيارات توزيع الغرف:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {smartSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="justify-start bg-white hover:bg-blue-50 border-blue-300"
                  >
                    <CheckCircle2 className="w-4 h-4 ml-2 text-blue-600" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
