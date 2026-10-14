import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatsOverview } from './StatsOverview';
import { CampusZoneMap } from './CampusZoneMap';
import { getLocationById } from '../../data/campusNodes';
import { CategoryBadge } from '../common/Badge';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Activity,
  GitMerge,
  Plus
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    quests,
    transactions,
    setActiveTab,
    openCreateModal,
    openQuestModal
  } = useApp();

  const userLocation = getLocationById(currentUser.currentZoneId);

  // Available quests nearby or urgent
  const availableQuests = quests
    .filter(q => q.status === 'available' && q.requesterId !== currentUser.id)
    .slice(0, 3);

  // Recent transactions/activity
  const recentActivities = transactions.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        {/* Subtle decorative grid/glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Campus Peer Coordination Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hello, {currentUser.name}!
            </h1>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              You are currently based near <strong className="text-white">{userLocation.name}</strong>. Earn credits by picking up errands on your walk, or spend them when you need study support.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 text-sm font-bold shadow-md hover:bg-indigo-50 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Errand</span>
            </button>
            <button
              onClick={() => setActiveTab('chains')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-semibold border border-indigo-400/30 transition backdrop-blur-sm active:scale-95"
            >
              <GitMerge className="w-4 h-4" />
              <span>Explore Chains</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsOverview />

      {/* Interactive 2D Campus Map */}
      <CampusZoneMap />

      {/* Two Columns: Available Opportunities & Campus Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Tasks in Vicinity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Open Quests Near You
                  </h3>
                  <p className="text-xs text-slate-500">Pick up errands along your daily route</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {availableQuests.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No open quests currently available. Check back soon or post one!
                </div>
              ) : (
                availableQuests.map(quest => {
                  const pLoc = getLocationById(quest.pickupLocationId);
                  const dLoc = getLocationById(quest.dropoffLocationId);

                  return (
                    <div
                      key={quest.id}
                      onClick={() => openQuestModal(quest)}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/50 hover:bg-white cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CategoryBadge category={quest.category} />
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {quest.estimatedMinutes}m walk
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                            {quest.title}
                          </h4>
                          <p className="text-xs text-slate-600">
                            {pLoc.name} <span className="text-slate-400">→</span> {dLoc.name}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-xs">
                            +{quest.offeredCredits} cr
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            by {quest.requesterName.split(' ')[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Combine compatible requests for maximum efficiency.</span>
            <button
              onClick={() => setActiveTab('chains')}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Run Chain Bundler →
            </button>
          </div>
        </div>

        {/* Live Campus Ledger & Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Recent Campus Activity
                  </h3>
                  <p className="text-xs text-slate-500">Live credits & task coordination stream</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('wallet')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
              >
                <span>Wallet Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentActivities.map(item => {
                const isEarned = item.type === 'reward_earned';
                const isFaucet = item.type === 'bonus_faucet';
                const isEscrow = item.type === 'escrow_hold';

                return (
                  <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {item.counterpartyName && ` • with ${item.counterpartyName}`}
                      </p>
                    </div>

                    <span
                      className={`font-bold shrink-0 text-xs px-2 py-0.5 rounded-md ${
                        isEarned || isFaucet
                          ? 'bg-emerald-50 text-emerald-700'
                          : isEscrow
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isEarned || isFaucet ? `+${item.amount} cr` : `-${item.amount} cr`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Escrow protects all requesters until verified delivery.</span>
            <span className="font-medium text-emerald-600">● 100% Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
