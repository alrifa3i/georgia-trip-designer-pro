import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '@/types/booking';
import { useHotelData } from '@/hooks/useHotelData';
import { MapPin, Building, Plus, Trash2, Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const { hotels: databaseHotels, loading: hotelsLoading } = useHotelData();
  const [selectedCities, setSelectedCities] = useState(data.selectedCities || []);

  // دالة لترتيب الفنادق حسب السعر من الأرخص إلى الأغلى
  const sortHotelsByPrice = (hotels: any[]) => {
    return hotels.sort((a, b) => {
      // استخدام أقل سعر متاح في الفندق للترتيب
      const priceA = Math.min(
        a.single_price || Infinity,
        a.single_view_price || Infinity,
        a.double_without_view_price || Infinity,
        a.double_view_price || Infinity,
        a.triple_without_view_price || Infinity,
        a.triple_view_price || Infinity
      );
      
      const priceB = Math.min(
        b.single_price || Infinity,
        b.single_view_price || Infinity,
        b.double_without_view_price || Infinity,
        b.double_view_price || Infinity,
        b.triple_without_view_price || Infinity,
        b.triple_view_price || Infinity
      );
      
      return priceA - priceB;
    });
  };

  // دالة للتحقق من اكتمال البيانات المطلوبة
  const getIncompleteFields = () => {
    const incompleteFields = [];
    
    if (selectedCities.length === 0) {
      incompleteFields.push('اختيار مدينة واحدة على الأقل');
    }
    
    selectedCities.forEach((city, index) => {
      if (!city.city) {
        incompleteFields.push(`اسم المدينة ${index + 1}`);
      }
      if (!city.hotel) {
        incompleteFields.push(`فندق المدينة ${index + 1}`);
      }
      if (!city.nights || city.nights <= 0) {
        incompleteFields.push(`عدد الليالي في المدينة ${index + 1}`);
      }
      if (!city.roomSelections || city.roomSelections.length === 0) {
        incompleteFields.push(`اختيار الغرف للمدينة ${index + 1}`);
      }
    });
    
    return incompleteFields;
  };

  // التحقق من صحة البيانات
  useEffect(() => {
    const incompleteFields = getIncompleteFields();
    const isValid = incompleteFields.length === 0;
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [selectedCities, onValidationChange]);

  const addCity = () => {
    const newCity = {
      city: '',
      hotel: '',
      nights: 1,
      tours: 0,
      mandatoryTours: 1,
      roomSelections: Array.from({ length: data.rooms }, (_, index) => ({
        roomNumber: index + 1,
        roomType: 'dbl_wv'
      }))
    };
    const updatedCities = [...selectedCities, newCity];
    setSelectedCities(updatedCities);
    updateData({ selectedCities: updatedCities });
  };

  const removeCity = (index: number) => {
    const updatedCities = selectedCities.filter((_, i) => i !== index);
    setSelectedCities(updatedCities);
    updateData({ selectedCities: updatedCities });
  };

  const updateCity = (index: number, field: string, value: any) => {
    const updatedCities = [...selectedCities];
    updatedCities[index] = { ...updatedCities[index], [field]: value };
    
    if (field === 'city') {
      updatedCities[index].hotel = '';
    }
    
    setSelectedCities(updatedCities);
    updateData({ selectedCities: updatedCities });
  };

  const updateRoomSelection = (cityIndex: number, roomIndex: number, roomType: string) => {
    const updatedCities = [...selectedCities];
    if (updatedCities[cityIndex].roomSelections) {
      updatedCities[cityIndex].roomSelections[roomIndex] = {
        ...updatedCities[cityIndex].roomSelections[roomIndex],
        roomType
      };
    }
    setSelectedCities(updatedCities);
    updateData({ selectedCities: updatedCities });
  };

  const getRoomTypeName = (roomType: string) => {
    const roomTypes = {
      single: 'مفردة',
      single_v: 'مفردة مع إطلالة',
      dbl_wv: 'مزدوجة بدون إطلالة',
      dbl_v: 'مزدوجة مع إطلالة',
      trbl_wv: 'ثلاثية بدون إطلالة',
      trbl_v: 'ثلاثية مع إطلالة'
    };
    return roomTypes[roomType as keyof typeof roomTypes] || 'غير محدد';
  };

  const availableCities = Object.keys(databaseHotels || {});

  if (hotelsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الفنادق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">حدد المدن التي تريد زيارتها والفنادق المفضلة</p>
      </div>

      {selectedCities.map((cityStay, cityIndex) => {
        const cityHotels = databaseHotels[cityStay.city] || [];
        const sortedHotels = sortHotelsByPrice(cityHotels);
        
        return (
          <Card key={cityIndex} className="border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>المدينة {cityIndex + 1}</span>
                </div>
                {selectedCities.length > 1 && (
                  <Button
                    onClick={() => removeCity(cityIndex)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`city-${cityIndex}`}>اختر المدينة *</Label>
                  <Select
                    value={cityStay.city}
                    onValueChange={(value) => updateCity(cityIndex, 'city', value)}
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

                <div>
                  <Label htmlFor={`nights-${cityIndex}`}>عدد الليالي *</Label>
                  <Input
                    id={`nights-${cityIndex}`}
                    type="number"
                    min="1"
                    value={cityStay.nights}
                    onChange={(e) => updateCity(cityIndex, 'nights', parseInt(e.target.value) || 1)}
                    className="text-center"
                  />
                </div>
              </div>

              {cityStay.city && (
                <div>
                  <Label htmlFor={`hotel-${cityIndex}`}>اختر الفندق *</Label>
                  <Select
                    value={cityStay.hotel}
                    onValueChange={(value) => updateCity(cityIndex, 'hotel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedHotels.map((hotel) => (
                        <SelectItem key={hotel.name} value={hotel.name}>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span>{hotel.name}</span>
                            <div className="flex gap-1">
                              {Array.from({ length: hotel.rating }, (_, i) => (
                                <span key={i} className="text-yellow-400">⭐</span>
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {cityStay.hotel && (
                <div>
                  <Label>تحديد نوع الغرف *</Label>
                  <div className="space-y-3 mt-2">
                    {Array.from({ length: data.rooms }, (_, roomIndex) => (
                      <div key={roomIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">الغرفة {roomIndex + 1}:</span>
                        </div>
                        <Select
                          value={cityStay.roomSelections?.[roomIndex]?.roomType || 'dbl_wv'}
                          onValueChange={(value) => updateRoomSelection(cityIndex, roomIndex, value)}
                        >
                          <SelectTrigger className="min-w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">مفردة</SelectItem>
                            <SelectItem value="single_v">مفردة مع إطلالة</SelectItem>
                            <SelectItem value="dbl_wv">مزدوجة بدون إطلالة</SelectItem>
                            <SelectItem value="dbl_v">مزدوجة مع إطلالة</SelectItem>
                            <SelectItem value="trbl_wv">ثلاثية بدون إطلالة</SelectItem>
                            <SelectItem value="trbl_v">ثلاثية مع إطلالة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor={`tours-${cityIndex}`}>عدد الجولات الإضافية (اختيارية)</Label>
                <Input
                  id={`tours-${cityIndex}`}
                  type="number"
                  min="0"
                  value={cityStay.tours || 0}
                  onChange={(e) => updateCity(cityIndex, 'tours', parseInt(e.target.value) || 0)}
                  className="text-center"
                />
                <p className="text-xs text-gray-500 mt-1">
                  الجولات الإجبارية ستُحسب تلقائياً حسب المدينة
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-center">
        <Button
          onClick={addCity}
          variant="outline"
          className="flex items-center gap-2 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4" />
          إضافة مدينة جديدة
        </Button>
      </div>

      {/* مؤشر الحقول المطلوبة */}
      <RequiredFieldsIndicator incompleteFields={getIncompleteFields()} />
    </div>
  );
};

// مكون جديد لإظهار الحقول المطلوبة
const RequiredFieldsIndicator = ({ incompleteFields }: { incompleteFields: string[] }) => {
  if (incompleteFields.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">جميع البيانات المطلوبة مكتملة</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-orange-800">البيانات المطلوبة لإكمال هذه المرحلة:</h4>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {incompleteFields.map((field, index) => (
              <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 bg-white">
                {field}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-orange-600 mt-2">
            يرجى إكمال هذه البيانات للمتابعة إلى المرحلة التالية
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
