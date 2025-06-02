import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '@/types/booking';
import { transportPricing, mandatoryToursRules } from '@/data/transportRules';
import { useCitiesData } from '@/hooks/useCitiesData';
import { useAllHotelsData } from '@/hooks/useHotelsData';
import { useTransportData } from '@/hooks/useTransportData';
import { 
  MapPin, Building, Car, Plane, Users, Plus, Trash2, 
  AlertTriangle, CheckCircle, Calendar, Bed, Star,
  Navigation, Clock, User, Loader
} from 'lucide-react';

interface CityHotelSelectionStepProps {
  data: BookingData;
  updateData: (data: Partial<BookingData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const CityHotelSelectionStep = ({ data, updateData, onValidationChange }: CityHotelSelectionStepProps) => {
  const [selectedCities, setSelectedCities] = useState(data.selectedCities || []);
  const [carType, setCarType] = useState(data.carType || '');
  const [arrivalAirport, setArrivalAirport] = useState(data.arrivalAirport || '');
  const [departureAirport, setDepartureAirport] = useState(data.departureAirport || '');
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [showAutoCorrect, setShowAutoCorrect] = useState(false);
  const [suggestedCorrection, setSuggestedCorrection] = useState<any>(null);

  // جلب البيانات من قاعدة البيانات
  const { data: citiesData, isLoading: citiesLoading, error: citiesError } = useCitiesData();
  const { data: hotelsData, isLoading: hotelsLoading, error: hotelsError } = useAllHotelsData();
  const { data: transportData, isLoading: transportLoading, error: transportError } = useTransportData();

  const airports = [
    { code: 'TBS', name: 'تبليسي (TBS)', city: 'تبليسي' },
    { code: 'BUS', name: 'باتومي (BUS)', city: 'باتومي' },
    { code: 'KUT', name: 'كوتايسي (KUT)', city: 'كوتايسي' }
  ];

  // استخدام البيانات من قاعدة البيانات أو القيم الافتراضية
  const cities = citiesData?.map(city => city.name) || [];
  const hotels = hotelsData || {};
  const transports = transportData || [];

  console.log('بيانات المدن:', cities);
  console.log('بيانات الفنادق:', hotels);
  console.log('بيانات النقل:', transports);

  // إظهار رسالة التحميل
  if (citiesLoading || hotelsLoading || transportLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // إظهار رسالة الخطأ
  if (citiesError || hotelsError || transportError) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          حدث خطأ في تحميل البيانات. الرجاء المحاولة مرة أخرى.
          {(citiesError || hotelsError || transportError) && (
            <div className="mt-2 text-sm">
              {citiesError && <div>خطأ المدن: {citiesError.message}</div>}
              {hotelsError && <div>خطأ الفنادق: {hotelsError.message}</div>}
              {transportError && <div>خطأ النقل: {transportError.message}</div>}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // حساب عدد الليالي المطلوبة من تواريخ الوصول والمغادرة
  const getRequiredNights = () => {
    if (!data.arrivalDate || !data.departureDate) return 0;
    const arrivalDate = new Date(data.arrivalDate);
    const departureDate = new Date(data.departureDate);
    const diffTime = Math.abs(departureDate.getTime() - arrivalDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
  };

  // حساب مجموع الليالي المختارة
  const getTotalSelectedNights = () => {
    return selectedCities.reduce((total, city) => total + city.nights, 0);
  };

  const requiredNights = getRequiredNights();
  const totalSelectedNights = getTotalSelectedNights();

  // التحقق من صحة البيانات والتحديث التلقائي
  const validateAndAutoCorrect = () => {
    if (selectedCities.length === 0 || !arrivalAirport || !departureAirport) {
      return;
    }

    // تحديد المدينة الأولى والأخيرة بناءً على عدد الليالي
    let firstCity = '';
    let lastCity = '';
    let maxNights = 0;
    let firstCityNights = 0;

    selectedCities.forEach(city => {
      if (city.nights > maxNights) {
        maxNights = city.nights;
        lastCity = city.city;
      }
    });

    // تحديد المدينة الأولى (يمكن أن تكون نفس المدينة الأخيرة إذا كانت لها أكبر عدد ليالي)
    firstCity = selectedCities[0]?.city || '';
    
    // في حالة تساوي الليالي، نأخذ المدينة الأخيرة في المصفوفة
    const citiesWithMaxNights = selectedCities.filter(city => city.nights === maxNights);
    if (citiesWithMaxNights.length > 1) {
      lastCity = citiesWithMaxNights[citiesWithMaxNights.length - 1].city;
    }

    const arrivalAirportCity = airports.find(a => a.code === arrivalAirport)?.city;
    const departureAirportCity = airports.find(a => a.code === departureAirport)?.city;

    let needsCorrection = false;
    let correctionNeeded = '';

    // التحقق من تطابق مطار الوصول مع المدينة الأولى
    if (arrivalAirportCity !== firstCity) {
      needsCorrection = true;
      correctionNeeded = `يجب أن تكون المدينة الأولى هي ${arrivalAirportCity}، الرجاء تعديل المسار`;
    }

    // التحقق من تطابق مطار المغادرة مع المدينة الأخيرة
    if (departureAirportCity !== lastCity) {
      needsCorrection = true;
      correctionNeeded = `يجب أن تكون المدينة الأخيرة هي ${departureAirportCity}، الرجاء تعديل الليلة الأخيرة لتكون في مدينة ${departureAirportCity}`;
    }

    // التحقق من تطابق عدد الليالي
    if (totalSelectedNights !== requiredNights && requiredNights > 0) {
      needsCorrection = true;
      correctionNeeded = `مجموع الليالي المختارة (${totalSelectedNights}) يجب أن يساوي عدد الليالي المطلوبة (${requiredNights})`;
    }

    if (needsCorrection) {
      setValidationMessage(correctionNeeded);
      setShowValidationError(true);
      
      // اقتراح التصحيح التلقائي
      const suggestion = {
        arrivalCity: arrivalAirportCity,
        departureCity: departureAirportCity,
        currentFirst: firstCity,
        currentLast: lastCity,
        nightsMismatch: totalSelectedNights !== requiredNights
      };
      setSuggestedCorrection(suggestion);
      setShowAutoCorrect(true);
      
      return false;
    }

    setShowValidationError(false);
    setShowAutoCorrect(false);
    return true;
  };

  // تطبيق التصحيح التلقائي
  const applyAutoCorrection = () => {
    if (!suggestedCorrection) return;

    const correctedCities = [...selectedCities];
    const arrivalAirportCity = airports.find(a => a.code === arrivalAirport)?.city;
    const departureAirportCity = airports.find(a => a.code === departureAirport)?.city;

    // التأكد من أن المدينة الأولى تطابق مطار الوصول
    if (correctedCities.length > 0 && arrivalAirportCity) {
      correctedCities[0] = {
        ...correctedCities[0],
        city: arrivalAirportCity,
        hotel: '', // إعادة تعيين الفندق عند تغيير المدينة
        roomSelections: []
      };
    }

    // التأكد من أن المدينة الأخيرة تطابق مطار المغادرة
    if (departureAirportCity) {
      // البحث عن المدينة التي لها أكبر عدد ليالي
      let maxNights = Math.max(...correctedCities.map(city => city.nights));
      let lastCityIndex = correctedCities.findIndex(city => city.nights === maxNights);
      
      // في حالة وجود عدة مدن بنفس عدد الليالي، نأخذ الأخيرة
      const citiesWithMaxNights = correctedCities
        .map((city, index) => ({ city, index }))
        .filter(item => item.city.nights === maxNights);
      
      if (citiesWithMaxNights.length > 0) {
        lastCityIndex = citiesWithMaxNights[citiesWithMaxNights.length - 1].index;
      }

      if (lastCityIndex !== -1) {
        correctedCities[lastCityIndex] = {
          ...correctedCities[lastCityIndex],
          city: departureAirportCity,
          hotel: '', // إعادة تعيين الفندق عند تغيير المدينة
          roomSelections: []
        };
      }
    }

    // تصحيح عدد الليالي إذا كان هناك عدم تطابق
    if (suggestedCorrection.nightsMismatch && requiredNights > 0) {
      const currentTotal = correctedCities.reduce((total, city) => total + city.nights, 0);
      const difference = requiredNights - currentTotal;
      
      if (difference !== 0 && correctedCities.length > 0) {
        // توزيع الفرق على المدن الموجودة
        let remainingDifference = difference;
        let cityIndex = 0;
        
        while (remainingDifference !== 0 && cityIndex < correctedCities.length) {
          if (remainingDifference > 0) {
            correctedCities[cityIndex].nights += 1;
            remainingDifference -= 1;
          } else if (remainingDifference < 0 && correctedCities[cityIndex].nights > 1) {
            correctedCities[cityIndex].nights -= 1;
            remainingDifference += 1;
          }
          cityIndex = (cityIndex + 1) % correctedCities.length;
        }
      }
    }

    setSelectedCities(correctedCities);
    setShowAutoCorrect(false);
    setShowValidationError(false);
  };

  // حساب الجولات الإجبارية
  const calculateMandatoryTours = (cityName: string, cityIndex: number) => {
    if (!carType) return 0;

    let mandatoryTours = 0;
    
    if (cityName === 'باتومي') {
      mandatoryTours = mandatoryToursRules.batumi;
    } else {
      mandatoryTours = mandatoryToursRules.default;
    }
    
    const isFirstCity = cityIndex === 0;
    const isLastCity = cityIndex === selectedCities.length - 1;
    
    if (isFirstCity && arrivalAirport) {
      if (arrivalAirport === 'TBS') {
        mandatoryTours = mandatoryToursRules.arrivalRules.TBS;
      } else if (arrivalAirport === 'BUS') {
        mandatoryTours = mandatoryToursRules.arrivalRules.BUS;
      } else if (arrivalAirport === 'KUT') {
        mandatoryTours = mandatoryToursRules.arrivalRules.KUT;
      }
    }
    
    if (isLastCity && departureAirport) {
      if (departureAirport === 'TBS') {
        mandatoryTours = mandatoryToursRules.departureRules.TBS;
      } else if (departureAirport === 'BUS') {
        mandatoryTours = mandatoryToursRules.departureRules.BUS;
      } else if (departureAirport === 'KUT') {
        mandatoryTours = mandatoryToursRules.departureRules.KUT;
      }
    }
    
    return mandatoryTours;
  };

  // إضافة مدينة جديدة
  const addCity = () => {
    const newCity = {
      city: '',
      nights: 1,
      hotel: '',
      tours: 0,
      mandatoryTours: 0,
      roomSelections: []
    };
    
    // التأكد من أن مجموع الليالي لا يتجاوز المطلوب
    const currentTotal = getTotalSelectedNights();
    if (currentTotal < requiredNights) {
      const remainingNights = requiredNights - currentTotal;
      newCity.nights = Math.min(remainingNights, 1);
    }
    
    setSelectedCities([...selectedCities, newCity]);
  };

  // حذف مدينة
  const removeCity = (index: number) => {
    const updatedCities = selectedCities.filter((_, i) => i !== index);
    setSelectedCities(updatedCities);
  };

  // تحديث بيانات المدينة
  const updateCity = (index: number, field: string, value: any) => {
    const updatedCities = [...selectedCities];
    updatedCities[index] = { ...updatedCities[index], [field]: value };
    
    // إعادة تعيين الفندق والغرف عند تغيير المدينة
    if (field === 'city') {
      updatedCities[index].hotel = '';
      updatedCities[index].roomSelections = [];
    }
    
    // إعادة تعيين الغرف عند تغيير الفندق
    if (field === 'hotel') {
      updatedCities[index].roomSelections = [];
    }

    // التحقق من عدد الليالي عند التغيير
    if (field === 'nights') {
      const newTotal = updatedCities.reduce((total, city) => total + city.nights, 0);
      if (newTotal > requiredNights) {
        // تقليل الليالي للمدينة الحالية فقط
        const excess = newTotal - requiredNights;
        updatedCities[index].nights = Math.max(1, updatedCities[index].nights - excess);
      }
    }
    
    setSelectedCities(updatedCities);
  };

  // تحديث الجولات الإجبارية تلقائياً
  useEffect(() => {
    const updatedCities = selectedCities.map((city, index) => ({
      ...city,
      mandatoryTours: calculateMandatoryTours(city.city, index)
    }));
    
    if (JSON.stringify(updatedCities) !== JSON.stringify(selectedCities)) {
      setSelectedCities(updatedCities);
    }
  }, [carType, arrivalAirport, departureAirport, selectedCities.length]);

  // إضافة غرفة جديدة
  const addRoom = (cityIndex: number) => {
    const updatedCities = [...selectedCities];
    const currentRooms = updatedCities[cityIndex].roomSelections || [];
    const newRoomNumber = currentRooms.length + 1;
    
    updatedCities[cityIndex].roomSelections = [
      ...currentRooms,
      { roomNumber: newRoomNumber, roomType: 'dbl_wv' }
    ];
    
    setSelectedCities(updatedCities);
  };

  // حذف غرفة
  const removeRoom = (cityIndex: number, roomIndex: number) => {
    const updatedCities = [...selectedCities];
    updatedCities[cityIndex].roomSelections = updatedCities[cityIndex].roomSelections?.filter((_, i) => i !== roomIndex) || [];
    
    // إعادة ترقيم الغرف
    updatedCities[cityIndex].roomSelections = updatedCities[cityIndex].roomSelections.map((room, index) => ({
      ...room,
      roomNumber: index + 1
    }));
    
    setSelectedCities(updatedCities);
  };

  // تحديث نوع الغرفة
  const updateRoomType = (cityIndex: number, roomIndex: number, roomType: string) => {
    const updatedCities = [...selectedCities];
    if (updatedCities[cityIndex].roomSelections) {
      updatedCities[cityIndex].roomSelections[roomIndex].roomType = roomType;
      setSelectedCities(updatedCities);
    }
  };

  // التحقق من صحة البيانات
  useEffect(() => {
    const isValid = selectedCities.length > 0 && 
                   carType && 
                   arrivalAirport && 
                   departureAirport &&
                   selectedCities.every(city => 
                     city.city && 
                     city.nights > 0 && 
                     city.hotel &&
                     city.roomSelections &&
                     city.roomSelections.length > 0
                   ) &&
                   totalSelectedNights === requiredNights;

    onValidationChange?.(isValid);
  }, [selectedCities, carType, arrivalAirport, departureAirport, totalSelectedNights, requiredNights]);

  // تحديث البيانات
  useEffect(() => {
    updateData({
      selectedCities,
      carType,
      arrivalAirport,
      departureAirport
    });
  }, [selectedCities, carType, arrivalAirport, departureAirport]);

  const getRoomTypeName = (roomType: string) => {
    switch (roomType) {
      case 'single': return 'غرفة مفردة';
      case 'single_v': return 'غرفة مفردة مع إطلالة';
      case 'dbl_wv': return 'غرفة مزدوجة بدون إطلالة';
      case 'dbl_v': return 'غرفة مزدوجة مع إطلالة';
      case 'trbl_wv': return 'غرفة ثلاثية بدون إطلالة';
      case 'trbl_v': return 'غرفة ثلاثية مع إطلالة';
      default: return roomType;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختيار المدن والفنادق</h2>
        <p className="text-gray-600">حدد مسار رحلتك والفنادق المفضلة</p>
      </div>

      {/* مؤشر عدد الليالي */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Calendar className="w-5 h-5" />
            مدة الرحلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">{requiredNights}</div>
              <div className="text-sm text-purple-600">ليلة مطلوبة</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${totalSelectedNights === requiredNights ? 'text-green-600' : 'text-red-600'}`}>
                {totalSelectedNights}
              </div>
              <div className="text-sm text-gray-600">ليلة مختارة</div>
            </div>
            <div className="text-center">
              {totalSelectedNights === requiredNights ? (
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
              )}
              <div className="text-xs text-gray-500 mt-1">
                {totalSelectedNights === requiredNights ? 'متطابق' : 'غير متطابق'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* اختيار نوع السيارة */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Car className="w-5 h-5" />
            اختيار نوع السيارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={carType} onValueChange={setCarType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر نوع السيارة" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {transports.map((transport) => (
                <SelectItem key={transport.type} value={transport.type}>
                  <div className="flex items-center justify-between w-full">
                    <span>{transport.type}</span>
                    <span className="text-gray-500 mr-2">{transport.capacity}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* اختيار المطارات */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Plane className="w-5 h-5" />
            مطارات الوصول والمغادرة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="arrival-airport">مطار الوصول</Label>
              <Select value={arrivalAirport} onValueChange={setArrivalAirport}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مطار الوصول" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {airports.map((airport) => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="departure-airport">مطار المغادرة</Label>
              <Select value={departureAirport} onValueChange={setDepartureAirport}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مطار المغادرة" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {airports.map((airport) => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* رسائل التحقق */}
      {showValidationError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {validationMessage}
          </AlertDescription>
        </Alert>
      )}

      {showAutoCorrect && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <p>تم اكتشاف تناقض في مسار الرحلة. هل تريد التصحيح التلقائي؟</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={applyAutoCorrection} className="bg-blue-600 hover:bg-blue-700">
                  تطبيق التصحيح التلقائي
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAutoCorrect(false)}>
                  تعديل يدوي
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* المدن والفنادق */}
      <div className="space-y-4">
        {selectedCities.map((cityStay, cityIndex) => (
          <Card key={cityIndex} className="border-2 hover:border-emerald-200 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  المدينة {cityIndex + 1}
                </CardTitle>
                {selectedCities.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCity(cityIndex)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* اختيار المدينة وعدد الليالي */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>المدينة</Label>
                  <Select 
                    value={cityStay.city} 
                    onValueChange={(value) => updateCity(cityIndex, 'city', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>عدد الليالي</Label>
                  <Input
                    type="number"
                    min="1"
                    max={requiredNights}
                    value={cityStay.nights}
                    onChange={(e) => updateCity(cityIndex, 'nights', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              {/* اختيار الفندق */}
              {cityStay.city && (
                <div>
                  <Label>الفندق</Label>
                  <Select 
                    value={cityStay.hotel} 
                    onValueChange={(value) => updateCity(cityIndex, 'hotel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفندق" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {(hotels[cityStay.city] || []).map((hotel) => (
                        <SelectItem key={hotel.name} value={hotel.name}>
                          <div className="flex items-center gap-2">
                            <span>{hotel.name}</span>
                            <div className="flex">
                              {[...Array(hotel.rating || 3)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* الجولات */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>الجولات الاختيارية</Label>
                  <Input
                    type="number"
                    min="0"
                    value={cityStay.tours || 0}
                    onChange={(e) => updateCity(cityIndex, 'tours', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>الجولات الإجبارية</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={cityStay.mandatoryTours || 0}
                      readOnly
                      className="bg-gray-100"
                    />
                    <Badge variant="secondary" className="text-xs">تلقائي</Badge>
                  </div>
                </div>
              </div>

              {/* الغرف */}
              {cityStay.hotel && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">الغرف</Label>
                    <Button
                      size="sm"
                      onClick={() => addRoom(cityIndex)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      إضافة غرفة
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {(cityStay.roomSelections || []).map((room, roomIndex) => (
                      <div key={roomIndex} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Bed className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">الغرفة {room.roomNumber}:</span>
                        <Select 
                          value={room.roomType} 
                          onValueChange={(value) => updateRoomType(cityIndex, roomIndex, value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            <SelectItem value="single">غرفة مفردة</SelectItem>
                            <SelectItem value="single_v">غرفة مفردة مع إطلالة</SelectItem>
                            <SelectItem value="dbl_wv">غرفة مزدوجة بدون إطلالة</SelectItem>
                            <SelectItem value="dbl_v">غرفة مزدوجة مع إطلالة</SelectItem>
                            <SelectItem value="trbl_wv">غرفة ثلاثية بدون إطلالة</SelectItem>
                            <SelectItem value="trbl_v">غرفة ثلاثية مع إطلالة</SelectItem>
                          </SelectContent>
                        </Select>
                        {(cityStay.roomSelections?.length || 0) > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeRoom(cityIndex, roomIndex)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* زر إضافة مدينة */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
          <CardContent className="pt-6">
            <Button
              onClick={addCity}
              variant="outline"
              className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              disabled={totalSelectedNights >= requiredNights}
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة مدينة جديدة
              {totalSelectedNights >= requiredNights && (
                <span className="mr-2 text-xs">(تم الوصول للحد الأقصى)</span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ملخص المسار */}
      {selectedCities.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Navigation className="w-5 h-5" />
              ملخص مسار الرحلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">إجمالي المدن:</span>
                <Badge variant="secondary">{selectedCities.length} مدينة</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">إجمالي الليالي:</span>
                <Badge variant={totalSelectedNights === requiredNights ? "default" : "destructive"}>
                  {totalSelectedNights} من {requiredNights} ليلة
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">إجمالي الجولات:</span>
                <Badge variant="secondary">
                  {selectedCities.reduce((total, city) => total + (city.tours || 0) + (city.mandatoryTours || 0), 0)} جولة
                </Badge>
              </div>
              <Separator />
              <div className="text-sm text-gray-600">
                <strong>المسار:</strong> {selectedCities.map(city => city.city).filter(Boolean).join(' → ')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
