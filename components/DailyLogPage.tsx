import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Smile, Frown, Meh, CloudRain, Droplet, Sun, Moon, Activity } from 'lucide-react';
import { getLogForDate, saveLog } from '../services/storage';
import { DailyLog, FlowIntensity, Mood } from '../types';

interface Props {
  date: string;
  onClose: () => void;
  onSave: () => void;
}

const DailyLogPage: React.FC<Props> = ({ date, onClose, onSave }) => {
  const [log, setLog] = useState<DailyLog>({
    date,
    flow: FlowIntensity.NONE,
    symptoms: [],
    mood: null,
    notes: '',
    intercourse: false,
    protection: false
  });

  useEffect(() => {
    const existing = getLogForDate(date);
    if (existing) setLog(existing);
  }, [date]);

  const handleSave = () => {
    saveLog(log);
    onSave();
  };

  const toggleSymptom = (sym: string) => {
    setLog(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(sym) 
        ? prev.symptoms.filter(s => s !== sym)
        : [...prev.symptoms, sym]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b flex justify-between items-center bg-white">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-600"><ArrowLeft /></button>
        <span className="font-bold text-lg">{new Date(date).toLocaleDateString()}</span>
        <button onClick={handleSave} className="text-rose-500 font-bold flex items-center gap-1">
          <Save size={18} /> Guardar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
        
        {/* Flow */}
        <section>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Droplet size={20} className="text-rose-500"/> Flujo Menstrual</h3>
          <div className="flex justify-between bg-white p-2 rounded-xl shadow-sm">
            {[FlowIntensity.NONE, FlowIntensity.LIGHT, FlowIntensity.MEDIUM, FlowIntensity.HEAVY].map((level, i) => (
              <button
                key={level}
                onClick={() => setLog(l => ({ ...l, flow: level }))}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${log.flow === level ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {level === FlowIntensity.NONE ? 'Nada' : level === 'light' ? 'Ligero' : level === 'medium' ? 'Medio' : 'Alto'}
              </button>
            ))}
          </div>
        </section>

        {/* Mood */}
        <section>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Smile size={20} className="text-amber-500"/> Estado de Ánimo</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: Mood.HAPPY, icon: <Smile/>, label: 'Feliz' },
              { id: Mood.CALM, icon: <Sun/>, label: 'Tranquila' },
              { id: Mood.SAD, icon: <CloudRain/>, label: 'Triste' },
              { id: Mood.IRRITATED, icon: <Activity/>, label: 'Irritada' },
              { id: Mood.ANXIOUS, icon: <Moon/>, label: 'Ansiosa' },
              { id: Mood.NEUTRAL, icon: <Meh/>, label: 'Neutra' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setLog(l => ({ ...l, mood: m.id }))}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                    log.mood === m.id 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-slate-100 bg-white text-slate-400'
                }`}
              >
                {m.icon}
                <span className="text-xs mt-1">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Symptoms */}
        <section>
          <h3 className="font-bold text-slate-700 mb-4">Síntomas</h3>
          <div className="flex flex-wrap gap-2">
            {['Dolor cabeza', 'Cóliscos', 'Fatiga', 'Acné', 'Antojos', 'Dolor espalda', 'Hinchazón'].map(sym => (
              <button
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                   log.symptoms.includes(sym)
                   ? 'bg-indigo-100 border-indigo-200 text-indigo-700 font-medium'
                   : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </section>

         {/* Notes */}
         <section>
          <h3 className="font-bold text-slate-700 mb-4">Notas</h3>
          <textarea
            value={log.notes}
            onChange={(e) => setLog(l => ({ ...l, notes: e.target.value }))}
            className="w-full p-4 rounded-xl border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none min-h-[100px]"
            placeholder="¿Algo más que quieras recordar?"
          />
        </section>
      </div>
    </div>
  );
};

export default DailyLogPage;