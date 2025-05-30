
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingData, CityStay, RoomSelection } from '@/types/booking';
import { hotelData, transportData, airportCityMapping } from '@/data/hotels';
import { Plus, Minus, MapPin, Building2, Car, Hotel } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const CityHotelSelectionStep = ({ data, updateData }: CityHotelSelectionStepProps) => {
  const availableCities = Object.keys(hotelData);

  const roomTypes = [
    { id: 'single', label: 'غرفة مفردة مع إفطار (بدون إطلالة)', capacity: 1 },
    { id: 'single_v', label: 'غرفة مفردة مع إفطار (مع إطلالة)', capacity: 1 },
    { id: 'dbl_wv', label: 'غرفة مزدوجة مع إفطار (بدون إطلالة)', capacity: 2 },
    { id: 'dbl_v', label: 'غرفة مزدوجة مع إفطار (مع إطلالة)', capacity: 2 },
    { id: 'trbl_wv', label: 'غرفة ثلاثية مع إفطار (بدون إطلالة)', capacity: 3 },
    { id: 'trbl_v', label: 'غرفة ثلاثية مع إفطار (مع إطلالة)', capacity: 3 }
  ];

  // Auto-add airport cities when component loads
  useEffect(() => {
    if (data.arrivalAirport && data.departureAirport && data.selectedCities.length === 0) {
      const firstNightCity = airportCityMapping[data.arrivalAirport];
      const lastNightCity = airportCityMapping[data.departureAirport];
      
      const newCities: CityStay[] = [];
      
      if (firstNightCity) {
        newCities.push({
          city: firstNightCity,
          nights: 1,
          hotel: '',
          tours: 0,
          mandatoryTours: 0,
          roomSelections: []
        });
      }
      
      if (lastNightCity && lastNightCity !== firstNightCity) {
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
    }
  }, [data.arrivalAirport, data.departureAirport]);

  // Auto-calculate recommended rooms and car type
  useEffect(() => {
    const totalAdults = data.adults + data.children.filter(child => child.age > 6).length;
    const recommendedRooms = Math.ceil(totalAdults / 2);
    
    // Auto-set rooms if not set
    if (data.rooms !== recommendedRooms) {
      updateData({ rooms: recommendedRooms });
    }

    // Auto-set car type based on people count
    const totalPeople = data.adults + data.children.filter(child => child.age > 6).length;
    let recommendedCar = 'سيدان';
    if (totalPeople <= 3) recommendedCar = 'سيدان';
    else if (totalPeople <= 6) recommendedCar = 'ميني فان';
    else if (totalPeople <= 8) recommendedCar = 'فان';
    else if (totalPeople <= 14) recommendedCar = 'سبرنتر';
    else recommendedCar = 'باص';

    if (data.carType !== recommendedCar) {
      updateData({ carType: recommendedCar });
    }
  }, [data.adults, data.children]);

  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      nights: 2,
      hotel: '',
      tours: 1,
      mandatoryTours: 1,
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
    
    // Initialize room selections when hotel is selected
    if (field === 'hotel' && value !== '') {
      const roomSelections: RoomSelection[] = [];
      for (let i = 0; i < data.rooms; i++) {
        roomSelections.push({
          roomNumber: i + 1,
          roomType: 'dbl_wv' // Default to double room
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">المدن والفنادق</h2>
        <p className="text-gray-600">اختر المدن التي تريد زيارتها والفنادق المناسبة</p>
      </div>

      {/* Room Count and Car Type - Auto Selected */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Hotel className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-800">عدد الغرف المقترح</h3>
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

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800">نوع السيارة المقترح</h3>
          </div>
          <Select
            value={data.carType}
            onValueChange={(value) => updateData({ carType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transportData.map((transport) => (
                <SelectItem key={transport.type} value={transport.type}>
                  {transport.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
              {data.selectedCities.length > 1 && (
                <Button
                  onClick={() => removeCity(index)}
                  variant="destructive"
                  size="sm"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
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

              {/* Hotel Selection */}
              {cityStay.city && (
                <div className="space-y-2">
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
            </div>

            {/* Room Type Selection - Show after hotel is selected */}
            {cityStay.hotel && cityStay.roomSelections && (
              <div className="mt-6 space-y-4">
                <h5 className="font-medium text-gray-800">اختيار نوع الغرف:</h5>
                <div className="grid md:grid-cols-2 gap-4">
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
