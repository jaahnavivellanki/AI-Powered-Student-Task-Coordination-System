import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { generateQuestChains } from '../../services/routeOptimization';
import { ChainCard } from './ChainCard';
import {
  GitMerge,
  Sparkles,
  Sliders,
  Zap
} from 'lucide-react';

export const QuestChainsView: React.FC = () => {
  const { quests, preferences, currentUser, openPreferencesModal, openCreateModal } = useApp();

  const chains = useMemo(() => {
    return generateQuestChains(quests, preferences, currentUser.id);
  }, [quests, preferences, currentUser.id]);

  const totalPossibleCredits = chains.reduce((acc, c) => acc + c.totalRewardCredits, 0);
  const totalMinutesSaved = chains.reduce((acc, c) => acc + c.savedMinutes, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Deterministic Route Clustering</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GitMerge className="w-6 h-6 text-indigo-600" />
            <span>Intelligent Quest Chains</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Multi-task errand bundling engine that groups compatible tasks along shared campus pathways to minimize backtracking and maximize your hourly credit yield.
          </p>
        </div>

        <button
          onClick={openPreferencesModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition"
        >
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Helper Preferences</span>
        </button>
      </div>

      {/* Helper Context Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <span>
            Mode: <strong className="text-slate-800 capitalize font-bold">{preferences.transportMode}</strong>
          </span>
          <span>•</span>
          <span>
            Max Detour: <strong className="text-slate-800 font-bold">≤ {preferences.maxDetourMinutes} min</strong>
          </span>
          <span>•</span>
          <span>
            Max Tasks: <strong className="text-slate-800 font-bold">{preferences.maxTasksPerJourney} per journey</strong>
          </span>
          {totalMinutesSaved > 0 && (
            <>
              <span>•</span>
              <span className="text-emerald-700 font-bold">
                Potential Savings: ~{totalMinutesSaved} mins ({totalPossibleCredits} cr total)
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {chains.length} Optimal {chains.length === 1 ? 'Bundle' : 'Bundles'} Available
          </span>
        </div>
      </div>

      {/* How it works educational box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/60 to-purple-50/60 border border-indigo-100 text-xs text-slate-700">
        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-900">
              Transparent Graph Scoring (No Fake AI)
            </p>
            <p className="text-slate-600 leading-relaxed">
              Quest Chains solves a multi-stop Traveling Salesperson problem across our campus waypoint graph with precedence constraints (every item must be picked up before its destination). Bundles are formed only when combined transit saves at least 4 minutes compared to separate trips.
            </p>
          </div>
        </div>
      </div>

      {/* Chains List */}
      {chains.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <GitMerge className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Compatible Chains Currently Available
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            There are currently not enough overlapping errands in the same corridor that satisfy your maximum detour threshold of {preferences.maxDetourMinutes} minutes.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={openPreferencesModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Increase Max Detour
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
            >
              Post a New Errand
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {chains.map(chain => (
            <ChainCard key={chain.id} chain={chain} />
          ))}
        </div>
      )}
    </div>
  );
};
