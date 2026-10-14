import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransportMode } from '../../types';
import { X, Sliders, Volume2, VolumeX, Bike, Footprints, Zap } from 'lucide-react';

const ALL_ZONES = [
  'Central Hub',
  'North Campus',
  'Science & Tech Quad',
  'South Residential',
  'West Athletics'
];

export const PreferencesModal: React.FC = () => {
  const { isPreferencesModalOpen, closePreferencesModal, preferences, updatePreferences } = useApp();

  const [maxDetour, setMaxDetour] = useState(preferences.maxDetourMinutes);
  const [maxTasks, setMaxTasks] = useState(preferences.maxTasksPerJourney);
  const [transportMode, setTransportMode] = useState<TransportMode>(preferences.transportMode);
  const [preferredZones, setPreferredZones] = useState<string[]>(preferences.preferredZones || []);
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled);

  if (!isPreferencesModalOpen) return null;

  const toggleZone = (zone: string) => {
    if (preferredZones.includes(zone)) {
      setPreferredZones(preferredZones.filter(z => z !== zone));
    } else {
      setPreferredZones([...preferredZones, zone]);
    }
  };

  const handleSave = () => {
    updatePreferences({
      maxDetourMinutes: maxDetour,
      maxTasksPerJourney: maxTasks,
      transportMode,
      preferredZones,
      soundEnabled
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Routing Constraints</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Helper & Errand Preferences
            </h2>
          </div>

          <button
            onClick={closePreferencesModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preferences Form */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Max Detour Minutes */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Maximum Allowed Detour</span>
              <span className="text-indigo-600 font-extrabold">{maxDetour} minutes</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Quest Chains will discard any errand combinations requiring extra detours beyond this limit.
            </p>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={maxDetour}
              onChange={e => setMaxDetour(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>5m (Strict Direct)</span>
              <span>15m (Balanced)</span>
              <span>25m (High Bounties)</span>
            </div>
          </div>

          {/* Maximum Tasks per Journey */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Maximum Bundled Tasks per Journey
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              How many errands you are comfortable carrying or managing at once.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxTasks(num)}
                  className={`py-2.5 rounded-xl border font-bold text-xs transition ${
                    maxTasks === num
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num} Errands Max
                </button>
              ))}
            </div>
          </div>

          {/* Transport Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Primary Campus Transit Mode
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Affects transit speed, estimated detour times, and carbon savings calculations.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'walking', label: 'Walking', icon: Footprints },
                { id: 'bicycle', label: 'Bicycle', icon: Bike },
                { id: 'scooter', label: 'Scooter / Board', icon: Zap }
              ].map(mode => {
                const Icon = mode.icon;
                const isSelected = transportMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransportMode(mode.id as TransportMode)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Campus Zones */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Preferred Campus Zones
            </label>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Select the campus areas you frequently traverse during class breaks.
            </p>
            <div className="space-y-2">
              {ALL_ZONES.map(zone => {
                const isChecked = preferredZones.includes(zone);
                return (
                  <label
                    key={zone}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                      isChecked
                        ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{zone}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleZone(zone)}
                      className="rounded accent-indigo-600 w-4 h-4"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sound Feedback Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <p className="font-bold text-slate-800">Tactile Audio Effects</p>
                <p className="text-[11px] text-slate-400">Chimes for rewards, clicks, and escrow releases</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ${
                soundEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={closePreferencesModal}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition active:scale-95"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
