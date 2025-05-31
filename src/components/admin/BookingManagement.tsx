
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Users, 
  Phone, 
  MapPin, 
  DollarSign, 
  Eye, 
  Download,
  FileText,
  Upload
} from 'lucide-react';

interface Booking {
  id: string;
  referenceNumber: string;
  customerName: string;
  phoneNumber: string;
  adults: number;
  children: number;
  arrivalDate: string;
  departureDate: string;
  selectedCities: string[];
  totalCost: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  passportFiles?: string[];
  ticketFiles?: string[];
  createdAt: string;
}

export const BookingManagement = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      referenceNumber: 'GT-2024-001',
      customerName: 'أحمد محمد علي',
      phoneNumber: '+966501234567',
      adults: 2,
      children: 1,
      arrivalDate: '2024-06-15',
      departureDate: '2024-06-22',
      selectedCities: ['تبليسي', 'باتومي'],
      totalCost: 2450,
      currency: 'USD',
      status: 'confirmed',
      passportFiles: ['passport1.pdf', 'passport2.pdf'],
      ticketFiles: ['ticket.pdf'],
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      referenceNumber: 'GT-2024-002',
      customerName: 'فاطمة السعيد',
      phoneNumber: '+966509876543',
      adults: 4,
      children: 2,
      arrivalDate: '2024-07-01',
      departureDate: '2024-07-10',
      selectedCities: ['تبليسي', 'كوتايسي', 'باكورياني'],
      totalCost: 4200,
      currency: 'USD',
      status: 'pending',
      createdAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '3',
      referenceNumber: 'GT-2024-003',
      customerName: 'محمد عبدالله',
      phoneNumber: '+966555123456',
      adults: 1,
      children: 0,
      arrivalDate: '2024-06-28',
      departureDate: '2024-07-05',
      selectedCities: ['تبليسي', 'برجومي'],
      totalCost: 1800,
      currency: 'USD',
      status: 'completed',
      passportFiles: ['passport3.pdf'],
      ticketFiles: ['ticket2.pdf'],
      createdAt: '2024-01-17T09:15:00Z'
    }
  ]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'في الانتظار';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const handleFileUpload = (bookingId: string, fileType: 'passport' | 'ticket') => {
    console.log(`رفع ملف ${fileType} للحجز ${bookingId}`);
    // هنا يتم رفع الملف
  };

  const handleDownloadFile = (fileName: string) => {
    console.log(`تحميل الملف: ${fileName}`);
    // هنا يتم تحميل الملف
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الحجوزات</h2>
        <div className="flex gap-2">
          <Badge variant="outline">إجمالي الحجوزات: {bookings.length}</Badge>
          <Badge variant="default">مؤكدة: {bookings.filter(b => b.status === 'confirmed').length}</Badge>
          <Badge variant="secondary">في الانتظار: {bookings.filter(b => b.status === 'pending').length}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            قائمة الحجوزات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم المرجع</TableHead>
                  <TableHead className="text-right">اسم العميل</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">عدد المسافرين</TableHead>
                  <TableHead className="text-right">تاريخ الوصول</TableHead>
                  <TableHead className="text-right">تاريخ المغادرة</TableHead>
                  <TableHead className="text-right">التكلفة الإجمالية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.referenceNumber}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {booking.adults + booking.children}
                        <span className="text-sm text-gray-500">
                          ({booking.adults} كبار، {booking.children} أطفال)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(booking.arrivalDate).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{new Date(booking.departureDate).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {booking.totalCost.toLocaleString()} {booking.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الحجز - {booking.referenceNumber}</DialogTitle>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-6">
                              {/* معلومات العميل */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">معلومات العميل</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm font-medium">الاسم:</span>
                                      <p className="text-lg">{selectedBooking.customerName}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">رقم الهاتف:</span>
                                      <p className="text-lg flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {selectedBooking.phoneNumber}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* تفاصيل الرحلة */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">تفاصيل الرحلة</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm font-medium">تاريخ الوصول:</span>
                                      <p className="text-lg">{new Date(selectedBooking.arrivalDate).toLocaleDateString('ar-SA')}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">تاريخ المغادرة:</span>
                                      <p className="text-lg">{new Date(selectedBooking.departureDate).toLocaleDateString('ar-SA')}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">عدد البالغين:</span>
                                      <p className="text-lg">{selectedBooking.adults}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">عدد الأطفال:</span>
                                      <p className="text-lg">{selectedBooking.children}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                      <span className="text-sm font-medium">المدن المختارة:</span>
                                      <div className="flex gap-2 mt-1">
                                        {selectedBooking.selectedCities.map((city, index) => (
                                          <Badge key={index} variant="outline">
                                            <MapPin className="w-3 h-3 ml-1" />
                                            {city}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* الملفات المرفقة */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">الملفات المرفقة</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">ملفات جوازات السفر:</h4>
                                      <div className="flex gap-2 mb-2">
                                        {selectedBooking.passportFiles?.map((file, index) => (
                                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                            <FileText className="w-4 h-4" />
                                            <span className="text-sm">{file}</span>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleDownloadFile(file)}
                                            >
                                              <Download className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFileUpload(selectedBooking.id, 'passport')}
                                      >
                                        <Upload className="w-4 h-4 ml-2" />
                                        رفع جواز سفر
                                      </Button>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-2">ملفات التذاكر:</h4>
                                      <div className="flex gap-2 mb-2">
                                        {selectedBooking.ticketFiles?.map((file, index) => (
                                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                            <FileText className="w-4 h-4" />
                                            <span className="text-sm">{file}</span>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleDownloadFile(file)}
                                            >
                                              <Download className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFileUpload(selectedBooking.id, 'ticket')}
                                      >
                                        <Upload className="w-4 h-4 ml-2" />
                                        رفع تذكرة
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* ملخص التكلفة */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">ملخص التكلفة</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold text-emerald-600">
                                    {selectedBooking.totalCost.toLocaleString()} {selectedBooking.currency}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    تاريخ الحجز: {new Date(selectedBooking.createdAt).toLocaleDateString('ar-SA')}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
