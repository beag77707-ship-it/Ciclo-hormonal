import React, { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UserSettings } from '../types';
import { getPhaseForDate } from '../services/cycleLogic';

interface Props {
  user: UserSettings;
  onDateSelect: (date: string) => void;
}

const CalendarPage: React.FC<Props> = ({ user, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const weeks = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  return (
    <div className="p-4 pt-8">
      <div className="flex justify-between items-center mb-8 px-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronLeft className="text-slate-600"/>
        </button>
        <h2 className="text-xl font-bold text-slate-800 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight className="text-slate-600"/>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weeks.map(w => <div key={w} className="text-center text-xs font-bold text-slate-400">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-1">
        {/* Placeholder for days before start of month (layout trick) */}
        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map(day => {
          const phase = getPhaseForDate(day, user);
          const isToday = isSameDay(day, new Date());
          
          let bgColor = 'bg-white';
          let textColor = 'text-slate-700';

          // Simplified visualization logic
          if (phase.name === 'Menstrual') {
             bgColor = 'bg-rose-400';
             textColor = 'text-white';
          } else if (phase.name === 'Ovulation' || phase.name === 'Follicular') {
             // Only color fertile window
             if (phase.description.includes('Fertil')) {
                 bgColor = 'bg-teal-100';
                 textColor = 'text-teal-700';
             }
             if (phase.name === 'Ovulation') { // Peak
                 bgColor = 'bg-teal-400';
                 textColor = 'text-white';
             }
          }

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(format(day, 'yyyy-MM-dd'))}
              className={`
                aspect-square rounded-full flex flex-col items-center justify-center text-sm relative
                ${bgColor} ${textColor}
                ${isToday ? 'ring-2 ring-slate-800 ring-offset-2' : ''}
              `}
            >
              <span>{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 space-y-2 px-4">
         <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-rose-400"></div>
             <span className="text-sm text-slate-500">Periodo (estimado)</span>
         </div>
         <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-teal-400"></div>
             <span className="text-sm text-slate-500">Día Fértil / Ovulación</span>
         </div>
         <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-800"></div>
             <span className="text-sm text-slate-500">Hoy</span>
         </div>
      </div>
    </div>
  );
};

export default CalendarPage;