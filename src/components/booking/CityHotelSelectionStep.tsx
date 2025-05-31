
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, CityStay, Hotel } from '@/types/booking';
import { hotelData, transportData, getMandatoryTours } from '@/data/hotels';
import { MapPin, Building, Plus, Minus, Trash2, Info, Car } from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  useEffect(() => {
    const isValid = data.selectedCities.length > 0 && 
                   data.selectedCities.every(city => city.city && city.hotel && city.nights > 0);
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [data.selectedCities, onValidationChange]);

  // حساب الجولات الإجبارية لكل مدينة عند تغيير البيانات
  useEffect(() => {
    if (data.selectedCities.length > 0 && data.arrivalAirport && data.departureAirport) {
      const updatedCities = data.selectedCities.map(city => {
        if (city.city) {
          const mandatoryTours = getMandatoryTours(city.city, data.arrivalAirport, data.departureAirport);
          console.log(`Calculating mandatory tours for ${city.city}: ${mandatoryTours}`);
          return { ...city, mandatoryTours };
        }
        return city;
      });
      
      // تحديث البيانات فقط إذا تغيرت
      const hasChanged = updatedCities.some((city, index) => 
        city.mandatoryTours !== data.selectedCities[index]?.mandatoryTours
      );
      
      if (hasChanged) {
        console.log('Updating cities with new mandatory tours:', updatedCities);
        updateData({ selectedCities: updatedCities });
      }
    }
  }, [data.selectedCities.map(c => c.city).join(','), data.arrivalAirport, data.departureAirport]);

  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      nights: 1,
      hotel: '',
      tours: 0,
      mandatoryTours: 0
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
          updatedCity.mandatoryTours = getMandatoryTours(updates.city, data.arrivalAirport, data.departureAirport);
          console.log(`Updated mandatory tours for ${updates.city}: ${updatedCity.mandatoryTours}`);
        }
        
        return updatedCity;
      }
      return city;
    });
    updateData({ selectedCities: updatedCities });
  };

  // Sort hotels from cheapest to most expensive based on actual room prices
  const sortHotelsByPrice = (hotels: Hotel[]): Hotel[] => {
    return [...hotels].sort((a, b) => {
      // Get the cheapest available room price for each hotel
      const getPrices = (hotel: Hotel) => [
        hotel.single,
        hotel.single_v,
        hotel.dbl_wv,
        hotel.dbl_v,
        hotel.trbl_wv,
        hotel.trbl_v
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

  // Handle room type selection
  const handleRoomTypeChange = (cityIndex: number, roomType: string) => {
    const updatedCities = data.selectedCities.map((city, i) => {
      if (i === cityIndex) {
        return { ...city, roomType };
      }
      return city;
    });
    updateData({ selectedCities: updatedCities });

    // Also update the main roomTypes array for pricing calculations
    const newRoomTypes = [...(data.roomTypes || [])];
    newRoomTypes[cityIndex] = roomType;
    updateData({ roomTypes: newRoomTypes });
  };

  // Get recommended car type based on number of people
  const getRecommendedCarType = () => {
    const totalPeople = data.adults + data.children.length;
    const recommendedCar = transportData.find(transport => {
      const maxCapacity = parseInt(transport.capacity.split('-')[1] || transport.capacity.replace('+', ''));
      return totalPeople <= maxCapacity;
    });
    return recommendedCar || transportData[transportData.length - 1];
  };

  const selectedCarType = data.carType || getRecommendedCarType().type;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">اختر المدن التي تريد زيارتها والفنادق للإقامة</p>
      </div>

      {/* Car Type Display */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-800">نوع السيارة المختارة</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اختر نوع السيارة</Label>
              <Select
                value={selectedCarType}
                onValueChange={(value) => updateData({ carType: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="اختر نوع السيارة" />
                </SelectTrigger>
                <SelectContent>
                  {transportData.map((transport) => (
                    <SelectItem key={transport.type} value={transport.type}>
                      <div className="flex justify-between items-center w-full">
                        <span>{transport.type}</span>
                        <span className="text-sm text-gray-500">({transport.capacity})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>السعة:</strong> {getRecommendedCarType().capacity}
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
                      onValueChange={(value) => updateCity(index, { city: value, hotel: '' })}
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

                {/* Room Type Selection - Show only when hotel is selected */}
                {selectedHotel && (
                  <div className="space-y-2">
                    <Label>نوع الغرفة *</Label>
                    <Select
                      value={cityStay.roomType || ''}
                      onValueChange={(value) => handleRoomTypeChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الغرفة" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedHotel.single && (
                          <SelectItem value="single">
                            غرفة مفردة
                          </SelectItem>
                        )}
                        {selectedHotel.single_v && (
                          <SelectItem value="single_v">
                            غرفة مفردة مع إطلالة
                          </SelectItem>
                        )}
                        {selectedHotel.dbl_wv && (
                          <SelectItem value="dbl_wv">
                            غرفة مزدوجة بدون إطلالة
                          </SelectItem>
                        )}
                        {selectedHotel.dbl_v && (
                          <SelectItem value="dbl_v">
                            غرفة مزدوجة مع إطلالة
                          </SelectItem>
                        )}
                        {selectedHotel.trbl_wv && (
                          <SelectItem value="trbl_wv">
                            غرفة ثلاثية بدون إطلالة
                          </SelectItem>
                        )}
                        {selectedHotel.trbl_v && (
                          <SelectItem value="trbl_v">
                            غرفة ثلاثية مع إطلالة
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
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
                return (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>
                      <strong>{city.city}</strong> - {city.hotel}
                      {city.roomType && ` (${city.roomType})`}
                    </span>
                    <span className="text-emerald-700">
                      {city.nights} ليالي، {totalTours} جولات ({city.mandatoryTours || 0} إجبارية + {city.tours || 0} إضافية)
                    </span>
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
