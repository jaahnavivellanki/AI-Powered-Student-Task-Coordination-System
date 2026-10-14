import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  GitMerge,
  Calculator,
  Wallet,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { NavigationTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    quests,
    currentUser,
    users,
    switchUser,
    preferences,
    updatePreferences,
    openPreferencesModal,
    resetAllData
  } = useApp();

  const availableCount = quests.filter(q => q.status === 'available').length;
  const myActiveCount = quests.filter(
    q => (q.helperId === currentUser.id || q.requesterId === currentUser.id) &&
         (q.status === 'accepted' || q.status === 'in_transit' || q.status === 'delivered')
  ).length;

  const navItems: { tab: NavigationTab; label: string; icon: React.ElementType; badge?: string | number; highlight?: boolean }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'marketplace', label: 'Quest Marketplace', icon: Compass, badge: availableCount },
    { tab: 'chains', label: 'Quest Chains', icon: GitMerge, badge: 'Smart', highlight: true },
    { tab: 'calculator', label: 'Reward Estimator', icon: Calculator },
    { tab: 'wallet', label: 'Credit Wallet', icon: Wallet }
  ];

  const toggleSound = () => {
    updatePreferences({
      ...preferences,
      soundEnabled: !preferences.soundEnabled
    });
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight flex items-center gap-1.5">
              SynchroCampus
            </h1>
            <p className="text-[11px] font-medium text-indigo-600 tracking-wide uppercase">
              Student Errand Sync
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Campus Navigation
        </p>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-900 font-semibold shadow-sm border border-indigo-100/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    item.highlight
                      ? 'bg-indigo-600 text-white'
                      : isActive
                      ? 'bg-indigo-200/60 text-indigo-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Live Active Tasks pill */}
        {myActiveCount > 0 && (
          <div className="pt-3 px-1">
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                <span>Active Errands</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                You have {myActiveCount} task(s) in progress or awaiting confirmation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Switch Student Persona widget */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Active Persona
          </span>
          <span className="text-[10px] text-indigo-600 font-medium">Demo Switcher</span>
        </div>
        <div className="relative">
          <select
            value={currentUser.id}
            onChange={e => switchUser(e.target.value)}
            className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none pr-7 shadow-xs"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.major.split(' ')[0]} - {u.creditBalance} cr)
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Bottom utility controls */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <button
            onClick={openPreferencesModal}
            className="flex items-center gap-1.5 hover:text-slate-800 transition py-1"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Preferences</span>
          </button>
          <button
            onClick={toggleSound}
            title={preferences.soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="p-1 rounded-md hover:bg-slate-200/60 text-slate-500 transition"
          >
            {preferences.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo tasks, balances, and ledger to original university seed state?')) {
              resetAllData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-rose-600 py-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
