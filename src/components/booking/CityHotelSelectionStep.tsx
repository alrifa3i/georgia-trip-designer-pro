
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, CityStay } from '@/types/booking';
import { useCitiesData } from '@/hooks/useCitiesData';
import { useAllHotelsData } from '@/hooks/useHotelsData';
import { useTransportData } from '@/hooks/useTransportData';
import { Loader2, MapPin, Building, Car, Info, AlertCircle } from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const [selectedCityForHotel, setSelectedCityForHotel] = useState<string>('');

  // استعلامات البيانات
  const { data: cities = [], isLoading: loadingCities, error: citiesError } = useCitiesData();
  const { data: allHotels = {}, isLoading: loadingHotels, error: hotelsError } = useAllHotelsData();
  const { data: transportOptions = [], isLoading: loadingTransport, error: transportError } = useTransportData();

  console.log('Cities data:', cities);
  console.log('Hotels data:', allHotels);
  console.log('Transport data:', transportOptions);

  // التحقق من صحة البيانات
  useEffect(() => {
    const hasSelectedCities = data.selectedCities && data.selectedCities.length > 0;
    const hasValidHotels = data.selectedCities?.every(city => 
      city.selectedHotelId && city.roomType
    );
    const hasTransport = !!data.carType;

    const isValid = hasSelectedCities && hasValidHotels && hasTransport;
    
    console.log('Validation check:', {
      hasSelectedCities,
      hasValidHotels,
      hasTransport,
      isValid
    });
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [data.selectedCities, data.carType, onValidationChange]);

  // معالجة إضافة مدينة
  const addCity = (cityName: string) => {
    console.log('Adding city:', cityName);
    
    if (!data.selectedCities) {
      updateData({ selectedCities: [] });
    }
    
    const isAlreadySelected = data.selectedCities?.some(city => city.name === cityName);
    
    if (!isAlreadySelected) {
      const newCity: CityStay = {
        city: cityName,
        name: cityName,
        nights: 0,
        hotel: '',
        tours: 0,
        mandatoryTours: 0,
        selectedHotelId: '',
        roomType: '',
        pricePerNight: 0,
        totalPrice: 0
      };
      
      const updatedCities = [...(data.selectedCities || []), newCity];
      updateData({ selectedCities: updatedCities });
      console.log('Updated cities:', updatedCities);
    }
  };

  // معالجة إزالة مدينة
  const removeCity = (cityName: string) => {
    console.log('Removing city:', cityName);
    
    const updatedCities = data.selectedCities?.filter(city => city.name !== cityName) || [];
    updateData({ selectedCities: updatedCities });
  };

  // معالجة اختيار الفندق
  const handleHotelSelection = (cityName: string, hotelId: string) => {
    console.log('Selecting hotel:', { cityName, hotelId });
    
    const cityHotels = allHotels[cityName] || [];
    const selectedHotel = cityHotels.find(hotel => hotel.id === hotelId);
    
    if (selectedHotel && data.selectedCities) {
      const updatedCities = data.selectedCities.map(city => {
        if (city.name === cityName) {
          return {
            ...city,
            selectedHotelId: hotelId,
            hotel: selectedHotel.name,
            roomType: '', // إعادة تعيين نوع الغرفة عند تغيير الفندق
            pricePerNight: 0,
            totalPrice: 0
          };
        }
        return city;
      });
      
      updateData({ selectedCities: updatedCities });
    }
  };

  // معالجة اختيار نوع الغرفة
  const handleRoomTypeSelection = (cityName: string, roomType: string) => {
    console.log('Selecting room type:', { cityName, roomType });
    
    if (!data.selectedCities) return;
    
    const cityHotels = allHotels[cityName] || [];
    const city = data.selectedCities.find(c => c.name === cityName);
    const selectedHotel = cityHotels.find(hotel => hotel.id === city?.selectedHotelId);
    
    if (selectedHotel) {
      let pricePerNight = 0;
      
      // تحديد السعر حسب نوع الغرفة
      switch (roomType) {
        case 'single':
          pricePerNight = selectedHotel.single_price || 0;
          break;
        case 'single_view':
          pricePerNight = selectedHotel.single_view_price || 0;
          break;
        case 'double_without_view':
          pricePerNight = selectedHotel.double_without_view_price || 0;
          break;
        case 'double_view':
          pricePerNight = selectedHotel.double_view_price || 0;
          break;
        case 'triple_without_view':
          pricePerNight = selectedHotel.triple_without_view_price || 0;
          break;
        case 'triple_view':
          pricePerNight = selectedHotel.triple_view_price || 0;
          break;
      }
      
      const updatedCities = data.selectedCities.map(city => {
        if (city.name === cityName) {
          return {
            ...city,
            roomType,
            pricePerNight,
            totalPrice: pricePerNight * (data.rooms || 1)
          };
        }
        return city;
      });
      
      updateData({ selectedCities: updatedCities });
    }
  };

  // معالجة اختيار وسيلة النقل
  const handleTransportSelection = (transportType: string) => {
    console.log('Selecting transport:', transportType);
    updateData({ carType: transportType });
  };

  // إظهار حالة التحميل
  if (loadingCities || loadingHotels || loadingTransport) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // إظهار الأخطاء
  if (citiesError || hotelsError || transportError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.
          {citiesError && <div>خطأ في المدن: {citiesError.message}</div>}
          {hotelsError && <div>خطأ في الفنادق: {hotelsError.message}</div>}
          {transportError && <div>خطأ في النقل: {transportError.message}</div>}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">اختر المدن التي تريد زيارتها والفنادق المفضلة لديك</p>
      </div>

      {/* اختيار المدن */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            المدن المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {cities.map((city) => {
              const isSelected = data.selectedCities?.some(selected => selected.name === city.name);
              return (
                <div key={city.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={city.id}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addCity(city.name);
                      } else {
                        removeCity(city.name);
                      }
                    }}
                  />
                  <Label
                    htmlFor={city.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {city.name}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* اختيار الفنادق لكل مدينة */}
      {data.selectedCities && data.selectedCities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              اختيار الفنادق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.selectedCities.map((selectedCity) => {
              const cityHotels = allHotels[selectedCity.name] || [];
              const selectedHotel = cityHotels.find(hotel => hotel.id === selectedCity.selectedHotelId);
              
              return (
                <div key={selectedCity.name} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">{selectedCity.name}</h3>
                  
                  {/* اختيار الفندق */}
                  <div className="space-y-3">
                    <Label>اختر الفندق</Label>
                    <Select
                      value={selectedCity.selectedHotelId}
                      onValueChange={(value) => handleHotelSelection(selectedCity.name, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فندق" />
                      </SelectTrigger>
                      <SelectContent>
                        {cityHotels.map((hotel) => (
                          <SelectItem key={hotel.id} value={hotel.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{hotel.name}</span>
                              <span className="text-sm text-gray-500">
                                {hotel.rating && `⭐ ${hotel.rating}`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* اختيار نوع الغرفة */}
                  {selectedHotel && (
                    <div className="space-y-3 mt-4">
                      <Label>نوع الغرفة</Label>
                      <Select
                        value={selectedCity.roomType}
                        onValueChange={(value) => handleRoomTypeSelection(selectedCity.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الغرفة" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedHotel.single_price && selectedHotel.single_price > 0 && (
                            <SelectItem value="single">
                              غرفة فردية - ${selectedHotel.single_price}/ليلة
                            </SelectItem>
                          )}
                          {selectedHotel.single_view_price && selectedHotel.single_view_price > 0 && (
                            <SelectItem value="single_view">
                              غرفة فردية بإطلالة - ${selectedHotel.single_view_price}/ليلة
                            </SelectItem>
                          )}
                          {selectedHotel.double_without_view_price && selectedHotel.double_without_view_price > 0 && (
                            <SelectItem value="double_without_view">
                              غرفة مزدوجة بدون إطلالة - ${selectedHotel.double_without_view_price}/ليلة
                            </SelectItem>
                          )}
                          {selectedHotel.double_view_price && selectedHotel.double_view_price > 0 && (
                            <SelectItem value="double_view">
                              غرفة مزدوجة بإطلالة - ${selectedHotel.double_view_price}/ليلة
                            </SelectItem>
                          )}
                          {selectedHotel.triple_without_view_price && selectedHotel.triple_without_view_price > 0 && (
                            <SelectItem value="triple_without_view">
                              غرفة ثلاثية بدون إطلالة - ${selectedHotel.triple_without_view_price}/ليلة
                            </SelectItem>
                          )}
                          {selectedHotel.triple_view_price && selectedHotel.triple_view_price > 0 && (
                            <SelectItem value="triple_view">
                              غرفة ثلاثية بإطلالة - ${selectedHotel.triple_view_price}/ليلة
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* معلومات إضافية عن الفندق */}
                  {selectedHotel && (
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600 space-y-1">
                        {selectedHotel.rating && (
                          <div>التقييم: {'⭐'.repeat(selectedHotel.rating)}</div>
                        )}
                        {selectedHotel.distance_from_center && (
                          <div>المسافة من المركز: {selectedHotel.distance_from_center} كم</div>
                        )}
                        {selectedCity.pricePerNight > 0 && (
                          <div className="font-semibold text-emerald-600">
                            السعر: ${selectedCity.pricePerNight}/ليلة × {data.rooms} غرفة = ${selectedCity.totalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* اختيار وسيلة النقل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            وسيلة النقل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              اختر نوع السيارة المناسب لعدد المسافرين ({data.adults + data.children.length} أشخاص)
            </AlertDescription>
          </Alert>
          
          <div className="grid md:grid-cols-2 gap-4">
            {transportOptions.map((transport) => (
              <div
                key={transport.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  data.carType === transport.type
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTransportSelection(transport.type)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{transport.type}</h3>
                  <span className="text-sm text-gray-500">{transport.capacity}</span>
                </div>
                <div className="text-emerald-600 font-bold">
                  ${transport.daily_price}/يوم
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ملخص الاختيارات */}
      {data.selectedCities && data.selectedCities.length > 0 && data.carType && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">ملخص اختياراتك</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>المدن المختارة: {data.selectedCities.map(city => city.name).join(', ')}</div>
              <div>وسيلة النقل: {data.carType}</div>
              <div>
                إجمالي تكلفة الفنادق: $
                {data.selectedCities.reduce((total, city) => total + city.totalPrice, 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
