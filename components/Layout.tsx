import React from 'react';
import { Calendar, Home, BarChart2, BookOpen, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 flex justify-around items-center py-3 pb-5 z-50">
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        
        <button 
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <Calendar size={24} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Calendario</span>
        </button>

        <button 
          onClick={() => onTabChange('stats')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <BarChart2 size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Estadísticas</span>
        </button>

        <button 
          onClick={() => onTabChange('education')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'education' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <BookOpen size={24} strokeWidth={activeTab === 'education' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Info</span>
        </button>

        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;