
import { useState } from 'react';
import { BookingWizard } from "@/components/BookingWizard";
import { BookingSearch } from "@/components/BookingSearch";
import { AdminAccess } from "@/components/AdminAccess";
import { VideoBackground } from "@/components/VideoBackground";
import { FloatingNotifications } from "@/components/FloatingNotifications";
import { TravelerCounter } from "@/components/TravelerCounter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, PlusCircle, ArrowRight, Settings } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'booking' | 'search' | 'admin'>('home');
  const [notificationsDisabled, setNotificationsDisabled] = useState(false);

  const handleBookingStart = () => {
    setNotificationsDisabled(true);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setNotificationsDisabled(false);
  };

  if (currentView === 'booking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <VideoBackground />
        <FloatingNotifications disabled={notificationsDisabled} />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToHome}
              className="mb-4 text-sm sm:text-base"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              العودة للرئيسية
            </Button>
          </div>
          <BookingWizard onBookingStart={handleBookingStart} />
        </div>
      </div>
    );
  }

  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <VideoBackground />
        <FloatingNotifications disabled={notificationsDisabled} />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToHome}
              className="mb-4 text-sm sm:text-base"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              العودة للرئيسية
            </Button>
          </div>
          <BookingSearch />
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    return <AdminAccess />;
  }

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <FloatingNotifications disabled={notificationsDisabled} />
      
      {/* زر لوحة التحكم في الزاوية - محسن للموبايل */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView('admin')}
          className="bg-white/90 hover:bg-white border-white/50 p-2 sm:px-3 sm:py-2"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
      
      {/* المحتوى الرئيسي - محسن للموبايل */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-2 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl px-2">
              صمم رحلتك بنفسك إلى جورجيا
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 drop-shadow-xl px-4">
              اول موقع متخصص بالسياحة في جورجيا
            </p>
          </div>

          {/* بطاقات الخيارات - محسن للموبايل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto px-2 sm:px-0">
            {/* بطاقة حجز جديد */}
            <Card className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm border-2 border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => setCurrentView('booking')}>
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-600 transition-colors">
                  <PlusCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                    احجز رحلتك الآن
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    ابدأ التخطيط لرحلة أحلامك إلى جورجيا مع باقات مخصصة حسب احتياجاتك وميزانيتك
                  </p>
                </div>
                
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 sm:py-3 text-base sm:text-lg group-hover:bg-emerald-700">
                  ابدأ الحجز
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>

            {/* بطاقة البحث عن حجز */}
            <Card className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm border-2 border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => setCurrentView('search')}>
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                    ابحث عن حجزك
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    راجع تفاصيل حجزك الحالي وتتبع حالة رحلتك باستخدام الرقم المرجعي
                  </p>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 text-base sm:text-lg group-hover:bg-blue-700">
                  ابحث الآن
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>

          {/* عداد المسافرين */}
          <TravelerCounter />
        </div>
      </div>

      {/* نص نهاية الموقع - محسن للموبايل */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 px-2">
        <p className="text-white/70 text-xs sm:text-sm font-medium drop-shadow-lg text-center">
          هذه الأداة خاصة لعالم الفخامة في جورجيا
        </p>
      </div>
    </div>
  );
};

export default Index;
