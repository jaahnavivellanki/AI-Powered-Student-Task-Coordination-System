export type QuestStatus =
  | 'available'
  | 'accepted'
  | 'in_transit'
  | 'delivered'
  | 'confirmed'
  | 'cancelled';

export type QuestCategory =
  | 'food_drink'
  | 'academic_print'
  | 'package_mail'
  | 'dorm_supplies'
  | 'tech_lab'
  | 'other';

export type EffortLevel = 'light' | 'medium' | 'heavy';

export type TransportMode = 'walking' | 'bicycle' | 'scooter';

export interface CampusNode {
  id: string;
  name: string;
  zone: 'North Campus' | 'Central Hub' | 'Science & Tech Quad' | 'South Residential' | 'West Athletics';
  x: number; // percentage on stylized map (0 - 100)
  y: number; // percentage on stylized map (0 - 100)
  iconName: string;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  helperId?: string;
  helperName?: string;
  helperAvatar?: string;
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDetail?: string;
  dropoffDetail?: string;
  deadline: string; // ISO date string
  effortLevel: EffortLevel;
  estimatedMinutes: number;
  offeredCredits: number;
  status: QuestStatus;
  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  specialInstructions?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
  avatar: string;
  creditBalance: number;
  inEscrowCredits: number;
  completedQuestsCount: number;
  requestedQuestsCount: number;
  rating: number;
  currentZoneId: string;
}

export type TransactionType =
  | 'reward_earned'
  | 'escrow_hold'
  | 'escrow_released'
  | 'escrow_refund'
  | 'bonus_faucet';

export interface Transaction {
  id: string;
  timestamp: string;
  userId: string;
  type: TransactionType;
  amount: number;
  questId?: string;
  questTitle?: string;
  counterpartyName?: string;
  description: string;
}

export interface HelperPreferences {
  maxDetourMinutes: number; // 5 to 25
  maxTasksPerJourney: number; // 2, 3, or 4
  transportMode: TransportMode;
  preferredZones: string[];
  soundEnabled: boolean;
}

export interface QuestChainStop {
  type: 'pickup' | 'dropoff';
  questId: string;
  questTitle: string;
  locationId: string;
  locationName: string;
  cumulativeMinutes: number;
  actionDescription: string;
}

export interface QuestChain {
  id: string;
  questIds: string[];
  quests: Quest[];
  stops: QuestChainStop[];
  totalRewardCredits: number;
  totalEstimatedMinutes: number;
  standaloneEstimatedMinutes: number;
  savedMinutes: number;
  detourMinutes: number;
  efficiencyScore: number;
  compatibilityReason: string;
  carbonSavedGrams: number;
}

export interface PricingBreakdown {
  baseCredits: number;
  distanceCredits: number;
  effortCredits: number;
  urgencySurgeCredits: number;
  totalCredits: number;
  distanceMeters: number;
  transitMinutes: number;
  urgencyMultiplier: number;
  explanation: string;
}
