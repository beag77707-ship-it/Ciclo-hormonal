import React from 'react';
import { UserSettings } from '../types';
import { getCurrentCycleDay, getPhaseForDate, getNextPeriodDate, getOvulationDate } from '../services/cycleLogic';
import { differenceInDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Calendar as CalIcon, MessageCircle } from 'lucide-react';

interface Props {
  user: UserSettings;
  onLogToday: () => void;
  onNavigate: (page: string) => void;
  onOpenChat: () => void;
}

const HomePage: React.FC<Props> = ({ user, onLogToday, onNavigate, onOpenChat }) => {
  const currentDay = getCurrentCycleDay(user.lastPeriodDate);
  const phase = getPhaseForDate(new Date(), user);
  const nextPeriod = getNextPeriodDate(user.lastPeriodDate, user.cycleLength);
  const daysUntilPeriod = differenceInDays(nextPeriod, new Date());
  
  const nextOvulation = getOvulationDate(nextPeriod);
  const daysUntilFertile = differenceInDays(nextOvulation, new Date()) - 4; // Approx start of window

  return (
    <div className="min-h-full pb-20">
      {/* Header with optional AI Theme */}
      <div 
        className="relative bg-gradient-to-br from-rose-100 to-rose-200 rounded-b-[2.5rem] p-6 pt-12 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center overflow-hidden"
      >
         {user.themeImage && (
             <div className="absolute inset-0 z-0 opacity-50">
                 <img src={user.themeImage} alt="Theme" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
             </div>
         )}
         
        <div className="relative z-10">
            <h1 className="text-slate-700 font-medium mb-1">Hola, {user.name}</h1>
            <div className="inline-block px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider mb-6">
            {phase.name === 'Menstrual' ? 'Menstruación' : 
             phase.name === 'Follicular' ? 'Fase Folicular' : 
             phase.name === 'Ovulation' ? 'Ovulación' : 'Fase Lútea'}
            </div>

            <div className="w-48 h-48 rounded-full border-8 border-white/50 flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-xl mb-4 relative">
            <div className="text-center">
                <span className="block text-xs text-slate-500 uppercase tracking-widest">Día</span>
                <span className="text-6xl font-bold text-slate-800">{currentDay}</span>
                <span className="block text-sm text-slate-600">del ciclo</span>
            </div>
            {/* Visual Indicator Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20" />
                <circle 
                cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" 
                strokeDasharray={`${(currentDay / user.cycleLength) * 289} 289`}
                className="text-rose-500 transition-all duration-1000 ease-out" 
                strokeLinecap="round"
                />
            </svg>
            </div>
            
            <p className="text-slate-600 font-medium max-w-[200px] mx-auto leading-tight">
            {phase.description}
            </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="px-6 -mt-8 grid grid-cols-2 gap-4 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Próximo Periodo</span>
          <span className="text-2xl font-bold text-rose-500 my-1">{daysUntilPeriod}</span>
          <span className="text-xs text-slate-500">días restantes</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Ventana Fértil</span>
          <span className="text-2xl font-bold text-teal-500 my-1">{daysUntilFertile > 0 ? daysUntilFertile : 'En curso'}</span>
          <span className="text-xs text-slate-500">{daysUntilFertile > 0 ? 'días restantes' : '¡Cuidado!'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 mt-8 space-y-4">
        <button 
          onClick={onLogToday}
          className="w-full bg-rose-500 text-white p-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Plus className="text-white" size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-lg">Registrar hoy</span>
              <span className="text-rose-100 text-sm">¿Cómo te sientes?</span>
            </div>
          </div>
          <div className="bg-white text-rose-500 px-3 py-1 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Go
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => onNavigate('calendar')}
                className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors"
            >
                <CalIcon size={24} />
                <span className="font-medium text-sm">Ver Calendario</span>
            </button>
            <button 
                onClick={onOpenChat}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-md shadow-indigo-200"
            >
                <MessageCircle size={24} />
                <span className="font-medium text-sm">Chat AI</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;