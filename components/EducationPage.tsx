import React, { useState } from 'react';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { searchHealthArticles } from '../services/geminiService';

const EducationPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const results = await searchHealthArticles(query);
    setArticles(results);
    setLoading(false);
  };

  const categories = [
    "Alivio dolor menstrual",
    "Nutrición fase lútea",
    "Yoga para el ciclo",
    "Métodos anticonceptivos"
  ];

  return (
    <div className="p-6 pt-10 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Biblioteca de Salud</h2>
      <p className="text-slate-500 text-sm mb-6">Información verificada potenciada por Google Search</p>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center px-4 shadow-sm focus-within:ring-2 focus-within:ring-rose-100">
            <Search className="text-slate-400" size={20} />
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Busca temas de salud..."
                className="w-full p-3 outline-none text-slate-700 bg-transparent"
            />
        </div>
        <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-slate-800 text-white px-4 rounded-xl flex items-center justify-center disabled:opacity-50"
        >
           {loading ? <Loader2 className="animate-spin" /> : 'Ir'}
        </button>
      </div>

      {/* Quick Chips */}
      {articles.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => { setQuery(cat); handleSearch(); }}
                    className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-100"
                >
                    {cat}
                </button>
            ))}
          </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {loading && <div className="text-center py-10 text-slate-400">Buscando información confiable...</div>}
        
        {articles.map((article, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-rose-200 transition-colors">
                <h3 className="font-bold text-slate-800 mb-2 leading-tight">{article.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-3">{article.summary}</p>
                {article.url && (
                    <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                        LEER ARTÍCULO COMPLETO <ExternalLink size={12} />
                    </a>
                )}
            </div>
        ))}

        {!loading && articles.length === 0 && (
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
                <h3 className="font-bold text-indigo-900 mb-2">Aprende sobre tu cuerpo</h3>
                <p className="text-sm text-indigo-700">Utiliza el buscador para encontrar artículos recientes sobre salud menstrual, higiene, fertilidad y bienestar.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;