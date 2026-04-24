import React from 'react';
import { Bell, PlaySquare } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex py-3.5 px-6 bg-bg-primary border-b border-border-tertiary items-center justify-between shrink-0">
        <div>
          <h1 className="text-[16px] font-medium text-text-primary leading-tight">{title}</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-transparent text-text-secondary border border-border-secondary px-3.5 py-1.5 rounded-lg text-[13px] hover:bg-bg-secondary transition-colors">
            View all projects
          </button>
          <button className="bg-brand-primary text-white border-none px-4 py-1.5 rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors">
            + New video
          </button>
        </div>
      </header>

      {/* Mobile Topnav */}
      <header className="md:hidden bg-bg-primary px-4 pt-2.5 pb-3 border-b border-border-tertiary shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-brand-primary flex items-center justify-center text-white">
              <PlaySquare size={14} />
            </div>
            <span className="text-[14px] font-medium text-text-primary">Aura</span>
            <span className="text-[9px] text-brand-hover bg-brand-light px-1.5 py-0.5 rounded ml-0.5">AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-bg-secondary border border-border-tertiary flex items-center justify-center text-text-secondary">
              <Bell size={14} />
            </button>
            <div className="w-[30px] h-[30px] rounded-full bg-[#AFA9EC] flex items-center justify-center text-[11px] font-medium text-[#26215C]">
              AC
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
