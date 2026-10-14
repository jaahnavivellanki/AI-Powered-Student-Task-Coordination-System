import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Quest,
  Transaction,
  HelperPreferences,
  QuestStatus,
  QuestChain,
  EffortLevel,
  QuestCategory
} from '../types';
import { storageService } from '../services/storageService';
import { soundEffects } from '../services/audioService';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type NavigationTab = 'dashboard' | 'marketplace' | 'chains' | 'wallet' | 'calculator';

interface CreateQuestInput {
  title: string;
  description: string;
  category: QuestCategory;
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDetail: string;
  dropoffDetail: string;
  deadlineMinutes: number;
  effortLevel: EffortLevel;
  offeredCredits: number;
  specialInstructions?: string;
}

interface AppContextType {
  users: User[];
  currentUser: User;
  quests: Quest[];
  transactions: Transaction[];
  preferences: HelperPreferences;
  activeTab: NavigationTab;
  toasts: ToastItem[];
  selectedQuestModal: Quest | null;
  isCreateModalOpen: boolean;
  isPreferencesModalOpen: boolean;
  setActiveTab: (tab: NavigationTab) => void;
  switchUser: (userId: string) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;
  openQuestModal: (quest: Quest) => void;
  closeQuestModal: () => void;
  createQuest: (input: CreateQuestInput) => { success: boolean; error?: string };
  acceptQuest: (questId: string) => void;
  acceptChain: (chain: QuestChain) => void;
  advanceQuestStatus: (questId: string, nextStatus: QuestStatus) => void;
  cancelQuest: (questId: string) => void;
  updatePreferences: (newPrefs: HelperPreferences) => void;
  faucetTopUp: (amount?: number) => void;
  resetAllData: () => void;
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => storageService.getCurrentUserId());
  const [quests, setQuests] = useState<Quest[]>(() => storageService.getQuests());
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getTransactions());
  const [preferences, setPreferences] = useState<HelperPreferences>(() => storageService.getPreferences());

  const [activeTab, setActiveTabState] = useState<NavigationTab>('dashboard');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [selectedQuestModal, setSelectedQuestModal] = useState<Quest | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  // Sync with sound service
  useEffect(() => {
    soundEffects.setEnabled(preferences.soundEnabled);
  }, [preferences.soundEnabled]);

  // Persistent storage auto-save
  useEffect(() => {
    storageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    storageService.saveQuests(quests);
  }, [quests]);

  useEffect(() => {
    storageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    storageService.savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    storageService.setCurrentUserId(currentUserId);
  }, [currentUserId]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTab = (tab: NavigationTab) => {
    soundEffects.playClick();
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    setCurrentUserId(userId);
    soundEffects.playClick();
    addToast('Persona Switched', `Now viewing as ${target.name} (${target.major})`, 'info');
  };

  const openCreateModal = () => {
    soundEffects.playClick();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openPreferencesModal = () => {
    soundEffects.playClick();
    setIsPreferencesModalOpen(true);
  };

  const closePreferencesModal = () => {
    setIsPreferencesModalOpen(false);
  };

  const openQuestModal = (quest: Quest) => {
    soundEffects.playClick();
    // Refresh modal quest from current state
    const fresh = quests.find(q => q.id === quest.id) || quest;
    setSelectedQuestModal(fresh);
  };

  const closeQuestModal = () => {
    setSelectedQuestModal(null);
  };

  const createQuest = (input: CreateQuestInput): { success: boolean; error?: string } => {
    if (currentUser.creditBalance < input.offeredCredits) {
      addToast(
        'Insufficient Credits',
        `You have ${currentUser.creditBalance} cr, but this quest requires ${input.offeredCredits} cr in escrow.`,
        'error'
      );
      return { success: false, error: 'Insufficient credits in wallet' };
    }

    const questId = `q-${Date.now().toString(36)}`;
    const deadlineIso = new Date(Date.now() + input.deadlineMinutes * 60000).toISOString();

    const newQuest: Quest = {
      id: questId,
      title: input.title,
      description: input.description,
      category: input.category,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      pickupLocationId: input.pickupLocationId,
      dropoffLocationId: input.dropoffLocationId,
      pickupDetail: input.pickupDetail,
      dropoffDetail: input.dropoffDetail,
      deadline: deadlineIso,
      effortLevel: input.effortLevel,
      estimatedMinutes: Math.max(5, Math.round(input.deadlineMinutes / 3)),
      offeredCredits: input.offeredCredits,
      status: 'available',
      createdAt: new Date().toISOString(),
      specialInstructions: input.specialInstructions
    };

    // Update Requester: lock offeredCredits into escrow
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? {
              ...u,
              creditBalance: u.creditBalance - input.offeredCredits,
              inEscrowCredits: u.inEscrowCredits + input.offeredCredits
            }
          : u
      )
    );

    // Add Escrow Hold transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      type: 'escrow_hold',
      amount: input.offeredCredits,
      questId: newQuest.id,
      questTitle: newQuest.title,
      counterpartyName: 'Escrow Lock',
      description: `${input.offeredCredits} credits held in escrow for "${newQuest.title}"`
    };

    setQuests(prev => [newQuest, ...prev]);
    setTransactions(prev => [newTx, ...prev]);
    setIsCreateModalOpen(false);

    soundEffects.playCoin();
    addToast('Quest Posted!', `${input.offeredCredits} credits locked in escrow. Looking for campus helpers.`, 'success');

    return { success: true };
  };

  const acceptQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    if (quest.requesterId === currentUser.id) {
      addToast('Cannot Self-Accept', 'You cannot accept your own requested quest.', 'warning');
      return;
    }

    if (quest.status !== 'available') {
      addToast('Quest Unavailable', 'This quest is no longer available.', 'error');
      return;
    }

    const updated = quests.map(q =>
      q.id === questId
        ? {
            ...q,
            status: 'accepted' as QuestStatus,
            helperId: currentUser.id,
            helperName: currentUser.name,
            helperAvatar: currentUser.avatar,
            acceptedAt: new Date().toISOString()
          }
        : q
    );

    setQuests(updated);
    if (selectedQuestModal?.id === questId) {
      setSelectedQuestModal(updated.find(q => q.id === questId) || null);
    }

    soundEffects.playSuccess();
    addToast('Quest Accepted!', `You are now coordinating "${quest.title}". Head to pickup location!`, 'success');
  };

  const acceptChain = (chain: QuestChain) => {
    const eligible = chain.quests.filter(q => q.status === 'available' && q.requesterId !== currentUser.id);
    if (eligible.length === 0) {
      addToast('Chain Unavailable', 'Tasks in this chain have already been claimed.', 'warning');
      return;
    }

    const eligibleIds = new Set(eligible.map(e => e.id));
    const nowIso = new Date().toISOString();

    const updated = quests.map(q => {
      if (eligibleIds.has(q.id)) {
        return {
          ...q,
          status: 'accepted' as QuestStatus,
          helperId: currentUser.id,
          helperName: currentUser.name,
          helperAvatar: currentUser.avatar,
          acceptedAt: nowIso
        };
      }
      return q;
    });

    setQuests(updated);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    soundEffects.playSuccess();
    addToast(
      'Quest Chain Claimed!',
      `You accepted ${eligible.length} bundled errands worth ${chain.totalRewardCredits} credits!`,
      'success'
    );
  };

  const advanceQuestStatus = (questId: string, nextStatus: QuestStatus) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const nowIso = new Date().toISOString();

    if (nextStatus === 'confirmed') {
      // RELEASE ESCROW: Transfer credits from Requester to Helper
      const requesterId = quest.requesterId;
      const helperId = quest.helperId;
      const amount = quest.offeredCredits;

      if (!helperId) return;

      setUsers(prev =>
        prev.map(u => {
          if (u.id === requesterId) {
            return {
              ...u,
              inEscrowCredits: Math.max(0, u.inEscrowCredits - amount),
              requestedQuestsCount: u.requestedQuestsCount + 1
            };
          }
          if (u.id === helperId) {
            return {
              ...u,
              creditBalance: u.creditBalance + amount,
              completedQuestsCount: u.completedQuestsCount + 1
            };
          }
          return u;
        })
      );

      // Ledger entries
      const helperTx: Transaction = {
        id: `tx-${Date.now()}-h`,
        timestamp: nowIso,
        userId: helperId,
        type: 'reward_earned',
        amount: amount,
        questId: quest.id,
        questTitle: quest.title,
        counterpartyName: quest.requesterName,
        description: `Earned +${amount} credits for completing "${quest.title}"`
      };

      const requesterTx: Transaction = {
        id: `tx-${Date.now()}-r`,
        timestamp: nowIso,
        userId: requesterId,
        type: 'escrow_released',
        amount: amount,
        questId: quest.id,
        questTitle: quest.title,
        counterpartyName: quest.helperName || 'Helper',
        description: `Released ${amount} credits from escrow upon verified delivery`
      };

      setTransactions(prev => [helperTx, requesterTx, ...prev]);

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 }
      });

      soundEffects.playCoin();
      addToast(
        'Delivery Confirmed & Credits Released!',
        `${amount} credits transferred to ${quest.helperName || 'the helper'}.`,
        'success'
      );
    } else {
      soundEffects.playSuccess();
      if (nextStatus === 'in_transit') {
        addToast('Status Updated', 'Quest marked as Picked Up & In Transit.', 'info');
      } else if (nextStatus === 'delivered') {
        addToast('Delivery Complete', 'Awaiting requester confirmation to release escrow.', 'info');
      }
    }

    const updated = quests.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: nextStatus,
          pickedUpAt: nextStatus === 'in_transit' ? nowIso : q.pickedUpAt,
          deliveredAt: nextStatus === 'delivered' ? nowIso : q.deliveredAt,
          confirmedAt: nextStatus === 'confirmed' ? nowIso : q.confirmedAt
        };
      }
      return q;
    });

    setQuests(updated);
    if (selectedQuestModal?.id === questId) {
      setSelectedQuestModal(updated.find(q => q.id === questId) || null);
    }
  };

  const cancelQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    if (quest.status !== 'available' && quest.status !== 'accepted') {
      addToast('Cannot Cancel', 'Tasks already in transit or delivered cannot be cancelled.', 'error');
      return;
    }

    // If requester cancels while available, refund escrow
    if (quest.requesterId === currentUser.id && quest.status === 'available') {
      setUsers(prev =>
        prev.map(u =>
          u.id === currentUser.id
            ? {
                ...u,
                creditBalance: u.creditBalance + quest.offeredCredits,
                inEscrowCredits: Math.max(0, u.inEscrowCredits - quest.offeredCredits)
              }
            : u
        )
      );

      const refundTx: Transaction = {
        id: `tx-${Date.now()}-ref`,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        type: 'escrow_refund',
        amount: quest.offeredCredits,
        questId: quest.id,
        questTitle: quest.title,
        counterpartyName: 'Escrow Refund',
        description: `Refunded ${quest.offeredCredits} credits due to quest cancellation`
      };

      setTransactions(prev => [refundTx, ...prev]);
    }

    const updated = quests.map(q =>
      q.id === questId
        ? {
            ...q,
            status: 'cancelled' as QuestStatus,
            cancelledAt: new Date().toISOString()
          }
        : q
    );

    setQuests(updated);
    if (selectedQuestModal?.id === questId) {
      setSelectedQuestModal(updated.find(q => q.id === questId) || null);
    }

    soundEffects.playClick();
    addToast('Quest Cancelled', `Quest "${quest.title}" has been cancelled.`, 'info');
  };

  const updatePreferences = (newPrefs: HelperPreferences) => {
    setPreferences(newPrefs);
    setIsPreferencesModalOpen(false);
    soundEffects.playClick();
    addToast('Preferences Saved', 'Helper detour limits and transport routing updated.', 'success');
  };

  const faucetTopUp = (amount = 50) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? {
              ...u,
              creditBalance: u.creditBalance + amount
            }
          : u
      )
    );

    const faucetTx: Transaction = {
      id: `tx-${Date.now()}-faucet`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      type: 'bonus_faucet',
      amount: amount,
      description: `Demo Campus Faucet: +${amount} credits granted`
    };

    setTransactions(prev => [faucetTx, ...prev]);
    soundEffects.playCoin();
    addToast('Credits Added!', `+${amount} credits deposited into your campus wallet.`, 'success');
  };

  const resetAllData = () => {
    storageService.resetToDefault();
    setUsers(storageService.getUsers());
    setCurrentUserId(storageService.getCurrentUserId());
    setQuests(storageService.getQuests());
    setTransactions(storageService.getTransactions());
    setPreferences(storageService.getPreferences());
    setSelectedQuestModal(null);
    setIsCreateModalOpen(false);
    setIsPreferencesModalOpen(false);
    soundEffects.playClick();
    addToast('System Reset', 'All demo data and local storage reset to defaults.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        quests,
        transactions,
        preferences,
        activeTab,
        toasts,
        selectedQuestModal,
        isCreateModalOpen,
        isPreferencesModalOpen,
        setActiveTab,
        switchUser,
        openCreateModal,
        closeCreateModal,
        openPreferencesModal,
        closePreferencesModal,
        openQuestModal,
        closeQuestModal,
        createQuest,
        acceptQuest,
        acceptChain,
        advanceQuestStatus,
        cancelQuest,
        updatePreferences,
        faucetTopUp,
        resetAllData,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
