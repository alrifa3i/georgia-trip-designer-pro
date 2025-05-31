
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';

interface BookingNotification {
  id: string;
  name: string;
  package: string;
  price: string;
  currency: string;
  country: string;
}

const gulfNames = [
  // السعودية
  { name: "أحمد بن محمد العتيبي", country: "السعودية", currency: "ريال سعودي" },
  { name: "فهد بن عبدالله الغامدي", country: "السعودية", currency: "ريال سعودي" },
  { name: "خالد بن سعد الحربي", country: "السعودية", currency: "ريال سعودي" },
  { name: "محمد بن علي القحطاني", country: "السعودية", currency: "ريال سعودي" },
  { name: "عبدالرحمن بن فهد الشهري", country: "السعودية", currency: "ريال سعودي" },
  
  // الإمارات
  { name: "سعيد بن أحمد المزروعي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "راشد بن محمد الزعابي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "عبدالله بن خالد النعيمي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "محمد بن سالم الكعبي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "أحمد بن علي البلوشي", country: "الإمارات", currency: "درهم إماراتي" },
  
  // الكويت
  { name: "فيصل أحمد الصباح", country: "الكويت", currency: "دينار كويتي" },
  { name: "بدر محمد العتيبي", country: "الكويت", currency: "دينار كويتي" },
  { name: "سالم عبدالله المطيري", country: "الكويت", currency: "دينار كويتي" },
  { name: "ناصر خالد الرشيد", country: "الكويت", currency: "دينار كويتي" },
  
  // قطر
  { name: "حمد بن ثاني آل ثاني", country: "قطر", currency: "ريال قطري" },
  { name: "محمد بن عبدالله المري", country: "قطر", currency: "ريال قطري" },
  { name: "سعد بن أحمد الكواري", country: "قطر", currency: "ريال قطري" },
  { name: "علي بن حمد النعيمي", country: "قطر", currency: "ريال قطري" },
  
  // البحرين
  { name: "أحمد بن محمد آل خليفة", country: "البحرين", currency: "دينار بحريني" },
  { name: "خالد بن سلمان الزياني", country: "البحرين", currency: "دينار بحريني" },
  { name: "محمد بن علي البوعينين", country: "البحرين", currency: "دينار بحريني" },
  
  // عمان
  { name: "سالم بن أحمد البوسعيدي", country: "عمان", currency: "ريال عماني" },
  { name: "محمد بن خالد الحراصي", country: "عمان", currency: "ريال عماني" },
  { name: "عبدالله بن سعيد المعمري", country: "عمان", currency: "ريال عماني" }
];

const packages = [
  "باكج مخصص",
  "باكج العائلة",
  "باكج شهر العسل",
  "باكج المغامرات",
  "باكج الفخامة"
];

const getPriceByCountry = (country: string): string => {
  switch (country) {
    case "السعودية": return Math.floor(Math.random() * 2000 + 3000).toString();
    case "الإمارات": return Math.floor(Math.random() * 1000 + 4000).toString();
    case "الكويت": return Math.floor(Math.random() * 100 + 150).toString();
    case "قطر": return Math.floor(Math.random() * 500 + 2000).toString();
    case "البحرين": return Math.floor(Math.random() * 50 + 200).toString();
    case "عمان": return Math.floor(Math.random() * 100 + 220).toString();
    default: return "580";
  }
};

export const FloatingNotifications = () => {
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [usedNames, setUsedNames] = useState<Set<string>>(new Set());

  const createNotification = (): BookingNotification => {
    // فلترة الأسماء غير المستخدمة
    const availableNames = gulfNames.filter(nameObj => !usedNames.has(nameObj.name));
    
    // إذا تم استخدام كل الأسماء، نعيد تعيين القائمة
    if (availableNames.length === 0) {
      setUsedNames(new Set());
      const nameObj = gulfNames[Math.floor(Math.random() * gulfNames.length)];
      const newUsedNames = new Set([nameObj.name]);
      setUsedNames(newUsedNames);
      
      return {
        id: Date.now().toString(),
        name: nameObj.name,
        package: packages[Math.floor(Math.random() * packages.length)],
        price: getPriceByCountry(nameObj.country),
        currency: nameObj.currency,
        country: nameObj.country
      };
    }

    const nameObj = availableNames[Math.floor(Math.random() * availableNames.length)];
    setUsedNames(prev => new Set([...prev, nameObj.name]));

    return {
      id: Date.now().toString(),
      name: nameObj.name,
      package: packages[Math.floor(Math.random() * packages.length)],
      price: getPriceByCountry(nameObj.country),
      currency: nameObj.currency,
      country: nameObj.country
    };
  };

  useEffect(() => {
    const showNotification = () => {
      const notification = createNotification();
      setNotifications(prev => [...prev, notification]);

      // إزالة الإشعار بعد 5 ثواني
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    // عرض أول إشعار بعد 3 ثواني
    const initialTimeout = setTimeout(showNotification, 3000);

    // عرض إشعار جديد كل 8-15 ثانية
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 7000 + 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="p-4 bg-white/95 backdrop-blur-sm border border-green-200 shadow-lg animate-slide-in-right"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  حجز جديد تم بنجاح! 🎉
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  <strong>{notification.name}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  {notification.package} • {notification.price} {notification.currency}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};
