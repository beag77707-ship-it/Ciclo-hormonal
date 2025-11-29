import React from 'react';
import { UserSettings } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: UserSettings;
}

const StatsPage: React.FC<Props> = ({ user }) => {
  // Mock data since we are using local storage heavily and might not have history
  const data = [
    { name: 'Ciclo 1', days: user.cycleLength - 2 },
    { name: 'Ciclo 2', days: user.cycleLength + 1 },
    { name: 'Ciclo 3', days: user.cycleLength },
    { name: 'Ciclo 4', days: user.cycleLength },
  ];

  return (
    <div className="p-6 pt-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Mis Estadísticas</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <span className="block text-slate-400 text-xs uppercase font-bold mb-1">Promedio Ciclo</span>
            <span className="text-3xl font-bold text-slate-800">{user.cycleLength}</span>
            <span className="text-xs text-slate-500 ml-1">días</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <span className="block text-slate-400 text-xs uppercase font-bold mb-1">Promedio Periodo</span>
            <span className="text-3xl font-bold text-rose-500">{user.periodLength}</span>
            <span className="text-xs text-slate-500 ml-1">días</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-700 mb-4">Historial de duración</h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="name" tick={{fontSize: 10}} stroke="#cbd5e1"/>
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="days" fill="#fb7185" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">Patrones detectados</h3>
        <p className="text-sm text-blue-600 leading-relaxed">
            Parece que tu ciclo es bastante regular. Usualmente experimentas cambios de ánimo 2 días antes de tu periodo.
        </p>
      </div>
    </div>
  );
};

export default StatsPage;