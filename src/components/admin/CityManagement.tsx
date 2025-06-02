
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Save, Trash2, MapPin, Loader } from 'lucide-react';
import { useCitiesData } from '@/hooks/useCitiesData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface City {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
}

export const CityManagement = () => {
  const { data: cities, isLoading, error } = useCitiesData();
  const queryClient = useQueryClient();
  
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [newCity, setNewCity] = useState({
    name: '',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCity = async (city: City) => {
    setIsSaving(true);
    try {
      console.log('حفظ المدينة:', city);
      
      const { error } = await supabase
        .from('cities')
        .update({
          name: city.name,
          description: city.description,
        })
        .eq('id', city.id);

      if (error) {
        console.error('خطأ في تحديث المدينة:', error);
        alert('حدث خطأ في تحديث المدينة');
        return;
      }

      console.log('تم تحديث المدينة بنجاح');
      setEditingCity(null);
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    } catch (error) {
      console.error('خطأ غير متوقع:', error);
      alert('حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCity = async () => {
    if (!newCity.name.trim()) {
      alert('يرجى إدخال اسم المدينة');
      return;
    }

    setIsSaving(true);
    try {
      console.log('إضافة مدينة جديدة:', newCity);
      
      const { error } = await supabase
        .from('cities')
        .insert({
          name: newCity.name,
          description: newCity.description,
          is_active: true
        });

      if (error) {
        console.error('خطأ في إضافة المدينة:', error);
        alert('حدث خطأ في إضافة المدينة');
        return;
      }

      console.log('تم إضافة المدينة بنجاح');
      setIsAddingCity(false);
      setNewCity({ name: '', description: '' });
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    } catch (error) {
      console.error('خطأ غير متوقع:', error);
      alert('حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCity = async (cityId: string, cityName: string) => {
    if (!confirm(`هل أنت متأكد من حذف مدينة ${cityName}؟`)) {
      return;
    }

    setIsSaving(true);
    try {
      console.log('حذف المدينة:', cityName);
      
      const { error } = await supabase
        .from('cities')
        .update({ is_active: false })
        .eq('id', cityId);

      if (error) {
        console.error('خطأ في حذف المدينة:', error);
        alert('حدث خطأ في حذف المدينة');
        return;
      }

      console.log('تم حذف المدينة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    } catch (error) {
      console.error('خطأ غير متوقع:', error);
      alert('حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل بيانات المدن...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          حدث خطأ في تحميل بيانات المدن: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة المدن</h2>
        <Dialog open={isAddingCity} onOpenChange={setIsAddingCity}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة مدينة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مدينة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>اسم المدينة</Label>
                <Input
                  value={newCity.name}
                  onChange={(e) => setNewCity({...newCity, name: e.target.value})}
                  placeholder="أدخل اسم المدينة"
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Input
                  value={newCity.description}
                  onChange={(e) => setNewCity({...newCity, description: e.target.value})}
                  placeholder="أدخل وصف المدينة"
                />
              </div>
              <Button 
                onClick={handleAddCity} 
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ المدينة
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            قائمة المدن ({cities?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المدينة</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities?.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>
                      {editingCity?.id === city.id ? (
                        <Input
                          value={editingCity.description || ''}
                          onChange={(e) => setEditingCity({...editingCity, description: e.target.value})}
                        />
                      ) : (
                        city.description || 'لا يوجد وصف'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        city.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {city.is_active ? 'نشطة' : 'غير نشطة'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {editingCity?.id === city.id ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveCity(editingCity)}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCity(city)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCity(city.id, city.name)}
                          disabled={isSaving}
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
          
          {cities?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد مدن متاحة حالياً
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
