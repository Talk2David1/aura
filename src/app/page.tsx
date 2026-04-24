"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { StatsOverview } from "@/components/studio/StatsOverview";
import { CreationForm } from "@/components/studio/CreationForm";
import { RecentVideos } from "@/components/studio/RecentVideos";
import { ProfileView } from "@/components/profile/ProfileView";
import { SettingsView } from "@/components/settings/SettingsView";
import { ProjectsView } from "@/components/studio/ProjectsView";
import { HistoryView } from "@/components/studio/HistoryView";
import { UpgradePlanView } from "@/components/billing/UpgradePlanView";
import { TemplatesView } from "@/components/library/TemplatesView";
import { AssetsView } from "@/components/library/AssetsView";
import { AuthView } from "@/components/auth/AuthView";

export default function App() {
  // Use auth as default to show off login flow, or studio
  const [activeView, setActiveView] = useState("auth");

  const getHeaderTitles = () => {
    switch(activeView) {
      case 'profile': return { title: "Profile", subtitle: "Manage your account and billing" };
      case 'settings': return { title: "Settings", subtitle: "Global application preferences" };
      case 'studio': return { title: "Video Studio", subtitle: "Create AI-powered faceless videos" };
      case 'projects': return { title: "My Projects", subtitle: "Manage and export your generated content" };
      case 'history': return { title: "Audit Log", subtitle: "History of generation activity and credits" };
      case 'upgrade': return { title: "Subscription Plans", subtitle: "Select a plan that fits your scale" };
      case 'templates': return { title: "Templates", subtitle: "Start quick with curated base videos" };
      case 'assets': return { title: "Library Assets", subtitle: "Manage uploaded media and uploads" };
      default: return { title: activeView.charAt(0).toUpperCase() + activeView.slice(1), subtitle: "Coming soon..." };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  if (activeView === 'auth') {
    return <AuthView onLogin={() => setActiveView('studio')} />;
  }

  return (
    <div className="flex w-full h-[100dvh]">
      {/* Desktop Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 flex flex-col w-full h-full min-w-0 bg-bg-tertiary">
        <Header title={title} subtitle={subtitle} />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto p-4 md:p-6 pb-[90px] md:pb-6">
            
            {/* Mobile Greeting (hidden on desktop) */}
            <div className={`md:hidden mb-4 mt-2 ${activeView !== 'studio' ? 'hidden' : ''}`}>
              <h2 className="text-[18px] font-medium text-text-primary">Hey, Adaeze</h2>
              <p className="text-[12px] text-text-tertiary mt-0.5">Ready to create something?</p>
            </div>

            {activeView === 'studio' ? (
              <>
                <StatsOverview />
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_450px] gap-4 md:gap-5">
                  <CreationForm />
                  <RecentVideos />
                </div>
              </>
            ) : activeView === 'profile' ? (
              <ProfileView 
                onUpgrade={() => setActiveView('upgrade')} 
                onLogout={() => setActiveView('auth')} 
              />
            ) : activeView === 'settings' ? (
              <SettingsView />
            ) : activeView === 'projects' ? (
              <ProjectsView />
            ) : activeView === 'history' ? (
              <HistoryView />
            ) : activeView === 'upgrade' ? (
              <UpgradePlanView />
            ) : activeView === 'templates' ? (
              <TemplatesView />
            ) : activeView === 'assets' ? (
              <AssetsView />
            ) : (
              <div className="flex items-center justify-center h-[50vh] text-text-tertiary">
                {activeView} coming soon...
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </main>
    </div>
  );
}
