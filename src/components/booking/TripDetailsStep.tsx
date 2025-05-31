
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { airports, transportData } from '@/data/hotels';
import { Plane, Car, Info, Lightbulb, CheckCircle2 } from 'lucide-react';

interface TripDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const TripDetailsStep = ({ data, updateData }: TripDetailsStepProps) => {
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);

  const generateSmartSuggestions = () => {
    // Calculate total people including children over 6 (internal logic)
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

    // Add "other" option
    suggestions.push('غير ذلك');

    setSmartSuggestions(suggestions);
  };

  useEffect(() => {
    generateSmartSuggestions();
  }, [data.adults, data.children]);

  const getRecommendedCarType = () => {
    // Internal calculation including children over 6
    const totalPeople = data.adults + data.children.filter(child => child.age > 6).length;
    if (totalPeople <= 3) return 'سيدان';
    if (totalPeople <= 6) return 'ميني فان';
    if (totalPeople <= 8) return 'فان';
    if (totalPeople <= 14) return 'سبرنتر';
    return 'باص';
  };

  const recommendedCar = getRecommendedCarType();

  const applySuggestion = (suggestion: string) => {
    if (suggestion === 'غير ذلك') {
      // Don't auto-set rooms, let user choose manually
      return;
    }
    
    // Parse suggestion and update room count accordingly
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
    // Add more parsing logic as needed
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل البرنامج السياحي</h2>
        <p className="text-gray-600">اختر تفاصيل رحلتك ونوع النقل</p>
      </div>

      {/* Airport Selection */}
      <div className="grid md:grid-cols-2 gap-6">
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

      {/* Airport Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          يمكنك اختيار مطار وصول مختلف عن مطار المغادرة حسب برنامجك السياحي
        </AlertDescription>
      </Alert>

      {/* Smart Room Suggestions */}
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

      {/* Car Type */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-lg font-medium">
          <Car className="w-4 h-4" />
          نوع السيارة *
        </Label>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-800">
            <strong>مقترح:</strong> بناءً على عدد الأشخاص ({data.adults + data.children.filter(child => child.age > 6).length}) ننصح بـ <strong>{recommendedCar}</strong>
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {transportData.map((transport) => (
            <div
              key={transport.type}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.carType === transport.type
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${transport.type === recommendedCar ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => updateData({ carType: transport.type })}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{transport.type}</h3>
                  <p className="text-sm text-gray-600">خدمة يومية شاملة</p>
                </div>
                {transport.type === recommendedCar && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    مقترح
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capacity Guidelines */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">دليل السعة:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• سيدان: 1-3 أشخاص</li>
          <li>• ميني فان: 4-6 أشخاص</li>
          <li>• فان: 7-8 أشخاص</li>
          <li>• سبرنتر: 9-14 شخص</li>
          <li>• باص: 15+ أشخاص</li>
        </ul>
      </div>
    </div>
  );
};
