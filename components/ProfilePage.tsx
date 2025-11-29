import React, { useState } from 'react';
import { UserSettings } from '../types';
import { LogOut, Image as ImageIcon, Wand2, Camera, Loader2, Save } from 'lucide-react';
import { generateThemeImage, editThemeImage } from '../services/geminiService';
import { saveUser, clearData } from '../services/storage';

interface Props {
  user: UserSettings;
  onLogout: () => void;
  onUpdateUser: (u: UserSettings) => void;
}

const ProfilePage: React.FC<Props> = ({ user, onLogout, onUpdateUser }) => {
  const [generating, setGenerating] = useState(false);
  const [moodPrompt, setMoodPrompt] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!moodPrompt) return;
    setGenerating(true);
    // Use the prompt to generate a theme
    const base64 = await generateThemeImage(moodPrompt);
    if (base64) {
        const updatedUser = { ...user, themeImage: base64 };
        saveUser(updatedUser);
        onUpdateUser(updatedUser);
        setEditMode(false);
    }
    setGenerating(false);
  };

  const handleEdit = async () => {
      if (!editPrompt || !user.themeImage) return;
      setGenerating(true);
      const result = await editThemeImage(user.themeImage, editPrompt);
      if (result) {
          setEditedImage(result);
      }
      setGenerating(false);
  }
  
  const saveEdit = () => {
      if (editedImage) {
          const updatedUser = { ...user, themeImage: editedImage };
          saveUser(updatedUser);
          onUpdateUser(updatedUser);
          setEditedImage(null);
          setEditMode(false);
      }
  }

  return (
    <div className="p-6 pt-10 pb-20">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Mi Perfil</h2>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-2xl font-bold text-rose-500">
            {user.name.charAt(0)}
        </div>
        <div>
            <h3 className="font-bold text-slate-800">{user.name}</h3>
            <p className="text-sm text-slate-500">Ciclo promedio: {user.cycleLength} días</p>
        </div>
      </div>

      {/* AI Theme Studio */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-lg mb-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="text-teal-400" />
            <h3 className="font-bold text-lg">AI Theme Studio</h3>
          </div>
          <p className="text-slate-300 text-sm mb-4">Personaliza el encabezado de tu app según tu estado de ánimo.</p>
          
          {user.themeImage && !editMode && (
              <div className="mb-4 relative group">
                  <img src={user.themeImage} alt="Current Theme" className="w-full h-32 object-cover rounded-xl border border-slate-600" />
                  <button 
                    onClick={() => setEditMode(true)}
                    className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md"
                  >
                      Editar Imagen
                  </button>
              </div>
          )}

          {editMode ? (
              <div className="space-y-3">
                   {editedImage ? (
                        <img src={editedImage} alt="Edited" className="w-full h-32 object-cover rounded-xl border border-teal-500/50" />
                   ) : (
                       <div className="w-full h-32 bg-slate-800 rounded-xl flex items-center justify-center border border-dashed border-slate-600">
                           <span className="text-xs text-slate-500">Vista previa aquí</span>
                       </div>
                   )}
                   
                   <input 
                    type="text" 
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Ej: Agrega flores, hazlo más oscuro..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500"
                  />
                  <div className="flex gap-2">
                       <button 
                        onClick={handleEdit}
                        disabled={generating}
                        className="flex-1 bg-teal-600 hover:bg-teal-500 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                       >
                           {generating ? <Loader2 className="animate-spin mx-auto"/> : 'Generar Edición'}
                       </button>
                       {editedImage && (
                           <button onClick={saveEdit} className="bg-white text-slate-900 p-2 rounded-xl"><Save size={18}/></button>
                       )}
                       <button onClick={() => { setEditMode(false); setEditedImage(null); }} className="p-2 text-slate-400"><LogOut size={18} className="rotate-180"/></button>
                  </div>
              </div>
          ) : (
            <div className="space-y-3">
                <input 
                    type="text" 
                    value={moodPrompt}
                    onChange={(e) => setMoodPrompt(e.target.value)}
                    placeholder="¿Cómo te sientes hoy? (ej: Calmada, Energética)"
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500"
                />
                <button 
                    onClick={handleGenerate}
                    disabled={generating || !moodPrompt}
                    className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 disabled:opacity-50"
                >
                    {generating ? <Loader2 className="animate-spin" /> : <><ImageIcon size={16} /> Generar Tema Nuevo</>}
                </button>
            </div>
          )}
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
            <span className="text-slate-600 text-sm">Notificaciones</span>
            <div className="w-10 h-6 bg-rose-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
        </div>
        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
            <span className="text-slate-600 text-sm">Privacidad</span>
            <span className="text-xs text-slate-400">Datos locales</span>
        </div>
        <button 
            onClick={() => { clearData(); onLogout(); }}
            className="w-full p-4 text-left text-red-500 text-sm font-medium hover:bg-red-50 flex items-center gap-2"
        >
            <LogOut size={16} /> Cerrar Sesión y Borrar Datos
        </button>
      </div>
      
      <p className="text-center text-slate-400 text-xs mt-8">
          Versión 1.0.0 • Hecho con ❤️
      </p>
    </div>
  );
};

export default ProfilePage;