
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, CityStay } from '@/types/booking';
import { cities, hotelData, transportData } from '@/data/hotels';
import { MapPin, Hotel, Car, Plus, Minus, Info, AlertCircle } from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const [totalSelectedNights, setTotalSelectedNights] = useState(0);
  const [requiredNights, setRequiredNights] = useState(0);

  const getTripNights = () => {
    if (!data.arrivalDate || !data.departureDate) return 0;
    const arrival = new Date(data.arrivalDate);
    const departure = new Date(data.departureDate);
    return Math.floor((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getArrivalCity = () => {
    if (data.arrivalAirport === 'تبليسي') return 'تبليسي';
    if (data.arrivalAirport === 'باتومي') return 'باتومي';
    return 'تبليسي'; // default
  };

  const getDepartureCity = () => {
    if (data.departureAirport === 'تبليسي') return 'تبليسي';
    if (data.departureAirport === 'باتومي') return 'باتومي';
    return 'تبليسي'; // default
  };

  useEffect(() => {
    const nights = getTripNights();
    setRequiredNights(nights);
    
    // Auto-add arrival and departure cities if not already added
    const arrivalCity = getArrivalCity();
    const departureCity = getDepartureCity();
    
    if (data.selectedCities.length === 0 && nights > 0) {
      const newCities: CityStay[] = [];
      
      // Add arrival city
      if (arrivalCity === departureCity) {
        newCities.push({
          city: arrivalCity,
          nights: Math.min(nights, 3),
          hotel: '',
          tours: 1,
          mandatoryTours: arrivalCity === 'باتومي' ? 2 : 1,
          additionalTours: 0,
          roomSelections: []
        });
      } else {
        newCities.push({
          city: arrivalCity,
          nights: Math.floor(nights / 2),
          hotel: '',
          tours: 1,
          mandatoryTours: arrivalCity === 'باتومي' ? 2 : 1,
          additionalTours: 0,
          roomSelections: []
        });
        
        if (departureCity !== arrivalCity) {
          newCities.push({
            city: departureCity,
            nights: Math.ceil(nights / 2),
            hotel: '',
            tours: 1,
            mandatoryTours: departureCity === 'باتومي' ? 2 : 1,
            additionalTours: 0,
            roomSelections: []
          });
        }
      }
      
      updateData({ selectedCities: newCities });
    }
  }, [data.arrivalDate, data.departureDate, data.arrivalAirport, data.departureAirport]);

  useEffect(() => {
    const total = data.selectedCities.reduce((sum, city) => sum + city.nights, 0);
    setTotalSelectedNights(total);
    
    // Validate the step
    const isValid = total === requiredNights && 
                   data.selectedCities.every(city => city.hotel && city.roomSelections && city.roomSelections.length > 0) &&
                   data.carType;
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [data.selectedCities, data.carType, requiredNights]);

  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      nights: 1,
      hotel: '',
      tours: 1,
      mandatoryTours: 1,
      additionalTours: 0,
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

  const updateCity = (index: number, updates: Partial<CityStay>) => {
    const newCities = [...data.selectedCities];
    newCities[index] = { ...newCities[index], ...updates };
    
    // Update mandatory tours based on city
    if (updates.city) {
      newCities[index].mandatoryTours = updates.city === 'باتومي' ? 2 : 1;
      newCities[index].tours = newCities[index].mandatoryTours + (newCities[index].additionalTours || 0);
    }
    
    updateData({ selectedCities: newCities });
  };

  const updateAdditionalTours = (index: number, additionalTours: number) => {
    const newCities = [...data.selectedCities];
    newCities[index].additionalTours = additionalTours;
    newCities[index].tours = newCities[index].mandatoryTours + additionalTours;
    updateData({ selectedCities: newCities });
  };

  const generateRoomSelections = (cityIndex: number, hotel: any) => {
    if (!hotel) return;
    
    const roomTypes = ['single', 'single_v', 'dbl_wv', 'dbl_v', 'trbl_wv', 'trbl_v'];
    const sortedRoomTypes = roomTypes.sort((a, b) => hotel[a] - hotel[b]);
    
    const roomSelections = Array.from({ length: data.rooms }, (_, i) => ({
      roomNumber: i + 1,
      roomType: sortedRoomTypes[0] // Default to cheapest room type
    }));
    
    updateCity(cityIndex, { roomSelections });
  };

  const updateRoomType = (cityIndex: number, roomIndex: number, roomType: string) => {
    const newCities = [...data.selectedCities];
    if (newCities[cityIndex].roomSelections) {
      newCities[cityIndex].roomSelections![roomIndex].roomType = roomType;
      updateData({ selectedCities: newCities });
    }
  };

  const getSortedHotels = (cityName: string) => {
    const cityHotels = hotelData[cityName] || [];
    return cityHotels.sort((a, b) => a.single - b.single); // Sort by cheapest single room price
  };

  const getSortedRoomTypes = (hotel: any) => {
    const roomTypes = [
      { key: 'single', name: 'غرفة مفردة (بدون إطلالة)', price: hotel.single },
      { key: 'single_v', name: 'غرفة مفردة (مع إطلالة)', price: hotel.single_v },
      { key: 'dbl_wv', name: 'غرفة مزدوجة (بدون إطلالة)', price: hotel.dbl_wv },
      { key: 'dbl_v', name: 'غرفة مزدوجة (مع إطلالة)', price: hotel.dbl_v },
      { key: 'trbl_wv', name: 'غرفة ثلاثية (بدون إطلالة)', price: hotel.trbl_wv },
      { key: 'trbl_v', name: 'غرفة ثلاثية (مع إطلالة)', price: hotel.trbl_v }
    ];
    return roomTypes.sort((a, b) => a.price - b.price);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">حدد المدن التي تريد زيارتها والفنادق المفضلة</p>
      </div>

      {/* Night Count Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800">معلومات الإقامة</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">إجمالي الليالي المطلوبة: </span>
            <span className="font-bold text-blue-800">{requiredNights} ليلة</span>
          </div>
          <div>
            <span className="text-blue-700">الليالي المحددة: </span>
            <span className="font-bold text-blue-800">{totalSelectedNights} ليلة</span>
          </div>
          <div>
            <span className="text-blue-700">عدد الغرف: </span>
            <span className="font-bold text-blue-800">{data.rooms} غرفة</span>
          </div>
        </div>
        {totalSelectedNights !== requiredNights && (
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              يجب أن يتطابق عدد الليالي المحددة ({totalSelectedNights}) مع إجمالي ليالي الرحلة ({requiredNights})
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Hotel and Room Type Sorting Notice */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-yellow-800">ملاحظة</span>
        </div>
        <p className="text-sm text-yellow-700">
          الفنادق مرتبة من الأرخص إلى الأغلى • أنواع الغرف مرتبة من الأرخص إلى الأغلى
        </p>
      </div>

      {/* Cities Selection */}
      <div className="space-y-4">
        {data.selectedCities.map((city, cityIndex) => (
          <Card key={cityIndex} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  المدينة {cityIndex + 1}
                </div>
                {data.selectedCities.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCity(cityIndex)}
                  >
                    حذف المدينة
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>اختر المدينة</Label>
                  <Select
                    value={city.city}
                    onValueChange={(value) => updateCity(cityIndex, { city: value, hotel: '', roomSelections: [] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((cityName) => (
                        <SelectItem key={cityName} value={cityName}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>عدد الليالي</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCity(cityIndex, { nights: Math.max(1, city.nights - 1) })}
                      disabled={city.nights <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{city.nights}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCity(cityIndex, { nights: city.nights + 1 })}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>الجولات</Label>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      إجبارية: {city.mandatoryTours}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">إضافية:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAdditionalTours(cityIndex, Math.max(0, (city.additionalTours || 0) - 1))}
                        disabled={(city.additionalTours || 0) <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{city.additionalTours || 0}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAdditionalTours(cityIndex, (city.additionalTours || 0) + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm font-medium">
                      المجموع: {city.tours} جولة
                    </div>
                  </div>
                </div>
              </div>

              {city.city && (
                <div>
                  <Label>اختر الفندق</Label>
                  <Select
                    value={city.hotel}
                    onValueChange={(value) => {
                      const selectedHotel = getSortedHotels(city.city).find(h => h.name === value);
                      updateCity(cityIndex, { hotel: value });
                      if (selectedHotel) {
                        generateRoomSelections(cityIndex, selectedHotel);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSortedHotels(city.city).map((hotel) => (
                        <SelectItem key={hotel.name} value={hotel.name}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {city.hotel && city.roomSelections && (
                <div className="space-y-3">
                  <Label>أنواع الغرف</Label>
                  {city.roomSelections.map((room, roomIndex) => {
                    const selectedHotel = getSortedHotels(city.city).find(h => h.name === city.hotel);
                    return (
                      <div key={roomIndex} className="flex items-center gap-4">
                        <span className="w-20 text-sm">الغرفة {room.roomNumber}:</span>
                        <Select
                          value={room.roomType}
                          onValueChange={(value) => updateRoomType(cityIndex, roomIndex, value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedHotel && getSortedRoomTypes(selectedHotel).map((roomType) => (
                              <SelectItem key={roomType.key} value={roomType.key}>
                                {roomType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button onClick={addCity} className="w-full" variant="outline">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مدينة جديدة
        </Button>
      </div>

      {/* Car Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            نوع السيارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={data.carType}
            onValueChange={(value) => updateData({ carType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع السيارة" />
            </SelectTrigger>
            <SelectContent>
              {transportData.map((transport) => (
                <SelectItem key={transport.type} value={transport.type}>
                  {transport.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};
