
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useBookingManagement } from '@/hooks/useBookingManagement';
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
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface BookingFile {
  id: string;
  booking_id: string;
  file_name: string;
  file_type: 'passport' | 'ticket';
  file_url: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
}

interface Booking {
  id: string;
  reference_number: string;
  customer_name: string;
  phone_number: string;
  adults: number;
  children: any;
  arrival_date: string;
  departure_date: string;
  arrival_airport?: string;
  departure_airport?: string;
  rooms: number;
  budget?: number;
  currency: string;
  car_type?: string;
  room_types?: any;
  selected_cities?: any;
  total_cost?: number;
  additional_services?: any;
  status: string;
  created_at: string;
  updated_at?: string;
  booking_files?: BookingFile[];
}

export const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  
  const {
    loading,
    error,
    getAllBookings,
    updateBookingStatus,
    uploadFile,
    deleteFile
  } = useBookingManagement();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getAllBookings();
    setBookings(data);
  };

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

  const formatDateArabic = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const success = await updateBookingStatus(bookingId, newStatus);
    if (success) {
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث حالة الحجز بنجاح",
      });
      setEditingStatus(null);
      loadBookings();
    } else {
      toast({
        title: "خطأ",
        description: error || "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (bookingId: string, fileType: 'passport' | 'ticket', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "يرجى رفع ملف PDF أو صورة (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    // التحقق من حجم الملف (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير",
        description: "يرجى رفع ملف أصغر من 5 ميجابايت",
        variant: "destructive",
      });
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [`${bookingId}-${fileType}`]: true }));

    const fileUrl = await uploadFile(bookingId, file, fileType);
    
    if (fileUrl) {
      toast({
        title: "تم رفع الملف بنجاح",
        description: `تم رفع ${fileType === 'passport' ? 'جواز السفر' : 'التذكرة'} بنجاح`,
      });
      loadBookings();
      // تحديث البيانات المعروضة
      if (selectedBooking?.id === bookingId) {
        const updatedBookings = await getAllBookings();
        const updatedBooking = updatedBookings.find(b => b.id === bookingId);
        if (updatedBooking) {
          setSelectedBooking(updatedBooking);
        }
      }
    } else {
      toast({
        title: "خطأ في رفع الملف",
        description: error || "حدث خطأ أثناء رفع الملف",
        variant: "destructive",
      });
    }

    setUploadingFiles(prev => ({ ...prev, [`${bookingId}-${fileType}`]: false }));
    
    // إعادة تعيين قيمة input
    event.target.value = '';
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteFile = async (fileId: string, fileName: string, bookingId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;

    const success = await deleteFile(fileId, fileName);
    
    if (success) {
      toast({
        title: "تم حذف الملف",
        description: "تم حذف الملف بنجاح",
      });
      loadBookings();
      // تحديث البيانات المعروضة
      if (selectedBooking?.id === bookingId) {
        const updatedBookings = await getAllBookings();
        const updatedBooking = updatedBookings.find(b => b.id === bookingId);
        if (updatedBooking) {
          setSelectedBooking(updatedBooking);
        }
      }
    } else {
      toast({
        title: "خطأ في حذف الملف",
        description: error || "حدث خطأ أثناء حذف الملف",
        variant: "destructive",
      });
    }
  };

  const parseJsonField = (field: any, defaultValue: any = []) => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>جاري تحميل الحجوزات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الحجوزات</h2>
        <div className="flex gap-2">
          <Button onClick={loadBookings} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
          <Badge variant="outline">إجمالي الحجوزات: {bookings.length}</Badge>
          <Badge variant="default">مؤكدة: {bookings.filter(b => b.status === 'confirmed').length}</Badge>
          <Badge variant="secondary">في الانتظار: {bookings.filter(b => b.status === 'pending').length}</Badge>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

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
                  <TableHead className="text-right">التكلفة الإجمالية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  const children = parseJsonField(booking.children, []);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.reference_number}</TableCell>
                      <TableCell>{booking.customer_name}</TableCell>
                      <TableCell>{booking.phone_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {booking.adults + children.length}
                          <span className="text-sm text-gray-500">
                            ({booking.adults} كبار، {children.length} أطفال)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDateArabic(booking.arrival_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {(booking.total_cost || 0).toLocaleString()} {booking.currency}
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
                              إلغاء
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
                              <DialogTitle>تفاصيل الحجز - {booking.reference_number}</DialogTitle>
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
                                        <p className="text-lg">{selectedBooking.customer_name}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">رقم الهاتف:</span>
                                        <p className="text-lg flex items-center gap-1">
                                          <Phone className="w-4 h-4" />
                                          {selectedBooking.phone_number}
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
                                        <p className="text-lg">{formatDateArabic(selectedBooking.arrival_date)}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">تاريخ المغادرة:</span>
                                        <p className="text-lg">{formatDateArabic(selectedBooking.departure_date)}</p>
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
                                        <p className="text-lg">{parseJsonField(selectedBooking.children, []).length}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">الميزانية:</span>
                                        <p className="text-lg flex items-center gap-1">
                                          <DollarSign className="w-4 h-4" />
                                          {(selectedBooking.budget || 0).toLocaleString()} {selectedBooking.currency}
                                        </p>
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
                                      {/* ملفات جوازات السفر */}
                                      <div>
                                        <h4 className="font-medium mb-2">ملفات جوازات السفر:</h4>
                                        <div className="flex gap-2 mb-2 flex-wrap">
                                          {selectedBooking.booking_files?.filter(f => f.file_type === 'passport').map((file) => (
                                            <div key={file.id} className="flex items-center gap-2 p-2 border rounded">
                                              <FileText className="w-4 h-4" />
                                              <span className="text-sm">{file.file_name}</span>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadFile(file.file_url, file.file_name)}
                                              >
                                                <Download className="w-3 h-3" />
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteFile(file.id, file.file_name, selectedBooking.id)}
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="file"
                                            id={`passport-${selectedBooking.id}`}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileUpload(selectedBooking.id, 'passport', e)}
                                          />
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById(`passport-${selectedBooking.id}`)?.click()}
                                            disabled={uploadingFiles[`${selectedBooking.id}-passport`]}
                                          >
                                            {uploadingFiles[`${selectedBooking.id}-passport`] ? (
                                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                              <Upload className="w-4 h-4 mr-2" />
                                            )}
                                            رفع جواز سفر
                                          </Button>
                                        </div>
                                      </div>

                                      {/* ملفات التذاكر */}
                                      <div>
                                        <h4 className="font-medium mb-2">ملفات التذاكر:</h4>
                                        <div className="flex gap-2 mb-2 flex-wrap">
                                          {selectedBooking.booking_files?.filter(f => f.file_type === 'ticket').map((file) => (
                                            <div key={file.id} className="flex items-center gap-2 p-2 border rounded">
                                              <FileText className="w-4 h-4" />
                                              <span className="text-sm">{file.file_name}</span>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadFile(file.file_url, file.file_name)}
                                              >
                                                <Download className="w-3 h-3" />
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteFile(file.id, file.file_name, selectedBooking.id)}
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="file"
                                            id={`ticket-${selectedBooking.id}`}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileUpload(selectedBooking.id, 'ticket', e)}
                                          />
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById(`ticket-${selectedBooking.id}`)?.click()}
                                            disabled={uploadingFiles[`${selectedBooking.id}-ticket`]}
                                          >
                                            {uploadingFiles[`${selectedBooking.id}-ticket`] ? (
                                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                              <Upload className="w-4 h-4 mr-2" />
                                            )}
                                            رفع تذكرة
                                          </Button>
                                        </div>
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
                                          {(selectedBooking.budget || 0).toLocaleString()} {selectedBooking.currency}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">التكلفة الإجمالية:</span>
                                        <div className="text-xl font-bold text-emerald-600">
                                          {(selectedBooking.total_cost || 0).toLocaleString()} {selectedBooking.currency}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-4">
                                      تاريخ الحجز: {formatDateArabic(selectedBooking.created_at)}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
