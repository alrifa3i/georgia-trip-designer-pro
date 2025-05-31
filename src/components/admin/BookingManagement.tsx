
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Users, 
  Phone, 
  MapPin, 
  DollarSign, 
  Eye, 
  Download,
  FileText,
  Upload,
  Hotel,
  Save
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
  budget?: number;
  rooms?: number;
  selectedHotels?: Array<{
    city: string;
    hotelName: string;
    roomType: string;
    nights: number;
    roomCount: number;
    totalPrice: number;
  }>;
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
      createdAt: '2024-01-15T10:30:00Z',
      budget: 2500,
      rooms: 2,
      selectedHotels: [
        {
          city: 'تبليسي',
          hotelName: 'Marjan plaza hotel',
          roomType: 'مزدوجة مع إطلالة',
          nights: 3,
          roomCount: 2,
          totalPrice: 540
        },
        {
          city: 'باتومي',
          hotelName: 'New Wave Hotel',
          roomType: 'ثلاثية مع إطلالة',
          nights: 4,
          roomCount: 1,
          totalPrice: 540
        }
      ]
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
      createdAt: '2024-01-16T14:20:00Z',
      budget: 4500,
      rooms: 3,
      selectedHotels: [
        {
          city: 'تبليسي',
          hotelName: 'Gallery Palace',
          roomType: 'مزدوجة بدون إطلالة',
          nights: 3,
          roomCount: 2,
          totalPrice: 270
        },
        {
          city: 'كوتايسي',
          hotelName: 'kutaisi inn hotel*5',
          roomType: 'ثلاثية مع إطلالة',
          nights: 2,
          roomCount: 1,
          totalPrice: 260
        },
        {
          city: 'باكورياني',
          hotelName: 'Bakuriani inn 5*',
          roomType: 'مزدوجة مع إطلالة',
          nights: 4,
          roomCount: 1,
          totalPrice: 340
        }
      ]
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
      createdAt: '2024-01-17T09:15:00Z',
      budget: 2000,
      rooms: 1,
      selectedHotels: [
        {
          city: 'تبليسي',
          hotelName: 'EPISODE',
          roomType: 'مزدوجة مع إطلالة',
          nights: 4,
          roomCount: 1,
          totalPrice: 260
        },
        {
          city: 'برجومي',
          hotelName: 'Borjomi Likani 5*',
          roomType: 'مزدوجة مع إطلالة',
          nights: 3,
          roomCount: 1,
          totalPrice: 540
        }
      ]
    }
  ]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

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

  const formatDateArabicIraqi = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    console.log(`تحديث حالة الحجز ${bookingId} إلى ${newStatus}`);
    setEditingStatus(null);
    // هنا يتم تحديث الحالة في قاعدة البيانات
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
                  <TableHead className="text-right">الميزانية</TableHead>
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
                    <TableCell>{formatDateArabicIraqi(booking.arrivalDate)}</TableCell>
                    <TableCell>{formatDateArabicIraqi(booking.departureDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {booking.budget?.toLocaleString()} {booking.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {booking.totalCost.toLocaleString()} {booking.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingStatus === booking.id ? (
                        <div className="flex gap-2">
                          <Select defaultValue={booking.status} onValueChange={(value) => handleStatusUpdate(booking.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">في الانتظار</SelectItem>
                              <SelectItem value="confirmed">مؤكد</SelectItem>
                              <SelectItem value="completed">مكتمل</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStatus(null)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge
                          variant={getStatusColor(booking.status)}
                          className="cursor-pointer"
                          onClick={() => setEditingStatus(booking.id)}
                        >
                          {getStatusText(booking.status)}
                        </Badge>
                      )}
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
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
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
                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                      <span className="text-sm font-medium">تاريخ الوصول:</span>
                                      <p className="text-lg">{formatDateArabicIraqi(selectedBooking.arrivalDate)}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">تاريخ المغادرة:</span>
                                      <p className="text-lg">{formatDateArabicIraqi(selectedBooking.departureDate)}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">عدد الغرف:</span>
                                      <p className="text-lg">{selectedBooking.rooms}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">عدد البالغين:</span>
                                      <p className="text-lg">{selectedBooking.adults}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">عدد الأطفال:</span>
                                      <p className="text-lg">{selectedBooking.children}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">الميزانية:</span>
                                      <p className="text-lg flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        {selectedBooking.budget?.toLocaleString()} {selectedBooking.currency}
                                      </p>
                                    </div>
                                    <div className="md:col-span-3">
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

                              {/* الفنادق المختارة */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Hotel className="w-5 h-5" />
                                    الفنادق المختارة ونوع الغرف
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="overflow-x-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-right">المدينة</TableHead>
                                          <TableHead className="text-right">اسم الفندق</TableHead>
                                          <TableHead className="text-right">نوع الغرفة</TableHead>
                                          <TableHead className="text-right">عدد الليالي</TableHead>
                                          <TableHead className="text-right">عدد الغرف</TableHead>
                                          <TableHead className="text-right">السعر الإجمالي</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedBooking.selectedHotels?.map((hotel, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{hotel.city}</TableCell>
                                            <TableCell className="font-medium">{hotel.hotelName}</TableCell>
                                            <TableCell>{hotel.roomType}</TableCell>
                                            <TableCell>{hotel.nights}</TableCell>
                                            <TableCell>{hotel.roomCount}</TableCell>
                                            <TableCell>
                                              <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {hotel.totalPrice.toLocaleString()} {selectedBooking.currency}
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
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
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm font-medium">الميزانية المحددة:</span>
                                      <div className="text-xl font-bold text-blue-600">
                                        {selectedBooking.budget?.toLocaleString()} {selectedBooking.currency}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">التكلفة الإجمالية:</span>
                                      <div className="text-xl font-bold text-emerald-600">
                                        {selectedBooking.totalCost.toLocaleString()} {selectedBooking.currency}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-4">
                                    تاريخ الحجز: {formatDateArabicIraqi(selectedBooking.createdAt)}
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
