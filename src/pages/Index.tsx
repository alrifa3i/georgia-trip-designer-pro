
import { useState } from 'react';
import { BookingWizard } from "@/components/BookingWizard";
import { BookingSearch } from "@/components/BookingSearch";
import { VideoBackground } from "@/components/VideoBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, PlusCircle, ArrowRight } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'booking' | 'search'>('home');

  if (currentView === 'booking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
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
        <div className="container mx-auto px-4 py-8">
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

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      
      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              مرحباً بك في جورجيا ✨
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-xl">
              اكتشف جمال القوقاز مع برامج سياحية مخصصة لك
            </p>
          </div>

          {/* بطاقات الخيارات */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* بطاقة حجز جديد */}
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
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
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
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

          {/* معلومات إضافية */}
          <div className="text-center mt-12">
            <p className="text-white/80 text-lg">
              🌟 أكثر من 1000 مسافر سعيد اختار جورجيا معنا
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
