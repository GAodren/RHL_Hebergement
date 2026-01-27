import { useState } from 'react';
import { User, FileText } from 'lucide-react';
import Profil from './Profil';
import MesEstimations from './MesEstimations';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('estimations');

  const tabs = [
    { id: 'estimations', label: 'Mes estimations', icon: FileText },
    { id: 'profil', label: 'Mon profil', icon: User },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Barre de navigation des onglets */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-4 font-medium text-sm border-b-2 transition-colors
                    ${isActive
                      ? 'border-[#0077B6] text-[#0077B6]'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div>
        {activeTab === 'estimations' && <MesEstimations />}
        {activeTab === 'profil' && <ProfilContent />}
      </div>
    </main>
  );
}

// Composant pour afficher le profil sans le wrapper main
function ProfilContent() {
  return <Profil embedded />;
}
