import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_NODES } from '../../data/campusNodes';
import { CampusNode, Quest } from '../../types';
import {
  Coffee,
  BookOpen,
  Cpu,
  FlaskConical,
  Home,
  Utensils,
  Building,
  Package,
  Dumbbell,
  Palette,
  MapPin,
  ChevronRight,
  Layers
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Coffee,
  BookOpen,
  Cpu,
  FlaskConical,
  Home,
  Utensils,
  Building,
  Package,
  Dumbbell,
  Palette
};

export const CampusZoneMap: React.FC = () => {
  const { quests, openQuestModal } = useApp();
  const [selectedNode, setSelectedNode] = useState<CampusNode | null>(CAMPUS_NODES[0]);

  // Count active quests per node
  const getNodeActivity = (nodeId: string): { pickups: Quest[]; dropoffs: Quest[]; total: number } => {
    const pickups = quests.filter(q => q.pickupLocationId === nodeId && q.status === 'available');
    const dropoffs = quests.filter(q => q.dropoffLocationId === nodeId && q.status === 'available');
    return { pickups, dropoffs, total: pickups.length + dropoffs.length };
  };

  const selectedActivity: { pickups: Quest[]; dropoffs: Quest[]; total: number } = selectedNode
    ? getNodeActivity(selectedNode.id)
    : { pickups: [], dropoffs: [], total: 0 };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Interactive Campus Errand Map</span>
          </h2>
          <p className="text-xs text-slate-500">
            Click any campus node to view current pickups and deliveries
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Pickups
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Deliveries
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visual 2D Campus Grid */}
        <div className="lg:col-span-2 relative bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 rounded-xl border border-slate-200 h-80 sm:h-96 overflow-hidden select-none">
          {/* Subtle campus pathways svg backdrop */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-200/80 stroke-[2] pointer-events-none">
            <line x1="48%" y1="46%" x2="52%" y2="35%" strokeDasharray="4 3" />
            <line x1="52%" y1="35%" x2="75%" y2="30%" strokeDasharray="4 3" />
            <line x1="75%" y1="30%" x2="82%" y2="48%" strokeDasharray="4 3" />
            <line x1="48%" y1="46%" x2="45%" y2="15%" strokeDasharray="4 3" />
            <line x1="45%" y1="15%" x2="62%" y2="18%" strokeDasharray="4 3" />
            <line x1="48%" y1="46%" x2="35%" y2="75%" strokeDasharray="4 3" />
            <line x1="35%" y1="75%" x2="55%" y2="82%" strokeDasharray="4 3" />
            <line x1="48%" y1="46%" x2="18%" y2="42%" strokeDasharray="4 3" />
            <line x1="48%" y1="46%" x2="32%" y2="50%" strokeDasharray="4 3" />
          </svg>

          {/* Campus Zones Watermark Labels */}
          <span className="absolute top-2 left-6 text-[11px] font-bold tracking-wider text-slate-300 uppercase pointer-events-none">
            North Campus (Dorms & Commons)
          </span>
          <span className="absolute bottom-2 left-6 text-[11px] font-bold tracking-wider text-slate-300 uppercase pointer-events-none">
            South Residential & Mail
          </span>
          <span className="absolute top-2 right-6 text-[11px] font-bold tracking-wider text-slate-300 uppercase pointer-events-none">
            Science & Tech Quad
          </span>
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[11px] font-bold tracking-wider text-slate-300 uppercase pointer-events-none">
            West Athletics
          </span>

          {/* Interactive Campus Nodes */}
          {CAMPUS_NODES.map(node => {
            const Icon = iconMap[node.iconName] || MapPin;
            const isSelected = selectedNode?.id === node.id;
            const activity = getNodeActivity(node.id);

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 z-10 ${
                  isSelected ? 'scale-115 z-20' : 'hover:scale-110'
                }`}
                title={node.name}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition shadow-md ${
                    isSelected
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 shadow-indigo-300'
                      : activity.total > 0
                      ? 'bg-white text-indigo-700 border-2 border-indigo-500 shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-300 shadow-xs hover:border-indigo-400'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Activity badge pill */}
                {activity.total > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white ring-2 ring-white shadow-xs">
                    {activity.total}
                  </span>
                )}

                {/* Node name tooltip */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap shadow-xs pointer-events-none transition ${
                    isSelected
                      ? 'bg-indigo-900 text-white opacity-100'
                      : 'bg-slate-800 text-slate-100 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {node.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Building Details Sidebar */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          {selectedNode ? (
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {selectedNode.zone}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedNode.description}
                  </p>
                </div>
              </div>

              {/* Errand Breakdown */}
              <div className="py-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Pickups waiting here:</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                    {selectedActivity.pickups.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Deliveries destined here:</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {selectedActivity.dropoffs.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {selectedActivity.total === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center">
                    No active tasks currently originating or ending here.
                  </p>
                ) : (
                  <>
                    {selectedActivity.pickups.map(q => (
                      <button
                        key={q.id}
                        onClick={() => openQuestModal(q)}
                        className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-xs transition flex items-center justify-between group shadow-2xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate block">
                            {q.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Pickup • {q.offeredCredits} cr
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      </button>
                    ))}
                    {selectedActivity.dropoffs.map(q => (
                      <button
                        key={q.id}
                        onClick={() => openQuestModal(q)}
                        className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-xs transition flex items-center justify-between group shadow-2xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-800 group-hover:text-emerald-600 truncate block">
                            {q.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Dropoff • {q.offeredCredits} cr
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select a location on map</p>
          )}

          <div className="pt-3 border-t border-slate-200 mt-2 text-[11px] text-slate-500">
            Tip: Combine nearby tasks using the <strong>Quest Chains</strong> tab.
          </div>
        </div>
      </div>
    </div>
  );
};
