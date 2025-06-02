
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingData, CityStay } from '@/types/booking';
import { useCitiesData } from '@/hooks/useCitiesData';
import { useAllHotelsData } from '@/hooks/useHotelsData';
import { useTransportData } from '@/hooks/useTransportData';
import { Loader2, Building, Car, Info, AlertCircle, Plus, Minus } from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const [selectedCities, setSelectedCities] = useState<CityStay[]>(data.selectedCities || []);

  // استعلامات البيانات
  const { data: cities = [], isLoading: loadingCities, error: citiesError } = useCitiesData();
  const { data: allHotels = {}, isLoading: loadingHotels, error: hotelsError } = useAllHotelsData();
  const { data: transportOptions = [], isLoading: loadingTransport, error: transportError } = useTransportData();

  console.log('Cities data:', cities);
  console.log('Hotels data:', allHotels);
  console.log('Transport data:', transportOptions);

  // التحقق من صحة البيانات
  useEffect(() => {
    const hasSelectedCities = selectedCities && selectedCities.length > 0;
    const hasValidHotels = selectedCities?.every(city => 
      city.name && city.selectedHotelId && city.roomType
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
  }, [selectedCities, data.carType, onValidationChange]);

  // تحديث البيانات الرئيسية عند تغيير المدن المحلية
  useEffect(() => {
    updateData({ selectedCities });
  }, [selectedCities, updateData]);

  // إضافة مدينة جديدة
  const addCity = () => {
    const newCity: CityStay = {
      city: '',
      name: '',
      nights: 1,
      hotel: '',
      tours: 0,
      mandatoryTours: 0,
      selectedHotelId: '',
      roomType: '',
      pricePerNight: 0,
      totalPrice: 0
    };
    
    setSelectedCities([...selectedCities, newCity]);
  };

  // إزالة مدينة
  const removeCity = (index: number) => {
    const newCities = selectedCities.filter((_, i) => i !== index);
    setSelectedCities(newCities);
  };

  // تحديث مدينة
  const updateCity = (index: number, field: keyof CityStay, value: any) => {
    const newCities = [...selectedCities];
    newCities[index] = { ...newCities[index], [field]: value };
    
    // إذا تم تغيير المدينة، قم بإعادة تعيين الفندق
    if (field === 'name') {
      newCities[index].city = value;
      newCities[index].selectedHotelId = '';
      newCities[index].hotel = '';
      newCities[index].roomType = '';
      newCities[index].pricePerNight = 0;
      newCities[index].totalPrice = 0;
    }
    
    // إذا تم تغيير الفندق، قم بإعادة تعيين نوع الغرفة
    if (field === 'selectedHotelId') {
      const cityHotels = allHotels[newCities[index].name] || [];
      const selectedHotel = cityHotels.find(hotel => hotel.id === value);
      newCities[index].hotel = selectedHotel ? selectedHotel.name : '';
      newCities[index].roomType = '';
      newCities[index].pricePerNight = 0;
      newCities[index].totalPrice = 0;
    }
    
    // إذا تم تغيير نوع الغرفة، احسب السعر
    if (field === 'roomType') {
      const cityHotels = allHotels[newCities[index].name] || [];
      const selectedHotel = cityHotels.find(hotel => hotel.id === newCities[index].selectedHotelId);
      
      if (selectedHotel) {
        let pricePerNight = 0;
        
        switch (value) {
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
        
        newCities[index].pricePerNight = pricePerNight;
        newCities[index].totalPrice = pricePerNight * (data.rooms || 1) * newCities[index].nights;
      }
    }
    
    // إذا تم تغيير عدد الليالي، أعد حساب السعر الإجمالي
    if (field === 'nights') {
      newCities[index].totalPrice = newCities[index].pricePerNight * (data.rooms || 1) * value;
    }
    
    setSelectedCities(newCities);
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

      {/* قسم المدن والفنادق */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              المدن والفنادق
            </div>
            <Button onClick={addCity} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة مدينة
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedCities.map((city, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">المدينة {index + 1}</h3>
                {selectedCities.length > 1 && (
                  <Button
                    onClick={() => removeCity(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                    حذف
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* اختيار المدينة */}
                <div className="space-y-2">
                  <Label>المدينة *</Label>
                  <Select
                    value={city.name}
                    onValueChange={(value) => updateCity(index, 'name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((cityOption) => (
                        <SelectItem key={cityOption.id} value={cityOption.name}>
                          {cityOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* عدد الليالي */}
                <div className="space-y-2">
                  <Label>عدد الليالي *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={city.nights}
                    onChange={(e) => updateCity(index, 'nights', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              {/* اختيار الفندق */}
              {city.name && allHotels[city.name] && (
                <div className="space-y-2">
                  <Label>الفندق *</Label>
                  <Select
                    value={city.selectedHotelId}
                    onValueChange={(value) => updateCity(index, 'selectedHotelId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent>
                      {allHotels[city.name].map((hotel) => (
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
              )}

              {/* نوع الغرفة */}
              {city.selectedHotelId && (
                <div className="space-y-2">
                  <Label>نوع الغرفة *</Label>
                  <Select
                    value={city.roomType}
                    onValueChange={(value) => updateCity(index, 'roomType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الغرفة" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const cityHotels = allHotels[city.name] || [];
                        const selectedHotel = cityHotels.find(hotel => hotel.id === city.selectedHotelId);
                        if (!selectedHotel) return null;

                        return (
                          <>
                            {selectedHotel.single_price && selectedHotel.single_price > 0 && (
                              <SelectItem value="single">غرفة فردية</SelectItem>
                            )}
                            {selectedHotel.single_view_price && selectedHotel.single_view_price > 0 && (
                              <SelectItem value="single_view">غرفة فردية بإطلالة</SelectItem>
                            )}
                            {selectedHotel.double_without_view_price && selectedHotel.double_without_view_price > 0 && (
                              <SelectItem value="double_without_view">غرفة مزدوجة بدون إطلالة</SelectItem>
                            )}
                            {selectedHotel.double_view_price && selectedHotel.double_view_price > 0 && (
                              <SelectItem value="double_view">غرفة مزدوجة بإطلالة</SelectItem>
                            )}
                            {selectedHotel.triple_without_view_price && selectedHotel.triple_without_view_price > 0 && (
                              <SelectItem value="triple_without_view">غرفة ثلاثية بدون إطلالة</SelectItem>
                            )}
                            {selectedHotel.triple_view_price && selectedHotel.triple_view_price > 0 && (
                              <SelectItem value="triple_view">غرفة ثلاثية بإطلالة</SelectItem>
                            )}
                          </>
                        );
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* معلومات إضافية عن التكلفة */}
              {city.pricePerNight > 0 && (
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="font-semibold text-emerald-600">
                      التكلفة: ${city.pricePerNight}/ليلة × {data.rooms} غرفة × {city.nights} ليالي = ${city.totalPrice}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {selectedCities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لم يتم اختيار أي مدينة بعد</p>
              <p className="text-sm">اضغط على "إضافة مدينة" لبدء اختيار المدن</p>
            </div>
          )}
        </CardContent>
      </Card>

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
          
          <div className="space-y-2">
            <Label>نوع السيارة *</Label>
            <Select
              value={data.carType}
              onValueChange={handleTransportSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع السيارة" />
              </SelectTrigger>
              <SelectContent>
                {transportOptions.map((transport) => (
                  <SelectItem key={transport.id} value={transport.type}>
                    <div className="flex items-center justify-between w-full">
                      <span>{transport.type}</span>
                      <span className="text-sm text-gray-500 mr-4">{transport.capacity}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* دليل السعة */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium mb-2">دليل السعة:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• سيدان: 1-3 أشخاص</li>
              <li>• ميني فان: 4-6 أشخاص</li>
              <li>• فان: 7-8 أشخاص</li>
              <li>• سبرنتر: 9-14 شخص</li>
              <li>• باص: 15+ أشخاص</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ملخص الاختيارات */}
      {selectedCities && selectedCities.length > 0 && data.carType && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">ملخص اختياراتك</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>المدن المختارة: {selectedCities.map(city => city.name).join(', ')}</div>
              <div>وسيلة النقل: {data.carType}</div>
              <div>
                إجمالي تكلفة الفنادق: $
                {selectedCities.reduce((total, city) => total + city.totalPrice, 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
