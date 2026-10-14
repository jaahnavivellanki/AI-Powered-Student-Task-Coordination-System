import React from 'react';
import { useApp } from '../../context/AppContext';
import { getLocationById, getDistanceMeters } from '../../data/campusNodes';
import { CategoryBadge, StatusBadge, EffortBadge } from '../common/Badge';
import {
  X,
  Clock,
  Coins,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  User,
  Trash2
} from 'lucide-react';

export const QuestDetailsModal: React.FC = () => {
  const {
    selectedQuestModal,
    closeQuestModal,
    currentUser,
    acceptQuest,
    advanceQuestStatus,
    cancelQuest
  } = useApp();

  if (!selectedQuestModal) return null;

  const quest = selectedQuestModal;
  const pickupNode = getLocationById(quest.pickupLocationId);
  const dropoffNode = getLocationById(quest.dropoffLocationId);
  const distance = getDistanceMeters(quest.pickupLocationId, quest.dropoffLocationId);

  const isRequester = quest.requesterId === currentUser.id;
  const isHelper = quest.helperId === currentUser.id;

  const steps = [
    { key: 'available', label: 'Open', icon: Clock },
    { key: 'accepted', label: 'Accepted', icon: User },
    { key: 'in_transit', label: 'In Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: AlertCircle },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 }
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case 'available': return 0;
      case 'accepted': return 1;
      case 'in_transit': return 2;
      case 'delivered': return 3;
      case 'confirmed': return 4;
      default: return -1;
    }
  };

  const currentStepIdx = getStepIndex(quest.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={quest.category} />
              <StatusBadge status={quest.status} />
              <EffortBadge effort={quest.effortLevel} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {quest.title}
            </h2>
          </div>

          <button
            onClick={closeQuestModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Progress Tracker (if not cancelled) */}
          {quest.status !== 'cancelled' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between relative">
                {/* Connecting bar */}
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0"></div>
                <div
                  className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-300"
                  style={{ width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 92)}%` }}
                ></div>

                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={s.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-sm'
                            : isDone
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${
                        isCurrent ? 'text-indigo-600 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bounty and Escrow Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-indigo-950">{quest.offeredCredits}</span>
                  <span className="text-xs font-bold text-indigo-700">Credits Reward</span>
                </div>
                <p className="text-[11px] text-indigo-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {quest.status === 'confirmed'
                    ? 'Escrow successfully released to helper'
                    : 'Secured in automated campus escrow'}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <p>Estimated Transit</p>
              <p className="font-bold text-slate-800">~{quest.estimatedMinutes} mins ({distance}m)</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Quest Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              {quest.description}
            </p>
          </div>

          {/* Route Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Corridor & Locations
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pickup */}
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <span>Pickup Point</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{pickupNode.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{pickupNode.zone}</p>
                {quest.pickupDetail && (
                  <p className="text-xs font-medium text-indigo-900 bg-white p-2 rounded-lg mt-2 border border-indigo-100">
                    📍 {quest.pickupDetail}
                  </p>
                )}
              </div>

              {/* Dropoff */}
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <span>Dropoff Destination</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{dropoffNode.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{dropoffNode.zone}</p>
                {quest.dropoffDetail && (
                  <p className="text-xs font-medium text-emerald-900 bg-white p-2 rounded-lg mt-2 border border-emerald-100">
                    🎯 {quest.dropoffDetail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Special Instructions if any */}
          {quest.specialInstructions && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1">
                ⚠️ Special Requester Instructions:
              </span>
              <p className="text-amber-800 leading-relaxed">
                {quest.specialInstructions}
              </p>
            </div>
          )}

          {/* Participants */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <img
                src={quest.requesterAvatar}
                alt={quest.requesterName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-[10px] text-slate-400">Requester</p>
                <p className="font-bold text-slate-800">{quest.requesterName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              {quest.helperName ? (
                <>
                  <img
                    src={quest.helperAvatar}
                    alt={quest.helperName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[10px] text-slate-400">Assigned Helper</p>
                    <p className="font-bold text-slate-800">{quest.helperName}</p>
                  </div>
                </>
              ) : (
                <div className="py-1">
                  <p className="text-[10px] text-slate-400">Assigned Helper</p>
                  <p className="font-semibold text-slate-500 italic">None yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span>Deadline:</span>
              <span className="font-semibold text-slate-700">
                {new Date(quest.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(quest.deadline).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Posted:</span>
              <span>{new Date(quest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {quest.acceptedAt && (
              <div className="flex items-center justify-between">
                <span>Accepted:</span>
                <span>{new Date(quest.acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
            {quest.deliveredAt && (
              <div className="flex items-center justify-between">
                <span>Delivered:</span>
                <span>{new Date(quest.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {quest.status === 'available' && isRequester && (
              <button
                onClick={() => {
                  cancelQuest(quest.id);
                  closeQuestModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-100/60 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Cancel Quest (Refund {quest.offeredCredits} cr)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={closeQuestModal}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Close
            </button>

            {quest.status === 'available' && !isRequester && (
              <button
                onClick={() => acceptQuest(quest.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition active:scale-95"
              >
                <span>Accept Quest (+{quest.offeredCredits} cr)</span>
              </button>
            )}

            {quest.status === 'accepted' && isHelper && (
              <button
                onClick={() => advanceQuestStatus(quest.id, 'in_transit')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition active:scale-95"
              >
                <Truck className="w-4 h-4" />
                <span>Mark Picked Up & In Transit</span>
              </button>
            )}

            {quest.status === 'in_transit' && isHelper && (
              <button
                onClick={() => advanceQuestStatus(quest.id, 'delivered')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md transition active:scale-95"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Mark Delivered</span>
              </button>
            )}

            {quest.status === 'delivered' && isRequester && (
              <button
                onClick={() => advanceQuestStatus(quest.id, 'confirmed')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Delivery & Release {quest.offeredCredits} cr</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
