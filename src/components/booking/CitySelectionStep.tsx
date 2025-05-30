
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingData, CityStay } from '@/types/booking';
import { hotelData } from '@/data/hotels';
import { Plus, Minus, MapPin, Building2, Car } from 'lucide-react';

interface CitySelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const CitySelectionStep = ({ data, updateData }: CitySelectionStepProps) => {
  const availableCities = Object.keys(hotelData);

  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      nights: 1,
      hotel: '',
      tours: 0
    };
    updateData({
      selectedCities: [...data.selectedCities, newCity]
    });
  };

  const removeCity = (index: number) => {
    const newCities = data.selectedCities.filter((_, i) => i !== index);
    updateData({ selectedCities: newCities });
  };

  const updateCity = (index: number, field: keyof CityStay, value: string | number) => {
    const newCities = [...data.selectedCities];
    newCities[index] = { ...newCities[index], [field]: value };
    updateData({ selectedCities: newCities });
  };

  const getTotalNights = () => {
    return data.selectedCities.reduce((total, city) => total + city.nights, 0);
  };

  const getMinimumNights = () => {
    const arrivalDate = new Date(data.arrivalDate);
    const departureDate = new Date(data.departureDate);
    const diffTime = Math.abs(departureDate.getTime() - arrivalDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1; // nights = days - 1
  };

  const minimumNights = getMinimumNights();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والإقامة</h2>
        <p className="text-gray-600">اختر المدن التي تريد زيارتها والفنادق المناسبة</p>
      </div>

      {/* Trip Duration Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          <strong>مدة الرحلة:</strong> {minimumNights} ليلة 
          {minimumNights < 2 && (
            <span className="text-red-600 mr-2">
              (الحد الأدنى 2 ليلة)
            </span>
          )}
        </p>
        <p className="text-blue-600 text-sm mt-1">
          مجموع الليالي المحددة: {getTotalNights()} ليلة
        </p>
      </div>

      {/* Add City Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">المدن المختارة</h3>
        <Button onClick={addCity} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          إضافة مدينة
        </Button>
      </div>

      {/* Cities List */}
      <div className="space-y-4">
        {data.selectedCities.map((cityStay, index) => (
          <div key={index} className="p-6 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-lg">المدينة {index + 1}</h4>
              <Button
                onClick={() => removeCity(index)}
                variant="destructive"
                size="sm"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* City Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  اختر المدينة
                </Label>
                <Select
                  value={cityStay.city}
                  onValueChange={(value) => updateCity(index, 'city', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Nights */}
              <div className="space-y-2">
                <Label>عدد الليالي</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCity(index, 'nights', Math.max(1, cityStay.nights - 1))}
                    disabled={cityStay.nights <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{cityStay.nights}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCity(index, 'nights', cityStay.nights + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Hotel Selection */}
            {cityStay.city && (
              <div className="mt-4 space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  اختر الفندق
                </Label>
                <Select
                  value={cityStay.hotel}
                  onValueChange={(value) => updateCity(index, 'hotel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفندق" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotelData[cityStay.city]?.map((hotel) => (
                      <SelectItem key={hotel.name} value={hotel.name}>
                        <div className="flex justify-between items-center w-full">
                          <span>{hotel.name}</span>
                          <span className="text-sm text-gray-500 mr-4">
                            من ${Math.min(hotel.dbl_v, hotel.dbl_wv)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tours */}
            <div className="mt-4 space-y-2">
              <Label className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                عدد الجولات السياحية
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCity(index, 'tours', Math.max(0, cityStay.tours - 1))}
                  disabled={cityStay.tours <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{cityStay.tours}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCity(index, 'tours', cityStay.tours + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                أو اختر خدمة الاستقبال والتوديع فقط (0 جولات)
              </p>
            </div>
          </div>
        ))}
      </div>

      {data.selectedCities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>لم تقم بإضافة أي مدن بعد</p>
          <p className="text-sm">اضغط على "إضافة مدينة" لبدء تخطيط رحلتك</p>
        </div>
      )}
    </div>
  );
};
