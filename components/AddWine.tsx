import React, { useState, useRef } from 'react';
import { Wine } from '../types.ts';
import { Camera, X, Loader2, Image } from 'lucide-react';
import { analyzeLabel } from '../services/geminiService.ts';

interface AddWineProps {
  onAdd: (wine: Wine) => void;
  onCancel: () => void;
}

const AddWine: React.FC<AddWineProps> = ({ onAdd, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Wine>>({
    name: '',
    producer: '',
    vintage: '',
    region: '',
    varietal: '',
    type: 'Red',
    quantity: 1,
    notes: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        handleAnalyze(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (base64: string) => {
    setLoading(true);
    try {
      const pureBase64 = base64.split(',')[1];
      const result = await analyzeLabel(pureBase64);
      setFormData(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWine: Wine = {
      id: Date.now().toString(),
      name: formData.name || 'Unknown Wine',
      producer: formData.producer || 'Unknown Producer',
      vintage: formData.vintage || 'NV',
      region: formData.region || '',
      varietal: formData.varietal || '',
      type: (formData.type as any) || 'Red',
      quantity: formData.quantity || 1,
      notes: formData.notes,
      rating: formData.rating,
      image: imagePreview || undefined,
      addedAt: Date.now(),
    };
    onAdd(newWine);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif">Add New Bottle</h2>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="mb-8 relative group">
        {/* Hidden file inputs */}
        <input 
          type="file" 
          ref={cameraInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          capture="environment"
          className="hidden" 
        />
        <input 
          type="file" 
          ref={galleryInputRef} 
          onChange={handleFileChange} 
          accept="image/*"
          className="hidden" 
        />
        
        {/* Image preview or placeholder */}
        <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden bg-white shadow-sm">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                <Camera size={24} />
              </div>
              <p className="font-semibold text-slate-600">Scan or Upload Label</p>
              <p className="text-xs text-slate-400 mt-1">AI will automatically fill the details</p>
            </>
          )}
        </div>
        
        {/* Button options */}
        {!imagePreview && (
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              Take Photo
            </button>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex-1 py-3 px-4 bg-white border-2 border-slate-900 text-slate-900 font-semibold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Image size={20} />
              Choose Photo
            </button>
          </div>
        )}
        
        {/* Change photo button when image is selected */}
        {imagePreview && !loading && (
          <button
            type="button"
            onClick={() => {
              setImagePreview(null);
              setFormData({
                name: '',
                producer: '',
                vintage: '',
                region: '',
                varietal: '',
                type: 'Red',
                quantity: 1,
                notes: '',
              });
            }}
            className="mt-4 w-full py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
          >
            Change Photo
          </button>
        )}
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-3xl z-10">
            <Loader2 size={32} className="text-red-900 animate-spin" />
            <p className="text-sm font-bold text-slate-600 animate-pulse">AI is reading the label...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Wine Name</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-900/10 font-medium bg-white shadow-sm"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Opus One"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Producer</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-900/10 bg-white shadow-sm"
              value={formData.producer}
              onChange={e => setFormData({...formData, producer: e.target.value})}
              placeholder="e.g. Baron Philippe de Rothschild"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Vintage</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-900/10 bg-white shadow-sm"
              value={formData.vintage}
              onChange={e => setFormData({...formData, vintage: e.target.value})}
              placeholder="2018"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Region</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-900/10 bg-white shadow-sm"
              value={formData.region}
              onChange={e => setFormData({...formData, region: e.target.value})}
              placeholder="Napa Valley"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Type</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-900/10 shadow-sm"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as any})}
            >
              <option>Red</option>
              <option>White</option>
              <option>Rosé</option>
              <option>Sparkling</option>
              <option>Dessert</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Quantity</label>
            <input 
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-900/10 bg-white shadow-sm"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 wine-gradient text-white font-bold rounded-2xl shadow-xl shadow-red-900/20 active:scale-95 transition-transform"
        >
          Store in Vault
        </button>
      </form>
    </div>
  );
};

export default AddWine;
