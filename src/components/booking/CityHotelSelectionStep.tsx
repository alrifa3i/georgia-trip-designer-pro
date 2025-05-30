
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingData, CityStay, RoomSelection } from '@/types/booking';
import { hotelData, transportData, airportCityMapping } from '@/data/hotels';
import { Plus, Minus, MapPin, Building2, Car, Hotel, AlertTriangle, Info, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const CityHotelSelectionStep = ({ data, updateData }: CityHotelSelectionStepProps) => {
  const availableCities = Object.keys(hotelData);

  // Room types sorted by price (cheapest to most expensive)
  const roomTypes = [
    { id: 'dbl_wv', label: 'غرفة مزدوجة مع إفطار (بدون إطلالة) - الأرخص', capacity: 2 },
    { id: 'dbl_v', label: 'غرفة مزدوجة مع إفطار (مع إطلالة)', capacity: 2 },
    { id: 'single', label: 'غرفة مفردة مع إفطار (بدون إطلالة)', capacity: 1 },
    { id: 'single_v', label: 'غرفة مفردة مع إفطار (مع إطلالة)', capacity: 1 },
    { id: 'trbl_wv', label: 'غرفة ثلاثية مع إفطار (بدون إطلالة)', capacity: 3 },
    { id: 'trbl_v', label: 'غرفة ثلاثية مع إفطار (مع إطلالة) - الأغلى', capacity: 3 }
  ];

  // Get total nights from dates
  const getTotalNights = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      const diffInTime = departure.getTime() - arrival.getTime();
      return Math.max(0, Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) - 1);
    }
    return 0;
  };

  const totalNights = getTotalNights();
  const currentNights = data.selectedCities.reduce((sum, city) => sum + city.nights, 0);

  // Sort hotels by price (cheapest to most expensive)
  const getSortedHotels = (cityName: string) => {
    const hotels = hotelData[cityName] || [];
    return hotels.sort((a, b) => {
      const aPrice = Math.min(a.dbl_wv || 999, a.dbl_v || 999, a.single || 999);
      const bPrice = Math.min(b.dbl_wv || 999, b.dbl_v || 999, b.single || 999);
      return aPrice - bPrice;
    });
  };

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
          mandatoryTours: firstNightCity === 'باتومي' ? 2 : 1,
          roomSelections: []
        });
      }
      
      if (lastNightCity && lastNightCity !== firstNightCity) {
        newCities.push({
          city: lastNightCity,
          nights: 1,
          hotel: '',
          tours: 0,
          mandatoryTours: lastNightCity === 'باتومي' ? 2 : 1,
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
    
    if (data.rooms !== recommendedRooms) {
      updateData({ rooms: recommendedRooms });
    }

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
      tours: 0,
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
    
    // Set mandatory tours based on city
    if (field === 'city') {
      newCities[index].mandatoryTours = value === 'باتومي' ? 2 : 1;
    }
    
    // Initialize room selections when hotel is selected
    if (field === 'hotel' && value !== '') {
      const roomSelections: RoomSelection[] = [];
      for (let i = 0; i < data.rooms; i++) {
        roomSelections.push({
          roomNumber: i + 1,
          roomType: 'dbl_wv' // Default to cheapest option
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

      {/* Nights Balance Alert */}
      {totalNights > 0 && (
        <Alert className={currentNights === totalNights ? "border-green-500 bg-green-50" : "border-orange-500 bg-orange-50"}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {currentNights === totalNights ? (
              <span className="text-green-700">✅ عدد الليالي متطابق: {currentNights} من {totalNights} ليلة</span>
            ) : (
              <span className="text-orange-700">
                ⚠️ عدد الليالي غير متطابق: {currentNights} من {totalNights} ليلة مطلوبة
                {currentNights < totalNights && ` (نقص ${totalNights - currentNights} ليالي)`}
                {currentNights > totalNights && ` (زيادة ${currentNights - totalNights} ليالي)`}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Room Count and Car Type */}
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

      {/* Pricing Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-blue-700">
          <strong>ملاحظة:</strong> الفنادق والغرف مرتبة من الأرخص إلى الأغلى لمساعدتك في الاختيار المناسب لميزانيتك
        </AlertDescription>
      </Alert>

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
                    اختر الفندق (مرتب من الأرخص)
                  </Label>
                  <Select
                    value={cityStay.hotel}
                    onValueChange={(value) => updateCity(index, 'hotel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSortedHotels(cityStay.city).map((hotel, hotelIndex) => (
                        <SelectItem key={hotel.name} value={hotel.name}>
                          <div className="flex justify-between items-center w-full">
                            <span>{hotel.name}</span>
                            <div className="flex items-center gap-2 mr-4">
                              {hotelIndex === 0 && <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">الأرخص</span>}
                              {hotel.rating && (
                                <span className="text-sm text-gray-500">
                                  {hotel.rating} نجوم
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Tours Display */}
            {cityStay.city && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  الجولات السياحية
                </h5>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-yellow-700">الجولات الإجبارية: </span>
                    <span className="font-bold">{cityStay.mandatoryTours}</span>
                    {cityStay.city === 'باتومي' && (
                      <span className="text-xs text-yellow-600 block">(باتومي تتطلب جولتين إجباريتين)</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-yellow-700">الجولات الإضافية: </span>
                    <span>{cityStay.tours || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Room Type Selection */}
            {cityStay.hotel && cityStay.roomSelections && (
              <div className="mt-6 space-y-4">
                <h5 className="font-medium text-gray-800">اختيار نوع الغرف (مرتبة من الأرخص):</h5>
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
