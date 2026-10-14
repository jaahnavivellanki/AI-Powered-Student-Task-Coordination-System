import React from 'react';
import { useApp } from '../../context/AppContext';
import { Quest } from '../../types';
import { getLocationById, getDistanceMeters } from '../../data/campusNodes';
import { CategoryBadge, StatusBadge, EffortBadge } from '../common/Badge';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  Trash2
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const {
    currentUser,
    openQuestModal,
    acceptQuest,
    advanceQuestStatus,
    cancelQuest
  } = useApp();

  const pickupNode = getLocationById(quest.pickupLocationId);
  const dropoffNode = getLocationById(quest.dropoffLocationId);
  const distanceMeters = getDistanceMeters(quest.pickupLocationId, quest.dropoffLocationId);

  const isRequester = quest.requesterId === currentUser.id;
  const isHelper = quest.helperId === currentUser.id;

  // Deadline calculation
  const deadlineDate = new Date(quest.deadline);
  const diffMinutes = Math.round((deadlineDate.getTime() - Date.now()) / 60000);
  const isUrgent = diffMinutes > 0 && diffMinutes <= 45;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Bar with Avatar, Badges, and Bounty */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={quest.requesterAvatar}
              alt={quest.requesterName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">
                  {quest.requesterName}
                </span>
                {isRequester && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                    You
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {pickupNode.zone}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100/80 border border-indigo-200 text-indigo-950 font-extrabold shadow-2xs">
              <span className="text-base sm:text-lg">{quest.offeredCredits}</span>
              <span className="text-xs font-bold text-indigo-700">cr</span>
            </div>
            {isUrgent && quest.status === 'available' && (
              <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                Urgent ({diffMinutes}m left)
              </p>
            )}
          </div>
        </div>

        {/* Categories & Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <CategoryBadge category={quest.category} />
          <StatusBadge status={quest.status} />
          <EffortBadge effort={quest.effortLevel} />
        </div>

        {/* Quest Title & Description */}
        <h3
          onClick={() => openQuestModal(quest)}
          className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
        >
          {quest.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {quest.description}
        </p>
      </div>

      {/* Transit Route Information */}
      <div className="px-5 py-3 bg-slate-50/60 border-t border-b border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{quest.estimatedMinutes} min transit</span>
          </span>
          <span>{distanceMeters} meters</span>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <div className="flex items-center gap-1.5 font-medium truncate flex-1" title={pickupNode.name}>
            <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></div>
            <span className="truncate">{pickupNode.name.split(' ')[0]} {pickupNode.name.split(' ')[1] || ''}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 font-medium truncate flex-1 text-right justify-end" title={dropoffNode.name}>
            <span className="truncate">{dropoffNode.name.split(' ')[0]} {dropoffNode.name.split(' ')[1] || ''}</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
          </div>
        </div>

        {/* Detail snippets if available */}
        {(quest.pickupDetail || quest.dropoffDetail) && (
          <div className="mt-2 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between truncate">
            <span className="truncate">
              📍 {quest.pickupDetail || quest.dropoffDetail}
            </span>
          </div>
        )}

        {/* Helper info if accepted */}
        {quest.helperName && quest.status !== 'available' && (
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
            <span className="font-medium text-slate-400">Coordinated by:</span>
            <div className="flex items-center gap-1.5">
              <img
                src={quest.helperAvatar}
                alt={quest.helperName}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="font-semibold text-slate-800">
                {isHelper ? 'You' : quest.helperName}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Action Controls */}
      <div className="p-4 bg-white flex items-center justify-between gap-2">
        <button
          onClick={() => openQuestModal(quest)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Action State: AVAILABLE */}
          {quest.status === 'available' && (
            <>
              {isRequester ? (
                <button
                  onClick={() => cancelQuest(quest.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                  title="Cancel this quest and refund escrow"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              ) : (
                <button
                  onClick={() => acceptQuest(quest.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition active:scale-95"
                >
                  <span>Accept (+{quest.offeredCredits} cr)</span>
                </button>
              )}
            </>
          )}

          {/* Action State: ACCEPTED */}
          {quest.status === 'accepted' && (
            <>
              {isHelper ? (
                <button
                  onClick={() => advanceQuestStatus(quest.id, 'in_transit')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition active:scale-95"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Mark Picked Up</span>
                </button>
              ) : (
                <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Helper on the way
                </span>
              )}
            </>
          )}

          {/* Action State: IN TRANSIT */}
          {quest.status === 'in_transit' && (
            <>
              {isHelper ? (
                <button
                  onClick={() => advanceQuestStatus(quest.id, 'delivered')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition active:scale-95"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Mark Delivered</span>
                </button>
              ) : (
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> In Transit
                </span>
              )}
            </>
          )}

          {/* Action State: DELIVERED (Pending Confirmation) */}
          {quest.status === 'delivered' && (
            <>
              {isRequester ? (
                <button
                  onClick={() => advanceQuestStatus(quest.id, 'confirmed')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 transition active:scale-95 animate-pulse-subtle"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Release</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Awaiting Confirmation
                </span>
              )}
            </>
          )}

          {/* Action State: CONFIRMED */}
          {quest.status === 'confirmed' && (
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
