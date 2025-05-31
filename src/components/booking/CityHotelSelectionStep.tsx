
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, CityStay } from '@/types/booking';
import { hotelsByCity, Hotel } from '@/data/hotels';
import { MapPin, Building, Plus, Minus, Trash2, ArrowUpDown, Info } from 'lucide-react';

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
    const updatedCities = data.selectedCities.map((city, i) => 
      i === index ? { ...city, ...updates } : city
    );
    updateData({ selectedCities: updatedCities });
  };

  // Sort hotels from cheapest to most expensive
  const sortHotelsByPrice = (hotels: Hotel[]): Hotel[] => {
    return [...hotels].sort((a, b) => {
      // Get the cheapest room price for each hotel
      const priceA = Math.min(
        a.single || Infinity,
        a.single_v || Infinity,
        a.dbl_wv || Infinity,
        a.dbl_v || Infinity,
        a.trbl_wv || Infinity,
        a.trbl_v || Infinity
      );
      const priceB = Math.min(
        b.single || Infinity,
        b.single_v || Infinity,
        b.dbl_wv || Infinity,
        b.dbl_v || Infinity,
        b.trbl_wv || Infinity,
        b.trbl_v || Infinity
      );
      return priceA - priceB;
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">اختر المدن التي تريد زيارتها والفنادق للإقامة</p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p><strong>ملاحظة:</strong> تم ترتيب الفنادق من الأرخص إلى الأغلى</p>
            <p>الأسعار النهائية ستظهر في مرحلة تفاصيل الأسعار</p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {data.selectedCities.map((cityStay, index) => (
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
                      {Object.keys(hotelsByCity).map((city) => (
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
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <ArrowUpDown className="w-3 h-3" />
                      <span>مرتب من الأرخص للأغلى</span>
                    </div>
                  </div>
                  <Select
                    value={cityStay.hotel}
                    onValueChange={(value) => updateCity(index, { hotel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortHotelsByPrice(hotelsByCity[cityStay.city] || []).map((hotel) => (
                        <SelectItem key={hotel.name} value={hotel.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{hotel.name}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>⭐ {hotel.rating}</span>
                              <span>{hotel.distanceFromCenter}km من المركز</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>عدد الجولات السياحية</Label>
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
                <p className="text-xs text-gray-500">الجولات السياحية اختيارية</p>
              </div>
            </CardContent>
          </Card>
        ))}
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
              {data.selectedCities.map((city, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>
                    <strong>{city.city}</strong> - {city.hotel}
                  </span>
                  <span className="text-emerald-700">
                    {city.nights} ليالي، {city.tours} جولات
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
