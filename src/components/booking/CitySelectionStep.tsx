
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingData, CityStay, RoomSelection } from '@/types/booking';
import { hotelData, availableTours, airportCityMapping } from '@/data/hotels';
import { Plus, Minus, MapPin, Building2, Car, Info, Hotel } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CitySelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const CitySelectionStep = ({ data, updateData }: CitySelectionStepProps) => {
  const availableCities = Object.keys(hotelData);

  const roomTypes = [
    { id: 'single', label: 'غرفة مفردة مع إفطار (بدون إطلالة)', capacity: 1 },
    { id: 'single_v', label: 'غرفة مفردة مع إفطار (مع إطلالة)', capacity: 1 },
    { id: 'dbl_wv', label: 'غرفة مزدوجة مع إفطار (بدون إطلالة)', capacity: 2 },
    { id: 'dbl_v', label: 'غرفة مزدوجة مع إفطار (مع إطلالة)', capacity: 2 },
    { id: 'trbl_wv', label: 'غرفة ثلاثية مع إفطار (بدون إطلالة)', capacity: 3 },
    { id: 'trbl_v', label: 'غرفة ثلاثية مع إفطار (مع إطلالة)', capacity: 3 }
  ];

  // Auto-add first and last night cities based on airports
  const autoAddAirportCities = () => {
    const firstNightCity = airportCityMapping[data.arrivalAirport];
    const lastNightCity = airportCityMapping[data.departureAirport];
    
    const newCities = [...data.selectedCities];
    
    // Check if first night city is already added
    const hasFirstNightCity = newCities.some(city => city.city === firstNightCity);
    if (!hasFirstNightCity && firstNightCity) {
      newCities.unshift({
        city: firstNightCity,
        nights: 1,
        hotel: '',
        tours: 0,
        mandatoryTours: 0,
        roomSelections: []
      });
    }
    
    // Check if last night city is already added and different from first
    const hasLastNightCity = newCities.some(city => city.city === lastNightCity);
    if (!hasLastNightCity && lastNightCity && lastNightCity !== firstNightCity) {
      newCities.push({
        city: lastNightCity,
        nights: 1,
        hotel: '',
        tours: 0,
        mandatoryTours: 0,
        roomSelections: []
      });
    }
    
    updateData({ selectedCities: newCities });
  };

  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      nights: 1,
      hotel: '',
      tours: 0,
      mandatoryTours: 0,
      roomSelections: []
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
    
    // Add mandatory tours when city is not arrival airport city
    if (field === 'city') {
      const arrivalCity = airportCityMapping[data.arrivalAirport];
      if (value !== arrivalCity && value !== '') {
        newCities[index].mandatoryTours = 1;
      } else {
        newCities[index].mandatoryTours = 0;
      }
      
      // Update available tours based on selected city
      if (value && availableTours[value as string]) {
        newCities[index].availableTours = availableTours[value as string];
      }
      
      // Reset room selections when city changes
      newCities[index].roomSelections = [];
    }
    
    // Initialize room selections when hotel is selected
    if (field === 'hotel' && value !== '') {
      const roomSelections: RoomSelection[] = [];
      for (let i = 0; i < data.rooms; i++) {
        roomSelections.push({
          roomNumber: i + 1,
          roomType: ''
        });
      }
      newCities[index].roomSelections = roomSelections;
    }
    
    updateData({ selectedCities: newCities });
  };

  const updateRoomSelection = (cityIndex: number, roomIndex: number, roomType: string) => {
    const newCities = [...data.selectedCities];
    if (newCities[cityIndex].roomSelections) {
      newCities[cityIndex].roomSelections![roomIndex].roomType = roomType;
      updateData({ selectedCities: newCities });
    }
  };

  const shouldShowRoomWarning = () => {
    const totalAdults = data.adults + data.children.filter(child => child.age > 6).length;
    const recommendedRooms = Math.ceil(totalAdults / 2);
    return data.rooms > recommendedRooms;
  };

  const getTotalNights = () => {
    return data.selectedCities.reduce((total, city) => total + city.nights, 0);
  };

  const getMinimumNights = () => {
    if (!data.arrivalDate || !data.departureDate) return 3;
    const arrivalDate = new Date(data.arrivalDate);
    const departureDate = new Date(data.departureDate);
    const diffTime = Math.abs(departureDate.getTime() - arrivalDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
  };

  const minimumNights = getMinimumNights();

  // Auto-add airport cities when component loads or airports change
  useEffect(() => {
    if (data.arrivalAirport && data.departureAirport) {
      autoAddAirportCities();
    }
  }, [data.arrivalAirport, data.departureAirport]);

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
          {minimumNights < 3 && (
            <span className="text-red-600 mr-2">
              (الحد الأدنى 3 ليالي)
            </span>
          )}
        </p>
        <p className="text-blue-600 text-sm mt-1">
          مجموع الليالي المحددة: {getTotalNights()} ليلة
        </p>
      </div>

      {/* Room Count Selection */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Hotel className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-purple-800">عدد الغرف المطلوبة</h3>
        </div>
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
          <span className="w-12 text-center font-semibold text-lg">{data.rooms}</span>
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

      {/* Room Count Warning */}
      {shouldShowRoomWarning() && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            تنبيه: عدد الغرف المختارة أكثر من المطلوب للعدد الحالي من المسافرين. يمكنك المتابعة أو تعديل العدد.
          </AlertDescription>
        </Alert>
      )}

      {/* Airport-based accommodation notice */}
      {data.arrivalAirport && data.departureAirport && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p><strong>الليلة الأولى:</strong> ستكون في {airportCityMapping[data.arrivalAirport]} (حسب مطار الوصول)</p>
              {data.arrivalAirport !== data.departureAirport && (
                <p><strong>الليلة الأخيرة:</strong> ستكون في {airportCityMapping[data.departureAirport]} (حسب مطار المغادرة)</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

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
                          {hotel.rating && (
                            <span className="text-sm text-gray-500 mr-4">
                              {hotel.rating} نجوم
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Room Type Selection - Show after hotel is selected */}
            {cityStay.hotel && cityStay.roomSelections && (
              <div className="mt-6 space-y-4">
                <h5 className="font-medium text-gray-800">اختيار نوع الغرف:</h5>
                {cityStay.roomSelections.map((roomSelection, roomIndex) => (
                  <div key={roomIndex} className="p-4 bg-gray-50 rounded-lg">
                    <Label className="block mb-2">الغرفة {roomSelection.roomNumber}:</Label>
                    <Select
                      value={roomSelection.roomType}
                      onValueChange={(value) => updateRoomSelection(index, roomIndex, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الغرفة" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((roomType) => (
                          <SelectItem key={roomType.id} value={roomType.id}>
                            {roomType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Tours */}
            <div className="mt-4 space-y-2">
              <Label className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                عدد الجولات السياحية
                {cityStay.mandatoryTours > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    +{cityStay.mandatoryTours} جولة إجبارية
                  </span>
                )}
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
                المجموع الفعلي: {cityStay.tours + (cityStay.mandatoryTours || 0)} جولة
              </p>
            </div>

            {/* Available Tours Display */}
            {cityStay.availableTours && cityStay.availableTours.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-sm mb-2">الجولات المتاحة:</h5>
                <div className="text-xs text-gray-600 space-y-1">
                  {cityStay.availableTours.map((tour, tourIndex) => (
                    <div key={tourIndex}>• {tour.name} - {tour.description}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.selectedCities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>سيتم إضافة مدن الإقامة تلقائياً حسب المطارات المختارة</p>
          <p className="text-sm">يمكنك إضافة مدن إضافية باستخدام زر "إضافة مدينة"</p>
        </div>
      )}
    </div>
  );
};
