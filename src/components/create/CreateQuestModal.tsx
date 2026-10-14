import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_NODES } from '../../data/campusNodes';
import { calculateFairReward } from '../../services/pricingService';
import { QuestCategory, EffortLevel } from '../../types';
import {
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const CreateQuestModal: React.FC = () => {
  const {
    isCreateModalOpen,
    closeCreateModal,
    currentUser,
    createQuest,
    preferences
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('food_drink');
  const [pickupId, setPickupId] = useState('stu_union');
  const [dropoffId, setDropoffId] = useState('lib_central');
  const [pickupDetail, setPickupDetail] = useState('');
  const [dropoffDetail, setDropoffDetail] = useState('');
  const [deadlineMinutes, setDeadlineMinutes] = useState(45);
  const [effortLevel, setEffortLevel] = useState<EffortLevel>('light');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customCredits, setCustomCredits] = useState<number | null>(null);

  // Compute fair recommendation dynamically
  const deadlineIso = useMemo(() => {
    return new Date(Date.now() + deadlineMinutes * 60000).toISOString();
  }, [deadlineMinutes]);

  const pricing = useMemo(() => {
    return calculateFairReward(pickupId, dropoffId, effortLevel, deadlineIso, preferences.transportMode);
  }, [pickupId, dropoffId, effortLevel, deadlineIso, preferences.transportMode]);

  // Actual offered credits: either custom or suggested
  const offeredCredits = customCredits !== null ? customCredits : pricing.totalCredits;

  const hasEnoughCredits = currentUser.creditBalance >= offeredCredits;

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    const res = createQuest({
      title: title.trim(),
      description: description.trim(),
      category,
      pickupLocationId: pickupId,
      dropoffLocationId: dropoffId,
      pickupDetail: pickupDetail.trim(),
      dropoffDetail: dropoffDetail.trim(),
      deadlineMinutes,
      effortLevel,
      offeredCredits,
      specialInstructions: specialInstructions.trim() || undefined
    });

    if (res.success) {
      // Reset form
      setTitle('');
      setDescription('');
      setPickupDetail('');
      setDropoffDetail('');
      setSpecialInstructions('');
      setCustomCredits(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus Errand Request</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Post a New Quest
            </h2>
          </div>

          <button
            onClick={closeCreateModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quest Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Pick up cold brew from Union & bring to Library 3rd floor"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Category & Effort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as QuestCategory)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="food_drink">☕ Food & Drink</option>
                <option value="academic_print">📚 Academic & Print</option>
                <option value="package_mail">📦 Package & Mail</option>
                <option value="dorm_supplies">🏠 Dorm Essentials</option>
                <option value="tech_lab">🔬 Tech & Lab</option>
                <option value="other">📋 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Package Effort Load
              </label>
              <select
                value={effortLevel}
                onChange={e => setEffortLevel(e.target.value as EffortLevel)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="light">Light (Coffee, envelope, keys)</option>
                <option value="medium">Medium (Groceries, textbook, meal)</option>
                <option value="heavy">Heavy (Multiple books, parcel, equipment)</option>
              </select>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup Location <span className="text-rose-500">*</span>
              </label>
              <select
                value={pickupId}
                onChange={e => setPickupId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CAMPUS_NODES.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={pickupDetail}
                onChange={e => setPickupDetail(e.target.value)}
                placeholder="Specific room, counter order #, or locker PIN"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 mt-1.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dropoff Destination <span className="text-rose-500">*</span>
              </label>
              <select
                value={dropoffId}
                onChange={e => setDropoffId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CAMPUS_NODES.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={dropoffDetail}
                onChange={e => setDropoffDetail(e.target.value)}
                placeholder="Specific room #, floor, study cubicle, or bench"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 mt-1.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description & Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What do you need picked up? Any specific instructions for the helper?"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Deadline Window */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Delivery Time Window</span>
              <span className="text-indigo-600 font-semibold">
                Within {deadlineMinutes} minutes
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[25, 45, 75, 120].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDeadlineMinutes(mins)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    deadlineMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* AI Fair Reward Suggestion & Customizer */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900">
                  Fair Algorithmic Reward Suggestion
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                Suggested: {pricing.totalCredits} cr
              </span>
            </div>

            <p className="text-[11px] text-indigo-800 leading-relaxed">
              {pricing.explanation}
            </p>

            <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-slate-700">
                Offered Bounty (Credits):
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={offeredCredits}
                  onChange={e => setCustomCredits(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-20 text-center font-bold text-sm bg-white border border-indigo-300 rounded-lg py-1 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setCustomCredits(null)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Escrow Guarantee Note */}
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your <strong className="text-slate-800 font-bold">{offeredCredits} credits</strong> will be safely locked in campus escrow and only transferred when you verify delivery.
            </p>
          </div>

          {!hasEnoughCredits && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                You have {currentUser.creditBalance} credits. Top up via the Faucet in your wallet or complete tasks to earn credits.
              </span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Wallet Balance: <strong className="text-slate-800">{currentUser.creditBalance} cr</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasEnoughCredits}
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition ${
                  hasEnoughCredits
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Post Quest ({offeredCredits} cr Escrow)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
