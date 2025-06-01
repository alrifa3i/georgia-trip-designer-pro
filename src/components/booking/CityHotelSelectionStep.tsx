import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, CityStay, Hotel, RoomSelection } from '@/types/booking';
import { hotelData, transportData } from '@/data/hotels';
import { calculateMandatoryTours } from '@/data/transportRules';
import { MapPin, Building, Plus, Minus, Trash2, Info, Car } from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [currentHotelForRoomSelection, setCurrentHotelForRoomSelection] = useState<any>(null);
  const [currentCityForRoomSelection, setCurrentCityForRoomSelection] = useState<string>('');
  const [tempRoomSelections, setTempRoomSelections] = useState<RoomSelection[]>([]);

  useEffect(() => {
    const isValid = data.selectedCities.length > 0 && 
      data.selectedCities.every(city => 
        city.city && 
        city.nights > 0 && 
        city.hotel && 
        city.tours >= city.mandatoryTours &&
        city.roomSelections && 
        city.roomSelections.length === data.rooms
      );
    
    if (onValidationChange) {
      onValidationChange(isValid); // تمرير boolean بدلاً من string
    }
  }, [data.selectedCities, data.rooms, onValidationChange]);

  // Airport to city mapping
  const airportCityMapping: Record<string, string> = {
    'TBS': 'تبليسي',
    'BUS': 'باتومي', 
    'KUT': 'كوتايسي'
  };

  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      nights: 1,
      hotel: '',
      tours: 0,
      mandatoryTours: 0,
      roomSelections: Array.from({ length: data.rooms }, (_, index) => ({
        roomNumber: index + 1,
        roomType: ''
      }))
    };
    updateData({
      selectedCities: [...data.selectedCities, newCity]
    });
  };

  const removeCity = (index: number) => {
    const updatedCities = data.selectedCities.filter((_, i) => i !== index);
    updateData({ selectedCities: updatedCities });
  };

  const updateCity = (index: number, updates: Partial<CityStay>) => {
    const updatedCities = data.selectedCities.map((city, i) => {
      if (i === index) {
        const updatedCity = { ...city, ...updates };
        
        // إعادة حساب الجولات الإجبارية إذا تغيرت المدينة
        if (updates.city && data.arrivalAirport && data.departureAirport) {
          const isFirstCity = i === 0;
          const isLastCity = i === data.selectedCities.length - 1;
          updatedCity.mandatoryTours = calculateMandatoryTours(
            updates.city, 
            data.arrivalAirport, 
            data.departureAirport,
            isFirstCity,
            isLastCity
          );
        }

        // إذا تم تغيير الفندق، أعد تعيين اختيارات الغرف
        if (updates.hotel && updates.hotel !== city.hotel) {
          updatedCity.roomSelections = Array.from({ length: data.rooms }, (_, roomIndex) => ({
            roomNumber: roomIndex + 1,
            roomType: ''
          }));
        }
        
        return updatedCity;
      }
      return city;
    });
    updateData({ selectedCities: updatedCities });
  };

  // تحديث اختيارات الغرف عند تغيير عدد الغرف
  useEffect(() => {
    const updatedCities = data.selectedCities.map(city => ({
      ...city,
      roomSelections: Array.from({ length: data.rooms }, (_, index) => 
        city.roomSelections?.[index] || {
          roomNumber: index + 1,
          roomType: ''
        }
      )
    }));
    
    const hasChanged = updatedCities.some((city, index) => 
      city.roomSelections?.length !== data.selectedCities[index]?.roomSelections?.length
    );
    
    if (hasChanged) {
      updateData({ selectedCities: updatedCities });
    }
  }, [data.rooms]);

  const updateRoomSelection = (cityIndex: number, roomIndex: number, roomType: string) => {
    const updatedCities = data.selectedCities.map((city, i) => {
      if (i === cityIndex && city.roomSelections) {
        const updatedRoomSelections = city.roomSelections.map((room, j) => 
          j === roomIndex ? { ...room, roomType } : room
        );
        return { ...city, roomSelections: updatedRoomSelections };
      }
      return city;
    });
    updateData({ selectedCities: updatedCities });
  };

  // Sort hotels from cheapest to most expensive
  const sortHotelsByPrice = (hotels: Hotel[]): Hotel[] => {
    return [...hotels].sort((a, b) => {
      const getPrices = (hotel: Hotel) => [
        hotel.single_price,
        hotel.single_view_price,
        hotel.double_without_view_price,
        hotel.double_view_price,
        hotel.triple_without_view_price,
        hotel.triple_view_price
      ].filter(price => price !== undefined && price !== null && price > 0);
      
      const pricesA = getPrices(a);
      const pricesB = getPrices(b);
      
      const minPriceA = pricesA.length > 0 ? Math.min(...pricesA) : Infinity;
      const minPriceB = pricesB.length > 0 ? Math.min(...pricesB) : Infinity;
      
      return minPriceA - minPriceB;
    });
  };

  // Get selected hotel details
  const getSelectedHotel = (cityName: string, hotelName: string): Hotel | null => {
    if (!cityName || !hotelName) return null;
    const cityHotels = hotelData[cityName] || [];
    return cityHotels.find(hotel => hotel.name === hotelName) || null;
  };

  // Get selected car type details
  const getSelectedCarType = () => {
    return transportData.find(transport => transport.type === data.carType) || transportData[0];
  };

  // Handle car type change
  const handleCarTypeChange = (carType: string) => {
    updateData({ carType });
  };

  // Check if city needs airport transfer
  const needsAirportTransfer = (cityIndex: number, cityName: string) => {
    const isFirstCity = cityIndex === 0;
    const isLastCity = cityIndex === data.selectedCities.length - 1;
    const arrivalCity = airportCityMapping[data.arrivalAirport];
    const departureCity = airportCityMapping[data.departureAirport];
    
    return (isFirstCity && cityName === arrivalCity) || (isLastCity && cityName === departureCity);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">اختر المدن التي تريد زيارتها والفنادق للإقامة</p>
      </div>

      {/* Car Type Selection */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-800">نوع السيارة والسعة</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اختر نوع السيارة *</Label>
              <Select
                value={data.carType || ''}
                onValueChange={handleCarTypeChange}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="اختر نوع السيارة" />
                </SelectTrigger>
                <SelectContent>
                  {transportData.map((transport) => (
                    <SelectItem key={transport.type} value={transport.type}>
                      <div className="flex justify-between items-center w-full">
                        <span>{transport.type}</span>
                        <span className="text-sm text-gray-500 mr-2">({transport.capacity})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>السعة:</strong> {getSelectedCarType().capacity}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                * يتم استخدام نوع السيارة لحساب أسعار الجولات والاستقبال/التوديع
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-emerald-50 border-emerald-200">
        <Info className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800">
          <div className="space-y-2">
            <p><strong>ملاحظة:</strong> تم ترتيب الفنادق من الأرخص إلى الأغلى</p>
            <p>الأسعار النهائية ستظهر في مرحلة تفاصيل الأسعار</p>
            <p><strong>الجولات الإجبارية:</strong> يتم حسابها تلقائياً حسب المدينة ومطارات الوصول/المغادرة</p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {data.selectedCities.map((cityStay, index) => {
          const selectedHotel = getSelectedHotel(cityStay.city, cityStay.hotel);
          const totalTours = (cityStay.tours || 0) + (cityStay.mandatoryTours || 0);
          const hasAirportTransfer = needsAirportTransfer(index, cityStay.city);
          
          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    مدينة {index + 1}
                  </CardTitle>
                  {data.selectedCities.length > 1 && (
                    <Button
                      onClick={() => removeCity(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>المدينة *</Label>
                    <Select
                      value={cityStay.city}
                      onValueChange={(value) => updateCity(index, { city: value, hotel: '', roomSelections: Array.from({ length: data.rooms }, (_, i) => ({ roomNumber: i + 1, roomType: '' })) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(hotelData).map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>عدد الليالي *</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateCity(index, { nights: Math.max(1, cityStay.nights - 1) })}
                        disabled={cityStay.nights <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold bg-gray-50 py-2 px-3 rounded border">
                        {cityStay.nights}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateCity(index, { nights: cityStay.nights + 1 })}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {cityStay.city && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-600" />
                      <Label>الفندق *</Label>
                      <span className="text-sm text-gray-600">(مرتب من الأرخص للأغلى)</span>
                    </div>
                    <Select
                      value={cityStay.hotel}
                      onValueChange={(value) => updateCity(index, { hotel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفندق" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortHotelsByPrice(hotelData[cityStay.city] || []).map((hotel, hotelIndex) => (
                          <SelectItem key={hotel.name} value={hotel.name}>
                            <div className="flex items-center justify-between w-full">
                              <span>{hotel.name}</span>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>⭐ {hotel.rating}</span>
                                {hotelIndex === 0 && <span className="text-green-600">(الأرخص)</span>}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Room Selections - Show for each room */}
                {selectedHotel && cityStay.roomSelections && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">أنواع الغرف *</Label>
                    {cityStay.roomSelections.map((room, roomIndex) => (
                      <div key={roomIndex} className="p-3 bg-gray-50 rounded-lg">
                        <Label className="block mb-2">الغرفة {room.roomNumber}</Label>
                        <Select
                          value={room.roomType || ''}
                          onValueChange={(value) => updateRoomSelection(index, roomIndex, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`اختر نوع الغرفة ${room.roomNumber}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedHotel.single_price && selectedHotel.single_price > 0 && (
                              <SelectItem value="single">
                                غرفة مفردة
                              </SelectItem>
                            )}
                            {selectedHotel.single_view_price && selectedHotel.single_view_price > 0 && (
                              <SelectItem value="single_v">
                                غرفة مفردة مع إطلالة
                              </SelectItem>
                            )}
                            {selectedHotel.double_without_view_price && selectedHotel.double_without_view_price > 0 && (
                              <SelectItem value="dbl_wv">
                                غرفة مزدوجة بدون إطلالة
                              </SelectItem>
                            )}
                            {selectedHotel.double_view_price && selectedHotel.double_view_price > 0 && (
                              <SelectItem value="dbl_v">
                                غرفة مزدوجة مع إطلالة
                              </SelectItem>
                            )}
                            {selectedHotel.triple_without_view_price && selectedHotel.triple_without_view_price > 0 && (
                              <SelectItem value="trbl_wv">
                                غرفة ثلاثية بدون إطلالة
                              </SelectItem>
                            )}
                            {selectedHotel.triple_view_price && selectedHotel.triple_view_price > 0 && (
                              <SelectItem value="trbl_v">
                                غرفة ثلاثية مع إطلالة
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>عدد الجولات السياحية الإضافية</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateCity(index, { tours: Math.max(0, cityStay.tours - 1) })}
                      disabled={cityStay.tours <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold bg-gray-50 py-2 px-3 rounded border">
                      {cityStay.tours}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateCity(index, { tours: cityStay.tours + 1 })}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {hasAirportTransfer && (
                      <p>• نقل من أو إلى المطار: 1</p>
                    )}
                    <p>• جولات إجبارية: {cityStay.mandatoryTours || 0}</p>
                    <p>• جولات إضافية: {cityStay.tours || 0}</p>
                    <p className="font-medium">• إجمالي الجولات: {totalTours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        onClick={addCity}
        variant="outline"
        className="w-full border-dashed border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="w-4 h-4 ml-2" />
        إضافة مدينة أخرى
      </Button>

      {data.selectedCities.length > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-emerald-800 mb-3">ملخص المدن المختارة:</h3>
            <div className="space-y-2">
              {data.selectedCities.map((city, index) => {
                const totalTours = (city.tours || 0) + (city.mandatoryTours || 0);
                const hasAirportTransfer = needsAirportTransfer(index, city.city);
                
                return (
                  <div key={index} className="text-sm space-y-1">
                    <div className="font-semibold">
                      <strong>{city.city}</strong> - {city.hotel}
                    </div>
                    <div className="text-emerald-700 mr-4">
                      • {city.nights} ليالي، {totalTours} جولات
                      {hasAirportTransfer && ' (تشمل نقل المطار)'}
                    </div>
                    {city.roomSelections && city.roomSelections.length > 0 && (
                      <div className="text-emerald-600 mr-4 text-xs">
                        الغرف: {city.roomSelections.map((room, roomIndex) => 
                          `الغرفة ${room.roomNumber}: ${
                            room.roomType === 'single' ? 'مفردة' :
                            room.roomType === 'single_v' ? 'مفردة مع إطلالة' :
                            room.roomType === 'dbl_wv' ? 'مزدوجة بدون إطلالة' :
                            room.roomType === 'dbl_v' ? 'مزدوجة مع إطلالة' :
                            room.roomType === 'trbl_wv' ? 'ثلاثية بدون إطلالة' :
                            room.roomType === 'trbl_v' ? 'ثلاثية مع إطلالة' :
                            'غير محدد'
                          }`
                        ).join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
