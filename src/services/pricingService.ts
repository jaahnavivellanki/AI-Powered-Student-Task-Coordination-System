import { EffortLevel, PricingBreakdown, TransportMode } from '../types';
import { getDistanceMeters, getTransitTimeMinutes } from '../data/campusNodes';

export function calculateFairReward(
  pickupId: string,
  dropoffId: string,
  effort: EffortLevel,
  deadlineIso: string,
  mode: TransportMode = 'walking'
): PricingBreakdown {
  const distanceMeters = getDistanceMeters(pickupId, dropoffId);
  const transitMinutes = getTransitTimeMinutes(pickupId, dropoffId, mode);

  // 1. Base errand credit for accepting and initiating
  const baseCredits = 8;

  // 2. Distance credits: ~1.2 credits per 100m walked
  const rawDistCredits = Math.round((distanceMeters / 100) * 1.2);
  const distanceCredits = Math.max(2, rawDistCredits);

  // 3. Physical effort / payload factor
  let effortCredits = 0;
  if (effort === 'medium') effortCredits = 4; // e.g. groceries, double meal bags
  if (effort === 'heavy') effortCredits = 9; // e.g. heavy lab equipment, multiple textbooks, laundry hamper

  // 4. Urgency surge multiplier
  const now = Date.now();
  const deadlineTime = new Date(deadlineIso).getTime();
  const diffMinutes = Math.max(5, Math.round((deadlineTime - now) / (1000 * 60)));

  let urgencyMultiplier = 1.0;
  let urgencySurgeCredits = 0;

  if (diffMinutes <= 30) {
    urgencyMultiplier = 1.45;
  } else if (diffMinutes <= 75) {
    urgencyMultiplier = 1.2;
  }

  const subtotal = baseCredits + distanceCredits + effortCredits;
  const rawTotal = Math.round(subtotal * urgencyMultiplier);
  urgencySurgeCredits = Math.max(0, rawTotal - subtotal);
  const totalCredits = rawTotal;

  // Human-readable explanation string
  const urgencyLabel =
    urgencyMultiplier > 1.3
      ? `High Urgency (<30m deadline surge +${urgencySurgeCredits}cr)`
      : urgencyMultiplier > 1.1
      ? `Moderate Urgency (<75m deadline surge +${urgencySurgeCredits}cr)`
      : `Standard window (${diffMinutes}m remaining)`;

  const effortLabel =
    effort === 'heavy'
      ? 'Heavy Payload (+9cr)'
      : effort === 'medium'
      ? 'Standard Load (+4cr)'
      : 'Light / Pocket-sized';

  const explanation = `Fair calculation: Base reward (${baseCredits}cr) + ~${distanceMeters}m campus transit (${distanceCredits}cr) + ${effortLabel} + ${urgencyLabel}. Total recommended: ${totalCredits} credits.`;

  return {
    baseCredits,
    distanceCredits,
    effortCredits,
    urgencySurgeCredits,
    totalCredits,
    distanceMeters,
    transitMinutes,
    urgencyMultiplier,
    explanation
  };
}
