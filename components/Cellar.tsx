
import React from 'react';
import { Wine } from '../types.ts';
import { Star } from 'lucide-react';

interface CellarProps {
  wines: Wine[];
  onViewDetail: (id: string) => void;
}

const Cellar: React.FC<CellarProps> = ({ wines, onViewDetail }) => {
  if (wines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-10 space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <Star size={40} />
        </div>
        <h2 className="text-xl font-serif text-slate-400">Your cellar is waiting to be filled.</h2>
        <p className="text-sm text-slate-400">Scan your first bottle to begin your collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {wines.map((wine) => (
        <div 
          key={wine.id} 
          onClick={() => onViewDetail(wine.id)}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex gap-4">
            <div className="w-20 h-24 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 relative">
              {wine.image ? (
                <img src={wine.image} alt={wine.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-200 uppercase text-[10px] font-bold">No Label</div>
              )}
              <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-600 border border-slate-100">
                {wine.type}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider truncate">
                {wine.producer}
              </p>
              <h3 className="text-lg font-serif font-bold text-slate-900 truncate group-hover:text-red-900 transition-colors">
                {wine.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded-full">{wine.vintage}</span>
                <span className="truncate">{wine.region}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < (wine.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  x{wine.quantity} BTL
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cellar;
