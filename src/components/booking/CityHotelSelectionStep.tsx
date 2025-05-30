
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, RoomSelection } from '@/types/booking';
import { hotelData, transportData, availableTours } from '@/data/hotels';
import { currencies, convertFromUSD, formatCurrency } from '@/data/currencies';
import { MapPin, Building2, Car, Users, Bed, Clock, AlertTriangle } from 'lucide-react';

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
      return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const requiredNights = getDuration() - 1;

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

  const validateStep = () => {
    const errors: string[] = [];
    
    if (totalSelectedNights !== requiredNights) {
      errors.push(`المطلوب ${requiredNights} ليلة، تم اختيار ${totalSelectedNights} ليلة`);
    }
    
    data.selectedCities.forEach((city, index) => {
      if (!city.hotel) {
        errors.push(`فندق ${city.city} غير محدد`);
      }
      if (!city.roomSelections || city.roomSelections.length === 0) {
        errors.push(`غرف ${city.city} غير محددة`);
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
        <p className="text-gray-600">اختر الفنادق المناسبة والغرف لكل مدينة</p>
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

      {/* Cities and Hotels */}
      <div className="space-y-6">
        {data.selectedCities.map((city, cityIndex) => {
          const cityHotels = hotelData[city.city] || [];
          const selectedHotel = cityHotels.find(h => h.name === city.hotel);

          return (
            <Card key={cityIndex} className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {city.city} - {city.nights} ليالي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hotel Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">اختيار الفندق *</label>
                  <Select
                    value={city.hotel || ''}
                    onValueChange={(hotelName) => updateCityHotel(cityIndex, hotelName)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent>
                      {cityHotels.map((hotel) => (
                        <SelectItem key={hotel.name} value={hotel.name}>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {hotel.name} - {'⭐'.repeat(hotel.rating)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Room Selection */}
                {selectedHotel && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <Bed className="w-4 h-4" />
                        اختيار الغرف والأنواع
                      </h4>
                      <Button
                        onClick={() => addRoom(cityIndex)}
                        variant="outline"
                        size="sm"
                      >
                        إضافة غرفة
                      </Button>
                    </div>

                    {/* Available Room Types Display */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-800 mb-2">أنواع الغرف المتاحة:</h5>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        {Object.entries(selectedHotel).map(([key, value]) => {
                          if (typeof value === 'number' && ['single', 'single_v', 'dbl_wv', 'dbl_v', 'trbl_wv', 'trbl_v'].includes(key)) {
                            const convertedPrice = convertFromUSD(value, selectedCurrency.code);
                            return (
                              <div key={key} className="flex justify-between items-center p-2 bg-white rounded border">
                                <span className="text-blue-700">{getRoomTypeName(key)}</span>
                                <span className="font-medium text-blue-800">
                                  {formatCurrency(convertedPrice, selectedCurrency.code)}
                                  {selectedCurrency.code !== 'USD' && (
                                    <span className="text-xs text-gray-500 mr-1">(${ value})</span>
                                  )}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>

                    {/* Room Selections */}
                    {city.roomSelections?.map((room, roomIndex) => (
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
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الغرفة" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(selectedHotel).map(([key, value]) => {
                              if (typeof value === 'number' && ['single', 'single_v', 'dbl_wv', 'dbl_v', 'trbl_wv', 'trbl_v'].includes(key)) {
                                const convertedPrice = convertFromUSD(value, selectedCurrency.code);
                                return (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex justify-between items-center w-full">
                                      <span>{getRoomTypeName(key)}</span>
                                      <span className="font-medium mr-4">
                                        {formatCurrency(convertedPrice, selectedCurrency.code)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                );
                              }
                              return null;
                            })}
                          </SelectContent>
                        </Select>
                        
                        {room.roomType && (
                          <div className="mt-2 text-sm text-green-600">
                            ✅ سعر الليلة: {formatCurrency(convertFromUSD(selectedHotel[room.roomType as keyof typeof selectedHotel] as number, selectedCurrency.code), selectedCurrency.code)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Car Type Selection - Card Style */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Car className="w-5 h-5" />
            اختيار نوع السيارة *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="text-green-600 font-medium">✅ محدد</div>
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
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">ملخص التقدم</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-700">الليالي المطلوبة: </span>
              <span className="font-medium">{requiredNights}</span>
            </div>
            <div>
              <span className="text-green-700">الليالي المختارة: </span>
              <span className="font-medium">{totalSelectedNights}</span>
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
