
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAdvertisementManagement } from '@/hooks/useAdvertisementManagement';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image, 
  Users,
  DollarSign,
  Save,
  RefreshCw,
  X
} from 'lucide-react';

export const AdvertisementManagement = () => {
  const {
    advertisements,
    loading,
    error,
    fetchAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
  } = useAdvertisementManagement();

  const [editingAd, setEditingAd] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    people_range: '',
    adults: 2,
    children: 0,
    services: [] as string[],
    type: 'special',
    priority: 1,
    status: 'active',
    image_url: '',
    whatsapp_message: '',
    display_order: 0
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      people_range: '',
      adults: 2,
      children: 0,
      services: [],
      type: 'special',
      priority: 1,
      status: 'active',
      image_url: '',
      whatsapp_message: '',
      display_order: 0
    });
    setEditingAd(null);
    setNewService('');
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء العنوان على الأقل",
        variant: "destructive",
      });
      return;
    }

    const success = editingAd 
      ? await updateAdvertisement(editingAd.id, formData)
      : await createAdvertisement(formData);

    if (success) {
      toast({
        title: editingAd ? "تم التحديث" : "تم الإنشاء",
        description: editingAd ? "تم تحديث الإعلان بنجاح" : "تم إنشاء الإعلان بنجاح",
      });
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    const success = await deleteAdvertisement(id);
    if (success) {
      toast({
        title: "تم الحذف",
        description: "تم حذف الإعلان بنجاح",
      });
    }
  };

  const openEditDialog = (ad: any) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title || '',
      description: ad.description || '',
      price: ad.price || '',
      people_range: ad.people_range || '',
      adults: ad.adults || 2,
      children: ad.children || 0,
      services: ad.services || [],
      type: ad.type || 'special',
      priority: ad.priority || 1,
      status: ad.status || 'active',
      image_url: ad.image_url || '',
      whatsapp_message: ad.whatsapp_message || '',
      display_order: ad.display_order || 0
    });
    setIsDialogOpen(true);
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()]
      });
      setNewService('');
    }
  };

  const removeService = (serviceToRemove: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter(service => service !== serviceToRemove)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الإعلانات</h2>
        <div className="flex gap-2">
          <Button onClick={fetchAdvertisements} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                إضافة إعلان
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingAd ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">العنوان *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="أدخل عنوان الإعلان"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">السعر</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="مثال: من 500$"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="أدخل وصف الإعلان"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="adults">عدد البالغين</Label>
                    <Input
                      id="adults"
                      type="number"
                      min="1"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="children">عدد الأطفال</Label>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="people_range">نطاق الأشخاص</Label>
                    <Input
                      id="people_range"
                      value={formData.people_range}
                      onChange={(e) => setFormData({ ...formData, people_range: e.target.value })}
                      placeholder="مثال: 2-4 أشخاص"
                    />
                  </div>
                </div>

                <div>
                  <Label>الخدمات المشمولة</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        placeholder="أدخل اسم الخدمة"
                        onKeyPress={(e) => e.key === 'Enter' && addService()}
                      />
                      <Button type="button" onClick={addService} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {service}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeService(service)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">نوع الإعلان</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="special">عرض خاص</SelectItem>
                        <SelectItem value="package">باقة سياحية</SelectItem>
                        <SelectItem value="hotel">عرض فندقي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">الأولوية</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="display_order">ترتيب العرض</Label>
                    <Input
                      id="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image_url">رابط الصورة</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp_message">رسالة الواتساب</Label>
                  <Textarea
                    id="whatsapp_message"
                    value={formData.whatsapp_message}
                    onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
                    placeholder="النص الذي سيرسل عبر الواتساب"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingAd ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            الإعلانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && advertisements.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>جاري تحميل الإعلانات...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">عدد الأشخاص</TableHead>
                    <TableHead className="text-right">الخدمات</TableHead>
                    <TableHead className="text-right">الأولوية</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advertisements.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {ad.type === 'special' ? 'عرض خاص' : 
                           ad.type === 'package' ? 'باقة سياحية' : 'عرض فندقي'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {ad.price || 'غير محدد'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ad.adults || 0} بالغ + {ad.children || 0} طفل
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {ad.services?.slice(0, 3).map((service: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {ad.services?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{ad.services.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{ad.priority}</TableCell>
                      <TableCell>
                        <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                          {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ad.created_at && formatDateArabic(ad.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(ad)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(ad.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          )}

          {!loading && advertisements.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              لا توجد إعلانات متوفرة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
