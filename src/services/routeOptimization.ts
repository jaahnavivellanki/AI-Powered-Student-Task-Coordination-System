import { Quest, QuestChain, QuestChainStop, HelperPreferences, TransportMode } from '../types';
import { getDistanceMeters, getTransitTimeMinutes, getLocationById } from '../data/campusNodes';

interface CandidateSequence {
  stops: { type: 'pickup' | 'dropoff'; quest: Quest; locationId: string }[];
  totalDistanceMeters: number;
  totalMinutes: number;
}

export function generateQuestChains(
  quests: Quest[],
  preferences: HelperPreferences,
  currentUserId: string
): QuestChain[] {
  // Only consider available quests not created by the current user
  const eligibleQuests = quests.filter(
    q => q.status === 'available' && q.requesterId !== currentUserId
  );

  if (eligibleQuests.length < 2) {
    return [];
  }

  const generatedChains: QuestChain[] = [];
  const maxTasks = Math.min(preferences.maxTasksPerJourney || 3, 3);
  const mode = preferences.transportMode || 'walking';

  // 1. Evaluate 2-task combinations
  for (let i = 0; i < eligibleQuests.length; i++) {
    for (let j = i + 1; j < eligibleQuests.length; j++) {
      const q1 = eligibleQuests[i];
      const q2 = eligibleQuests[j];

      const chain = evaluateBundle([q1, q2], preferences, mode);
      if (chain) {
        generatedChains.push(chain);
      }
    }
  }

  // 2. Evaluate 3-task combinations if permitted by preferences
  if (maxTasks >= 3 && eligibleQuests.length >= 3) {
    for (let i = 0; i < Math.min(eligibleQuests.length, 5); i++) {
      for (let j = i + 1; j < Math.min(eligibleQuests.length, 6); j++) {
        for (let k = j + 1; k < Math.min(eligibleQuests.length, 7); k++) {
          const combo = [eligibleQuests[i], eligibleQuests[j], eligibleQuests[k]];
          const chain = evaluateBundle(combo, preferences, mode);
          if (chain && chain.savedMinutes >= 10) {
            generatedChains.push(chain);
          }
        }
      }
    }
  }

  // Deduplicate and rank by efficiency score & total reward
  const uniqueMap = new Map<string, QuestChain>();
  for (const c of generatedChains) {
    const key = [...c.questIds].sort().join('-');
    if (!uniqueMap.has(key) || (uniqueMap.get(key)!.efficiencyScore < c.efficiencyScore)) {
      uniqueMap.set(key, c);
    }
  }

  return Array.from(uniqueMap.values())
    .sort((a, b) => b.efficiencyScore - a.efficiencyScore || b.totalRewardCredits - a.totalRewardCredits);
}

function evaluateBundle(
  tasks: Quest[],
  preferences: HelperPreferences,
  mode: TransportMode
): QuestChain | null {
  // Standalone metrics
  let standaloneMinutes = 0;
  let totalRewardCredits = 0;

  for (const q of tasks) {
    totalRewardCredits += q.offeredCredits;
    const directTime = getTransitTimeMinutes(q.pickupLocationId, q.dropoffLocationId, mode);
    // Add handling buffer (3 mins per quest for pickup and handoff)
    standaloneMinutes += directTime + 4;
  }

  // Find optimal valid stop ordering (every pickup must precede its dropoff)
  const bestSequence = findOptimalSequence(tasks, mode);
  if (!bestSequence) return null;

  // Add 2 minutes handling buffer per intermediate stop
  const handlingBuffer = tasks.length * 3;
  const chainedMinutes = bestSequence.totalMinutes + handlingBuffer;
  const savedMinutes = standaloneMinutes - chainedMinutes;

  // Minimum threshold: must save at least 4 minutes to qualify as a real chain
  if (savedMinutes < 4) {
    return null;
  }

  // Calculate detour relative to longest standalone task
  const maxStandaloneTask = Math.max(
    ...tasks.map(t => getTransitTimeMinutes(t.pickupLocationId, t.dropoffLocationId, mode))
  );
  const detourMinutes = Math.max(0, chainedMinutes - maxStandaloneTask);

  // Helper preference check
  if (detourMinutes > preferences.maxDetourMinutes) {
    return null;
  }

  // Preferred zones bonus / filtering check (if helper specified preferred zones)
  if (preferences.preferredZones && preferences.preferredZones.length > 0) {
    const hasPreferred = tasks.some(t => {
      const pLoc = getLocationById(t.pickupLocationId);
      const dLoc = getLocationById(t.dropoffLocationId);
      return (
        preferences.preferredZones.includes(pLoc.zone) ||
        preferences.preferredZones.includes(dLoc.zone)
      );
    });
    if (!hasPreferred) return null;
  }

  const efficiencyScore = Math.min(
    95,
    Math.round((savedMinutes / standaloneMinutes) * 100)
  );

  // Build the formatted stops
  let cumulativeTime = 0;
  const stops: QuestChainStop[] = [];

  for (let i = 0; i < bestSequence.stops.length; i++) {
    const stop = bestSequence.stops[i];
    const prevLocId = i === 0 ? stop.locationId : bestSequence.stops[i - 1].locationId;
    const legMinutes = i === 0 ? 2 : getTransitTimeMinutes(prevLocId, stop.locationId, mode);
    cumulativeTime += legMinutes + 1;

    const loc = getLocationById(stop.locationId);
    const action =
      stop.type === 'pickup'
        ? `Pick up "${stop.quest.title}" (${stop.quest.category.replace('_', ' ')})`
        : `Deliver to ${stop.quest.requesterName} (${stop.quest.dropoffDetail || loc.name})`;

    stops.push({
      type: stop.type,
      questId: stop.quest.id,
      questTitle: stop.quest.title,
      locationId: stop.locationId,
      locationName: loc.name,
      cumulativeMinutes: cumulativeTime,
      actionDescription: action
    });
  }

  // Synthesize transparent explanation
  const reason = generateExplanation(tasks, savedMinutes, efficiencyScore, mode);
  const carbonSavedGrams = savedMinutes * 24; // 24g CO2 equiv saved per minute of non-duplicated transport

  return {
    id: `chain-${tasks.map(t => t.id).join('-')}`,
    questIds: tasks.map(t => t.id),
    quests: tasks,
    stops,
    totalRewardCredits,
    totalEstimatedMinutes: cumulativeTime,
    standaloneEstimatedMinutes: standaloneMinutes,
    savedMinutes,
    detourMinutes,
    efficiencyScore,
    compatibilityReason: reason,
    carbonSavedGrams
  };
}

