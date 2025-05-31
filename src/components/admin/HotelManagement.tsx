
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Save, Trash2, Hotel } from 'lucide-react';
import { hotelData } from '@/data/hotels';

interface Hotel {
  id?: string;
  name: string;
  city: string;
  dbl_v: number;
  dbl_wv: number;
  trbl_v: number;
  trbl_wv: number;
  rating: number;
}

export const HotelManagement = () => {
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [newHotel, setNewHotel] = useState<Hotel>({
    name: '',
    city: '',
    dbl_v: 0,
    dbl_wv: 0,
    trbl_v: 0,
    trbl_wv: 0,
    rating: 5
  });

  const cities = Object.keys(hotelData);

  const handleSaveHotel = (hotel: Hotel) => {
    console.log('حفظ الفندق:', hotel);
    setEditingHotel(null);
    // هنا يتم حفظ البيانات في قاعدة البيانات
  };

  const handleAddHotel = () => {
    console.log('إضافة فندق جديد:', newHotel);
    setIsAddingHotel(false);
    setNewHotel({
      name: '',
      city: '',
      dbl_v: 0,
      dbl_wv: 0,
      trbl_v: 0,
      trbl_wv: 0,
      rating: 5
    });
    // هنا يتم إضافة الفندق في قاعدة البيانات
  };

  const handleDeleteHotel = (hotelName: string, city: string) => {
    console.log('حذف الفندق:', hotelName, 'من', city);
    // هنا يتم حذف الفندق من قاعدة البيانات
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الفنادق</h2>
        <Dialog open={isAddingHotel} onOpenChange={setIsAddingHotel}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة فندق جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة فندق جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>اسم الفندق</Label>
                <Input
                  value={newHotel.name}
                  onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                />
              </div>
              <div>
                <Label>المدينة</Label>
                <Select onValueChange={(value) => setNewHotel({...newHotel, city: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>مزدوجة مع إطلالة</Label>
                  <Input
                    type="number"
                    value={newHotel.dbl_v}
                    onChange={(e) => setNewHotel({...newHotel, dbl_v: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>مزدوجة بدون إطلالة</Label>
                  <Input
                    type="number"
                    value={newHotel.dbl_wv}
                    onChange={(e) => setNewHotel({...newHotel, dbl_wv: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>ثلاثية مع إطلالة</Label>
                  <Input
                    type="number"
                    value={newHotel.trbl_v}
                    onChange={(e) => setNewHotel({...newHotel, trbl_v: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>ثلاثية بدون إطلالة</Label>
                  <Input
                    type="number"
                    value={newHotel.trbl_wv}
                    onChange={(e) => setNewHotel({...newHotel, trbl_wv: Number(e.target.value)})}
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
              <Button onClick={handleAddHotel} className="w-full">
                <Save className="w-4 h-4 ml-2" />
                حفظ الفندق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(hotelData).map(([city, hotels]) => (
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
                    <TableHead className="text-right">مزدوجة مع إطلالة</TableHead>
                    <TableHead className="text-right">مزدوجة بدون إطلالة</TableHead>
                    <TableHead className="text-right">ثلاثية مع إطلالة</TableHead>
                    <TableHead className="text-right">ثلاثية بدون إطلالة</TableHead>
                    <TableHead className="text-right">التقييم</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.map((hotel, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{hotel.name}</TableCell>
                      <TableCell>
                        {editingHotel?.name === hotel.name ? (
                          <Input
                            type="number"
                            value={editingHotel.dbl_v}
                            onChange={(e) => setEditingHotel({...editingHotel, dbl_v: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.dbl_v}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.name === hotel.name ? (
                          <Input
                            type="number"
                            value={editingHotel.dbl_wv}
                            onChange={(e) => setEditingHotel({...editingHotel, dbl_wv: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.dbl_wv}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.name === hotel.name ? (
                          <Input
                            type="number"
                            value={editingHotel.trbl_v}
                            onChange={(e) => setEditingHotel({...editingHotel, trbl_v: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.trbl_v}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingHotel?.name === hotel.name ? (
                          <Input
                            type="number"
                            value={editingHotel.trbl_wv}
                            onChange={(e) => setEditingHotel({...editingHotel, trbl_wv: Number(e.target.value)})}
                            className="w-20"
                          />
                        ) : (
                          `$${hotel.trbl_wv}`
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{hotel.rating} نجوم</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingHotel?.name === hotel.name ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveHotel(editingHotel)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingHotel({...hotel, city})}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteHotel(hotel.name, city)}
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
