
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useBookingManagement } from '@/hooks/useBookingManagement';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Phone,
  MapPin,
  DollarSign,
  Users,
  Hotel,
  Car,
  FileText,
  Download,
  Upload
} from 'lucide-react';

export const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();
  
  const {
    loading,
    error,
    searchBookingByReference,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    uploadFile,
    deleteFile
  } = useBookingManagement();

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    const data = await getAllBookings();
    setBookings(data);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const booking = await searchBookingByReference(searchTerm);
      if (booking) {
        setBookings([booking]);
      } else {
        setBookings([]);
      }
    } else {
      loadAllBookings();
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const success = await updateBookingStatus(bookingId, newStatus);
    if (success) {
      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة الحجز بنجاح"
      });
      loadAllBookings();
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      const success = await deleteBooking(bookingId);
      if (success) {
        toast({
          title: "تم حذف الحجز",
          description: "تم حذف الحجز بنجاح"
        });
        loadAllBookings();
        setShowDetailsDialog(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'في الانتظار';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const parseJsonSafely = (jsonString: any, fallback: any = []) => {
    if (typeof jsonString === 'object') return jsonString;
    if (typeof jsonString === 'string') {
      try {
        return JSON.parse(jsonString);
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  const renderBookingDetails = (booking: any) => {
    const children = parseJsonSafely(booking.children, []);
    const selectedCities = parseJsonSafely(booking.selected_cities, []);
    const additionalServices = parseJsonSafely(booking.additional_services, {});

    return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* معلومات أساسية */}
        <div>
          <h3 className="text-lg font-semibold mb-3">معلومات أساسية</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>{booking.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{booking.phone_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>من {formatDate(booking.arrival_date)} إلى {formatDate(booking.departure_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{booking.adults} بالغ</span>
              {children.length > 0 && <span>+ {children.length} أطفال</span>}
            </div>
          </div>
        </div>

        <Separator />

        {/* المدن المختارة */}
        {selectedCities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">المدن المختارة</h3>
            <div className="space-y-2">
              {selectedCities.map((city: any, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{city.name}</span>
                  <Badge variant="outline">{city.nights} ليلة</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* النقل */}
        {booking.car_type && (
          <div>
            <h3 className="text-lg font-semibold mb-3">النقل</h3>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span>{booking.car_type}</span>
            </div>
          </div>
        )}

        <Separator />

        {/* التكلفة */}
        <div>
          <h3 className="text-lg font-semibold mb-3">التكلفة</h3>
          <div className="space-y-2">
            {booking.discount_amount > 0 && (
              <>
                <div className="flex justify-between">
                  <span>المجموع الأساسي:</span>
                  <span>{(booking.total_cost + booking.discount_amount).toFixed(2)} {booking.currency}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>خصم ({booking.discount_coupon}):</span>
                  <span>-{booking.discount_amount.toFixed(2)} {booking.currency}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-lg font-bold text-emerald-600">
              <span>المجموع النهائي:</span>
              <span>{booking.total_cost?.toFixed(2)} {booking.currency}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* الملفات المرفقة */}
        {booking.booking_files && booking.booking_files.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">الملفات المرفقة</h3>
            <div className="space-y-2">
              {booking.booking_files.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{file.file_name}</span>
                    <Badge variant="outline">{file.file_type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* إدارة الحالة */}
        <div>
          <h3 className="text-lg font-semibold mb-3">إدارة الحجز</h3>
          <div className="flex gap-4">
            <Select
              value={booking.status}
              onValueChange={(value) => handleStatusUpdate(booking.id, value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="destructive"
              onClick={() => handleDeleteBooking(booking.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              حذف الحجز
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الحجوزات</CardTitle>
        </CardHeader>
        <CardContent>
          {/* البحث */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="ابحث برقم الحجز المرجعي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              بحث
            </Button>
            <Button variant="outline" onClick={loadAllBookings} disabled={loading}>
              عرض الكل
            </Button>
          </div>

          {/* قائمة الحجوزات */}
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد حجوزات</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">{booking.reference_number}</div>
                        <div className="text-sm text-gray-600">{booking.customer_name}</div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {formatDate(booking.arrival_date)} - {formatDate(booking.departure_date)}
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        {booking.total_cost?.toFixed(2)} {booking.currency}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog 
                        open={showDetailsDialog && selectedBooking?.id === booking.id}
                        onOpenChange={(open) => {
                          setShowDetailsDialog(open);
                          if (open) setSelectedBooking(booking);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            تفاصيل
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الحجز - {booking.reference_number}</DialogTitle>
                          </DialogHeader>
                          {selectedBooking && renderBookingDetails(selectedBooking)}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
