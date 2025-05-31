
import React, { useState, useEffect } from 'react';
import { getTravelerCount } from './FloatingNotifications';

export const TravelerCounter = () => {
  const [count, setCount] = useState(getTravelerCount());

  useEffect(() => {
    // تحديث العداد عند تحميل المكون
    setCount(getTravelerCount());

    // الاستماع لأحداث تحديث العداد
    const handleCounterUpdate = (event: CustomEvent) => {
      setCount(event.detail.count);
    };

    window.addEventListener('travelerCountUpdated', handleCounterUpdate as EventListener);

    return () => {
      window.removeEventListener('travelerCountUpdated', handleCounterUpdate as EventListener);
    };
  }, []);

  return (
    <div className="text-center mt-12">
      <p className="text-white/80 text-lg">
        🌟 أكثر من {count.toLocaleString()} مسافر سعيد اختار جورجيا معنا
      </p>
    </div>
  );
};
