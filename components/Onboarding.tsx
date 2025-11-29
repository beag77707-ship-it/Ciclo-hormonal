import React, { useState } from 'react';
import { Heart, Activity, Lock, ArrowRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      icon: <Heart size={64} className="text-rose-500" />,
      title: "Conoce tu ciclo",
      desc: "Seguimiento sencillo de tu período, síntomas y días fértiles."
    },
    {
      icon: <Activity size={64} className="text-teal-500" />,
      title: "Registra tus síntomas",
      desc: "Lleva un registro de cómo te sientes y descubre patrones."
    },
    {
      icon: <Lock size={64} className="text-slate-700" />,
      title: "Tu salud, tus datos",
      desc: "Tus datos son privados y se almacenan localmente."
    }
  ];

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-8 bg-rose-50 rounded-full mb-8 animate-pulse">
          {slides[slide].icon}
        </div>
        <h1 className="text-3xl font-bold text-slate-800">{slides[slide].title}</h1>
        <p className="text-slate-500 text-lg px-4">{slides[slide].desc}</p>
      </div>

      <div className="w-full mb-10 space-y-4">
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i === slide ? 'bg-rose-500 w-6 transition-all' : 'bg-slate-200'}`} />
          ))}
        </div>

        {slide < 2 ? (
          <button 
            onClick={() => setSlide(slide + 1)}
            className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
          >
            Siguiente <ArrowRight size={20} />
          </button>
        ) : (
          <button 
            onClick={onComplete}
            className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-700 transition-colors"
          >
            Comenzar
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;