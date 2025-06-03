
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Percent, 
  Calendar,
  Users,
  Save,
  RefreshCw
} from 'lucide-react';

interface DiscountCode {
  id: string;
  code: string;
  discount_percentage: number;
  expires_at?: string;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

export const DiscountManagement = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: 0,
    expires_at: '',
    max_uses: '',
    is_active: true
  });

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const fetchDiscountCodes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscountCodes(data || []);
    } catch (error) {
      console.error('Error fetching discount codes:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل أكواد الخصم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.code || formData.discount_percentage <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const saveData = {
        code: formData.code.toUpperCase(),
        discount_percentage: formData.discount_percentage,
        expires_at: formData.expires_at || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        is_active: formData.is_active
      };

      if (editingCode) {
        const { error } = await supabase
          .from('discount_codes')
          .update(saveData)
          .eq('id', editingCode.id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث كود الخصم بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('discount_codes')
          .insert(saveData);

        if (error) throw error;
        
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء كود الخصم بنجاح",
        });
      }

      await fetchDiscountCodes();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving discount code:', error);
      toast({
        title: "خطأ",
        description: error.message === 'duplicate key value violates unique constraint "discount_codes_code_key"' 
          ? "كود الخصم موجود بالفعل" 
          : "حدث خطأ أثناء حفظ كود الخصم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف كود الخصم؟')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف كود الخصم بنجاح",
      });
      
      await fetchDiscountCodes();
    } catch (error) {
      console.error('Error deleting discount code:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف كود الخصم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_percentage: 0,
      expires_at: '',
      max_uses: '',
      is_active: true
    });
    setEditingCode(null);
  };

  const openEditDialog = (code: DiscountCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      discount_percentage: code.discount_percentage,
      expires_at: code.expires_at ? code.expires_at.split('T')[0] : '',
      max_uses: code.max_uses?.toString() || '',
      is_active: code.is_active
    });
    setIsDialogOpen(true);
  };

  const formatDateArabic = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (code: DiscountCode) => {
    if (!code.is_active) return 'destructive';
    if (code.expires_at && new Date(code.expires_at) < new Date()) return 'secondary';
    if (code.max_uses && code.current_uses >= code.max_uses) return 'outline';
    return 'default';
  };

  const getStatusText = (code: DiscountCode) => {
    if (!code.is_active) return 'غير فعال';
    if (code.expires_at && new Date(code.expires_at) < new Date()) return 'منتهي الصلاحية';
    if (code.max_uses && code.current_uses >= code.max_uses) return 'مستنفد';
    return 'فعال';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة أكواد الخصم</h2>
        <div className="flex gap-2">
          <Button onClick={fetchDiscountCodes} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                إضافة كود خصم
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingCode ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">كود الخصم *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="أدخل كود الخصم"
                  />
                </div>
                
                <div>
                  <Label htmlFor="discount_percentage">نسبة الخصم (%) *</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                    placeholder="أدخل نسبة الخصم"
                  />
                </div>
                
                <div>
                  <Label htmlFor="expires_at">تاريخ انتهاء الصلاحية</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="max_uses">الحد الأقصى للاستخدام</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="اتركه فارغاً للاستخدام غير المحدود"
                  />
                </div>
                
                <div>
                  <Label htmlFor="is_active">الحالة</Label>
                  <Select value={formData.is_active.toString()} onValueChange={(value) => setFormData({ ...formData, is_active: value === 'true' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">فعال</SelectItem>
                      <SelectItem value="false">غير فعال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleSave} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingCode ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            أكواد الخصم
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && discountCodes.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>جاري تحميل أكواد الخصم...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الكود</TableHead>
                    <TableHead className="text-right">نسبة الخصم</TableHead>
                    <TableHead className="text-right">تاريخ انتهاء الصلاحية</TableHead>
                    <TableHead className="text-right">الاستخدامات</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono font-medium">{code.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          {code.discount_percentage}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {code.expires_at ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDateArabic(code.expires_at)}
                          </div>
                        ) : (
                          <span className="text-gray-500">غير محدد</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {code.current_uses}
                          {code.max_uses && ` / ${code.max_uses}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(code)}>
                          {getStatusText(code)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateArabic(code.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(code)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(code.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};
