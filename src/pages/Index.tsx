
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

  if (currentView === 'booking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <VideoBackground />
        <FloatingNotifications />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('home')}
              className="mb-4"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              العودة للرئيسية
            </Button>
          </div>
          <BookingWizard />
        </div>
      </div>
    );
  }

  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <VideoBackground />
        <FloatingNotifications />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('home')}
              className="mb-4"
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
      <FloatingNotifications />
      
      {/* زر لوحة التحكم في الزاوية */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView('admin')}
          className="bg-white/90 hover:bg-white border-white/50"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
      
      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              مرحباً بك في جورجيا
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-xl">
              اكتشف جمال القوقاز مع برامج سياحية مخصصة لك
            </p>
          </div>

          {/* بطاقات الخيارات */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* بطاقة حجز جديد */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => setCurrentView('booking')}>
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-600 transition-colors">
                  <PlusCircle className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    احجز رحلتك الآن
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    ابدأ التخطيط لرحلة أحلامك إلى جورجيا مع باقات مخصصة حسب احتياجاتك وميزانيتك
                  </p>
                </div>
                
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg group-hover:bg-emerald-700">
                  ابدأ الحجز
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>

            {/* بطاقة البحث عن حجز */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => setCurrentView('search')}>
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                  <Search className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    ابحث عن حجزك
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    راجع تفاصيل حجزك الحالي وتتبع حالة رحلتك باستخدام الرقم المرجعي
                  </p>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg group-hover:bg-blue-700">
                  ابحث الآن
                  <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>

          {/* عداد المسافرين */}
          <TravelerCounter />
        </div>
      </div>

      {/* نص نهاية الموقع */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <p className="text-white/70 text-sm font-medium drop-shadow-lg">
          هذه الأداة خاصة لعالم الفخامة في جورجيا
        </p>
      </div>
    </div>
  );
};

export default Index;
