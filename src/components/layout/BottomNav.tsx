import React from 'react';
import { PlaySquare, FolderDot, LayoutTemplate, User } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function BottomNav({ activeView, setActiveView }: BottomNavProps) {
  const NavTab = ({ id, icon: Icon, label, active, onClick }: any) => (
    <div 
      className="flex flex-col items-center gap-1 cursor-pointer px-3 py-1 flex-1 transition-colors"
      onClick={() => onClick(id)}
    >
      <Icon size={20} className={active ? 'text-brand-primary' : 'text-text-tertiary'} />
      <span className={`text-[10px] ${active ? 'text-brand-primary font-medium' : 'text-text-tertiary'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="md:hidden bg-bg-primary border-t border-border-tertiary py-2 pb-4 flex justify-around w-full shrink-0">
      <NavTab id="studio" icon={PlaySquare} label="Studio" active={activeView === 'studio'} onClick={setActiveView} />
      <NavTab id="projects" icon={FolderDot} label="Projects" active={activeView === 'projects'} onClick={setActiveView} />
      <NavTab id="templates" icon={LayoutTemplate} label="Templates" active={activeView === 'templates'} onClick={setActiveView} />
      <NavTab id="profile" icon={User} label="Profile" active={activeView === 'profile'} onClick={setActiveView} />
    </div>
  );
}
