import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestChain } from '../../types';
import { ChainRouteVisualizer } from './ChainRouteVisualizer';
import { getLocationById } from '../../data/campusNodes';
import { CategoryBadge } from '../common/Badge';
import {
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  Leaf,
  TrendingUp,
  CheckCircle2,
  Info
} from 'lucide-react';

interface ChainCardProps {
  chain: QuestChain;
}

export const ChainCard: React.FC<ChainCardProps> = ({ chain }) => {
  const { acceptChain } = useApp();
  const [showRoute, setShowRoute] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Banner with Highlights */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 flex items-center gap-1.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>{chain.quests.length} Bundled Errands</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{chain.efficiencyScore}% Efficiency</span>
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
              +{chain.totalRewardCredits}
            </span>
            <span className="text-sm font-bold text-amber-200">credits</span>
          </div>
        </div>

        {/* Savings Metrics Row */}
        <div className="mt-4 pt-3 border-t border-indigo-700/50 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Saves ~{chain.savedMinutes} mins</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>{chain.carbonSavedGrams}g CO₂ avoided</span>
            </span>
          </div>
          <span className="text-[11px] text-indigo-300">
            Total journey: ~{chain.totalEstimatedMinutes} mins (vs {chain.standaloneEstimatedMinutes} mins separate)
          </span>
        </div>
      </div>

      {/* Rationale & Compatibility Explanation Box */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-indigo-900 mb-0.5">
              Why this chain was bundled:
            </p>
            <p className="text-indigo-800 leading-relaxed">
              {chain.compatibilityReason}
            </p>
          </div>
        </div>

        {/* Included Tasks Preview */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Quests in this Journey:
          </h4>

          <div className="space-y-2">
            {chain.quests.map((quest, idx) => {
              const pLoc = getLocationById(quest.pickupLocationId);
              const dLoc = getLocationById(quest.dropoffLocationId);

              return (
                <div
                  key={quest.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                      #{idx + 1}
                    </span>
                    <img
                      src={quest.requesterAvatar}
                      alt={quest.requesterName}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">
                        {quest.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {pLoc.name.split(' ')[0]} <span className="text-slate-400">→</span> {dLoc.name.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0">
                    <CategoryBadge category={quest.category} />
                    <span className="font-extrabold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100 shadow-2xs">
                      +{quest.offeredCredits} cr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Route Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowRoute(!showRoute)}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <span>{showRoute ? 'Hide Waypoint Sequence' : 'Inspect Optimized Waypoint Sequence'}</span>
            {showRoute ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRoute && (
            <div className="mt-3 pt-2">
              <ChainRouteVisualizer stops={chain.stops} />
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 text-center sm:text-left">
          <span>Detour overhead: </span>
          <strong className="text-slate-700 font-semibold">+{chain.detourMinutes} mins</strong>
          <span> (well within your preference limits)</span>
        </div>

        <button
          onClick={() => acceptChain(chain)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Claim Entire Quest Chain (+{chain.totalRewardCredits} cr)</span>
        </button>
      </div>
    </div>
  );
};
