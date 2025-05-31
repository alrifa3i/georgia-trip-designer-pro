
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Save, Trash2, MapPin } from 'lucide-react';
import { hotelData } from '@/data/hotels';

interface City {
  name: string;
  description: string;
  minTours: number;
}

export const CityManagement = () => {
  const [cities, setCities] = useState<City[]>(
    Object.keys(hotelData).map(city => ({
      name: city,
      description: `مدينة ${city} الجميلة`,
      minTours: city === 'باتومي' ? 2 : 1
    }))
  );
  
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [newCity, setNewCity] = useState<City>({
    name: '',
    description: '',
    minTours: 1
  });

  const handleSaveCity = (city: City) => {
    console.log('حفظ المدينة:', city);
    const updatedCities = cities.map(c => c.name === city.name ? city : c);
    setCities(updatedCities);
    setEditingCity(null);
  };

  const handleAddCity = () => {
    console.log('إضافة مدينة جديدة:', newCity);
    setCities([...cities, newCity]);
    setIsAddingCity(false);
    setNewCity({ name: '', description: '', minTours: 1 });
  };

  const handleDeleteCity = (cityName: string) => {
    console.log('حذف المدينة:', cityName);
    setCities(cities.filter(c => c.name !== cityName));
  };

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
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Input
                  value={newCity.description}
                  onChange={(e) => setNewCity({...newCity, description: e.target.value})}
                />
              </div>
              <div>
                <Label>الحد الأدنى للجولات الإجبارية</Label>
                <Input
                  type="number"
                  value={newCity.minTours}
                  onChange={(e) => setNewCity({...newCity, minTours: Number(e.target.value)})}
                />
              </div>
              <Button onClick={handleAddCity} className="w-full">
                <Save className="w-4 h-4 ml-2" />
                حفظ المدينة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            قائمة المدن
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المدينة</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">الحد الأدنى للجولات</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map((city, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>
                      {editingCity?.name === city.name ? (
                        <Input
                          value={editingCity.description}
                          onChange={(e) => setEditingCity({...editingCity, description: e.target.value})}
                        />
                      ) : (
                        city.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCity?.name === city.name ? (
                        <Input
                          type="number"
                          value={editingCity.minTours}
                          onChange={(e) => setEditingCity({...editingCity, minTours: Number(e.target.value)})}
                          className="w-20"
                        />
                      ) : (
                        `${city.minTours} جولة`
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {editingCity?.name === city.name ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveCity(editingCity)}
                          >
                            <Save className="w-4 h-4" />
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
                          onClick={() => handleDeleteCity(city.name)}
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
    </div>
  );
};