function findOptimalSequence(
  tasks: Quest[],
  mode: TransportMode
): CandidateSequence | null {
  // Generate all valid topological permutations
  // For each quest i: event +i is pickup, -i is dropoff. Constraint: +i must appear before -i.
  const taskCount = tasks.length;
  const events: { questIndex: number; type: 'pickup' | 'dropoff' }[] = [];

  for (let i = 0; i < taskCount; i++) {
    events.push({ questIndex: i, type: 'pickup' });
    events.push({ questIndex: i, type: 'dropoff' });
  }

  const validPermutations: { questIndex: number; type: 'pickup' | 'dropoff' }[][] = [];

  function permute(
    current: { questIndex: number; type: 'pickup' | 'dropoff' }[],
    remaining: { questIndex: number; type: 'pickup' | 'dropoff' }[],
    pickedUpMask: boolean[]
  ) {
    if (remaining.length === 0) {
      validPermutations.push(current);
      return;
    }

    for (let idx = 0; idx < remaining.length; idx++) {
      const item = remaining[idx];
      if (item.type === 'dropoff' && !pickedUpMask[item.questIndex]) {
        // Can't drop off before picking up
        continue;
      }

      const nextPickedUp = [...pickedUpMask];
      if (item.type === 'pickup') {
        nextPickedUp[item.questIndex] = true;
      }

      const nextRemaining = remaining.filter((_, i) => i !== idx);
      permute([...current, item], nextRemaining, nextPickedUp);
    }
  }

  permute([], events, new Array(taskCount).fill(false));

  let best: CandidateSequence | null = null;
  let minCost = Infinity;

  for (const seq of validPermutations) {
    let distance = 0;
    let minutes = 0;

    const stopList: { type: 'pickup' | 'dropoff'; quest: Quest; locationId: string }[] = [];

    for (let i = 0; i < seq.length; i++) {
      const item = seq[i];
      const quest = tasks[item.questIndex];
      const locId = item.type === 'pickup' ? quest.pickupLocationId : quest.dropoffLocationId;

      stopList.push({
        type: item.type,
        quest,
        locationId: locId
      });

      if (i > 0) {
        const prevLocId =
          seq[i - 1].type === 'pickup'
            ? tasks[seq[i - 1].questIndex].pickupLocationId
            : tasks[seq[i - 1].questIndex].dropoffLocationId;

        distance += getDistanceMeters(prevLocId, locId);
        minutes += getTransitTimeMinutes(prevLocId, locId, mode);
      }
    }

    if (minutes < minCost) {
      minCost = minutes;
      best = {
        stops: stopList,
        totalDistanceMeters: distance,
        totalMinutes: minutes
      };
    }
  }

  return best;
}

function generateExplanation(
  tasks: Quest[],
  savedMinutes: number,
  efficiencyScore: number,
  mode: TransportMode
): string {
  const p1 = getLocationById(tasks[0].pickupLocationId);
  const d1 = getLocationById(tasks[0].dropoffLocationId);
  const p2 = getLocationById(tasks[1].pickupLocationId);
  const d2 = getLocationById(tasks[1].dropoffLocationId);

  const sharedPickup = p1.id === p2.id || p1.zone === p2.zone;
  const sharedDropoff = d1.id === d2.id || d1.zone === d2.zone;
  const transitModeText = mode === 'bicycle' ? 'by bike' : mode === 'scooter' ? 'by scooter' : 'on foot';

  if (sharedPickup && sharedDropoff) {
    return `Double Corridor: Both pickups are located in ${p1.zone} (${p1.name}) and both destinations are in ${d1.zone}. Combining them saves ~${savedMinutes} min (${efficiencyScore}% faster ${transitModeText}) by eliminating a complete round trip across campus.`;
  }

  if (sharedPickup) {
    return `Origin Clustering: Pickups are adjacent within ${p1.zone}. The helper can collect both items at once before heading towards ${d1.name} and ${d2.name}, cutting ~${savedMinutes} minutes of separate retrieval walk.`;
  }

  if (sharedDropoff) {
    return `Destination Convergence: Both quests deliver directly to ${d1.zone} (${d1.name}). Collecting along the path to the same dropoff zone saves ~${savedMinutes} minutes compared to two isolated deliveries.`;
  }

  return `En-Route Waypoint: Pickup at ${p2.name} is directly along the natural travel corridor between ${p1.name} and ${d1.name}. Bundling this saves ~${savedMinutes} min with only a brief waypoint detour.`;
}
