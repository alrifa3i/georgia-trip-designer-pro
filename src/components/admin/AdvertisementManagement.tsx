
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Save, Trash2, ArrowUp, ArrowDown, Star, Users, Baby, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  adults: number;
  children: number;
  services: string[];
  type: string;
  priority: number;
  status: 'active' | 'inactive';
  whatsappMessage: string;
}

const availableServices = [
  'إقامة في فنادق 4-5 نجوم',
  'جولات سياحية يومية',
  'مرشد سياحي متخصص',
  'نقل خاص مريح',
  'وجبات إفطار متنوعة',
  'أنشطة ترفيهية',
  'زيارة المعالم التاريخية',
  'جولات طبيعية',
  'تصوير فوتوغرافي',
  'خدمة عملاء 24/7'
];

const adTypes = [
  { value: 'limited', label: 'محدود', color: 'bg-red-100 text-red-800' },
  { value: 'featured', label: 'مميز', color: 'bg-blue-100 text-blue-800' },
  { value: 'special', label: 'خاص', color: 'bg-green-100 text-green-800' },
  { value: 'premium', label: 'بريميوم', color: 'bg-purple-100 text-purple-800' }
];

export const AdvertisementManagement = () => {
  const { toast } = useToast();
  
  const [ads, setAds] = useState<Advertisement[]>([
    {
      id: '1',
      title: 'باقة رومانسية لشهر العسل',
      description: 'باقة مميزة للأزواج تشمل إقامة فاخرة وجولات رومانسية في أجمل المناطق الطبيعية',
      adults: 2,
      children: 0,
      services: ['إقامة في فنادق 4-5 نجوم', 'جولات سياحية يومية', 'نقل خاص مريح'],
      type: 'special',
      priority: 1,
      status: 'active',
      whatsappMessage: 'مرحباً، أرغب في الاستفسار عن باقة شهر العسل الرومانسية'
    },
    {
      id: '2',
      title: 'باقة العائلة الكبيرة',
      description: 'باقة شاملة للعائلات الكبيرة مع أنشطة مناسبة للأطفال وبرامج ترفيهية متنوعة',
      adults: 6,
      children: 3,
      services: ['إقامة في فنادق 4-5 نجوم', 'أنشطة ترفيهية', 'وجبات إفطار متنوعة'],
      type: 'featured',
      priority: 2,
      status: 'active',
      whatsappMessage: 'مرحباً، أرغب في الاستفسار عن باقة العائلة الكبيرة'
    }
  ]);

  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [newAd, setNewAd] = useState<Advertisement>({
    id: '',
    title: '',
    description: '',
    adults: 1,
    children: 0,
    services: [],
    type: 'limited',
    priority: 1,
    status: 'active',
    whatsappMessage: ''
  });

  const handleSaveAd = (ad: Advertisement) => {
    console.log('حفظ الإعلان:', ad);
    const updatedAds = ads.map(a => a.id === ad.id ? ad : a);
    setAds(updatedAds);
    setEditingAd(null);
    
    toast({
      title: "تم بنجاح",
      description: "تم حفظ تعديلات الإعلان بنجاح",
    });
  };

  const handleAddAd = () => {
    if (!newAd.title || !newAd.description) {
      toast({
        title: "خطأ",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const id = Date.now().toString();
    const adToAdd = { 
      ...newAd, 
      id,
      whatsappMessage: newAd.whatsappMessage || `مرحباً، أرغب في الاستفسار عن ${newAd.title}`
    };
    
    console.log('إضافة إعلان جديد:', adToAdd);
    setAds([...ads, adToAdd]);
    setIsAddingAd(false);
    setNewAd({
      id: '',
      title: '',
      description: '',
      adults: 1,
      children: 0,
      services: [],
      type: 'limited',
      priority: 1,
      status: 'active',
      whatsappMessage: ''
    });

    toast({
      title: "تم بنجاح",
      description: "تم إضافة الإعلان الجديد بنجاح",
    });
  };

  const handleDeleteAd = (adId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      console.log('حذف الإعلان:', adId);
      setAds(ads.filter(a => a.id !== adId));
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف الإعلان بنجاح",
      });
    }
  };

  const handleServiceToggle = (service: string, ad: Advertisement, isEditing: boolean = false) => {
    if (isEditing && editingAd) {
      const updatedServices = editingAd.services.includes(service)
        ? editingAd.services.filter(s => s !== service)
        : [...editingAd.services, service];
      setEditingAd({ ...editingAd, services: updatedServices });
    } else {
      const updatedServices = newAd.services.includes(service)
        ? newAd.services.filter(s => s !== service)
        : [...newAd.services, service];
      setNewAd({ ...newAd, services: updatedServices });
    }
  };

  const handlePriorityChange = (adId: string, direction: 'up' | 'down') => {
    const updatedAds = ads.map(ad => {
      if (ad.id === adId) {
        const newPriority = direction === 'up' ? Math.max(1, ad.priority - 1) : ad.priority + 1;
        return { ...ad, priority: newPriority };
      }
      return ad;
    });
    setAds(updatedAds);
    
    toast({
      title: "تم بنجاح",
      description: "تم تحديث أولوية الإعلان",
    });
  };

  const getTypeInfo = (type: string) => {
    return adTypes.find(t => t.value === type) || adTypes[0];
  };

  const renderServicesList = (services: string[], ad?: Advertisement, isEditing: boolean = false) => (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {availableServices.map((service) => (
        <div key={service} className="flex items-center space-x-2">
          <Checkbox
            id={`service-${service}-${ad?.id || 'new'}`}
            checked={services.includes(service)}
            onCheckedChange={() => handleServiceToggle(service, ad || newAd, isEditing)}
          />
          <Label 
            htmlFor={`service-${service}-${ad?.id || 'new'}`}
            className="text-sm cursor-pointer"
          >
            {service}
          </Label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الإعلانات المتقدمة</h2>
        <Dialog open={isAddingAd} onOpenChange={setIsAddingAd}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 ml-2" />
              إضافة إعلان جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl">إضافة إعلان جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium">اسم الإعلان *</Label>
                  <Input
                    value={newAd.title}
                    onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                    placeholder="أدخل اسم الإعلان"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">وصف الإعلان *</Label>
                  <Textarea
                    value={newAd.description}
                    onChange={(e) => setNewAd({...newAd, description: e.target.value})}
                    placeholder="أدخل وصف مفصل للإعلان"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">عدد البالغين</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newAd.adults}
                      onChange={(e) => setNewAd({...newAd, adults: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">عدد الأطفال</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newAd.children}
                      onChange={(e) => setNewAd({...newAd, children: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">الأولوية</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newAd.priority}
                      onChange={(e) => setNewAd({...newAd, priority: parseInt(e.target.value) || 1})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">نوع الإعلان</Label>
                    <Select onValueChange={(value) => setNewAd({...newAd, type: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر نوع الإعلان" />
                      </SelectTrigger>
                      <SelectContent>
                        {adTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">حالة الإعلان</Label>
                    <Select onValueChange={(value: 'active' | 'inactive') => setNewAd({...newAd, status: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">الخدمات المتاحة</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                    {renderServicesList(newAd.services)}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">رسالة الواتساب</Label>
                  <Textarea
                    value={newAd.whatsappMessage}
                    onChange={(e) => setNewAd({...newAd, whatsappMessage: e.target.value})}
                    placeholder="أدخل الرسالة التي ستُرسل عبر الواتساب (اختياري)"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddAd} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ الإعلان
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {ads.sort((a, b) => a.priority - b.priority).map((ad) => (
          <Card key={ad.id} className="border-2 hover:border-emerald-200 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  {editingAd?.id === ad.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">اسم الإعلان</Label>
                        <Input
                          value={editingAd.title}
                          onChange={(e) => setEditingAd({...editingAd, title: e.target.value})}
                          className="mt-1 font-bold text-lg"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">وصف الإعلان</Label>
                        <Textarea
                          value={editingAd.description}
                          onChange={(e) => setEditingAd({...editingAd, description: e.target.value})}
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium">البالغين</Label>
                          <Input
                            type="number"
                            min="0"
                            value={editingAd.adults}
                            onChange={(e) => setEditingAd({...editingAd, adults: parseInt(e.target.value) || 0})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">الأطفال</Label>
                          <Input
                            type="number"
                            min="0"
                            value={editingAd.children}
                            onChange={(e) => setEditingAd({...editingAd, children: parseInt(e.target.value) || 0})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">النوع</Label>
                          <Select
                            value={editingAd.type}
                            onValueChange={(value) => setEditingAd({...editingAd, type: value})}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {adTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">الحالة</Label>
                          <Select
                            value={editingAd.status}
                            onValueChange={(value: 'active' | 'inactive') => setEditingAd({...editingAd, status: value})}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">نشط</SelectItem>
                              <SelectItem value="inactive">غير نشط</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">الخدمات</Label>
                        <div className="mt-2 p-4 border rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                          {renderServicesList(editingAd.services, editingAd, true)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <h3 className="font-bold text-xl text-gray-800">{ad.title}</h3>
                        <Badge className={getTypeInfo(ad.type).color}>
                          {getTypeInfo(ad.type).label}
                        </Badge>
                        <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                          {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          أولوية: {ad.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed">{ad.description}</p>
                      
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{ad.adults} بالغ</span>
                        </div>
                        {ad.children > 0 && (
                          <div className="flex items-center gap-2">
                            <Baby className="w-4 h-4 text-pink-600" />
                            <span className="text-sm font-medium">{ad.children} طفل</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">الخدمات المتاحة:</h4>
                        <div className="flex flex-wrap gap-2">
                          {ad.services.map((service, index) => (
                            <div key={index} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs">
                              <Star className="w-3 h-3" />
                              <span>{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePriorityChange(ad.id, 'up')}
                      disabled={ad.priority === 1}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePriorityChange(ad.id, 'down')}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {editingAd?.id === ad.id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveAd(editingAd)}
                      className="bg-emerald-50 hover:bg-emerald-100"
                    >
                      <CheckCircle className="w-4 h-4" />
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
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
