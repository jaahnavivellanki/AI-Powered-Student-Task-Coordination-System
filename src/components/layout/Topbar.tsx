import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Coins, Lock, Star, Sparkles, Sliders } from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    currentUser,
    openCreateModal,
    setActiveTab,
    openPreferencesModal
  } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Title or Desktop Breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              SynchroCampus
            </span>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Campus Network Active</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-700">Fall Term Campus Hub</span>
            </div>
          </div>
        </div>

        {/* Right: Wallet, Post Quest, User Avatar */}
        <div className="flex items-center gap-3">
          {/* Wallet Balance Pill */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 transition group"
            title="View virtual credit wallet and transactions"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              <Coins className="w-3 h-3 text-indigo-100 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-indigo-950">
                {currentUser.creditBalance}
              </span>
              <span className="text-[11px] font-semibold text-indigo-700">cr</span>
            </div>

            {currentUser.inEscrowCredits > 0 && (
              <div
                className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-indigo-200 text-[11px] text-amber-700 font-medium"
                title={`${currentUser.inEscrowCredits} credits currently held in escrow`}
              >
                <Lock className="w-2.5 h-2.5 text-amber-600" />
                <span>{currentUser.inEscrowCredits} locked</span>
              </div>
            )}
          </button>

          {/* Quick Preferences button for mobile/tablet */}
          <button
            onClick={openPreferencesModal}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            title="Helper Preferences"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Post Quest CTA */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Post Quest</span>
          </button>

          {/* Active Student Avatar Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden xl:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </span>
                <span className="flex items-center text-[10px] text-amber-600 font-semibold">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 ml-0.5" />
                  {currentUser.rating}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {currentUser.major}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
