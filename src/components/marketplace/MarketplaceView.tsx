import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestCard } from './QuestCard';
import { CAMPUS_NODES } from '../../data/campusNodes';
import { QuestCategory } from '../../types';
import {
  Search,
  Plus,
  Compass,
  RotateCcw,
  Sparkles
} from 'lucide-react';

type TabFilter = 'available' | 'my_accepted' | 'my_posted' | 'completed';
type SortOption = 'urgent' | 'bounty_high' | 'distance_short' | 'newest';

export const MarketplaceView: React.FC = () => {
  const { quests, currentUser, openCreateModal } = useApp();

  const [activeTab, setActiveTab] = useState<TabFilter>('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('urgent');

  // Filtered & Sorted Quests
  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      // 1. Tab filter
      if (activeTab === 'available') {
        if (quest.status !== 'available') return false;
      } else if (activeTab === 'my_accepted') {
        if (quest.helperId !== currentUser.id) return false;
        if (quest.status !== 'accepted' && quest.status !== 'in_transit' && quest.status !== 'delivered') return false;
      } else if (activeTab === 'my_posted') {
        if (quest.requesterId !== currentUser.id) return false;
      } else if (activeTab === 'completed') {
        if (quest.status !== 'confirmed') return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && quest.category !== selectedCategory) {
        return false;
      }

      // 3. Zone filter
      if (selectedZone !== 'all') {
        const pNode = CAMPUS_NODES.find(n => n.id === quest.pickupLocationId);
        const dNode = CAMPUS_NODES.find(n => n.id === quest.dropoffLocationId);
        if (pNode?.zone !== selectedZone && dNode?.zone !== selectedZone) {
          return false;
        }
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const pNode = CAMPUS_NODES.find(n => n.id === quest.pickupLocationId);
        const dNode = CAMPUS_NODES.find(n => n.id === quest.dropoffLocationId);

        const matchTitle = quest.title.toLowerCase().includes(query);
        const matchDesc = quest.description.toLowerCase().includes(query);
        const matchRequester = quest.requesterName.toLowerCase().includes(query);
        const matchLoc = (pNode?.name.toLowerCase().includes(query) || false) || (dNode?.name.toLowerCase().includes(query) || false);

        if (!matchTitle && !matchDesc && !matchRequester && !matchLoc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'urgent') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'bounty_high') {
        return b.offeredCredits - a.offeredCredits;
      }
      if (sortBy === 'distance_short') {
        return a.estimatedMinutes - b.estimatedMinutes;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [quests, activeTab, selectedCategory, selectedZone, searchQuery, sortBy, currentUser.id]);

  const categories: { key: QuestCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'food_drink', label: 'Food & Drink' },
    { key: 'academic_print', label: 'Academic & Print' },
    { key: 'package_mail', label: 'Package & Mail' },
    { key: 'dorm_supplies', label: 'Dorm Essentials' },
    { key: 'tech_lab', label: 'Tech & Lab' }
  ];

  const zones = [
    'All Zones',
    'North Campus',
    'Central Hub',
    'Science & Tech Quad',
    'South Residential',
    'West Athletics'
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Post Quest CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            <span>Campus Quest Marketplace</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pick up everyday student errands, earn virtual credits, or request peer assistance
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm shadow-indigo-200 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Quest</span>
        </button>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-6 text-sm font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'available'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <span>Available Quests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 font-bold">
            {quests.filter(q => q.status === 'available').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my_accepted')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'my_accepted'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <span>My Coordinated Tasks</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-bold">
            {quests.filter(q => q.helperId === currentUser.id && (q.status === 'accepted' || q.status === 'in_transit' || q.status === 'delivered')).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my_posted')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'my_posted'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <span>My Posted Quests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-bold">
            {quests.filter(q => q.requesterId === currentUser.id).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'completed'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <span>Completed & Archives</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-bold">
            {quests.filter(q => q.status === 'confirmed').length}
          </span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, location (e.g. Library, Union), or requester..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Zone Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer text-slate-700"
            >
              {zones.map(z => (
                <option key={z} value={z === 'All Zones' ? 'all' : z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer text-slate-700"
              >
                <option value="urgent">⏰ Most Urgent First</option>
                <option value="bounty_high">💰 Highest Reward Bounty</option>
                <option value="distance_short">⚡ Shortest Transit Time</option>
                <option value="newest">✨ Most Recently Posted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pill Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Category:
          </span>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800 font-bold">{filteredQuests.length}</strong> {filteredQuests.length === 1 ? 'quest' : 'quests'}
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedZone !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedZone('all');
            }}
            className="flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Quests Grid */}
      {filteredQuests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Quests Found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            There are no errands matching your current filter criteria. You can post a new errand or adjust your filters.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveTab('available');
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedZone('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Clear Filters
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
            >
              Post a Quest (+ cr)
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}
    </div>
  );
};
