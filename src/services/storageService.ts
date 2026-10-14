import { User, Quest, Transaction, HelperPreferences } from '../types';
import { INITIAL_STUDENTS, INITIAL_QUESTS, INITIAL_TRANSACTIONS, INITIAL_PREFERENCES } from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'synchro_users_v1',
  CURRENT_USER_ID: 'synchro_current_user_id_v1',
  QUESTS: 'synchro_quests_v1',
  TRANSACTIONS: 'synchro_transactions_v1',
  PREFERENCES: 'synchro_preferences_v1'
};

export const storageService = {
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getCurrentUserId(): string {
    try {
      const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return id || 'user_alex';
    } catch {
      return 'user_alex';
    }
  },

  setCurrentUserId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getQuests(): Quest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
      return data ? JSON.parse(data) : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  },

  saveQuests(quests: Quest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getPreferences(): HelperPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  },

  savePreferences(prefs: HelperPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  resetToDefault(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      localStorage.removeItem(STORAGE_KEYS.QUESTS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    } catch (e) {
      console.warn('Storage reset error:', e);
    }
  }
};
