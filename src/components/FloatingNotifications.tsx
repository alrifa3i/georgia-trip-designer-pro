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
  
  { name: "نورا بنت أحمد العتيبي", country: "السعودية", currency: "ريال سعودي" },
  { name: "سارة بنت محمد الغامدي", country: "السعودية", currency: "ريال سعودي" },
  { name: "فاطمة بنت عبدالله الحربي", country: "السعودية", currency: "ريال سعودي" },
  { name: "مريم بنت سعد القحطاني", country: "السعودية", currency: "ريال سعودي" },
  { name: "هيفاء بنت خالد الشهري", country: "السعودية", currency: "ريال سعودي" },
  
  { name: "سعيد بن أحمد المزروعي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "راشد بن محمد الزعابي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "عبدالله بن خالد النعيمي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "محمد بن سالم الكعبي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "أحمد بن علي البلوشي", country: "الإمارات", currency: "درهم إماراتي" },
  
  { name: "عائشة بنت سعيد المزروعي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "شما بنت راشد الزعابي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "مريم بنت عبدالله النعيمي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "فاطمة بنت محمد الكعبي", country: "الإمارات", currency: "درهم إماراتي" },
  { name: "نورا بنت أحمد البلوشي", country: "الإمارات", currency: "درهم إماراتي" },
  
  { name: "فيصل أحمد الصباح", country: "الكويت", currency: "دينار كويتي" },
  { name: "بدر محمد العتيبي", country: "الكويت", currency: "دينار كويتي" },
  { name: "سالم عبدالله المطيري", country: "الكويت", currency: "دينار كويتي" },
  { name: "ناصر خالد الرشيد", country: "الكويت", currency: "دينار كويتي" },
  
  { name: "بشاير فيصل الصباح", country: "الكويت", currency: "دينار كويتي" },
  { name: "دانة بدر العتيبي", country: "الكويت", currency: "دينار كويتي" },
  { name: "هيا سالم المطيري", country: "الكويت", currency: "دينار كويتي" },
  { name: "سارة ناصر الرشيد", country: "الكويت", currency: "دينار كويتي" },
  
  { name: "حمد بن ثاني آل ثاني", country: "قطر", currency: "ريال قطري" },
  { name: "محمد بن عبدالله المري", country: "قطر", currency: "ريال قطري" },
  { name: "سعد بن أحمد الكواري", country: "قطر", currency: "ريال قطري" },
  { name: "علي بن حمد النعيمي", country: "قطر", currency: "ريال قطري" },
  
  { name: "شيخة بنت حمد آل ثاني", country: "قطر", currency: "ريال قطري" },
  { name: "مريم بنت محمد المري", country: "قطر", currency: "ريال قطري" },
  { name: "نورا بنت سعد الكواري", country: "قطر", currency: "ريال قطري" },
  { name: "عائشة بنت علي النعيمي", country: "قطر", currency: "ريال قطري" },
  
  { name: "أحمد بن محمد آل خليفة", country: "البحرين", currency: "دينار بحريني" },
  { name: "خالد بن سلمان الزياني", country: "البحرين", currency: "دينار بحريني" },
  { name: "محمد بن علي البوعينين", country: "البحرين", currency: "دينار بحريني" },
  
  { name: "هيفاء بنت أحمد آل خليفة", country: "البحرين", currency: "دينار بحريني" },
  { name: "لولوة بنت خالد الزياني", country: "البحرين", currency: "دينار بحريني" },
  { name: "مريم بنت محمد البوعينين", country: "البحرين", currency: "دينار بحريني" },
  
  { name: "سالم بن أحمد البوسعيدي", country: "عمان", currency: "ريال عماني" },
  { name: "محمد بن خالد الحراصي", country: "عمان", currency: "ريال عماني" },
  { name: "عبدالله بن سعيد المعمري", country: "عمان", currency: "ريال عماني" },
  
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

let globalTravelerCount = 994;

export const incrementTravelerCount = () => {
  globalTravelerCount++;
  localStorage.setItem('travelerCount', globalTravelerCount.toString());
  
  window.dispatchEvent(new CustomEvent('travelerCountUpdated', { 
    detail: { count: globalTravelerCount } 
  }));
  
  return globalTravelerCount;
};

export const getTravelerCount = () => {
  const saved = localStorage.getItem('travelerCount');
  if (saved) {
    globalTravelerCount = parseInt(saved, 10);
  }
  return globalTravelerCount;
};

interface FloatingNotificationsProps {
  onNotificationShow?: () => void;
  disabled?: boolean;
}

export const FloatingNotifications: React.FC<FloatingNotificationsProps> = ({ 
  onNotificationShow, 
  disabled = false 
}) => {
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [usedNames, setUsedNames] = useState<Set<string>>(new Set());
  const [isActive, setIsActive] = useState(!disabled);

  // تحديث حالة النشاط عند تغيير disabled
  useEffect(() => {
    setIsActive(!disabled);
    if (disabled) {
      setNotifications([]); // إخفاء الإشعارات الحالية عند التعطيل
    }
  }, [disabled]);

  const createNotification = (): BookingNotification => {
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
    if (!isActive) return; // لا تبدأ الإشعارات إذا كانت معطلة

    // عرض أول إشعار بعد ثانيتين
    const initialTimeout = setTimeout(() => {
      if (!isActive) return;
      
      const notification = createNotification();
      setNotifications([notification]);
      incrementTravelerCount();
      onNotificationShow?.();

      setTimeout(() => {
        if (isActive) {
          setNotifications([]);
        }
      }, 5000);
    }, 2000);

    // نظام دوري
    const startCycle = () => {
      if (!isActive) return;
      
      const notification = createNotification();
      setNotifications([notification]);
      incrementTravelerCount();
      onNotificationShow?.();

      setTimeout(() => {
        if (isActive) {
          setNotifications([]);
          
          setTimeout(() => {
            if (isActive) {
              startCycle();
            }
          }, 3000);
        }
      }, 5000);
    };

    const cycleTimeout = setTimeout(() => {
      if (isActive) {
        startCycle();
      }
    }, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(cycleTimeout);
    };
  }, [isActive, onNotificationShow]);

  const removeNotification = (id: string) => {
    setNotifications([]);
  };

  const getGenderText = (name: string) => {
    if (name.includes('بنت')) {
      return 'صممت';
    }
    return 'صمم';
  };

  if (!isActive) return null; // لا تعرض أي شيء إذا كانت معطلة

  return (
    <div className="fixed top-20 sm:top-4 left-4 sm:left-auto sm:right-4 z-50 space-y-2 max-w-xs pointer-events-none">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="p-2 sm:p-4 bg-white/95 backdrop-blur-sm border border-green-200 shadow-lg animate-slide-in-right pointer-events-auto"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <div className="flex-shrink-0">
                <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-green-600 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                  حجز جديد تم بنجاح! 🎉
                </p>
                <p className="text-xs text-gray-600 mb-1 truncate">
                  <strong>{notification.name}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  {getGenderText(notification.name)} باكج بقيمة {notification.price} {notification.currency}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};
