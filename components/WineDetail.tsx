
import React, { useState } from 'react';
import { Wine } from '../types';
import { ArrowLeft, Trash2, Star, Plus, Minus, Edit3, Save } from 'lucide-react';

interface WineDetailProps {
  wine: Wine;
  onUpdate: (wine: Wine) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const WineDetail: React.FC<WineDetailProps> = ({ wine, onUpdate, onDelete, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWine, setEditedWine] = useState<Wine>(wine);

  const handleSave = () => {
    onUpdate(editedWine);
    setIsEditing(false);
  };

  const updateQuantity = (delta: number) => {
    const newQty = Math.max(0, wine.quantity + delta);
    onUpdate({ ...wine, quantity: newQty });
  };

  const setRating = (r: number) => {
    onUpdate({ ...wine, rating: r });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`p-2 rounded-full ${isEditing ? 'bg-red-50 text-red-900' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <Edit3 size={20} />
          </button>
          <button onClick={() => onDelete(wine.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <div className="w-48 h-64 bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-6 transform -rotate-1">
          {wine.image ? (
            <img src={wine.image} alt={wine.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
               <span className="font-serif text-4xl mb-2 italic">V</span>
               <span className="text-[10px] uppercase font-bold tracking-widest">No Label</span>
             </div>
          )}
        </div>
        
        {isEditing ? (
          <input 
            className="text-center text-2xl font-serif font-bold text-slate-900 bg-transparent border-b-2 border-red-900/20 focus:outline-none w-full"
            value={editedWine.name}
            onChange={e => setEditedWine({...editedWine, name: e.target.value})}
          />
        ) : (
          <h2 className="text-3xl font-serif font-bold text-slate-900 text-center px-4 leading-tight">{wine.name}</h2>
        )}
        <p className="text-sm font-bold text-red-800 uppercase tracking-widest mt-2">{wine.producer}</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        {/* Rating & Quantity */}
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} onClick={() => setRating(r)}>
                  <Star 
                    size={24} 
                    className={r <= (wine.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory</span>
            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
              <button onClick={() => updateQuantity(-1)} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold text-slate-900">{wine.quantity}</span>
              <button onClick={() => updateQuantity(1)} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 pt-4 border-t border-slate-50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Vintage</span>
            <p className="font-semibold">{wine.vintage}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Type</span>
            <p className="font-semibold">{wine.type}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Region</span>
            <p className="font-semibold">{wine.region || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Varietal</span>
            <p className="font-semibold">{wine.varietal || '—'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tasting Notes</span>
          {isEditing ? (
            <textarea 
              className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 focus:outline-none min-h-[100px]"
              value={editedWine.notes}
              onChange={e => setEditedWine({...editedWine, notes: e.target.value})}
            />
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {wine.notes || "No notes added yet. Use the sommelier to get some inspiration!"}
            </p>
          )}
        </div>

        {isEditing && (
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default WineDetail;
