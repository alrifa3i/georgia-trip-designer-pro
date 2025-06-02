import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Save, Trash2, Hotel, Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { useAllHotelsData } from '@/hooks/useHotelsData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HotelEdit {
  id?: string;
  name: string;
  city: string;
  single_price: number;
  single_view_price: number;
  double_without_view_price: number;
  double_view_price: number;
  triple_without_view_price: number;
  triple_view_price: number;
  rating: number;
}

interface ImportPreview {
  headers: string[];
  rows: string[][];
  mapping: Record<string, string>;
}

export const HotelManagement = () => {
  const { data: hotelsData, refetch } = useAllHotelsData();
  const { toast } = useToast();
  const [editingHotel, setEditingHotel] = useState<HotelEdit | null>(null);
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newHotel, setNewHotel] = useState<HotelEdit>({
    name: '',
    city: '',
    single_price: 0,
    single_view_price: 0,
    double_without_view_price: 0,
    double_view_price: 0,
    triple_without_view_price: 0,
    triple_view_price: 0,
    rating: 5
  });

  const cities = hotelsData ? Object.keys(hotelsData) : [];

  // Field mappings for different CSV formats
  const fieldMappings = {
    name: ['اسم الفندق', 'name', 'hotel_name', 'فندق'],
    city: ['المدينة', 'city', 'المدينه'],
    single_price: ['فردية', 'single', 'single_price', 'فرديه'],
    single_view_price: ['فردية مع إطلالة', 'single_view', 'single_view_price', 'فردية بطلالة'],
    double_without_view_price: ['مزدوجة بدون إطلالة', 'double_without_view', 'double_wv', 'مزدوجه بدون اطلاله'],
    double_view_price: ['مزدوجة مع إطلالة', 'double_view', 'double_v', 'مزدوجه مع اطلاله'],
    triple_without_view_price: ['ثلاثية بدون إطلالة', 'triple_without_view', 'triple_wv', 'ثلاثيه بدون اطلاله'],
    triple_view_price: ['ثلاثية مع إطلالة', 'triple_view', 'triple_v', 'ثلاثيه مع اطلاله'],
    rating: ['التقييم', 'rating', 'تقييم', 'نجوم']
  };

  const findColumnMapping = (headers: string[]): Record<string, string> => {
    const mapping: Record<string, string> = {};
    
    Object.entries(fieldMappings).forEach(([field, possibleNames]) => {
      const foundHeader = headers.find(header => 
        possibleNames.some(name => 
          header.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(header.toLowerCase())
        )
      );
      if (foundHeader) {
        mapping[field] = foundHeader;
      }
    });
    
    return mapping;
  };

  const handleSaveHotel = async (hotel: HotelEdit) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('hotels')
        .update({
          name: hotel.name,
          city: hotel.city,
          single_price: hotel.single_price,
          single_view_price: hotel.single_view_price,
          double_without_view_price: hotel.double_without_view_price,
          double_view_price: hotel.double_view_price,
          triple_without_view_price: hotel.triple_without_view_price,
          triple_view_price: hotel.triple_view_price,
          rating: hotel.rating
        })
        .eq('id', hotel.id);

      if (error) throw error;

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات الفندق بنجاح"
      });
      
      setEditingHotel(null);
      refetch();
    } catch (error) {
      console.error('خطأ في تحديث الفندق:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث بيانات الفندق",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('hotels')
        .insert([{
          name: newHotel.name,
          city: newHotel.city,
          single_price: newHotel.single_price,
          single_view_price: newHotel.single_view_price,
          double_without_view_price: newHotel.double_without_view_price,
          double_view_price: newHotel.double_view_price,
          triple_without_view_price: newHotel.triple_without_view_price,
          triple_view_price: newHotel.triple_view_price,
          rating: newHotel.rating,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة الفندق الجديد بنجاح"
      });

      setIsAddingHotel(false);
      setNewHotel({
        name: '',
        city: '',
        single_price: 0,
        single_view_price: 0,
        double_without_view_price: 0,
        double_view_price: 0,
        triple_without_view_price: 0,
        triple_view_price: 0,
        rating: 5
      });
      refetch();
    } catch (error) {
      console.error('خطأ في إضافة الفندق:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة الفندق الجديد",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', hotelId);

      if (error) throw error;

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الفندق بنجاح"
      });
      
      refetch();
    } catch (error) {
      console.error('خطأ في حذف الفندق:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الفندق",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportHotels = () => {
    if (!hotelsData) return;

    const allHotels = Object.entries(hotelsData).flatMap(([city, hotels]) =>
      hotels.map(hotel => ({
        name: hotel.name,
        city: hotel.city,
        single_price: hotel.single_price,
        single_view_price: hotel.single_view_price,
        double_without_view_price: hotel.double_without_view_price,
        double_view_price: hotel.double_view_price,
        triple_without_view_price: hotel.triple_without_view_price,
        triple_view_price: hotel.triple_view_price,
        rating: hotel.rating
      }))
    );

    const csvContent = [
      'اسم الفندق,المدينة,فردية,فردية مع إطلالة,مزدوجة بدون إطلالة,مزدوجة مع إطلالة,ثلاثية بدون إطلالة,ثلاثية مع إطلالة,التقييم',
      ...allHotels.map(hotel => 
        `"${hotel.name}","${hotel.city}",${hotel.single_price},${hotel.single_view_price},${hotel.double_without_view_price},${hotel.double_view_price},${hotel.triple_without_view_price},${hotel.triple_view_price},${hotel.rating}`
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hotels_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير بيانات الفنادق بنجاح"
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "خطأ في الملف",
          description: "الملف فارغ أو لا يحتوي على بيانات كافية",
          variant: "destructive"
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const rows = lines.slice(1).map(line => 
        line.split(',').map(val => val.replace(/"/g, '').trim())
      );

      const mapping = findColumnMapping(headers);
      
      setImportPreview({ headers, rows, mapping });
      setShowImportDialog(true);
    } catch (error) {
      console.error('خطأ في قراءة الملف:', error);
      toast({
        title: "خطأ في قراءة الملف",
        description: "تأكد من أن الملف بتنسيق CSV صحيح",
        variant: "destructive"
      });
    } finally {
      event.target.value = '';
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;

    try {
      setLoading(true);
      const hotelsToImport = [];

      for (const row of importPreview.rows) {
        if (row.length === 0 || !row.some(cell => cell.trim())) continue;

        const hotel: any = {
          is_active: true
        };

        // Map the data based on column mapping
        Object.entries(importPreview.mapping).forEach(([field, headerName]) => {
          const columnIndex = importPreview.headers.indexOf(headerName);
          if (columnIndex !== -1 && row[columnIndex]) {
            const value = row[columnIndex].trim();
            
            if (['single_price', 'single_view_price', 'double_without_view_price', 
                 'double_view_price', 'triple_without_view_price', 'triple_view_price'].includes(field)) {
              hotel[field] = parseFloat(value) || 0;
            } else if (field === 'rating') {
              hotel[field] = parseInt(value) || 5;
            } else {
              hotel[field] = value;
            }
          }
        });

        // Ensure required fields are present
        if (hotel.name && hotel.city) {
          hotelsToImport.push(hotel);
        }
      }

      if (hotelsToImport.length > 0) {
        const { error } = await supabase
          .from('hotels')
          .insert(hotelsToImport);

        if (error) throw error;

        toast({
          title: "تم الاستيراد بنجاح",
          description: `تم استيراد ${hotelsToImport.length} فندق بنجاح`
        });
        
        refetch();
        setShowImportDialog(false);
        setImportPreview(null);
      } else {
        toast({
          title: "لا توجد بيانات صالحة",
          description: "لم يتم العثور على بيانات فنادق صالحة في الملف",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('خطأ في استيراد الفنادق:', error);
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد الفنادق",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMapping = (field: string, header: string) => {
    if (!importPreview) return;
    
    setImportPreview({
      ...importPreview,
      mapping: {
        ...importPreview.mapping,
        [field]: header
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الفنادق</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportHotels}
            disabled={loading}
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={loading}
            />
            <Button variant="outline" disabled={loading}>
              <Upload className="w-4 h-4 ml-2" />
              استيراد CSV
            </Button>
          </div>
          <Dialog open={isAddingHotel} onOpenChange={setIsAddingHotel}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 ml-2" />
                إضافة فندق جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>إضافة فندق جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>اسم الفندق</Label>
                    <Input
                      value={newHotel.name}
                      onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>المدينة</Label>
                    <Input
                      value={newHotel.city}
                      onChange={(e) => setNewHotel({...newHotel, city: e.target.value})}
                      placeholder="أدخل اسم المدينة"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>فردية</Label>
                    <Input
                      type="number"
                      value={newHotel.single_price}
                      onChange={(e) => setNewHotel({...newHotel, single_price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>فردية مع إطلالة</Label>
                    <Input
                      type="number"
                      value={newHotel.single_view_price}
                      onChange={(e) => setNewHotel({...newHotel, single_view_price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>مزدوجة بدون إطلالة</Label>
                    <Input
                      type="number"
                      value={newHotel.double_without_view_price}
                      onChange={(e) => setNewHotel({...newHotel, double_without_view_price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>مزدوجة مع إطلالة</Label>
                    <Input
                      type="number"
                      value={newHotel.double_view_price}
                      onChange={(e) => setNewHotel({...newHotel, double_view_price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ثلاثية بدون إطلالة</Label>
                    <Input
                      type="number"
                      value={newHotel.triple_without_view_price}
                      onChange={(e) => setNewHotel({...newHotel, triple_without_view_price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>ثلاثية مع إطلالة</Label>
                    <Input
                      type="number"
                      value={newHotel.triple_view_price}
                      onChange={(e) => setNewHotel({...newHotel, triple_view_price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label>التقييم</Label>
                  <Select onValueChange={(value) => setNewHotel({...newHotel, rating: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التقييم" />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>{rating} نجوم</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAddHotel} 
                  className="w-full"
                  disabled={loading || !newHotel.name || !newHotel.city}
                >
                  <Save className="w-4 h-4 ml-2" />
                  {loading ? 'جاري الحفظ...' : 'حفظ الفندق'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Import Preview Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>معاينة الاستيراد وتخصيص الأعمدة</DialogTitle>
          </DialogHeader>
          
          {importPreview && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">تخصيص الأعمدة</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  يرجى تحديد الأعمدة المقابلة لكل حقل. الحقول المطلوبة: اسم الفندق والمدينة
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(fieldMappings).map(field => (
                    <div key={field}>
                      <Label className="text-sm font-medium">
                        {field === 'name' ? 'اسم الفندق*' :
                         field === 'city' ? 'المدينة*' :
                         field === 'single_price' ? 'فردية' :
                         field === 'single_view_price' ? 'فردية مع إطلالة' :
                         field === 'double_without_view_price' ? 'مزدوجة بدون إطلالة' :
                         field === 'double_view_price' ? 'مزدوجة مع إطلالة' :
                         field === 'triple_without_view_price' ? 'ثلاثية بدون إطلالة' :
                         field === 'triple_view_price' ? 'ثلاثية مع إطلالة' :
                         'التقييم'}
                      </Label>
                      <Select
                        value={importPreview.mapping[field] || ''}
                        onValueChange={(value) => updateMapping(field, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العمود" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">لا يوجد</SelectItem>
                          {importPreview.headers.map(header => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">معاينة البيانات (أول 5 صفوف)</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {importPreview.headers.map(header => (
                          <TableHead key={header} className="text-right">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importPreview.rows.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {importPreview.rows.length > 5 && (
                  <p className="text-sm text-gray-500 mt-2">
                    وسيتم استيراد {importPreview.rows.length - 5} صف إضافي...
                  </p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportPreview(null);
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleConfirmImport}
                  disabled={loading || !importPreview.mapping.name || !importPreview.mapping.city}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'جاري الاستيراد...' : `استيراد ${importPreview.rows.length} فندق`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            تعليمات الاستيراد والتصدير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>للتصدير:</strong> سيتم تصدير جميع الفنادق بتنسيق CSV مع الأعمدة القياسية</p>
            <p><strong>للاستيراد:</strong> يمكن استيراد ملفات CSV بأي ترتيب للأعمدة. سيتم عرض معاينة لتخصيص الأعمدة قبل الاستيراد</p>
            <p><strong>الحقول المطلوبة:</strong> اسم الفندق والمدينة فقط</p>
            <p><strong>الحقول الاختيارية:</strong> جميع أسعار الغرف والتقييم</p>
          </div>
        </CardContent>
      </Card>

      {hotelsData && Object.entries(hotelsData).map(([city, hotels]) => (
        <Card key={city}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              فنادق {city}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الفندق</TableHead>
                    <TableHead className="text-right">فردية</TableHead>
                    <TableHead className="text-right">فردية مع إطلالة</TableHead>
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
                      <TableCell>
                        {editingHotel?.id === hotel.id ? (
                          <Input
                            type="number"
                            value={editingHotel.single_price}
                            onChange={(e) => setEditingHotel({...editingHotel, single_price: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.single_price}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.id === hotel.id ? (
                          <Input
                            type="number"
                            value={editingHotel.single_view_price}
                            onChange={(e) => setEditingHotel({...editingHotel, single_view_price: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.single_view_price}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.id === hotel.id ? (
                          <Input
                            type="number"
                            value={editingHotel.double_without_view_price}
                            onChange={(e) => setEditingHotel({...editingHotel, double_without_view_price: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.double_without_view_price}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.id === hotel.id ? (
                          <Input
                            type="number"
                            value={editingHotel.double_view_price}
                            onChange={(e) => setEditingHotel({...editingHotel, double_view_price: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.double_view_price}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.id === hotel.id ? (
                          <Input
                            type="number"
                            value={editingHotel.triple_without_view_price}
                            onChange={(e) => setEditingHotel({...editingHotel, triple_without_view_price: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.triple_without_view_price}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.id === hotel.id ? (
                          <Input
                            type="number"
                            value={editingHotel.triple_view_price}
                            onChange={(e) => setEditingHotel({...editingHotel, triple_view_price: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.triple_view_price}`
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{hotel.rating} نجوم</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingHotel?.id === hotel.id ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveHotel(editingHotel)}
                              disabled={loading}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingHotel({
                                id: hotel.id,
                                name: hotel.name,
                                city: hotel.city,
                                single_price: hotel.single_price,
                                single_view_price: hotel.single_view_price,
                                double_without_view_price: hotel.double_without_view_price,
                                double_view_price: hotel.double_view_price,
                                triple_without_view_price: hotel.triple_without_view_price,
                                triple_view_price: hotel.triple_view_price,
                                rating: hotel.rating
                              })}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteHotel(hotel.id)}
                            disabled={loading}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
