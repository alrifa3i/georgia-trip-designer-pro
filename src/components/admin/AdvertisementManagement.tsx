
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Save, Trash2, Image, Users, DollarSign } from 'lucide-react';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  peopleRange: string;
  price: string;
  imageUrl: string;
  status: 'active' | 'inactive';
}

export const AdvertisementManagement = () => {
  const [ads, setAds] = useState<Advertisement[]>([
    {
      id: '1',
      title: 'باقة رومانسية لشخصين',
      description: 'باقة مميزة للأزواج تشمل إقامة فاخرة وجولات رومانسية',
      peopleRange: '1-2',
      price: '1,200$',
      imageUrl: '/placeholder-ad1.jpg',
      status: 'active'
    },
    {
      id: '2',
      title: 'باقة العائلة المميزة',
      description: 'باقة شاملة للعائلات مع أنشطة مناسبة للأطفال',
      peopleRange: '3-5',
      price: '2,400$',
      imageUrl: '/placeholder-ad2.jpg',
      status: 'active'
    },
    {
      id: '3',
      title: 'باقة المجموعات الكبيرة',
      description: 'باقة اقتصادية للمجموعات الكبيرة مع خصومات خاصة',
      peopleRange: '6-10',
      price: '4,800$',
      imageUrl: '/placeholder-ad3.jpg',
      status: 'inactive'
    }
  ]);

  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [newAd, setNewAd] = useState<Advertisement>({
    id: '',
    title: '',
    description: '',
    peopleRange: '1-2',
    price: '',
    imageUrl: '',
    status: 'active'
  });

  const handleSaveAd = (ad: Advertisement) => {
    console.log('حفظ الإعلان:', ad);
    const updatedAds = ads.map(a => a.id === ad.id ? ad : a);
    setAds(updatedAds);
    setEditingAd(null);
  };

  const handleAddAd = () => {
    const id = Date.now().toString();
    const adToAdd = { ...newAd, id };
    console.log('إضافة إعلان جديد:', adToAdd);
    setAds([...ads, adToAdd]);
    setIsAddingAd(false);
    setNewAd({
      id: '',
      title: '',
      description: '',
      peopleRange: '1-2',
      price: '',
      imageUrl: '',
      status: 'active'
    });
  };

  const handleDeleteAd = (adId: string) => {
    console.log('حذف الإعلان:', adId);
    setAds(ads.filter(a => a.id !== adId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الإعلانات</h2>
        <Dialog open={isAddingAd} onOpenChange={setIsAddingAd}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة إعلان جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة إعلان جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>عنوان الإعلان</Label>
                <Input
                  value={newAd.title}
                  onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea
                  value={newAd.description}
                  onChange={(e) => setNewAd({...newAd, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نطاق عدد الأشخاص</Label>
                  <Select onValueChange={(value) => setNewAd({...newAd, peopleRange: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النطاق" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 أشخاص</SelectItem>
                      <SelectItem value="3-5">3-5 أشخاص</SelectItem>
                      <SelectItem value="6-10">6-10 أشخاص</SelectItem>
                      <SelectItem value="10+">أكثر من 10 أشخاص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>السعر</Label>
                  <Input
                    value={newAd.price}
                    onChange={(e) => setNewAd({...newAd, price: e.target.value})}
                    placeholder="مثال: 1,200$"
                  />
                </div>
              </div>
              <div>
                <Label>رابط الصورة</Label>
                <Input
                  value={newAd.imageUrl}
                  onChange={(e) => setNewAd({...newAd, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>الحالة</Label>
                <Select onValueChange={(value: 'active' | 'inactive') => setNewAd({...newAd, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddAd} className="w-full">
                <Save className="w-4 h-4 ml-2" />
                حفظ الإعلان
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  {editingAd?.id === ad.id ? (
                    <div className="space-y-4">
                      <Input
                        value={editingAd.title}
                        onChange={(e) => setEditingAd({...editingAd, title: e.target.value})}
                        className="font-bold text-lg"
                      />
                      <Textarea
                        value={editingAd.description}
                        onChange={(e) => setEditingAd({...editingAd, description: e.target.value})}
                      />
                      <div className="flex gap-4">
                        <Select
                          value={editingAd.peopleRange}
                          onValueChange={(value) => setEditingAd({...editingAd, peopleRange: value})}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 أشخاص</SelectItem>
                            <SelectItem value="3-5">3-5 أشخاص</SelectItem>
                            <SelectItem value="6-10">6-10 أشخاص</SelectItem>
                            <SelectItem value="10+">أكثر من 10 أشخاص</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={editingAd.price}
                          onChange={(e) => setEditingAd({...editingAd, price: e.target.value})}
                          className="w-32"
                        />
                        <Select
                          value={editingAd.status}
                          onValueChange={(value: 'active' | 'inactive') => setEditingAd({...editingAd, status: value})}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="inactive">غير نشط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg">{ad.title}</h3>
                      <p className="text-gray-600">{ad.description}</p>
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
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingAd?.id === ad.id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveAd(editingAd)}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAd(ad)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAd(ad.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
