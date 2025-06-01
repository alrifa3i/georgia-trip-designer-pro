import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingData, CityStay, RoomSelection } from '@/types/booking';
import { hotelData, availableTours, airportCityMapping } from '@/data/hotels';
import { Plus, Minus, MapPin, Building2, Car, Info, Hotel, Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CitySelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
}

export const CitySelectionStep = ({ data, updateData }: CitySelectionStepProps) => {
  const availableCities = Object.keys(hotelData);

  const roomTypes = [
    { id: 'single', label: 'غرفة مفردة مع إفطار (بدون إطلالة)', capacity: 1, hasView: false },
    { id: 'single_v', label: 'غرفة مفردة مع إفطار (مع إطلالة)', capacity: 1, hasView: true },
    { id: 'dbl_wv', label: 'غرفة مزدوجة مع إفطار (بدون إطلالة)', capacity: 2, hasView: false },
    { id: 'dbl_v', label: 'غرفة مزدوجة مع إفطار (مع إطلالة)', capacity: 2, hasView: true },
    { id: 'trbl_wv', label: 'غرفة ثلاثية مع إفطار (بدون إطلالة)', capacity: 3, hasView: false },
    { id: 'trbl_v', label: 'غرفة ثلاثية مع إفطار (مع إطلالة)', capacity: 3, hasView: true }
  ];

  // Calculate total people
  const totalPeople = data.adults + data.children.length;
  
  // Calculate minimum rooms needed
  const getMinimumRoomsNeeded = () => {
    // Adults + children over 6 need bed space
    const peopleNeedingBeds = data.adults + data.children.filter(child => child.age > 6).length;
    return Math.ceil(peopleNeedingBeds / 3); // Maximum 3 people per room (triple)
  };

  const minimumRooms = getMinimumRoomsNeeded();

  // Calculate mandatory tours for a city
  const getMandatoryTours = (cityName: string, isArrivalCity: boolean) => {
    if (isArrivalCity && cityName !== 'باتومي') {
      return 0; // No mandatory tours for arrival city except Batumi
    }
    if (cityName === 'باتومي') {
      return 2; // Batumi always has 2 mandatory tours
    }
    return 1; // All other cities have 1 mandatory tour
  };

  // Sort hotels by average price (cheapest first) using correct price fields
  const sortHotelsByPrice = (hotels: any[]) => {
    return hotels.sort((a, b) => {
      const avgPriceA = ((a.double_without_view_price || 0) + (a.double_view_price || 0)) / 2;
      const avgPriceB = ((b.double_without_view_price || 0) + (b.double_view_price || 0)) / 2;
      return avgPriceA - avgPriceB;
    });
  };

  // Sort room types by price (cheapest first), ensuring view rooms are more expensive
  const sortRoomsByPrice = (hotel: any) => {
    const roomEntries = [
      { roomType: 'single', price: hotel.single_price || hotel.double_without_view_price || 0, roomInfo: roomTypes.find(rt => rt.id === 'single') },
      { roomType: 'single_v', price: hotel.single_view_price || hotel.double_view_price || 0, roomInfo: roomTypes.find(rt => rt.id === 'single_v') },
      { roomType: 'dbl_wv', price: hotel.double_without_view_price || 0, roomInfo: roomTypes.find(rt => rt.id === 'dbl_wv') },
      { roomType: 'dbl_v', price: hotel.double_view_price || 0, roomInfo: roomTypes.find(rt => rt.id === 'dbl_v') },
      { roomType: 'trbl_wv', price: hotel.triple_without_view_price || 0, roomInfo: roomTypes.find(rt => rt.id === 'trbl_wv') },
      { roomType: 'trbl_v', price: hotel.triple_view_price || 0, roomInfo: roomTypes.find(rt => rt.id === 'trbl_v') }
    ]
    .filter(entry => entry.price > 0 && entry.roomInfo) // Only include rooms with valid prices
    .sort((a, b) => {
      // First sort by capacity, then by view (no view cheaper than with view)
      if (a.roomInfo!.capacity !== b.roomInfo!.capacity) {
        return a.roomInfo!.capacity - b.roomInfo!.capacity;
      }
      if (a.roomInfo!.hasView !== b.roomInfo!.hasView) {
        return a.roomInfo!.hasView ? 1 : -1; // No view comes first (cheaper)
      }
      return a.price - b.price;
    });
    
    return roomEntries;
  };

  // Auto-add first and last night cities based on airports
  const autoAddAirportCities = () => {
    const firstNightCity = airportCityMapping[data.arrivalAirport];
    const lastNightCity = airportCityMapping[data.departureAirport];
    
    const newCities = [...data.selectedCities];
    
    // Check if first night city is already added
    const hasFirstNightCity = newCities.some(city => city.city === firstNightCity);
    if (!hasFirstNightCity && firstNightCity) {
      const mandatoryTours = getMandatoryTours(firstNightCity, true);
      newCities.unshift({
        city: firstNightCity,
        nights: 1,
        hotel: '',
        tours: 0,
        mandatoryTours: mandatoryTours,
        roomSelections: []
      });
    }
    
    // Check if last night city is already added and different from first
    const hasLastNightCity = newCities.some(city => city.city === lastNightCity);
    if (!hasLastNightCity && lastNightCity && lastNightCity !== firstNightCity) {
      const mandatoryTours = getMandatoryTours(lastNightCity, false);
      newCities.push({
        city: lastNightCity,
        nights: 1,
        hotel: '',
        tours: 0,
        mandatoryTours: mandatoryTours,
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
    
    // Update mandatory tours when city is selected
    if (field === 'city') {
      const arrivalCity = airportCityMapping[data.arrivalAirport];
      const isArrivalCity = value === arrivalCity;
      newCities[index].mandatoryTours = getMandatoryTours(value as string, isArrivalCity);
      
      // Update available tours based on selected city
      if (value && availableTours[value as string]) {
        newCities[index].availableTours = availableTours[value as string].map(tour => tour.name);
      }
      
      // Reset hotel and room selections when city changes
      newCities[index].hotel = '';
      newCities[index].roomSelections = [];
    }
    
    // Reset room selections when hotel changes
    if (field === 'hotel') {
      newCities[index].roomSelections = [];
    }
    
    updateData({ selectedCities: newCities });
  };

  const addRoom = (cityIndex: number) => {
    const newCities = [...data.selectedCities];
    const currentRooms = newCities[cityIndex].roomSelections || [];
    const newRoom: RoomSelection = {
      roomNumber: currentRooms.length + 1,
      roomType: ''
    };
    newCities[cityIndex].roomSelections = [...currentRooms, newRoom];
    updateData({ selectedCities: newCities });
  };

  const removeRoom = (cityIndex: number, roomIndex: number) => {
    const newCities = [...data.selectedCities];
    newCities[cityIndex].roomSelections = newCities[cityIndex].roomSelections?.filter((_, i) => i !== roomIndex);
    // Renumber remaining rooms
    newCities[cityIndex].roomSelections?.forEach((room, i) => {
      room.roomNumber = i + 1;
    });
    updateData({ selectedCities: newCities });
  };

  const updateRoomSelection = (cityIndex: number, roomIndex: number, roomType: string) => {
    const newCities = [...data.selectedCities];
    if (newCities[cityIndex].roomSelections) {
      newCities[cityIndex].roomSelections![roomIndex].roomType = roomType;
      updateData({ selectedCities: newCities });
    }
  };

  // Validate room capacity
  const validateRoomCapacity = () => {
    const totalRoomCapacity = data.selectedCities.reduce((total, city) => {
      if (!city.roomSelections) return total;
      return total + city.roomSelections.reduce((cityTotal, room) => {
        const roomInfo = roomTypes.find(rt => rt.id === room.roomType);
        return cityTotal + (roomInfo?.capacity || 0);
      }, 0);
    }, 0);
    
    return totalRoomCapacity >= totalPeople;
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

  const getTotalTours = () => {
    const mandatoryTours = data.selectedCities.reduce((total, city) => total + (city.mandatoryTours || 0), 0);
    const optionalTours = data.selectedCities.reduce((total, city) => total + city.tours, 0);
    return { mandatory: mandatoryTours, optional: optionalTours, total: mandatoryTours + optionalTours + 2 }; // +2 for reception and farewell
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

      {/* Room Capacity Validation */}
      {data.selectedCities.some(city => city.roomSelections?.length > 0) && !validateRoomCapacity() && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            سعة الغرف المختارة غير كافية لعدد الأشخاص ({totalPeople} أشخاص). الرجاء إضافة غرف أو تغيير أنواع الغرف.
          </AlertDescription>
        </Alert>
      )}

      {/* Minimum Rooms Warning */}
      {data.rooms < minimumRooms && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            تحتاج إلى {minimumRooms} غرف على الأقل لعدد الأشخاص ({totalPeople} أشخاص).
          </AlertDescription>
        </Alert>
      )}

      {/* Room Count Selection */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Hotel className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-purple-800">عدد الغرف المطلوبة</h3>
          <span className="text-sm text-gray-600">({totalPeople} أشخاص - الحد الأدنى {minimumRooms} غرف)</span>
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

      {/* Airport-based accommodation notice */}
      {data.arrivalAirport && data.departureAirport && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p><strong>يوم الوصول:</strong> استقبال في {airportCityMapping[data.arrivalAirport]}</p>
              {data.arrivalAirport !== data.departureAirport && (
                <p><strong>يوم المغادرة:</strong> توديع من {airportCityMapping[data.departureAirport]}</p>
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
        {data.selectedCities.map((cityStay, index) => {
          const cityHotels = cityStay.city ? sortHotelsByPrice(hotelData[cityStay.city] || []) : [];
          const selectedHotel = cityHotels.find(h => h.name === cityStay.hotel);
          const isArrivalCity = cityStay.city === airportCityMapping[data.arrivalAirport];

          return (
            <div key={index} className="p-6 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-lg">
                  المدينة {index + 1}
                  {isArrivalCity && <span className="text-blue-600 text-sm mr-2">(مدينة الوصول)</span>}
                </h4>
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
                    اختر الفندق (مرتبة من الأرخص إلى الأغلى)
                  </Label>
                  <Select
                    value={cityStay.hotel}
                    onValueChange={(value) => updateCity(index, 'hotel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent>
                      {cityHotels.map((hotel, hotelIndex) => (
                        <SelectItem key={hotel.name} value={hotel.name}>
                          <div className="flex justify-between items-center w-full">
                            <span>{hotel.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-500">{'⭐'.repeat(hotel.rating)}</span>
                              {hotelIndex === 0 && <span className="text-green-600 text-xs">(الأرخص)</span>}
                              {hotelIndex === cityHotels.length - 1 && cityHotels.length > 1 && 
                                <span className="text-blue-600 text-xs">(الأغلى)</span>}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Room Selection */}
              {selectedHotel && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-800">
                      اختيار الغرف (مرتبة من الأرخص إلى الأغلى)
                    </h5>
                    <Button
                      onClick={() => addRoom(index)}
                      variant="outline"
                      size="sm"
                      className="bg-green-50 hover:bg-green-100"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      إضافة غرفة
                    </Button>
                  </div>

                  {(!cityStay.roomSelections || cityStay.roomSelections.length === 0) ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Hotel className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 mb-3">لم يتم إضافة غرف بعد</p>
                      <Button
                        onClick={() => addRoom(index)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        إضافة غرفة
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cityStay.roomSelections.map((room, roomIndex) => {
                        const sortedRooms = sortRoomsByPrice(selectedHotel);
                        
                        return (
                          <div key={roomIndex} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium">الغرفة {room.roomNumber}</h5>
                              <Button
                                onClick={() => removeRoom(index, roomIndex)}
                                variant="destructive"
                                size="sm"
                              >
                                حذف
                              </Button>
                            </div>
                            
                            <Select
                              value={room.roomType}
                              onValueChange={(roomType) => updateRoomSelection(index, roomIndex, roomType)}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="اختر نوع الغرفة" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border shadow-lg z-50">
                                {sortedRooms.map(({ roomType, price, roomInfo }, roomTypeIndex) => (
                                  <SelectItem key={roomType} value={roomType}>
                                    <div className="flex justify-between items-center w-full">
                                      <span>{roomInfo!.label}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">({roomInfo!.capacity} أشخاص - ${price})</span>
                                        {roomTypeIndex === 0 && <span className="text-green-600 text-xs">(الأرخص)</span>}
                                        {roomTypeIndex === sortedRooms.length - 1 && sortedRooms.length > 1 && 
                                          <span className="text-blue-600 text-xs">(الأغلى)</span>}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {room.roomType && (
                              <div className="mt-2 text-sm text-green-600 font-medium">
                                ✅ تم اختيار: {roomTypes.find(rt => rt.id === room.roomType)?.label}
                                <div className="text-xs text-gray-500">
                                  السعر: ${sortedRooms.find(sr => sr.roomType === room.roomType)?.price || 0}/ليلة
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tours */}
              <div className="mt-4 space-y-2">
                <Label className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  الجولات السياحية
                  {cityStay.mandatoryTours > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      {cityStay.mandatoryTours} جولة إجبارية
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
                  المجموع: {cityStay.tours + (cityStay.mandatoryTours || 0)} جولة 
                  ({cityStay.mandatoryTours || 0} إجبارية + {cityStay.tours} اختيارية)
                </p>
              </div>

              {/* Available Tours Display */}
              {cityStay.availableTours && cityStay.availableTours.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 text-blue-800">الجولات المتاحة:</h5>
                  <div className="text-xs text-blue-700 space-y-1">
                    {cityStay.availableTours.map((tourName, tourIndex) => {
                      const tourDetails = availableTours[cityStay.city]?.find(tour => tour.name === tourName);
                      return (
                        <div key={tourIndex}>• {tourName} - {tourDetails?.description || ''}</div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {data.selectedCities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>سيتم إضافة مدن الإقامة تلقائياً حسب المطارات المختارة</p>
          <p className="text-sm">يمكنك إضافة مدن إضافية باستخدام زر "إضافة مدينة"</p>
        </div>
      )}

      {/* Progress Summary */}
      {data.selectedCities.length > 0 && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-emerald-800">ملخص التقدم</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-emerald-700">المدن: </span>
              <span className="font-medium">{data.selectedCities.length}</span>
            </div>
            <div>
              <span className="text-emerald-700">الليالي: </span>
              <span className={`font-medium ${getTotalNights() === minimumNights ? 'text-green-600' : 'text-red-600'}`}>
                {getTotalNights()}/{minimumNights}
              </span>
            </div>
            <div>
              <span className="text-emerald-700">الغرف: </span>
              <span className="font-medium">
                {data.selectedCities.reduce((total, city) => total + (city.roomSelections?.length || 0), 0)}
              </span>
            </div>
            <div>
              <span className="text-emerald-700">الجولات: </span>
              <span className="font-medium">
                {getTotalTours().total} (استقبال + {getTotalTours().mandatory + getTotalTours().optional} + توديع)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
