import React, { useState } from 'react';
import { UserSettings, CycleGoal } from '../types';
import { saveUser } from '../services/storage';

interface Props {
  onComplete: (user: UserSettings) => void;
}

const Setup: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [lastPeriod, setLastPeriod] = useState(new Date().toISOString().split('T')[0]);
  const [periodLen, setPeriodLen] = useState(5);
  const [cycleLen, setCycleLen] = useState(28);
  const [goal, setGoal] = useState<CycleGoal>(CycleGoal.UNDERSTAND);

  const handleFinish = () => {
    const newUser: UserSettings = {
      name: 'Amiga',
      email: '', // Optional for local
      lastPeriodDate: lastPeriod,
      cycleLength: cycleLen,
      periodLength: periodLen,
      goal: goal,
      notifications: {
        periodReminder: true,
        periodReminderDays: 2,
        fertileReminder: true,
        logReminder: false
      }
    };
    saveUser(newUser);
    onComplete(newUser);
  };

  return (
    <div className="h-screen bg-rose-50 p-6 flex flex-col justify-between">
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Configuremos tu ciclo</h2>
        <p className="text-slate-500 mb-8">Estos datos nos ayudan a predecir tus próximas fechas.</p>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <label className="block text-sm font-medium text-slate-700 mb-2">Primer día de tu última menstruación</label>
              <input 
                type="date" 
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <label className="block text-sm font-medium text-slate-700 mb-2">Duración promedio del período (días)</label>
              <div className="flex items-center justify-between">
                <button onClick={() => setPeriodLen(Math.max(1, periodLen - 1))} className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold">-</button>
                <span className="text-2xl font-bold text-rose-500">{periodLen}</span>
                <button onClick={() => setPeriodLen(Math.min(10, periodLen + 1))} className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold">+</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <label className="block text-sm font-medium text-slate-700 mb-2">Duración del ciclo (días)</label>
              <div className="flex items-center justify-between">
                <button onClick={() => setCycleLen(Math.max(21, cycleLen - 1))} className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold">-</button>
                <span className="text-2xl font-bold text-teal-500">{cycleLen}</span>
                <button onClick={() => setCycleLen(Math.min(45, cycleLen + 1))} className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold">+</button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-slate-700">¿Cuál es tu objetivo principal?</h3>
            {[
              { id: CycleGoal.UNDERSTAND, label: "Entender mi cuerpo" },
              { id: CycleGoal.AVOID_PREGNANCY, label: "Evitar un embarazo" },
              { id: CycleGoal.SEEK_PREGNANCY, label: "Quedar embarazada" }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGoal(opt.id)}
                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                  goal === opt.id 
                    ? 'border-rose-500 bg-rose-50 text-rose-700' 
                    : 'border-white bg-white text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        {step === 1 ? (
          <button 
            onClick={() => setStep(2)}
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold"
          >
            Siguiente
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-rose-200"
          >
            Finalizar configuración
          </button>
        )}
      </div>
    </div>
  );
};

export default Setup;