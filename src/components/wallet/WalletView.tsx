import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';
import {
  Wallet,
  Coins,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { currentUser, transactions, faucetTopUp } = useApp();
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

  // Filter transactions for this user
  const userTransactions = transactions.filter(t => t.userId === currentUser.id);

  const filtered = userTransactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  // Calculate lifetime earned and spent
  const lifetimeEarned = userTransactions
    .filter(t => t.type === 'reward_earned' || t.type === 'bonus_faucet')
    .reduce((acc, t) => acc + t.amount, 0);

  const lifetimeSpent = userTransactions
    .filter(t => t.type === 'escrow_released')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title & Faucet Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            <span>Virtual Credit Wallet</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Student-to-student micro-credits. Earn by assisting peers, spend to delegate campus errands.
          </p>
        </div>

        <button
          onClick={() => faucetTopUp(50)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95"
          title="Simulate receiving free demo campus credits"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Campus Faucet (+50 cr)</span>
        </button>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Spendable Balance */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Spendable Balance</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-indigo-950 tracking-tight">
              {currentUser.creditBalance}
            </span>
            <span className="text-sm font-bold text-indigo-600">cr</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Available immediately for new requests
          </p>
        </div>

        {/* Escrow Locked */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Held in Escrow</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-700 tracking-tight">
              {currentUser.inEscrowCredits}
            </span>
            <span className="text-sm font-bold text-amber-600">cr</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Reserved for your active posted quests
          </p>
        </div>

        {/* Lifetime Earned */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Earned</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-700 tracking-tight">
              +{lifetimeEarned}
            </span>
            <span className="text-sm font-bold text-emerald-600">cr</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Earned: +{lifetimeEarned} cr • Spent: -{lifetimeSpent} cr
          </p>
        </div>

        {/* Completed Tasks Count */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Errands Fulfilled</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {currentUser.completedQuestsCount}
            </span>
            <span className="text-sm font-bold text-slate-500">quests</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Campus helper credibility rating: <strong>{currentUser.rating} ★</strong>
          </p>
        </div>
      </div>

      {/* Escrow Mechanism Explainer Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Automated Trust & Escrow Guarantee</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          How Credits Flow Between Students
        </h3>
        <p className="text-xs sm:text-sm text-indigo-100/80 max-w-3xl leading-relaxed mb-6">
          To ensure fairness, credits are never directly debited until work is verified. We utilize an automated escrow protocol designed specifically for campus micro-tasks:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">1. Post Errand</span>
            <p className="text-indigo-200">Requester locks credits in escrow. Balance is safe from double spending.</p>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="font-bold text-indigo-300 block mb-1">2. Helper Accepts</span>
            <p className="text-indigo-200">A fellow student picks up the request or bundles it in a Quest Chain.</p>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="font-bold text-violet-300 block mb-1">3. Physical Delivery</span>
            <p className="text-indigo-200">Item is picked up and brought to the specified dorm room or study cubicle.</p>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="font-bold text-emerald-300 block mb-1">4. Release Escrow</span>
            <p className="text-indigo-200">Requester clicks Confirm, releasing the escrowed credits to the helper's wallet.</p>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Audit Ledger & Transaction History
            </h3>
            <p className="text-xs text-slate-500">
              Complete chronological record of all balance changes and escrow events
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'reward_earned', label: 'Rewards Earned' },
              { id: 'escrow_hold', label: 'Escrow Locks' },
              { id: 'escrow_released', label: 'Released' },
              { id: 'bonus_faucet', label: 'Faucet' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as TransactionType | 'all')}
                className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="divide-y divide-slate-100 mt-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No transactions matching this filter.
            </div>
          ) : (
            filtered.map(tx => {
              const isPositive = tx.type === 'reward_earned' || tx.type === 'bonus_faucet' || tx.type === 'escrow_refund';
              const isEscrow = tx.type === 'escrow_hold';

              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPositive
                          ? 'bg-emerald-50 text-emerald-600'
                          : isEscrow
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : isEscrow ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 leading-tight">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(tx.timestamp).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                        {tx.counterpartyName && ` • with ${tx.counterpartyName}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-black text-sm ${
                        isPositive
                          ? 'text-emerald-600'
                          : isEscrow
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {isPositive ? `+${tx.amount}` : `-${tx.amount}`} cr
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {tx.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
