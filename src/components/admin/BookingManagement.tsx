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
import { supabase } from '@/integrations/supabase/client';
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
  RefreshCw,
  Info,
  Plane,
  Receipt
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
  discount_amount?: number;
}

export const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
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

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟ هذا الإجراء لا يمكن التراجع عنه.')) return;

    try {
      // Delete booking files first
      const { error: filesError } = await supabase
        .from('booking_files')
        .delete()
        .eq('booking_id', bookingId);

      if (filesError) {
        console.warn('Warning deleting booking files:', filesError);
      }

      // Delete booking
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الحجز بنجاح",
      });

      loadBookings();
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الحجز",
        variant: "destructive",
      });
    }
  };

  const showBookingDetails = (booking: Booking) => {
    setBookingDetails(booking);
    setShowDetailsDialog(true);
  };

  const showInvoice = (booking: Booking) => {
    const invoiceData = generateInvoiceContent(booking);
    setSelectedBooking(booking);
    setShowInvoiceDialog(true);
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
    return date.toLocaleDateString('ar-IQ', {
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

  const generateInvoiceContent = (booking: Booking) => {
    const selectedCities = parseJsonField(booking.selected_cities, []);
    const roomTypes = parseJsonField(booking.room_types, []);
    const children = parseJsonField(booking.children, []);
    const additionalServices = parseJsonField(booking.additional_services, {});
    
    // Calculate nights for each city based on arrival and departure dates
    const arrivalDate = new Date(booking.arrival_date);
    const departureDate = new Date(booking.departure_date);
    const totalNights = Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 3600 * 24));
    const nightsPerCity = Math.ceil(totalNights / selectedCities.length);

    // Calculate hotel totals for each city
    const hotelTotals = selectedCities.map((city: any, index: number) => {
      const roomType = roomTypes[index];
      const pricePerNight = roomType?.price || city.pricePerNight || 0;
      const nights = city.nights || nightsPerCity;
      return {
        cityName: typeof city === 'string' ? city : city.name,
        hotelName: city.selectedHotel?.name || city.hotel || 'فندق مختار',
        nights,
        pricePerNight,
        total: nights * pricePerNight * booking.rooms
      };
    });

    // Calculate tours total
    const toursTotal = selectedCities.reduce((total: number, city: any) => {
      const tours = city.tours || city.mandatoryTours || 1;
      const tourPrice = city.tourPrice || 50; // Default tour price
      return total + (tours * tourPrice);
    }, 0);

    // Calculate reception and farewell costs
    const receptionCost = 50; // Default reception cost
    const farewellCost = 50; // Default farewell cost

    return {
      booking,
      selectedCities,
      roomTypes,
      children,
      additionalServices,
      totalNights,
      nightsPerCity,
      totalPeople: booking.adults + children.length,
      hotelTotals,
      toursTotal,
      receptionCost,
      farewellCost
    };
  };

  const getBookingDetailsText = (booking: Booking) => {
    const selectedCities = parseJsonField(booking.selected_cities, []);
    const roomTypes = parseJsonField(booking.room_types, []);
    
    const mandatoryToursCount = selectedCities.reduce((total: number, city: any) => {
      const cityName = typeof city === 'string' ? city : city.name;
      // Simplified tour calculation - adjust based on your business logic
      const doubleTourCities = ['اسطنبول', 'طرابزون'];
      return total + (doubleTourCities.includes(cityName) ? 2 : 1);
    }, 0);

    return {
      arrival_airport: booking.arrival_airport || 'غير محدد',
      departure_airport: booking.departure_airport || 'غير محدد',
      arrival_date: formatDateArabic(booking.arrival_date),
      departure_date: formatDateArabic(booking.departure_date),
      tours_count: mandatoryToursCount,
      hotels: selectedCities.map((city: any) => typeof city === 'string' ? city : city.name).join('، '),
      room_types: roomTypes.map((room: any) => room.type || room).join('، ') || 'غير محدد',
      rooms_count: booking.rooms,
      total_cost: `${(booking.total_cost || 0).toLocaleString()} ${booking.currency}`
    };
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
                  <TableHead className="text-right">تفاصيل الحجز</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{booking.customer_name}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showInvoice(booking)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Receipt className="w-4 h-4 mr-1" />
                            فاتورة
                          </Button>
                        </div>
                      </TableCell>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => showBookingDetails(booking)}
                        >
                          <Info className="w-4 h-4 mr-1" />
                          عرض التفاصيل
                        </Button>
                      </TableCell>
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
                        <div className="flex gap-2">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              فاتورة الحجز - {selectedBooking?.reference_number}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {(() => {
                const invoiceData = generateInvoiceContent(selectedBooking);
                return (
                  <div className="space-y-6">
                    {/* Header Information */}
                    <div className="border-b pb-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-bold text-lg">معلومات العميل</h3>
                          <p><strong>الاسم:</strong> {selectedBooking.customer_name}</p>
                          <p><strong>الهاتف:</strong> {selectedBooking.phone_number}</p>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">معلومات الحجز</h3>
                          <p><strong>رقم المرجع:</strong> {selectedBooking.reference_number}</p>
                          <p><strong>تاريخ الحجز:</strong> {formatDateArabic(selectedBooking.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="border-b pb-4">
                      <h3 className="font-bold text-lg mb-3">تفاصيل الرحلة</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p><strong>تاريخ الوصول:</strong> {formatDateArabic(selectedBooking.arrival_date)}</p>
                          <p><strong>مطار الوصول:</strong> {selectedBooking.arrival_airport || 'غير محدد'}</p>
                        </div>
                        <div>
                          <p><strong>تاريخ المغادرة:</strong> {formatDateArabic(selectedBooking.departure_date)}</p>
                          <p><strong>مطار المغادرة:</strong> {selectedBooking.departure_airport || 'غير محدد'}</p>
                        </div>
                        <div>
                          <p><strong>إجمالي الليالي:</strong> {invoiceData.totalNights} ليلة</p>
                          <p><strong>عدد المسافرين:</strong> {invoiceData.totalPeople} شخص</p>
                        </div>
                      </div>
                    </div>

                    {/* Hotels and Rooms with individual totals */}
                    <div className="border-b pb-4">
                      <h3 className="font-bold text-lg mb-3">الفنادق ونوع الغرف</h3>
                      <div className="space-y-4">
                        {invoiceData.hotelTotals.map((hotel: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid md:grid-cols-4 gap-4">
                              <div>
                                <p><strong>المدينة:</strong> {hotel.cityName}</p>
                                <p><strong>الفندق:</strong> {hotel.hotelName}</p>
                              </div>
                              <div>
                                <p><strong>عدد الليالي:</strong> {hotel.nights}</p>
                                <p><strong>عدد الغرف:</strong> {selectedBooking.rooms}</p>
                              </div>
                              <div>
                                <p><strong>السعر لكل ليلة:</strong> {hotel.pricePerNight} {selectedBooking.currency}</p>
                              </div>
                              <div>
                                <p><strong>إجمالي الفندق:</strong></p>
                                <div className="text-lg font-bold text-blue-600">
                                  {hotel.total.toLocaleString()} {selectedBooking.currency}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reception and Farewell */}
                    <div className="border-b pb-4">
                      <h3 className="font-bold text-lg mb-3">خدمات النقل</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p><strong>سعر الاستقبال:</strong></p>
                          <div className="text-lg font-bold text-blue-600">
                            {invoiceData.receptionCost.toLocaleString()} {selectedBooking.currency}
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p><strong>سعر التوديع:</strong></p>
                          <div className="text-lg font-bold text-orange-600">
                            {invoiceData.farewellCost.toLocaleString()} {selectedBooking.currency}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tours Total */}
                    <div className="border-b pb-4">
                      <h3 className="font-bold text-lg mb-3">الجولات</h3>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <p><strong>إجمالي الجولات:</strong></p>
                          <div className="text-xl font-bold text-purple-600">
                            {invoiceData.toursTotal.toLocaleString()} {selectedBooking.currency}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Services (excluding those with 0 price) */}
                    {Object.entries(invoiceData.additionalServices).filter(([key, serviceData]: [string, any]) => serviceData.price && serviceData.price > 0).length > 0 && (
                      <div className="border-b pb-4">
                        <h3 className="font-bold text-lg mb-3">الخدمات الإضافية</h3>
                        <div className="space-y-3">
                          {Object.entries(invoiceData.additionalServices)
                            .filter(([key, serviceData]: [string, any]) => serviceData.price && serviceData.price > 0)
                            .map(([serviceKey, serviceData]: [string, any]) => (
                            <div key={serviceKey} className="bg-green-50 p-3 rounded-lg">
                              <div className="grid md:grid-cols-4 gap-4">
                                <div>
                                  <p><strong>الخدمة:</strong> {serviceData.name || serviceKey}</p>
                                </div>
                                <div>
                                  <p><strong>الكمية:</strong> {serviceData.quantity || 1}</p>
                                </div>
                                <div>
                                  <p><strong>السعر:</strong> {serviceData.price || 0} {selectedBooking.currency}</p>
                                </div>
                                <div>
                                  <p><strong>المجموع:</strong> {(serviceData.price || 0) * (serviceData.quantity || 1)} {selectedBooking.currency}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transport */}
                    {selectedBooking.car_type && (
                      <div className="border-b pb-4">
                        <h3 className="font-bold text-lg mb-3">النقل</h3>
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p><strong>نوع المركبة:</strong> {selectedBooking.car_type}</p>
                          <p><strong>مدة الاستخدام:</strong> {invoiceData.totalNights} يوم</p>
                        </div>
                      </div>
                    )}

                    {/* Total Cost */}
                    <div className="bg-emerald-50 p-6 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-2xl">إجمالي التكلفة</h3>
                        <div className="text-3xl font-bold text-emerald-600">
                          {(selectedBooking.total_cost || 0).toLocaleString()} {selectedBooking.currency}
                        </div>
                      </div>
                      {selectedBooking.discount_amount && selectedBooking.discount_amount > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>تم تطبيق خصم: -{selectedBooking.discount_amount} {selectedBooking.currency}</p>
                        </div>
                      )}
                    </div>

                    {/* Print Button */}
                    <div className="flex justify-center pt-4">
                      <Button 
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        طباعة الفاتورة
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
          </DialogHeader>
          {bookingDetails && (
            <div className="space-y-4">
              {(() => {
                const details = getBookingDetailsText(bookingDetails);
                return (
                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">مطار الوصول:</span>
                        <span>{details.arrival_airport}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-red-600" />
                        <span className="font-medium">مطار المغادرة:</span>
                        <span>{details.departure_airport}</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-medium">تاريخ الوصول:</span>
                        <span>{details.arrival_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">تاريخ المغادرة:</span>
                        <span>{details.departure_date}</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">عدد الجولات:</span>
                        <span>{details.tours_count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-indigo-600" />
                        <span className="font-medium">عدد الغرف:</span>
                        <span>{details.rooms_count}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-2">
                        <Hotel className="w-4 h-4 text-teal-600 mt-1" />
                        <span className="font-medium">الفنادق:</span>
                        <span className="flex-1">{details.hotels}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-pink-600 mt-1" />
                        <span className="font-medium">نوع الغرف:</span>
                        <span className="flex-1">{details.room_types}</span>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-lg">السعر الإجمالي:</span>
                        <span className="font-bold text-xl text-emerald-600">{details.total_cost}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
