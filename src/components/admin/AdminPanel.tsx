
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Trash2
} from 'lucide-react';

export const AdminPanel = () => {
  const [editMode, setEditMode] = useState<string | null>(null);

  // بيانات وهمية للأسعار
  const [prices, setPrices] = useState({
    hotels: {
      'تبليسي': {
        'فندق رويال باتومي': { single: 80, single_v: 100, dbl_wv: 120, dbl_v: 150, trbl_wv: 180, trbl_v: 220 }
      }
    },
    transport: {
      'سيدان': 50,
      'ميني فان': 80,
      'فان': 120,
      'سبرنتر': 180,
      'باص': 250
    },
    services: {
      travelInsurance: 5,
      phoneLines: 15,
      roomDecoration: 50,
      airportReception: 280,
      photoSession: 150
    }
  });

  // بيانات المستخدمين
  const [users] = useState([
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', bookings: 3, status: 'active' },
    { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', bookings: 1, status: 'active' },
    { id: 3, name: 'محمد سعد', email: 'mohammed@example.com', bookings: 5, status: 'inactive' }
  ]);

  // إعلانات
  const [ads, setAds] = useState([
    { id: 1, title: 'باقة رومانسية لشخصين', peopleRange: '1-2', price: '1,200$', status: 'active' },
    { id: 2, title: 'باقة العائلة المميزة', peopleRange: '3-5', price: '2,400$', status: 'active' },
    { id: 3, title: 'باقة المجموعات الكبيرة', peopleRange: '6-10', price: '4,800$', status: 'inactive' }
  ]);

  return (
    <div className="container mx-auto p-6 max-w-7xl" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم الإدارية</h1>
        <p className="text-gray-600">إدارة الأسعار والإعلانات والمستخدمين</p>
      </div>

      <Tabs defaultValue="prices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            إدارة الأسعار
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            إدارة الإعلانات
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            إدارة المستخدمين
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

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
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>مدينة</Label>
                    <Input value="تبليسي" disabled />
                  </div>
                  <div>
                    <Label>اسم الفندق</Label>
                    <Input value="فندق رويال باتومي" disabled />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-6 gap-4">
                  <div>
                    <Label>غرفة مفردة</Label>
                    <Input value="80" />
                  </div>
                  <div>
                    <Label>مفردة مع إطلالة</Label>
                    <Input value="100" />
                  </div>
                  <div>
                    <Label>مزدوجة</Label>
                    <Input value="120" />
                  </div>
                  <div>
                    <Label>مزدوجة مع إطلالة</Label>
                    <Input value="150" />
                  </div>
                  <div>
                    <Label>ثلاثية</Label>
                    <Input value="180" />
                  </div>
                  <div>
                    <Label>ثلاثية مع إطلالة</Label>
                    <Input value="220" />
                  </div>
                </div>
                
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* أسعار النقل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                أسعار النقل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {Object.entries(prices.transport).map(([type, price]) => (
                  <div key={type}>
                    <Label>{type}</Label>
                    <Input value={price} />
                  </div>
                ))}
              </div>
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ أسعار النقل
              </Button>
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
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    التأمين (يومي)
                  </Label>
                  <Input value={prices.services.travelInsurance} />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    خط اتصال
                  </Label>
                  <Input value={prices.services.phoneLines} />
                </div>
                <div>
                  <Label>تزيين الغرف</Label>
                  <Input value={prices.services.roomDecoration} />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    استقبال VIP
                  </Label>
                  <Input value={prices.services.airportReception} />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    جلسة تصوير
                  </Label>
                  <Input value={prices.services.photoSession} />
                </div>
              </div>
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ أسعار الخدمات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إدارة الإعلانات */}
        <TabsContent value="ads" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">إدارة الإعلانات</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة إعلان جديد
            </Button>
          </div>

          <div className="grid gap-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{ad.title}</h3>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          <Users className="w-3 h-3 ml-1" />
                          {ad.peopleRange} أشخاص
                        </Badge>
                        <Badge variant="outline">
                          <DollarSign className="w-3 h-3 ml-1" />
                          {ad.price}
                        </Badge>
                        <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                          {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إدارة المستخدمين */}
        <TabsContent value="users" className="space-y-6">
          <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-right p-4">الاسم</th>
                      <th className="text-right p-4">البريد الإلكتروني</th>
                      <th className="text-right p-4">عدد الحجوزات</th>
                      <th className="text-right p-4">الحالة</th>
                      <th className="text-right p-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4">{user.bookings}</td>
                        <td className="p-4">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
                  <Input value="22" />
                  <p className="text-sm text-gray-500 mt-1">النسبة المضافة على التكلفة الأساسية</p>
                </div>
                <div>
                  <Label>العملة الافتراضية</Label>
                  <Input value="USD" />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>رسالة الأمان (الصفحة الرئيسية)</Label>
                <Input value="لا يوجد دفع عبر الموقع - الدفع فقط عند الوصول" />
              </div>
              
              <Button className="bg-emerald-600 hover:bg-emerald-700">
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
