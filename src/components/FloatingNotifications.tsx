
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';

interface BookingNotification {
  id: string;
  name: string;
  price: string;
  currency: string;
  country: string;
}

const gulfNames = [
  // السعودية - رجال
  { name: "أحمد بن محمد العتيبي", country: "السعودية", currency: "ريال سعودي" },
  { name: "فهد بن عبدالله الغامدي", country: "السعودية", currency: "ريال سعودي" },
  { name: "خالد بن سعد الحربي", country: "السعودية", currency: "ريال سعودي" },
  { name: "محمد بن علي القحطاني", country: "السعودية", currency: "ريال سعودي" },
  { name: "عبدالرحمن بن فهد الشهري", country: "السعودية", currency: "ريال سعودي" },
  
  // السعودية - نساء
  { name: "نورا بنت أحمد العتيبي", country: "السعودية", currency: "ريال سعودي" },
  { name: "سارة بنت محمد الغامدي", country: "السعودية", currency: "ريال سعودي" },
  { name: "فاطمة بنت عبدالله الحربي", country: "السعودية", currency: "ريال سعودي" },
  { name: "مريم بنت سعد القحطاني", country: "السعودية", currency: "ريال سعودي" },
  { name: "هيفاء بنت خالد الشهري", country: "السعودية", currency: "ريال سعودي" },
  
  // الإمارات - رجال
  { name: "سعيد بن أحمد المزروعي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "راشد بن محمد الزعابي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "عبدالله بن خالد النعيمي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "محمد بن سالم الكعبي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "أحمد بن علي البلوشي", country: "الإمارات", currency: "درهم إماراتي" },
  
  // الإمارات - نساء
  { name: "عائشة بنت سعيد المزروعي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "شما بنت راشد الزعابي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "مريم بنت عبدالله النعيمي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "فاطمة بنت محمد الكعبي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "نورا بنت أحمد البلوشي", country: "الإمارات", currency: "درهم إماراتي" },
  
  // الكويت - رجال
  { name: "فيصل أحمد الصباح", country: "الكويت", currency: "دينار كويتي" },
  { name: "بدر محمد العتيبي", country: "الكويت", currency: "دينار كويتي" },
  { name: "سالم عبدالله المطيري", country: "الكويت", currency: "دينار كويتي" },
  { name: "ناصر خالد الرشيد", country: "الكويت", currency: "دينار كويتي" },
  
  // الكويت - نساء
  { name: "بشاير فيصل الصباح", country: "الكويت", currency: "دينار كويتي" },
  { name: "دانة بدر العتيبي", country: "الكويت", currency: "دينار كويتي" },
  { name: "هيا سالم المطيري", country: "الكويت", currency: "دينار كويتي" },
  { name: "سارة ناصر الرشيد", country: "الكويت", currency: "دينار كويتي" },
  
  // قطر - رجال
  { name: "حمد بن ثاني آل ثاني", country: "قطر", currency: "ريال قطري" },
  { name: "محمد بن عبدالله المري", country: "قطر", currency: "ريال قطري" },
  { name: "سعد بن أحمد الكواري", country: "قطر", currency: "ريال قطري" },
  { name: "علي بن حمد النعيمي", country: "قطر", currency: "ريال قطري" },
  
  // قطر - نساء
  { name: "شيخة بنت حمد آل ثاني", country: "قطر", currency: "ريال قطري" },
  { name: "مريم بنت محمد المري", country: "قطر", currency: "ريال قطري" },
  { name: "نورا بنت سعد الكواري", country: "قطر", currency: "ريال قطري" },
  { name: "عائشة بنت علي النعيمي", country: "قطر", currency: "ريال قطري" },
  
  // البحرين - رجال
  { name: "أحمد بن محمد آل خليفة", country: "البحرين", currency: "دينار بحريني" },
  { name: "خالد بن سلمان الزياني", country: "البحرين", currency: "دينار بحريني" },
  { name: "محمد بن علي البوعينين", country: "البحرين", currency: "دينار بحريني" },
  
  // البحرين - نساء
  { name: "هيفاء بنت أحمد آل خليفة", country: "البحرين", currency: "دينار بحريني" },
  { name: "لولوة بنت خالد الزياني", country: "البحرين", currency: "دينار بحريني" },
  { name: "مريم بنت محمد البوعينين", country: "البحرين", currency: "دينار بحريني" },
  
  // عمان - رجال
  { name: "سالم بن أحمد البوسعيدي", country: "عمان", currency: "ريال عماني" },
  { name: "محمد بن خالد الحراصي", country: "عمان", currency: "ريال عماني" },
  { name: "عبدالله بن سعيد المعمري", country: "عمان", currency: "ريال عماني" },
  
  // عمان - نساء
  { name: "زينب بنت سالم البوسعيدي", country: "عمان", currency: "ريال عماني" },
  { name: "أسماء بنت محمد الحراصي", country: "عمان", currency: "ريال عماني" },
  { name: "فاطمة بنت عبدالله المعمري", country: "عمان", currency: "ريال عماني" }
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

// نظام العداد العالمي
let globalTravelerCount = 994;

export const incrementTravelerCount = () => {
  globalTravelerCount++;
  // حفظ العداد في localStorage للاستمرارية
  localStorage.setItem('travelerCount', globalTravelerCount.toString());
  
  // إرسال حدث مخصص لتحديث العداد في المكونات الأخرى
  window.dispatchEvent(new CustomEvent('travelerCountUpdated', { 
    detail: { count: globalTravelerCount } 
  }));
  
  return globalTravelerCount;
};

export const getTravelerCount = () => {
  // استرجاع العداد من localStorage إذا كان موجوداً
  const saved = localStorage.getItem('travelerCount');
  if (saved) {
    globalTravelerCount = parseInt(saved, 10);
  }
  return globalTravelerCount;
};

interface FloatingNotificationsProps {
  onNotificationShow?: () => void;
}

export const FloatingNotifications: React.FC<FloatingNotificationsProps> = ({ onNotificationShow }) => {
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [usedNames, setUsedNames] = useState<Set<string>>(new Set());

  const createNotification = (): BookingNotification => {
    // استخدام أسماء الأفراد فقط
    const availableNames = gulfNames.filter(nameObj => !usedNames.has(nameObj.name));
    
    if (availableNames.length === 0) {
      setUsedNames(new Set());
      const nameObj = gulfNames[Math.floor(Math.random() * gulfNames.length)];
      const newUsedNames = new Set([nameObj.name]);
      setUsedNames(newUsedNames);
      
      return {
        id: Date.now().toString() + Math.random().toString(),
        name: nameObj.name,
        price: getPriceByCountry(nameObj.country),
        currency: nameObj.currency,
        country: nameObj.country
      };
    }

    const nameObj = availableNames[Math.floor(Math.random() * availableNames.length)];
    setUsedNames(prev => new Set([...prev, nameObj.name]));

    return {
      id: Date.now().toString() + Math.random().toString(),
      name: nameObj.name,
      price: getPriceByCountry(nameObj.country),
      currency: nameObj.currency,
      country: nameObj.country
    };
  };

  useEffect(() => {
    // عرض أول إشعار بعد ثانيتين
    const initialTimeout = setTimeout(() => {
      const notification = createNotification();
      setNotifications([notification]); // عرض إشعار واحد فقط
      incrementTravelerCount();
      onNotificationShow?.();

      // إخفاء الإشعار بعد 5 ثواني
      setTimeout(() => {
        setNotifications([]);
      }, 5000);
    }, 2000);

    // نظام دوري: عرض إشعار لمدة 5 ثواني، ثم انتظار 3 ثواني
    const startCycle = () => {
      const notification = createNotification();
      setNotifications([notification]); // عرض إشعار واحد فقط
      incrementTravelerCount();
      onNotificationShow?.();

      // إخفاء الإشعار بعد 5 ثواني
      setTimeout(() => {
        setNotifications([]);
        
        // انتظار 3 ثواني ثم بدء دورة جديدة
        setTimeout(() => {
          startCycle();
        }, 3000);
      }, 5000);
    };

    // بدء الدورة بعد الإشعار الأول (2 + 5 + 3 = 10 ثواني)
    const cycleTimeout = setTimeout(() => {
      startCycle();
    }, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(cycleTimeout);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications([]);
  };

  // دالة لتحديد النص بناءً على الجنس
  const getGenderText = (name: string) => {
    // إذا كان الاسم يحتوي على "بنت" فهو أنثى
    if (name.includes('بنت')) {
      return 'صممت';
    }
    // باقي الأسماء تعتبر ذكور
    return 'صمم';
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
                  {getGenderText(notification.name)} باكج بقيمة {notification.price} {notification.currency}
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
