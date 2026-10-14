import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { QuestChainsView } from './components/chains/QuestChainsView';
import { RewardCalculator } from './components/create/RewardCalculator';
import { WalletView } from './components/wallet/WalletView';
import { CreateQuestModal } from './components/create/CreateQuestModal';
import { QuestDetailsModal } from './components/marketplace/QuestDetailsModal';
import { PreferencesModal } from './components/preferences/PreferencesModal';
import { ToastContainer } from './components/common/ToastContainer';

export const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'marketplace' && <MarketplaceView />}
          {activeTab === 'chains' && <QuestChainsView />}
          {activeTab === 'calculator' && <RewardCalculator />}
          {activeTab === 'wallet' && <WalletView />}
        </main>

        <MobileNav />
      </div>

      {/* Global Interactive Modals */}
      <CreateQuestModal />
      <QuestDetailsModal />
      <PreferencesModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
