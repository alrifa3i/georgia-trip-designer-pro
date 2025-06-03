
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useBookingManagement } from '@/hooks/useBookingManagement';
import { 
  Search, 
  Calendar, 
  Users, 
  DollarSign, 
  Phone, 
  Plane,
  Hotel,
  MapPin,
  Clock,
  FileText,
  Download,
  RefreshCw,
  Trash2,
  Eye
} from 'lucide-react';

export const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { 
    loading, 
    error, 
    searchBookingByReference, 
    getAllBookings, 
    updateBookingStatus,
    deleteBooking
  } = useBookingManagement();
  const { toast } = useToast();

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    const result = await getAllBookings();
    setBookings(result);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchAllBookings();
      return;
    }

    const result = await searchBookingByReference(searchTerm);
    if (result) {
      setBookings([result]);
    } else {
      setBookings([]);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const success = await updateBookingStatus(bookingId, newStatus);
    if (success) {
      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة الحجز بنجاح",
      });
      fetchAllBookings();
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;
    
    const success = await deleteBooking(bookingId);
    if (success) {
      toast({
        title: "تم الحذف",
        description: "تم حذف الحجز بنجاح",
      });
      fetchAllBookings();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      'pending': 'outline',
      'confirmed': 'default',
      'cancelled': 'destructive',
      'completed': 'secondary'
    };
    return statusColors[status] || 'outline';
  };

  const getStatusText = (status: string) => {
    const statusTexts: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'confirmed': 'مؤكد',
      'cancelled': 'ملغي',
      'completed': 'مكتمل'
    };
    return statusTexts[status] || status;
  };

  const calculateTotalTours = (selectedCities: any[]) => {
    if (!selectedCities || !Array.isArray(selectedCities)) return 0;
    
    return selectedCities.reduce((total, city) => {
      const mandatoryTours = city.mandatoryTours || 0;
      const optionalTours = city.optionalTours || 0;
      return total + mandatoryTours + optionalTours;
    }, 0);
  };

  const getTourDetails = (selectedCities: any[]) => {
    if (!selectedCities || !Array.isArray(selectedCities)) return [];
    
    return selectedCities.map(city => ({
      cityName: city.name || 'غير محدد',
      mandatory: city.mandatoryTours || 0,
      optional: city.optionalTours || 0
    }));
  };

  const getHotelDetails = (selectedCities: any[]) => {
    if (!selectedCities || !Array.isArray(selectedCities)) return [];
    
    const hotels: any[] = [];
    selectedCities.forEach(city => {
      if (city.selectedHotels && Array.isArray(city.selectedHotels)) {
        city.selectedHotels.forEach((hotel: any) => {
          hotels.push({
            name: hotel.name || 'فندق غير محدد',
            city: city.name || 'مدينة غير محددة',
            nights: hotel.nights || city.nights || 0,
            roomType: hotel.roomType || 'غير محدد',
            rooms: hotel.rooms || 1
          });
        });
      } else if (city.selectedHotelId) {
        hotels.push({
          name: 'فندق محدد',
          city: city.name || 'مدينة غير محددة',
          nights: city.nights || 0,
          roomType: 'غير محدد',
          rooms: 1
        });
      }
    });
    return hotels;
  };

  const openDetailsDialog = (booking: any) => {
    console.log('Opening details for booking:', booking);
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الحجوزات</h2>
        <Button onClick={fetchAllBookings} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>البحث في الحجوزات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="ادخل الرقم المرجعي للحجز"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              بحث
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            قائمة الحجوزات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && bookings.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>جاري تحميل الحجوزات...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الرقم المرجعي</TableHead>
                    <TableHead className="text-right">اسم العميل</TableHead>
                    <TableHead className="text-right">رقم الهاتف</TableHead>
                    <TableHead className="text-right">تواريخ السفر</TableHead>
                    <TableHead className="text-right">عدد المسافرين</TableHead>
                    <TableHead className="text-right">تفاصيل الحجز</TableHead>
                    <TableHead className="text-right">التكلفة الإجمالية</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono">{booking.reference_number}</TableCell>
                      <TableCell>{booking.customer_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {booking.phone_number || 'غير متوفر'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Plane className="w-3 h-3" />
                            {formatDate(booking.arrival_date)}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Plane className="w-3 h-3 rotate-180" />
                            {formatDate(booking.departure_date)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {booking.adults} بالغ
                          {booking.children && Array.isArray(booking.children) && booking.children.length > 0 && 
                            ` + ${booking.children.length} طفل`
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailsDialog(booking)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          عرض التفاصيل
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {booking.total_cost?.toFixed(2) || '0.00'} {booking.currency || 'USD'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select value={booking.status} onValueChange={(value) => handleStatusUpdate(booking.id, value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">في الانتظار</SelectItem>
                              <SelectItem value="confirmed">مؤكد</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                              <SelectItem value="completed">مكتمل</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBooking(booking.id)}
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
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          )}

          {!loading && bookings.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              لا توجد حجوزات متوفرة
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog لعرض تفاصيل الحجز */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز - {selectedBooking?.reference_number}</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* معلومات أساسية */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>اسم العميل:</strong> {selectedBooking.customer_name}
                    </div>
                    <div>
                      <strong>رقم الهاتف:</strong> {selectedBooking.phone_number || 'غير متوفر'}
                    </div>
                    <div>
                      <strong>مطار الوصول:</strong> {selectedBooking.arrival_airport || 'غير محدد'}
                    </div>
                    <div>
                      <strong>مطار المغادرة:</strong> {selectedBooking.departure_airport || 'غير محدد'}
                    </div>
                    <div>
                      <strong>تاريخ الوصول:</strong> {formatDate(selectedBooking.arrival_date)}
                    </div>
                    <div>
                      <strong>تاريخ المغادرة:</strong> {formatDate(selectedBooking.departure_date)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* تفاصيل الجولات */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">تفاصيل الجولات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong>إجمالي عدد الجولات:</strong> {calculateTotalTours(selectedBooking.selected_cities)}
                    </div>
                    <div className="space-y-2">
                      {getTourDetails(selectedBooking.selected_cities).map((tour, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="font-medium">{tour.cityName}</div>
                          <div className="text-sm text-gray-600">
                            جولات إجبارية: {tour.mandatory} | جولات اختيارية: {tour.optional}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* تفاصيل الفنادق */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">تفاصيل الفنادق</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getHotelDetails(selectedBooking.selected_cities).map((hotel, index) => (
                      <div key={index} className="border rounded p-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div><strong>اسم الفندق:</strong> {hotel.name}</div>
                          <div><strong>المدينة:</strong> {hotel.city}</div>
                          <div><strong>عدد الليالي:</strong> {hotel.nights}</div>
                          <div><strong>نوع الغرفة:</strong> {hotel.roomType}</div>
                          <div><strong>عدد الغرف:</strong> {hotel.rooms}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* التكلفة الإجمالية */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">التكلفة الإجمالية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-600">
                      {selectedBooking.total_cost?.toFixed(2) || '0.00'} {selectedBooking.currency || 'USD'}
                    </div>
                    {selectedBooking.discount_amount && selectedBooking.discount_amount > 0 && (
                      <div className="text-sm text-gray-600">
                        خصم مطبق: {selectedBooking.discount_amount} {selectedBooking.currency || 'USD'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
