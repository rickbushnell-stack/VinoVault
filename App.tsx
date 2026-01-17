
import React, { useState, useEffect } from 'react';
import { Wine, View } from './types.ts';
import Cellar from './components/Cellar.tsx';
import Sommelier from './components/Sommelier.tsx';
import AddWine from './components/AddWine.tsx';
import WineDetail from './components/WineDetail.tsx';
import { 
  Wine as WineIcon, 
  Plus, 
  MessageSquare, 
  LayoutGrid,
  Search
} from 'lucide-react';

const App: React.FC = () => {
  const [wines, setWines] = useState<Wine[]>([]);
  const [currentView, setCurrentView] = useState<View>('cellar');
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vino_vault_wines');
    if (saved) {
      try {
        setWines(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load wines", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vino_vault_wines', JSON.stringify(wines));
  }, [wines]);

  const addWine = (wine: Wine) => {
    setWines(prev => [wine, ...prev]);
    setCurrentView('cellar');
  };

  const updateWine = (updatedWine: Wine) => {
    setWines(prev => prev.map(w => w.id === updatedWine.id ? updatedWine : w));
  };

  const deleteWine = (id: string) => {
    setWines(prev => prev.filter(w => w.id !== id));
    setCurrentView('cellar');
  };

  const filteredWines = wines.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.varietal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderView = () => {
    switch (currentView) {
      case 'sommelier':
        return <Sommelier cellar={wines} />;
      case 'add':
        return <AddWine onAdd={addWine} onCancel={() => setCurrentView('cellar')} />;
      case 'detail':
        const wine = wines.find(w => w.id === selectedWineId);
        return wine ? (
          <WineDetail 
            wine={wine} 
            onUpdate={updateWine} 
            onDelete={deleteWine} 
            onBack={() => setCurrentView('cellar')} 
          />
        ) : <Cellar wines={filteredWines} onViewDetail={(id) => { setSelectedWineId(id); setCurrentView('detail'); }} />;
      default:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search your collection..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-900/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Cellar 
              wines={filteredWines} 
              onViewDetail={(id) => { setSelectedWineId(id); setCurrentView('detail'); }} 
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto bg-[#fdfcfb]">
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-[#fdfcfb]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('cellar')}>
          <div className="w-10 h-10 wine-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-900/10">
            <WineIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">VinoVault</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Your Personal Sommelier</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentView('add')}
          className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Plus size={20} />
        </button>
      </header>

      <main className="flex-1 px-6 pb-24 overflow-y-auto">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-4 z-40 max-w-2xl mx-auto flex justify-between items-center shadow-2xl rounded-t-3xl">
        <button 
          onClick={() => setCurrentView('cellar')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'cellar' ? 'text-red-900' : 'text-slate-400'}`}
        >
          <LayoutGrid size={24} />
          <span className="text-[10px] font-semibold">Cellar</span>
        </button>
        <button 
          onClick={() => setCurrentView('sommelier')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'sommelier' ? 'text-red-900' : 'text-slate-400'}`}
        >
          <MessageSquare size={24} />
          <span className="text-[10px] font-semibold">AI Sommelier</span>
        </button>
        <div className="relative -top-12">
           <button 
              onClick={() => setCurrentView('add')}
              className="w-14 h-14 wine-gradient text-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#fdfcfb] transform active:scale-95 transition-transform"
           >
             <Plus size={28} />
           </button>
        </div>
        <div className="w-12"></div>
      </nav>
    </div>
  );
};

export default App;
