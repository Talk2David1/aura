"use client";

import React, { useEffect, useState } from 'react';
import { PlaySquare, FolderDot, History, LayoutTemplate, Image, User, Settings, ArrowUpRight } from 'lucide-react';
import { getStoredUser } from '@/lib/api/auth';
import { studioService } from '@/lib/api/studio';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [displayName, setDisplayName] = useState<string>('Account');

  useEffect(() => {
    const user = getStoredUser();
    const fromSession =
      user?.displayName?.trim() ||
      [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
      user?.email?.trim() ||
      'Account';
    setDisplayName(fromSession);

    let cancelled = false;
    (async () => {
      try {
        const profile = await studioService.getProfile();
        if (cancelled) return;
        if (profile.fullName?.trim()) setDisplayName(profile.fullName.trim());
      } catch {
        /* keep session display name */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const NavItem = ({ id, icon: Icon, label, active, onClick }: any) => (
    <div
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] mb-0.5 transition-colors ${
        active
          ? 'bg-brand-light text-brand-hover font-medium'
          : 'text-text-secondary hover:bg-bg-secondary'
      }`}
    >
      <Icon size={14} className={active ? 'text-brand-hover' : 'text-text-secondary'} />
      {label}
    </div>
  );

  return (
    <aside className="hidden md:flex w-[220px] shrink-0 bg-bg-primary border-r border-border-tertiary flex-col p-0">
      <div className="p-5 pb-4 border-b border-border-tertiary">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center text-white">
            <PlaySquare size={16} />
          </div>
          <span className="text-[15px] font-medium text-text-primary">Aura</span>
          <span className="text-[10px] text-brand-primary bg-brand-light px-1.5 py-0.5 rounded ml-0.5">AI</span>
        </div>
      </div>

      <nav className="p-3 px-2.5 flex-1 overflow-y-auto">
        <div className="text-[10px] text-text-tertiary px-2 py-2.5 pb-1 tracking-wider uppercase">Create</div>
        <NavItem id="studio" icon={PlaySquare} label="Video studio" active={activeView === 'studio'} onClick={setActiveView} />
        <NavItem id="projects" icon={FolderDot} label="My projects" active={activeView === 'projects'} onClick={setActiveView} />
        <NavItem id="history" icon={History} label="History" active={activeView === 'history'} onClick={setActiveView} />

        <div className="text-[10px] text-text-tertiary px-2 py-2.5 pb-1 tracking-wider uppercase mt-2">Library</div>
        <NavItem id="templates" icon={LayoutTemplate} label="Templates" active={activeView === 'templates'} onClick={setActiveView} />
        <NavItem id="assets" icon={Image} label="Assets" active={activeView === 'assets'} onClick={setActiveView} />

        <div className="text-[10px] text-text-tertiary px-2 py-2.5 pb-1 tracking-wider uppercase mt-2">Account</div>
        <NavItem id="profile" icon={User} label="Profile" active={activeView === 'profile'} onClick={setActiveView} />
        <NavItem id="settings" icon={Settings} label="Settings" active={activeView === 'settings'} onClick={setActiveView} />
      </nav>

      <div className="p-3.5 px-4 border-t border-border-tertiary">
        <button
          type="button"
          aria-label="Open profile"
          onClick={() => setActiveView('profile')}
          className="w-full flex items-center gap-2 hover:bg-bg-secondary p-1 -mx-1 rounded-lg cursor-pointer transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-[#AFA9EC] flex items-center justify-center text-[11px] font-medium text-[#26215C] shrink-0">
            {initialsFromName(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-text-primary leading-tight truncate">{displayName}</p>
          </div>
          <ArrowUpRight size={14} className="text-text-tertiary shrink-0" />
        </button>
      </div>
    </aside>
  );
}
