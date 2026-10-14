import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_NODES } from '../../data/campusNodes';
import { calculateFairReward } from '../../services/pricingService';
import { EffortLevel, TransportMode } from '../../types';
import {
  Calculator,
  Sparkles,
  Plus
} from 'lucide-react';

export const RewardCalculator: React.FC = () => {
  const { openCreateModal, preferences } = useApp();

  const [pickupId, setPickupId] = useState<string>('stu_union');
  const [dropoffId, setDropoffId] = useState<string>('lib_central');
  const [effort, setEffort] = useState<EffortLevel>('light');
  const [urgencyMinutes, setUrgencyMinutes] = useState<number>(45);
  const [mode, setMode] = useState<TransportMode>(preferences.transportMode || 'walking');

  const deadlineIso = useMemo(() => {
    return new Date(Date.now() + urgencyMinutes * 60000).toISOString();
  }, [urgencyMinutes]);

  const pricing = useMemo(() => {
    return calculateFairReward(pickupId, dropoffId, effort, deadlineIso, mode);
  }, [pickupId, dropoffId, effort, deadlineIso, mode]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Algorithmic Fair Compensation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-indigo-600" />
          <span>Fair Reward Estimator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Transparent student-to-student dynamic pricing formula. Calculates equitable credit bounties based on walking distances, physical load, and real-time deadline urgency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
            Journey Parameters
          </h2>

          {/* Pickup and Dropoff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pickup Location
              </label>
              <select
                value={pickupId}
                onChange={e => setPickupId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CAMPUS_NODES.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dropoff Destination
              </label>
              <select
                value={dropoffId}
                onChange={e => setDropoffId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CAMPUS_NODES.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Effort Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Physical Effort / Package Load
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', desc: 'Coffee, notes, key' },
                { id: 'medium', label: 'Medium', desc: 'Backpack, meals' },
                { id: 'heavy', label: 'Heavy', desc: 'Books, heavy boxes' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEffort(item.id as EffortLevel)}
                  className={`p-3 rounded-xl border text-left transition ${
                    effort === item.id
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 text-indigo-950'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-xs">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Deadline / Urgency */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Deadline Urgency</span>
              <span className="text-indigo-600">
                {urgencyMinutes <= 30
                  ? `Rush (${urgencyMinutes} mins - 1.45x Surge)`
                  : urgencyMinutes <= 75
                  ? `Prompt (${urgencyMinutes} mins - 1.20x Surge)`
                  : `Relaxed (${urgencyMinutes} mins - 1.0x)`}
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="180"
              step="5"
              value={urgencyMinutes}
              onChange={e => setUrgencyMinutes(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15 min (Rush)</span>
              <span>60 min (Standard)</span>
              <span>180 min (Flexible)</span>
            </div>
          </div>

          {/* Transport Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Calculated for Transport Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'walking', label: '🚶 Walking' },
                { id: 'bicycle', label: '🚲 Bicycle' },
                { id: 'scooter', label: '🛴 Scooter' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as TransportMode)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                    mode === m.id
                      ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Output Card */}
        <div className="md:col-span-5 flex flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-300">
                Fair Algorithmic Result
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-black text-amber-300 tracking-tight">
                  {pricing.totalCredits}
                </span>
                <span className="text-base font-bold text-amber-200">Credits</span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                Estimated Transit: ~{pricing.transitMinutes} mins ({pricing.distanceMeters}m walk)
              </p>
            </div>

            {/* Itemized Mathematical Formula */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2.5 text-xs backdrop-blur-xs">
              <p className="font-bold text-indigo-200 uppercase tracking-wider text-[10px] pb-1 border-b border-white/10">
                Formula Breakdown:
              </p>

              <div className="flex items-center justify-between text-indigo-100">
                <span>Base errand bounty</span>
                <span className="font-bold text-white">+{pricing.baseCredits} cr</span>
              </div>

              <div className="flex items-center justify-between text-indigo-100">
                <span>Distance (~{pricing.distanceMeters}m)</span>
                <span className="font-bold text-white">+{pricing.distanceCredits} cr</span>
              </div>

              <div className="flex items-center justify-between text-indigo-100">
                <span>Effort ({effort})</span>
                <span className="font-bold text-white">+{pricing.effortCredits} cr</span>
              </div>

              {pricing.urgencySurgeCredits > 0 && (
                <div className="flex items-center justify-between text-amber-300 font-semibold pt-1 border-t border-white/10">
                  <span>Urgency Surge ({pricing.urgencyMultiplier}x)</span>
                  <span className="font-bold">+{pricing.urgencySurgeCredits} cr</span>
                </div>
              )}
            </div>

            {/* Explanation Note */}
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/20 text-[11px] text-indigo-200 leading-relaxed">
              {pricing.explanation}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={openCreateModal}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Quest with this Reward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
