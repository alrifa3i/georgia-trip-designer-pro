
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, RoomSelection, CityStay } from '@/types/booking';
import { hotelData, transportData, cities } from '@/data/hotels';
import { currencies, convertFromUSD, formatCurrency } from '@/data/currencies';
import { MapPin, Building2, Car, Users, Bed, Clock, AlertTriangle, Plus, Minus, Info } from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const [totalSelectedNights, setTotalSelectedNights] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const getDuration = () => {
    if (data.arrivalDate && data.departureDate) {
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const requiredNights = getDuration();
  const selectedCurrency = currencies.find(c => c.code === data.currency) || currencies[0];

  const getRoomTypeName = (roomType: string) => {
    const roomTypes: { [key: string]: string } = {
      'single': 'غرفة مفردة (بدون إطلالة)',
      'single_v': 'غرفة مفردة (مع إطلالة)',
      'dbl_wv': 'غرفة مزدوجة (بدون إطلالة)',
      'dbl_v': 'غرفة مزدوجة (مع إطلالة)',
      'trbl_wv': 'غرفة ثلاثية (بدون إطلالة)',
      'trbl_v': 'غرفة ثلاثية (مع إطلالة)'
    };
    return roomTypes[roomType] || roomType;
  };

  // ترتيب الفنادق من الأرخص إلى الأغلى
  const sortHotelsByPrice = (hotels: any[]) => {
    return hotels.sort((a, b) => {
      const avgPriceA = (a.dbl_wv + a.dbl_v) / 2;
      const avgPriceB = (b.dbl_wv + b.dbl_v) / 2;
      return avgPriceA - avgPriceB;
    });
  };

  // ترتيب الغرف من الأرخص إلى الأغلى
  const sortRoomsByPrice = (roomTypes: { [key: string]: number }) => {
    const sortedRooms = Object.entries(roomTypes)
      .filter(([key, value]) => typeof value === 'number' && ['single', 'single_v', 'dbl_wv', 'dbl_v', 'trbl_wv', 'trbl_v'].includes(key))
      .sort(([, a], [, b]) => a - b);
    return sortedRooms;
  };

  // إضافة مدينة جديدة
  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      nights: 1,
      hotel: '',
      tours: 0,
      mandatoryTours: 0,
      roomSelections: []
    };
    updateData({ selectedCities: [...data.selectedCities, newCity] });
  };

  // حذف مدينة
  const removeCity = (cityIndex: number) => {
    const newCities = data.selectedCities.filter((_, i) => i !== cityIndex);
    updateData({ selectedCities: newCities });
  };

  // تحديث بيانات المدينة
  const updateCity = (cityIndex: number, field: keyof CityStay, value: string | number) => {
    const newCities = [...data.selectedCities];
    newCities[cityIndex] = { ...newCities[cityIndex], [field]: value };
    
    if (field === 'city') {
      newCities[cityIndex].hotel = '';
      newCities[cityIndex].roomSelections = [];
    }
    
    if (field === 'hotel' && value !== '') {
      newCities[cityIndex].roomSelections = [];
    }
    
    updateData({ selectedCities: newCities });
  };

  const validateStep = () => {
    const errors: string[] = [];
    
    if (data.selectedCities.length === 0) {
      errors.push('لم يتم تحديد أي مدن - الرجاء إضافة مدينة واحدة على الأقل');
    }
    
    if (totalSelectedNights !== requiredNights && data.selectedCities.length > 0 && requiredNights > 0) {
      errors.push(`المطلوب ${requiredNights} ليلة، تم اختيار ${totalSelectedNights} ليلة - الرجاء تعديل عدد الليالي`);
    }
    
    data.selectedCities.forEach((city, index) => {
      if (!city.city) {
        errors.push(`المدينة ${index + 1}: لم يتم اختيار المدينة`);
      }
      if (!city.hotel && city.city) {
        errors.push(`${city.city}: لم يتم اختيار الفندق`);
      }
      if ((!city.roomSelections || city.roomSelections.length === 0) && city.hotel) {
        errors.push(`${city.city}: لم يتم تحديد الغرف`);
      }
      if (city.roomSelections && city.roomSelections.length > 0) {
        city.roomSelections.forEach((room, roomIndex) => {
          if (!room.roomType) {
            errors.push(`${city.city} - الغرفة ${room.roomNumber}: لم يتم اختيار نوع الغرفة`);
          }
        });
      }
    });
    
    if (!data.carType) {
      errors.push('نوع السيارة غير محدد');
    }
    
    setValidationErrors(errors);
    const isValid = errors.length === 0;
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  };

  useEffect(() => {
    const total = data.selectedCities.reduce((sum, city) => sum + city.nights, 0);
    setTotalSelectedNights(total);
    validateStep();
  }, [data.selectedCities, data.carType, requiredNights]);

  const updateCityHotel = (cityIndex: number, hotelName: string) => {
    const newCities = [...data.selectedCities];
    newCities[cityIndex] = {
      ...newCities[cityIndex],
      hotel: hotelName,
      roomSelections: []
    };
    updateData({ selectedCities: newCities });
  };

  const addRoom = (cityIndex: number) => {
    const newCities = [...data.selectedCities];
    const city = newCities[cityIndex];
    const newRoom: RoomSelection = {
      roomNumber: city.roomSelections ? city.roomSelections.length + 1 : 1,
      roomType: ''
    };
    city.roomSelections = [...(city.roomSelections || []), newRoom];
    newCities[cityIndex] = city;
    updateData({ selectedCities: newCities });
  };

  const removeRoom = (cityIndex: number, roomIndex: number) => {
    const newCities = [...data.selectedCities];
    const city = newCities[cityIndex];
    city.roomSelections = city.roomSelections?.filter((_, index) => index !== roomIndex);
    newCities[cityIndex] = city;
    updateData({ selectedCities: newCities });
  };

  const updateRoomType = (cityIndex: number, roomIndex: number, roomType: string) => {
    const newCities = [...data.selectedCities];
    const city = newCities[cityIndex];
    city.roomSelections = city.roomSelections?.map((room, index) =>
      index === roomIndex ? { ...room, roomType } : room
    );
    newCities[cityIndex] = city;
    updateData({ selectedCities: newCities });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">اختر المدن والفنادق والغرف والجولات لرحلتك</p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">الرجاء إكمال البيانات التالية:</p>
              <ul className="text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Trip Duration Info */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">مدة الرحلة: </span>
              <span>{getDuration()} أيام</span>
            </div>
            <div>
              <span className="font-medium">الليالي المطلوبة: </span>
              <span>{requiredNights} ليلة</span>
            </div>
            <div>
              <span className="font-medium">الليالي المختارة: </span>
              <span className={totalSelectedNights === requiredNights ? 'text-green-600' : 'text-red-600'}>
                {totalSelectedNights} ليلة
              </span>
            </div>
            <div>
              <span className="font-medium">الفرق: </span>
              <span className={totalSelectedNights === requiredNights ? 'text-green-600' : 'text-red-600'}>
                {totalSelectedNights - requiredNights} ليلة
              </span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Add City Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المدن المختارة ({data.selectedCities.length})</h3>
        <Button onClick={addCity} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          إضافة مدينة
        </Button>
      </div>

      {/* Cities and Hotels */}
      <div className="space-y-6">
        {data.selectedCities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد مدن محددة</h3>
            <p className="text-sm text-gray-500 mb-4">ابدأ بإضافة مدينة لتخطيط رحلتك</p>
            <Button onClick={addCity} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              إضافة أول مدينة
            </Button>
          </div>
        ) : (
          data.selectedCities.map((city, cityIndex) => {
            const cityHotels = city.city ? sortHotelsByPrice(hotelData[city.city] || []) : [];
            const selectedHotel = cityHotels.find(h => h.name === city.hotel);

            return (
              <Card key={cityIndex} className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>المدينة {cityIndex + 1}</span>
                      {city.city && <span className="text-blue-600">- {city.city}</span>}
                      {city.nights > 0 && <span className="text-sm text-gray-600">({city.nights} ليالي)</span>}
                    </div>
                    <Button
                      onClick={() => removeCity(cityIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  
                  {/* 1. اختيار المدينة */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800 border-b pb-2">1. اختيار المدينة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">المدينة *</label>
                        <Select
                          value={city.city || ''}
                          onValueChange={(value) => updateCity(cityIndex, 'city', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            {cities.map((cityName) => (
                              <SelectItem key={cityName} value={cityName}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {cityName}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">عدد الليالي *</label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateCity(cityIndex, 'nights', Math.max(1, city.nights - 1))}
                            disabled={city.nights <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold bg-gray-100 py-2 px-3 rounded">
                            {city.nights}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateCity(cityIndex, 'nights', city.nights + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. اختيار الفندق */}
                  {city.city && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800 border-b pb-2">
                        2. اختيار الفندق 
                        <span className="text-sm font-normal text-gray-600 mr-2">(مرتبة من الأرخص إلى الأغلى)</span>
                      </h4>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">الفندق *</label>
                        <Select
                          value={city.hotel || ''}
                          onValueChange={(hotelName) => updateCityHotel(cityIndex, hotelName)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="اختر الفندق" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            {cityHotels.length === 0 ? (
                              <div className="p-2 text-sm text-gray-500">لا توجد فنادق متاحة لهذه المدينة</div>
                            ) : (
                              cityHotels.map((hotel, index) => (
                                <SelectItem key={hotel.name} value={hotel.name}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>{hotel.name}</span>
                                    <span className="text-yellow-500">{'⭐'.repeat(hotel.rating)}</span>
                                    {index === 0 && <span className="text-green-600 text-xs">(الأرخص)</span>}
                                    {index === cityHotels.length - 1 && cityHotels.length > 1 && <span className="text-blue-600 text-xs">(الأغلى)</span>}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* 3. اختيار الغرف */}
                  {selectedHotel && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-medium text-gray-800">
                          3. اختيار الغرف والأنواع
                          <span className="text-sm font-normal text-gray-600 mr-2">(مرتبة من الأرخص إلى الأغلى)</span>
                        </h4>
                        <Button
                          onClick={() => addRoom(cityIndex)}
                          variant="outline"
                          size="sm"
                          className="bg-green-50 hover:bg-green-100"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          إضافة غرفة
                        </Button>
                      </div>

                      {/* الغرف المحددة */}
                      {(!city.roomSelections || city.roomSelections.length === 0) ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Bed className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-600 mb-3">لم يتم إضافة غرف بعد</p>
                          <Button
                            onClick={() => addRoom(cityIndex)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            إضافة أول غرفة
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {city.roomSelections.map((room, roomIndex) => {
                            const sortedRooms = sortRoomsByPrice(selectedHotel);
                            
                            return (
                              <div key={roomIndex} className="p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium">الغرفة {room.roomNumber}</h5>
                                  <Button
                                    onClick={() => removeRoom(cityIndex, roomIndex)}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    حذف
                                  </Button>
                                </div>
                                
                                <Select
                                  value={room.roomType}
                                  onValueChange={(roomType) => updateRoomType(cityIndex, roomIndex, roomType)}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="اختر نوع الغرفة" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border shadow-lg z-50">
                                    {sortedRooms.map(([roomType, price], index) => (
                                      <SelectItem key={roomType} value={roomType}>
                                        <div className="flex justify-between items-center w-full">
                                          <span>{getRoomTypeName(roomType)}</span>
                                          {index === 0 && <span className="text-green-600 text-xs mr-2">(الأرخص)</span>}
                                          {index === sortedRooms.length - 1 && sortedRooms.length > 1 && <span className="text-blue-600 text-xs mr-2">(الأغلى)</span>}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                {room.roomType && (
                                  <div className="mt-2 text-sm text-green-600 font-medium">
                                    ✅ تم اختيار: {getRoomTypeName(room.roomType)}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. الجولات السياحية */}
                  {city.hotel && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800 border-b pb-2">4. الجولات السياحية</h4>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">عدد الجولات السياحية (اختياري)</label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateCity(cityIndex, 'tours', Math.max(0, city.tours - 1))}
                            disabled={city.tours <= 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold bg-gray-100 py-2 px-3 rounded">
                            {city.tours}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateCity(cityIndex, 'tours', city.tours + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          الجولات المتاحة في {city.city}: جولة المدينة، المعالم التاريخية، الطبيعة والمناظر
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Car Type Selection */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Car className="w-5 h-5" />
            اختيار نوع السيارة *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transportData.map((transport) => (
              <div
                key={transport.type}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  data.carType === transport.type
                    ? 'border-orange-500 bg-orange-100 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-orange-300'
                }`}
                onClick={() => updateData({ carType: transport.type })}
              >
                <div className="text-center">
                  <Car className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-medium text-gray-800 mb-1">{transport.type}</h4>
                  <p className="text-sm text-gray-600 mb-2">السعة: {transport.capacity}</p>
                  {data.carType === transport.type && (
                    <div className="text-green-600 font-medium mt-2">✅ محدد</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">ملخص التقدم</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-green-700">المدن: </span>
              <span className="font-medium">{data.selectedCities.length}</span>
            </div>
            <div>
              <span className="text-green-700">الليالي المطلوبة: </span>
              <span className="font-medium">{requiredNights}</span>
            </div>
            <div>
              <span className="text-green-700">الليالي المختارة: </span>
              <span className={`font-medium ${totalSelectedNights === requiredNights ? 'text-green-600' : 'text-red-600'}`}>
                {totalSelectedNights}
              </span>
            </div>
            <div>
              <span className="text-green-700">نوع السيارة: </span>
              <span className="font-medium">{data.carType || 'غير محدد'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
