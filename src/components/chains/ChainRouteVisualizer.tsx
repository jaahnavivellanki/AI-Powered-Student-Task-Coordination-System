import React from 'react';
import { QuestChainStop } from '../../types';
import { Clock } from 'lucide-react';

interface ChainRouteVisualizerProps {
  stops: QuestChainStop[];
}

export const ChainRouteVisualizer: React.FC<ChainRouteVisualizerProps> = ({ stops }) => {
  return (
    <div className="py-2 space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
        <span className="uppercase tracking-wider">Suggested Waypoint Sequence</span>
        <span className="flex items-center gap-1 text-indigo-600">
          <Clock className="w-3.5 h-3.5" /> Ordered for minimum backtracking
        </span>
      </div>

      <div className="relative pl-6 space-y-4">
        {/* Continuous Route Line */}
        <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-emerald-500"></div>

        {stops.map((stop, index) => {
          const isPickup = stop.type === 'pickup';
          const isLast = index === stops.length - 1;

          return (
            <div key={`${stop.questId}-${stop.type}-${index}`} className="relative group">
              {/* Waypoint Node Dot */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition ${
                  isPickup
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-100 shadow-xs'
                    : isLast
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-100 shadow-xs'
                    : 'bg-violet-600 text-white ring-2 ring-violet-100 shadow-xs'
                }`}
              >
                {index + 1}
              </div>

              {/* Stop Content Box */}
              <div
                className={`p-3 rounded-xl border text-xs transition ${
                  isPickup
                    ? 'bg-indigo-50/40 border-indigo-100'
                    : isLast
                    ? 'bg-emerald-50/40 border-emerald-100'
                    : 'bg-violet-50/40 border-violet-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      isPickup
                        ? 'bg-indigo-100 text-indigo-800'
                        : isLast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-violet-100 text-violet-800'
                    }`}
                  >
                    {isPickup ? 'Stop: Pickup' : isLast ? 'Final Delivery' : 'Intermediate Delivery'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    +{stop.cumulativeMinutes} min mark
                  </span>
                </div>

                <p className="font-bold text-slate-900 mt-1.5 text-sm">
                  {stop.locationName}
                </p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {stop.actionDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
