
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users } from 'lucide-react';

interface AdvertisementSectionProps {
  peopleCount: number;
}

export const AdvertisementSection: React.FC<AdvertisementSectionProps> = ({ peopleCount }) => {
  const getAdsForPeopleCount = () => {
    if (peopleCount <= 2) {
      return [
        {
          title: "عرض شهر العسل الرومانسي",
          description: "باقة خاصة للثنائي تشمل إقامة فاخرة وجولات رومانسية",
          price: "من 800$",
          features: ["إقامة في فنادق 4-5 نجوم", "جولات رومانسية خاصة", "عشاء رومانسي", "نقل خاص"]
        },
        {
          title: "رحلة استكشافية للثنائي",
          description: "اكتشف جمال جورجيا مع شريك حياتك",
          price: "من 650$",
          features: ["إقامة مريحة", "جولات يومية", "مرشد سياحي", "نقل مشترك"]
        }
      ];
    } else if (peopleCount <= 4) {
      return [
        {
          title: "عرض العائلة الصغيرة",
          description: "باقة مثالية للعائلات الصغيرة مع أطفال",
          price: "من 1200$",
          features: ["غرف عائلية", "أنشطة للأطفال", "وجبات متنوعة", "نقل عائلي مريح"]
        },
        {
          title: "مغامرة الأصدقاء",
          description: "رحلة ممتعة لمجموعة الأصدقاء الصغيرة",
          price: "من 950$",
          features: ["إقامة جماعية", "أنشطة ترفيهية", "جولات جماعية", "مرونة في البرنامج"]
        }
      ];
    } else if (peopleCount <= 8) {
      return [
        {
          title: "عرض المجموعات المتوسطة",
          description: "باقة شاملة للمجموعات والعائلات الكبيرة",
          price: "من 2000$",
          features: ["غرف متعددة", "حافلة خاصة", "مرشد مخصص", "برنامج مرن"]
        },
        {
          title: "رحلة العائلة الكبيرة",
          description: "تجربة مميزة للعائلات الممتدة",
          price: "من 1800$",
          features: ["إقامة فاخرة", "أنشطة متنوعة", "وجبات جماعية", "خدمة شخصية"]
        }
      ];
    } else {
      return [
        {
          title: "عرض المجموعات الكبيرة",
          description: "باقة خاصة للمجموعات الكبيرة والرحلات المؤسسية",
          price: "من 3500$",
          features: ["حافلة سياحية كبيرة", "فنادق متعددة", "برنامج مخصص", "خدمات VIP"]
        },
        {
          title: "الرحلة المؤسسية",
          description: "تنظيم مثالي للشركات والمؤسسات",
          price: "من 4000$",
          features: ["تنظيم شامل", "قاعات اجتماعات", "برامج تيم بيلدنغ", "خدمة 24/7"]
        }
      ];
    }
  };

  const handleWhatsAppClick = () => {
    // رقم واتساب الشركة - يمكن تعديله حسب الحاجة
    const phoneNumber = "+995123456789"; // استبدل بالرقم الفعلي
    const message = encodeURIComponent("مرحباً، أرغب في الاستفسار عن العروض السياحية المتاحة");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const ads = getAdsForPeopleCount();

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">عروض مميزة لك</h3>
        <p className="text-gray-600">باقات مصممة خصيصاً لعدد المسافرين ({peopleCount} أشخاص)</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {ads.map((ad, index) => (
          <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{ad.title}</h4>
                <p className="text-gray-600 text-sm">{ad.description}</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                <Users className="w-3 h-3 ml-1" />
                {peopleCount} أشخاص
              </Badge>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-emerald-600">{ad.price}</span>
              <span className="text-gray-500 text-sm mr-1">للشخص</span>
            </div>
            
            <div className="space-y-2 mb-4">
              {ad.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                عرض محدود
              </div>
              <button 
                onClick={handleWhatsAppClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                اطلب الآن
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
