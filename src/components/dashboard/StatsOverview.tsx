import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, Compass, CheckCircle2, Zap, ArrowUpRight, PlusCircle } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { currentUser, quests, setActiveTab, openCreateModal, faucetTopUp } = useApp();

  const availableQuests = quests.filter(q => q.status === 'available');
  const completedQuests = quests.filter(q => q.status === 'confirmed');
  const activeMyQuests = quests.filter(
    q => (q.helperId === currentUser.id || q.requesterId === currentUser.id) &&
         (q.status === 'accepted' || q.status === 'in_transit' || q.status === 'delivered')
  );

  // Highest available bounty
  const maxBounty = availableQuests.length > 0
    ? Math.max(...availableQuests.map(q => q.offeredCredits))
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Credit Balance Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Credit Balance</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentUser.creditBalance}
          </span>
          <span className="text-sm font-bold text-indigo-600">credits</span>
        </div>
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            {currentUser.inEscrowCredits > 0 ? `${currentUser.inEscrowCredits} in escrow` : '0 locked'}
          </span>
          <button
            onClick={() => faucetTopUp(50)}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition"
            title="Add test credits via demo faucet"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Faucet (+50)</span>
          </button>
        </div>
      </div>

      {/* 2. Available Quests */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Available Quests</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {availableQuests.length}
          </span>
          <span className="text-xs font-semibold text-slate-500">tasks on campus</span>
        </div>
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">Max bounty: <strong className="text-slate-800 font-bold">{maxBounty} cr</strong></span>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="inline-flex items-center gap-0.5 font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>Browse</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Active Errands */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Your Active Errands</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeMyQuests.length}
          </span>
          <span className="text-xs font-semibold text-slate-500">in progress</span>
        </div>
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            {currentUser.completedQuestsCount} lifetime done
          </span>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>+ New Quest</span>
          </button>
        </div>
      </div>

      {/* 4. Completed & Campus Efficiency */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider">Campus Efficiency</span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {completedQuests.length}
          </span>
          <span className="text-xs font-semibold text-slate-500">confirmed delivery</span>
        </div>
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">Chains boost: <strong className="text-emerald-600 font-bold">~38% saved</strong></span>
          <button
            onClick={() => setActiveTab('chains')}
            className="inline-flex items-center gap-0.5 font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>Chains</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
