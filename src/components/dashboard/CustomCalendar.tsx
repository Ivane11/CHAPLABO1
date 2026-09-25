import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
}

export const CustomCalendar: React.FC<CustomCalendarProps> = ({ isOpen, onClose, align = 'left' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      setCurrentDate(new Date(selectedYear, selectedMonth, 1));
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long' });
  const monthLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const num = i + 1;
    let state = '';
    if (num === selectedDate && month === selectedMonth && year === selectedYear) {
      state = 'selected';
    } else if (isCurrentMonth && num === today.getDate()) {
      state = 'green-dot';
    }
    return { num, state };
  });

  const emptyDaysStart = firstDayIndex;
  const emptyDaysEnd = (7 - ((emptyDaysStart + daysInMonth) % 7)) % 7;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (num: number) => {
    setSelectedDate(num);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDate);
  const dateString = selectedDateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  const formattedDateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  const diffTime = selectedDateObj.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let relativeString = "";
  let relativeBadgeClass = "bg-[#D9F99D] text-[#18181B]"; // Green

  if (diffDays === 0) {
    relativeString = "Aujourd'hui";
  } else if (diffDays === 1) {
    relativeString = "Demain";
  } else if (diffDays === -1) {
    relativeString = "Hier";
    relativeBadgeClass = "bg-slate-200 text-slate-700";
  } else if (diffDays > 0) {
    relativeString = `Dans ${diffDays} j`;
  } else {
    relativeString = `Il y a ${Math.abs(diffDays)} j`;
    relativeBadgeClass = "bg-slate-200 text-slate-700";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-transparent" // Transparent backdrop just to catch clicks
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className={`absolute top-12 z-50 w-[320px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-5 font-sans ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h4 className="font-bold text-[14px] text-slate-900 tracking-tight">{monthLabel}</h4>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1.5 mb-2 px-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-slate-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 px-1 mb-4">
              {/* Empty start days */}
              {Array.from({ length: emptyDaysStart }).map((_, i) => (
                <div
                  key={`empty-start-${i}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, #F1F5F9 3px, #F1F5F9 4.5px)'
                  }}
                />
              ))}

              {/* Month days */}
              {days.map((day) => {
                let bgClass = "bg-slate-50 hover:bg-slate-100 text-slate-600";
                let dotClass = "";
                
                if (day.state === 'selected') {
                  bgClass = "bg-[#5832E5] text-white shadow-sm shadow-[#5832E5]/30";
                  dotClass = "bg-white";
                } else if (day.state === 'green-dot') {
                  bgClass = "bg-[#D9F99D] text-slate-900"; // Light green for today
                  dotClass = "bg-[#18181B]"; // Black dot
                }

                return (
                  <button
                    key={day.num}
                    onClick={() => handleDayClick(day.num)}
                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold transition-colors smooth-press ${bgClass}`}
                  >
                    <span className={day.state ? "mb-1.5" : ""}>{day.num}</span>
                    {day.state && (
                      <span className={`absolute bottom-1 w-1 h-1 rounded-full ${dotClass}`} />
                    )}
                  </button>
                );
              })}

              {/* Empty end days */}
              {Array.from({ length: emptyDaysEnd }).map((_, i) => (
                <div
                  key={`empty-end-${i}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, #F1F5F9 3px, #F1F5F9 4.5px)'
                  }}
                />
              ))}
            </div>

            {/* Bottom Event Card */}
            <div className="bg-[#F8F6FF] rounded-xl p-3 border border-[#F2EEFF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-[#EAE4FF] flex items-center justify-center text-[#5832E5] shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">{formattedDateString}</div>
                  <div className="text-[17px] font-extrabold text-[#18181B] tracking-tight -mt-0.5">
                    {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}
                  </div>
                </div>
              </div>
              <div className={`${relativeBadgeClass} text-[10px] font-bold px-2 py-1 rounded-full shadow-sm`}>
                {relativeString}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
