
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, MapPin, Hotel, Calendar, Plus } from 'lucide-react';
import { BookingData, CityStay, RoomSelection } from '@/types/booking';
import { hotelData, cities, transportData } from '@/data/hotels';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const roomTypeLabels = {
  single: 'مفرد',
  single_v: 'مفرد بإطلالة',
  dbl_wv: 'مزدوج بدون إطلالة',
  dbl_v: 'مزدوج بإطلالة',
  trbl_wv: 'ثلاثي بدون إطلالة',
  trbl_v: 'ثلاثي بإطلالة'
};

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const [errors, setErrors] = useState<{[key: number]: string}>({});

  const validateStep = () => {
    const newErrors: {[key: number]: string} = {};
    let isValid = true;

    data.selectedCities.forEach((city, index) => {
      if (!city.city || !city.hotel || city.nights <= 0 || !city.roomSelections || city.roomSelections.length === 0) {
        newErrors[index] = 'يرجى إكمال جميع البيانات المطلوبة';
        isValid = false;
      }
    });

    if (data.selectedCities.length === 0) {
      isValid = false;
    }

    if (!data.carType) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const isValid = validateStep();
    onValidationChange(isValid);
  }, [data.selectedCities, data.carType, onValidationChange]);

  // ترتيب الغرف من الأرخص إلى الأغلى (wv أولاً ثم v)
  const sortRoomsByPrice = (roomPrices: { [key: string]: number }) => {
    const sortedRooms = Object.entries(roomPrices)
      .filter(([key, value]) => typeof value === 'number' && ['single', 'single_v', 'dbl_wv', 'dbl_v', 'trbl_wv', 'trbl_v'].includes(key))
      .sort(([keyA, priceA], [keyB, priceB]) => {
        // ترتيب حسب السعر أولاً، ثم حسب النوع (wv قبل v)
        if (priceA !== priceB) return priceA - priceB;
        if (keyA.includes('wv') && keyB.includes('_v')) return -1;
        if (keyA.includes('_v') && keyB.includes('wv')) return 1;
        return 0;
      });
    return sortedRooms;
  };

  // Extract room prices from hotel object
  const extractRoomPrices = (hotel: any) => {
    const roomPrices: { [key: string]: number } = {};
    const roomKeys = ['single', 'single_v', 'dbl_wv', 'dbl_v', 'trbl_wv', 'trbl_v'];
    
    roomKeys.forEach(key => {
      if (typeof hotel[key] === 'number') {
        roomPrices[key] = hotel[key];
      }
    });
    
    return roomPrices;
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

    updateData({
      selectedCities: [...data.selectedCities, newCity]
    });
  };

  // حذف مدينة
  const removeCity = (index: number) => {
    const updatedCities = data.selectedCities.filter((_, i) => i !== index);
    updateData({ selectedCities: updatedCities });
  };

  // تحديث بيانات المدينة
  const updateCity = (index: number, updates: Partial<CityStay>) => {
    const updatedCities = [...data.selectedCities];
    updatedCities[index] = { ...updatedCities[index], ...updates };
    updateData({ selectedCities: updatedCities });
  };

  // تحديث الغرفة
  const updateRoom = (cityIndex: number, roomIndex: number, updates: Partial<RoomSelection>) => {
    const updatedCities = [...data.selectedCities];
    if (!updatedCities[cityIndex].roomSelections) {
      updatedCities[cityIndex].roomSelections = [];
    }
    updatedCities[cityIndex].roomSelections![roomIndex] = { 
      ...updatedCities[cityIndex].roomSelections![roomIndex], 
      ...updates 
    };
    updateData({ selectedCities: updatedCities });
  };

  // إضافة غرفة جديدة
  const addRoom = (cityIndex: number) => {
    const updatedCities = [...data.selectedCities];
    if (!updatedCities[cityIndex].roomSelections) {
      updatedCities[cityIndex].roomSelections = [];
    }
    
    const roomNumber = updatedCities[cityIndex].roomSelections!.length + 1;
    updatedCities[cityIndex].roomSelections!.push({
      roomNumber,
      roomType: 'dbl_wv'
    });
    
    updateData({ selectedCities: updatedCities });
  };

  // حذف غرفة
  const removeRoom = (cityIndex: number, roomIndex: number) => {
    const updatedCities = [...data.selectedCities];
    updatedCities[cityIndex].roomSelections = updatedCities[cityIndex].roomSelections?.filter((_, i) => i !== roomIndex) || [];
    
    // إعادة ترقيم الغرف
    updatedCities[cityIndex].roomSelections?.forEach((room, index) => {
      room.roomNumber = index + 1;
    });
    
    updateData({ selectedCities: updatedCities });
  };

  // معالجة تغيير الفندق
  const handleHotelChange = (cityIndex: number, hotelName: string) => {
    const cityHotels = hotelData[data.selectedCities[cityIndex].city] || [];
    const selectedHotel = cityHotels.find(h => h.name === hotelName);

    // تحديث الفندق
    updateCity(cityIndex, { hotel: hotelName });

    // إضافة أول غرفة تلقائياً عند اختيار الفندق
    if (selectedHotel) {
      const roomPrices = extractRoomPrices(selectedHotel);
      const sortedRooms = sortRoomsByPrice(roomPrices);
      if (sortedRooms.length > 0) {
        const firstRoom: RoomSelection = {
          roomNumber: 1,
          roomType: sortedRooms[0][0]
        };
        
        updateCity(cityIndex, { 
          hotel: hotelName,
          roomSelections: [firstRoom]
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">حدد المدن التي تود زيارتها والفنادق المفضلة</p>
      </div>

      {/* إضافة المدينة الأولى إذا لم تكن موجودة */}
      {data.selectedCities.length === 0 && (
        <div className="text-center py-8">
          <Button onClick={addCity} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مدينة
          </Button>
        </div>
      )}

      {/* عرض المدن المحددة */}
      {data.selectedCities.map((city, cityIndex) => {
        const cityHotels = hotelData[city.city] || [];
        const selectedHotel = cityHotels.find(h => h.name === city.hotel);

        return (
          <div key={cityIndex} className="space-y-4">
            <Card className="border-2 border-emerald-200">
              <CardHeader className="bg-emerald-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <MapPin className="w-5 h-5" />
                    المدينة {cityIndex + 1}
                  </CardTitle>
                  {data.selectedCities.length > 1 && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeCity(cityIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* اختيار المدينة */}
                  <div>
                    <Label>المدينة</Label>
                    <Select 
                      value={city.city} 
                      onValueChange={(value) => updateCity(cityIndex, { city: value, hotel: '', roomSelections: [] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(cityName => (
                          <SelectItem key={cityName} value={cityName}>{cityName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* عدد الليالي */}
                  <div>
                    <Label>عدد الليالي</Label>
                    <Input
                      type="number"
                      min="1"
                      value={city.nights}
                      onChange={(e) => updateCity(cityIndex, { nights: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  {/* عدد الجولات */}
                  <div>
                    <Label>عدد الجولات السياحية</Label>
                    <Input
                      type="number"
                      min="0"
                      value={city.tours}
                      onChange={(e) => updateCity(cityIndex, { tours: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* اختيار الفندق */}
                {city.city && (
                  <div>
                    <Label className="flex items-center gap-2">
                      <Hotel className="w-4 h-4" />
                      الفندق
                    </Label>
                    <Select 
                      value={city.hotel} 
                      onValueChange={(value) => handleHotelChange(cityIndex, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفندق" />
                      </SelectTrigger>
                      <SelectContent>
                        {cityHotels.map(hotel => (
                          <SelectItem key={hotel.name} value={hotel.name}>
                            <div className="flex justify-between items-center w-full">
                              <span>{hotel.name}</span>
                              <span className="text-sm text-gray-500">
                                ⭐ {hotel.rating} - {hotel.distanceFromCenter}كم من المركز
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* تفاصيل الغرف */}
                {city.hotel && selectedHotel && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">تفاصيل الغرف</Label>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => addRoom(cityIndex)}
                      >
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة غرفة
                      </Button>
                    </div>

                    {!city.roomSelections || city.roomSelections.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        لم يتم اختيار غرف بعد
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {city.roomSelections.map((room, roomIndex) => {
                          const roomPrices = extractRoomPrices(selectedHotel);
                          const sortedRooms = sortRoomsByPrice(roomPrices);
                          
                          return (
                            <div key={roomIndex} className="p-4 bg-gray-50 rounded-lg border">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">الغرفة {room.roomNumber}</h4>
                                {city.roomSelections!.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeRoom(cityIndex, roomIndex)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              
                              <div>
                                <Label>نوع الغرفة</Label>
                                <Select 
                                  value={room.roomType} 
                                  onValueChange={(value) => updateRoom(cityIndex, roomIndex, { roomType: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sortedRooms.map(([roomType, price]) => (
                                      <SelectItem key={roomType} value={roomType}>
                                        <div className="flex justify-between items-center w-full">
                                          <span>{roomTypeLabels[roomType as keyof typeof roomTypeLabels]}</span>
                                          <span className="text-sm text-green-600 font-medium mr-4">
                                            ${price}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {errors[cityIndex] && (
                  <div className="text-red-600 text-sm">{errors[cityIndex]}</div>
                )}
              </CardContent>
            </Card>

            {/* زر إضافة مدينة بعد كل مدينة */}
            <div className="text-center py-2">
              <Button 
                onClick={addCity} 
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة مدينة أخرى
              </Button>
            </div>
          </div>
        );
      })}

      {/* اختيار نوع السيارة */}
      <Card>
        <CardHeader>
          <CardTitle>نوع السيارة والنقل</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>اختر نوع السيارة</Label>
          <Select value={data.carType} onValueChange={(value) => updateData({ carType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع السيارة" />
            </SelectTrigger>
            <SelectContent>
              {transportData.map(transport => (
                <SelectItem key={transport.type} value={transport.type}>
                  <div className="flex justify-between items-center w-full">
                    <span>{transport.type}</span>
                    <span className="text-sm text-gray-500 mr-4">
                      ({transport.capacity}) - ${transport.price}/جولة
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};
