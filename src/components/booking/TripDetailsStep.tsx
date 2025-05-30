
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BookingData } from '@/types/booking';
import { airports, transportData } from '@/data/hotels';
import { Plane, Car, Hotel } from 'lucide-react';

interface TripDetailsStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const TripDetailsStep = ({ data, updateData }: TripDetailsStepProps) => {
  const roomTypes = [
    { id: 'single', label: 'غرفة مفردة (لشخص واحد)' },
    { id: 'dbl_v', label: 'غرفة مزدوجة (dbl_v)' },
    { id: 'dbl_wv', label: 'غرفة مزدوجة (dbl_wv)' },
    { id: 'trbl_v', label: 'غرفة ثلاثية (trbl_v)' },
    { id: 'trbl_wv', label: 'غرفة ثلاثية (trbl_wv)' }
  ];

  const handleRoomTypeChange = (roomType: string, checked: boolean) => {
    const newRoomTypes = checked
      ? [...data.roomTypes, roomType]
      : data.roomTypes.filter(type => type !== roomType);
    updateData({ roomTypes: newRoomTypes });
  };

  const getRecommendedCarType = () => {
    const totalPeople = data.adults + data.children.filter(child => child.age > 6).length;
    if (totalPeople <= 3) return 'سيدان';
    if (totalPeople <= 6) return 'ميني فان';
    if (totalPeople <= 8) return 'فان';
    if (totalPeople <= 14) return 'سبرنتر';
    return 'باص';
  };

  const recommendedCar = getRecommendedCarType();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل البرنامج السياحي</h2>
        <p className="text-gray-600">اختر تفاصيل رحلتك ونوع الإقامة والنقل</p>
      </div>

      {/* Airport Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Plane className="w-4 h-4" />
          مطار الوصول والمغادرة
        </Label>
        <Select
          value={data.airport}
          onValueChange={(value) => updateData({ airport: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر المطار" />
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

      {/* Room Types */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-lg font-medium">
          <Hotel className="w-4 h-4" />
          نوع الغرف المطلوبة
        </Label>
        <div className="grid md:grid-cols-2 gap-4">
          {roomTypes.map((roomType) => (
            <div key={roomType.id} className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg">
              <Checkbox
                id={roomType.id}
                checked={data.roomTypes.includes(roomType.id)}
                onCheckedChange={(checked) => handleRoomTypeChange(roomType.id, checked as boolean)}
              />
              <Label htmlFor={roomType.id} className="text-sm cursor-pointer">
                {roomType.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Car Type */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-lg font-medium">
          <Car className="w-4 h-4" />
          نوع السيارة
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
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                data.carType === transport.type
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${transport.type === recommendedCar ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => updateData({ carType: transport.type })}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{transport.type}</h3>
                  <p className="text-sm text-gray-600">${transport.price}/يوم</p>
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
        <p className="text-xs text-gray-500 mt-2">
          * الأطفال فوق 6 سنوات يحسبون كبالغين في حساب السعة
        </p>
      </div>
    </div>
  );
};
