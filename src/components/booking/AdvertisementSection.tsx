
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Users, Star, MapPin } from 'lucide-react';

interface AdvertisementSectionProps {
  peopleCount: number;
}

interface Advertisement {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  link: string;
  peopleRange: [number, number];
  features: string[];
}

const advertisements: Advertisement[] = [
  {
    id: 'couple-romantic',
    title: 'باقة رومانسية لشخصين',
    description: 'رحلة شهر عسل مثالية مع إقامة فاخرة وجولات خاصة',
    price: '1,200$',
    image: '/placeholder.svg',
    link: 'https://example.com/couple-package',
    peopleRange: [1, 2],
    features: ['إقامة 5 نجوم', 'عشاء رومانسي', 'جولة خاصة', 'تصوير مجاني']
  },
  {
    id: 'family-fun',
    title: 'باقة العائلة المميزة',
    description: 'مغامرة عائلية شاملة مع أنشطة للكبار والصغار',
    price: '2,400$',
    image: '/placeholder.svg',
    link: 'https://example.com/family-package',
    peopleRange: [3, 5],
    features: ['فنادق عائلية', 'أنشطة للأطفال', 'مواصلات مريحة', 'وجبات متنوعة']
  },
  {
    id: 'group-adventure',
    title: 'باقة المجموعات الكبيرة',
    description: 'رحلة جماعية مثيرة مع خصومات خاصة للمجموعات',
    price: '4,800$',
    image: '/placeholder.svg',
    link: 'https://example.com/group-package',
    peopleRange: [6, 10],
    features: ['خصم المجموعات', 'باص مريح', 'مرشد مختص', 'برنامج متنوع']
  },
  {
    id: 'large-group',
    title: 'باقة الوفود والشركات',
    description: 'برنامج شامل للوفود الكبيرة والشركات مع خدمات VIP',
    price: '8,500$',
    image: '/placeholder.svg',
    link: 'https://example.com/corporate-package',
    peopleRange: [11, 50],
    features: ['خدمات VIP', 'باص فاخر', 'قاعات اجتماعات', 'منسق مختص']
  }
];

export const AdvertisementSection = ({ peopleCount }: AdvertisementSectionProps) => {
  // تصفية الإعلانات بناءً على عدد الأشخاص
  const relevantAds = advertisements.filter(ad => 
    peopleCount >= ad.peopleRange[0] && peopleCount <= ad.peopleRange[1]
  );

  // إذا لم توجد إعلانات مناسبة، أظهر جميع الإعلانات
  const adsToShow = relevantAds.length > 0 ? relevantAds : advertisements;

  if (peopleCount === 0) return null;

  return (
    <div className="mt-12 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">عروض مميزة لك</h3>
        <p className="text-gray-600">
          باقات مصممة خصيصاً لـ {peopleCount} {peopleCount === 1 ? 'شخص' : peopleCount === 2 ? 'شخصين' : 'أشخاص'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adsToShow.map((ad) => (
          <Card key={ad.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img 
                src={ad.image} 
                alt={ad.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded text-sm font-bold">
                {ad.price}
              </div>
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Users className="w-3 h-3" />
                {ad.peopleRange[0]}-{ad.peopleRange[1]}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h4 className="font-bold text-lg mb-2 text-gray-800">{ad.title}</h4>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{ad.description}</p>
              
              <div className="space-y-2 mb-4">
                {ad.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                onClick={() => window.open(ad.link, '_blank')}
              >
                <ExternalLink className="w-4 h-4 ml-2" />
                تفاصيل العرض
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
        <h4 className="font-bold text-blue-800 text-lg mb-2">هل تريد عرض خاص؟</h4>
        <p className="text-blue-700 mb-4">تواصل معنا للحصول على باقة مخصصة تناسب احتياجاتك</p>
        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
          <MapPin className="w-4 h-4 ml-2" />
          طلب عرض مخصص
        </Button>
      </div>
    </div>
  );
};
