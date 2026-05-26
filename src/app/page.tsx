"use client";

import { useLayoutEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { StudioView } from "@/components/studio/StudioView";
import { AiToolsView } from "@/components/ai/AiToolsView";
import { ProfileView } from "@/components/profile/ProfileView";
import { SettingsView } from "@/components/settings/SettingsView";
import { ProjectsView } from "@/components/studio/ProjectsView";
import { HistoryView } from "@/components/studio/HistoryView";
import { UpgradePlanView } from "@/components/billing/UpgradePlanView";
import { TemplatesView } from "@/components/library/TemplatesView";
import { AssetsView } from "@/components/library/AssetsView";
import { AuthView } from "@/components/auth/AuthView";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";
import { getAccessToken } from "@/lib/api/client";
import { getStoredUser } from "@/lib/api/auth";

export default function App() {
  const [activeView, setActiveView] = useState("auth");
  const [bootstrapped, setBootstrapped] = useState(false);
  const [resetPasswordPrefillEmail, setResetPasswordPrefillEmail] = useState<string | undefined>();

  useLayoutEffect(() => {
    if (getAccessToken()) setActiveView("studio");
    setBootstrapped(true);
  }, []);

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
      case 'ai_tools': return { title: "AI Tools", subtitle: "Prompts, images, and characters" };
      default: return { title: activeView.charAt(0).toUpperCase() + activeView.slice(1), subtitle: "Coming soon..." };
    }
  };

  const { title, subtitle } = getHeaderTitles();
  const user = getStoredUser();
  const firstName = user?.displayName?.split(/\s+/)[0] ?? "there";

  if (!bootstrapped) {
    return null;
  }

  if (activeView === 'auth') {
    return <AuthView onLogin={() => setActiveView('studio')} />;
  }

  if (activeView === 'reset_password') {
    return (
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-bg-tertiary overflow-y-auto py-6 md:py-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-coral-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <ForgotPasswordFlow
          key={resetPasswordPrefillEmail ?? 'reset-password'}
          initialVariant="reset"
          lockVariant
          initialEmail={resetPasswordPrefillEmail ?? ''}
          firstStepBackLabel="Back to profile"
          onBack={() => {
            setResetPasswordPrefillEmail(undefined);
            setActiveView('profile');
          }}
          onSuccess={() => {
            setResetPasswordPrefillEmail(undefined);
            setActiveView('studio');
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full h-[100dvh]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 flex flex-col w-full h-full min-w-0 bg-bg-tertiary">
        <Header
          title={title}
          subtitle={subtitle}
          onViewAllProjects={() => setActiveView('projects')}
        />

        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto p-4 md:p-6 pb-[90px] md:pb-6">

            <div className={`md:hidden mb-4 mt-2 ${activeView !== 'studio' ? 'hidden' : ''}`}>
              <h2 className="text-[18px] font-medium text-text-primary">Hey, {firstName}</h2>
              <p className="text-[12px] text-text-tertiary mt-0.5">Ready to create something?</p>
            </div>

            {activeView === 'studio' ? (
              <StudioView onViewAllProjects={() => setActiveView('projects')} />
            ) : activeView === 'profile' ? (
              <ProfileView
                onUpgrade={() => setActiveView('upgrade')}
                onLogout={() => setActiveView('auth')}
                onManagePassword={(email) => {
                  setResetPasswordPrefillEmail(email || undefined);
                  setActiveView('reset_password');
                }}
              />
            ) : activeView === 'settings' ? (
              <SettingsView />
            ) : activeView === 'projects' ? (
              <ProjectsView onCreateNew={() => setActiveView('studio')} />
            ) : activeView === 'ai_tools' ? (
              <AiToolsView />
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

        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </main>
    </div>
  );
}
