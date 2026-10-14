import React from 'react';
import { QuestCategory, QuestStatus, EffortLevel } from '../../types';
import {
  Coffee,
  BookOpen,
  Package,
  Home,
  Cpu,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';

interface CategoryBadgeProps {
  category: QuestCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  switch (category) {
    case 'food_drink':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
          <Coffee className="w-3 h-3" />
          Food & Drink
        </span>
      );
    case 'academic_print':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200 ${className}`}>
          <BookOpen className="w-3 h-3" />
          Academic & Print
        </span>
      );
    case 'package_mail':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200 ${className}`}>
          <Package className="w-3 h-3" />
          Package & Mail
        </span>
      );
    case 'dorm_supplies':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}>
          <Home className="w-3 h-3" />
          Dorm Essentials
        </span>
      );
    case 'tech_lab':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-200 ${className}`}>
          <Cpu className="w-3 h-3" />
          Tech & Lab
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          <Layers className="w-3 h-3" />
          General
        </span>
      );
  }
};

export const StatusBadge: React.FC<{ status: QuestStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'available':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Available
        </span>
      );
    case 'accepted':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}>
          <Clock className="w-3 h-3 text-indigo-500" />
          Accepted
        </span>
      );
    case 'in_transit':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
          <Truck className="w-3 h-3 text-amber-600" />
          In Transit
        </span>
      );
    case 'delivered':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200 ${className}`}>
          <AlertCircle className="w-3 h-3 text-violet-600" />
          Delivered (Pending Release)
        </span>
      );
    case 'confirmed':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
          Cancelled
        </span>
      );
  }
};

export const EffortBadge: React.FC<{ effort: EffortLevel; className?: string }> = ({ effort, className = '' }) => {
  switch (effort) {
    case 'light':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
          Light Load
        </span>
      );
    case 'medium':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
          Medium Load
        </span>
      );
    case 'heavy':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 ${className}`}>
          Heavy / Bulky
        </span>
      );
  }
};
