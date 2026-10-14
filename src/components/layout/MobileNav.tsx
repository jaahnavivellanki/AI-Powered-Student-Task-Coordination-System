import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { LayoutDashboard, Compass, GitMerge, Calculator, Wallet } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, quests } = useApp();
  const availableCount = quests.filter(q => q.status === 'available').length;

  const items: { tab: NavigationTab; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { tab: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { tab: 'marketplace', label: 'Market', icon: Compass, badge: availableCount },
    { tab: 'chains', label: 'Chains', icon: GitMerge, badge: 'AI' },
    { tab: 'calculator', label: 'Estimator', icon: Calculator },
    { tab: 'wallet', label: 'Wallet', icon: Wallet }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.tab;

        return (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors relative ${
              isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-extrabold bg-indigo-600 text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
