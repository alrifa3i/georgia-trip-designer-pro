
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  DollarSign, 
  Users, 
  Image, 
  Hotel, 
  Car, 
  Plane,
  Shield,
  Phone,
  Camera,
  Edit,
  Save,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  LogOut,
  Percent
} from 'lucide-react';
import { hotelData, transportData, additionalServicesData } from '@/data/hotels';
import { transportPricing, mandatoryToursRules } from '@/data/transportRules';
import { HotelManagement } from './HotelManagement';
import { CityManagement } from './CityManagement';
import { AdvertisementManagement } from './AdvertisementManagement';
import { BookingManagement } from './BookingManagement';
import { DiscountManagement } from './DiscountManagement';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [profitMargin, setProfitMargin] = useState(22);
  const [currency, setCurrency] = useState('USD');
  const [safetyMessage, setSafetyMessage] = useState('لا يوجد دفع عبر الموقع - الدفع فقط عند الوصول');
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Here you would save to database or local storage
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات النظام بنجاح",
    });
  };

  const formatDateArabic = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl" dir="rtl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-gray-600">إدارة شاملة للنظام والبيانات</p>
        </div>
        <Button 
          onClick={onLogout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            إدارة الحجوزات
          </TabsTrigger>
          <TabsTrigger value="hotels" className="flex items-center gap-2">
            <Hotel className="w-4 h-4" />
            إدارة الفنادق
          </TabsTrigger>
          <TabsTrigger value="cities" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            إدارة المدن
          </TabsTrigger>
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            إدارة الأسعار
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            إدارة الإعلانات
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            إدارة الخصومات
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* إدارة الحجوزات */}
        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>

        {/* إدارة الفنادق */}
        <TabsContent value="hotels">
          <HotelManagement />
        </TabsContent>

        {/* إدارة المدن */}
        <TabsContent value="cities">
          <CityManagement />
        </TabsContent>

        {/* إدارة الأسعار */}
        <TabsContent value="prices" className="space-y-6">
          
          {/* أسعار الفنادق */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                أسعار الفنادق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(hotelData).map(([city, hotels]) => (
                  <div key={city} className="space-y-4">
                    <h3 className="text-lg font-semibold text-emerald-700">{city}</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">اسم الفندق</TableHead>
                            <TableHead className="text-right">مزدوجة بدون إطلالة</TableHead>
                            <TableHead className="text-right">مزدوجة مع إطلالة</TableHead>
                            <TableHead className="text-right">ثلاثية بدون إطلالة</TableHead>
                            <TableHead className="text-right">ثلاثية مع إطلالة</TableHead>
                            <TableHead className="text-right">التقييم</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {hotels.map((hotel) => (
                            <TableRow key={hotel.id}>
                              <TableCell className="font-medium">{hotel.name}</TableCell>
                              <TableCell>${hotel.dbl_wv}</TableCell>
                              <TableCell>${hotel.dbl_v}</TableCell>
                              <TableCell>${hotel.trbl_wv}</TableCell>
                              <TableCell>${hotel.trbl_v}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {hotel.rating} نجوم
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* أسعار النقل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                أسعار النقل والاستقبال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">أسعار السيارات اليومية</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">نوع السيارة</TableHead>
                        <TableHead className="text-right">السعة</TableHead>
                        <TableHead className="text-right">السعر اليومي</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transportData.map((transport) => (
                        <TableRow key={transport.id}>
                          <TableCell className="font-medium">{transport.type}</TableCell>
                          <TableCell>{transport.capacity}</TableCell>
                          <TableCell>${transport.daily_price}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">أسعار الاستقبال والتوديع</h3>
                <div className="grid gap-4">
                  {Object.entries(transportPricing).map(([type, pricing]) => (
                    <Card key={type} className="p-4">
                      <h4 className="font-semibold mb-3 capitalize">{type === 'سيدان' ? 'سيدان' : type === 'ميني فان' ? 'ميني فان' : type === 'فان' ? 'فان' : 'سبرنتر'}</h4>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Label>استقبال نفس المدينة</Label>
                          <Input value={`$${pricing.reception.sameCity}`} readOnly />
                        </div>
                        <div>
                          <Label>استقبال مدينة مختلفة</Label>
                          <Input value={`$${pricing.reception.differentCity}`} readOnly />
                        </div>
                        <div>
                          <Label>توديع نفس المدينة</Label>
                          <Input value={`$${pricing.farewell.sameCity}`} readOnly />
                        </div>
                        <div>
                          <Label>توديع مدينة مختلفة</Label>
                          <Input value={`$${pricing.farewell.differentCity}`} readOnly />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أسعار الخدمات الإضافية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                أسعار الخدمات الإضافية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    تأمين السفر (يومي)
                  </Label>
                  <Input value={`$${additionalServicesData.travelInsurance.pricePerPersonPerDay}`} />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    خط اتصال
                  </Label>
                  <Input value={`$${additionalServicesData.phoneLines.pricePerLine}`} />
                </div>
                <div>
                  <Label>تزيين الغرف</Label>
                  <Input value={`$${additionalServicesData.roomDecoration.price}`} />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    استقبال VIP
                  </Label>
                  <Input value={`$${additionalServicesData.airportReception.pricePerPerson}`} />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    جلسة تصوير
                  </Label>
                  <Input value={`$${additionalServicesData.photoSession.price}`} />
                </div>
                <div>
                  <Label>استقبال بالورود</Label>
                  <Input value={`$${additionalServicesData.flowerReception.price}`} />
                </div>
              </div>
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ أسعار الخدمات
              </Button>
            </CardContent>
          </Card>

          {/* قواعد الجولات الإجبارية */}
          <Card>
            <CardHeader>
              <CardTitle>قواعد الجولات الإجبارية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">القواعد العامة للمدن</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>المدن ذات الجولتين الإجباريتين:</span>
                        <div className="flex gap-1">
                          {mandatoryToursRules.doubleTourCities.map((city) => (
                            <Badge key={city}>{city}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>المدن ذات الجولة الواحدة:</span>
                        <div className="flex gap-1 flex-wrap">
                          {mandatoryToursRules.singleTourCities.map((city) => (
                            <Badge key={city} variant="outline">{city}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>القاعدة الافتراضية:</span>
                        <Badge variant="outline">{mandatoryToursRules.default} جولة إجبارية</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">معلومات إضافية</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>حساب الجولات:</strong>
                        <p className="text-gray-600 mt-1">يتم حساب الجولات الإجبارية تلقائياً حسب المدينة المختارة</p>
                      </div>
                      <div>
                        <strong>التسعير:</strong>
                        <p className="text-gray-600 mt-1">تعتمد تكلفة الجولات على نوع السيارة المختارة</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إدارة الإعلانات */}
        <TabsContent value="ads">
          <AdvertisementManagement />
        </TabsContent>

        {/* إدارة الخصومات */}
        <TabsContent value="discounts">
          <DiscountManagement />
        </TabsContent>

        {/* الإعدادات */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-xl font-bold">الإعدادات العامة</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النظام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>هامش الربح (%)</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">النسبة المضافة على التكلفة الأساسية</p>
                </div>
                <div>
                  <Label>العملة الافتراضية</Label>
                  <Input 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>رسالة الأمان (الصفحة الرئيسية)</Label>
                <Input 
                  value={safetyMessage}
                  onChange={(e) => setSafetyMessage(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSaveSettings}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
