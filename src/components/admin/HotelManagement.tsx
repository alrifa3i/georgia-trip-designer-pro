
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Save, Trash2, Hotel, Upload, Download, FileText } from 'lucide-react';
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

export const HotelManagement = () => {
  const { data: hotelsData, refetch } = useAllHotelsData();
  const { toast } = useToast();
  const [editingHotel, setEditingHotel] = useState<HotelEdit | null>(null);
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleImportHotels = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const hotelsToImport = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(val => val.replace(/"/g, '').trim());
        if (values.length >= 9) {
          hotelsToImport.push({
            name: values[0],
            city: values[1],
            single_price: parseFloat(values[2]) || 0,
            single_view_price: parseFloat(values[3]) || 0,
            double_without_view_price: parseFloat(values[4]) || 0,
            double_view_price: parseFloat(values[5]) || 0,
            triple_without_view_price: parseFloat(values[6]) || 0,
            triple_view_price: parseFloat(values[7]) || 0,
            rating: parseInt(values[8]) || 5,
            is_active: true
          });
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
      event.target.value = '';
    }
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
              onChange={handleImportHotels}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            تعليمات الاستيراد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            يجب أن يكون ملف CSV بالترتيب التالي: اسم الفندق، المدينة، فردية، فردية مع إطلالة، مزدوجة بدون إطلالة، مزدوجة مع إطلالة، ثلاثية بدون إطلالة، ثلاثية مع إطلالة، التقييم
          </p>
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
