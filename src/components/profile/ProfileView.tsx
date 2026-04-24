import React from 'react';
import { User, Mail, CreditCard, LogOut, ArrowRight, ShieldCheck, PlaySquare, Calendar } from 'lucide-react';

export function ProfileView({ onUpgrade, onLogout }: { onUpgrade?: () => void, onLogout?: () => void }) {
  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl p-4 md:p-6 mb-8 max-w-4xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-border-tertiary gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#AFA9EC] flex items-center justify-center text-[24px] md:text-[28px] font-medium text-[#26215C]">
            AC
          </div>
          <div>
            <h2 className="text-[20px] md:text-[24px] font-medium text-text-primary">Adaeze C.</h2>
            <div className="flex items-center gap-2 mt-1">
              <Mail size={14} className="text-text-tertiary" />
              <span className="text-[13px] text-text-secondary">adaeze@example.com</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-medium text-amber-primary bg-amber-light px-2 py-0.5 rounded-full uppercase tracking-wide">
                Pro Plan
              </span>
              <span className="text-[12px] text-text-tertiary hidden md:inline">• Member since Oct 2024</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-bg-secondary border border-border-secondary rounded-lg text-[13px] font-medium text-text-secondary hover:border-border-tertiary hover:bg-border-tertiary transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-[14px] font-medium text-text-primary mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-brand-primary" />
            Subscription & Credits
          </h3>
          <div className="bg-bg-secondary border border-border-tertiary rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[13px] font-medium text-text-primary">Monthly Credits</span>
              <span className="text-[13px] font-medium text-amber-primary">8 / 100 left</span>
            </div>
            <div className="h-1.5 bg-border-tertiary rounded-full mb-3">
              <div className="h-full bg-amber-primary rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-[11px] text-text-tertiary mb-4">Your plan renews in 4 days. Credits do not roll over.</p>
            <button 
              onClick={onUpgrade}
              className="w-full py-2 bg-brand-light text-brand-hover rounded-lg text-[13px] font-medium hover:bg-[#DEDCFC] transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-medium text-text-primary mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-success-primary" />
            Security & Account
          </h3>
          <div className="border border-border-tertiary rounded-xl divide-y divide-border-tertiary">
            <div className="p-3 md:p-4 flex justify-between items-center cursor-pointer hover:bg-bg-secondary transition-colors rounded-t-xl">
              <div>
                <div className="text-[13px] font-medium text-text-primary">Password</div>
                <div className="text-[11px] text-text-tertiary mt-0.5">Last changed 3 months ago</div>
              </div>
              <ArrowRight size={16} className="text-text-tertiary" />
            </div>
            <div className="p-3 md:p-4 flex justify-between items-center cursor-pointer hover:bg-bg-secondary transition-colors">
              <div>
                <div className="text-[13px] font-medium text-text-primary">Two-Factor Auth</div>
                <div className="text-[11px] text-text-tertiary mt-0.5">Currently enabled</div>
              </div>
              <ArrowRight size={16} className="text-text-tertiary" />
            </div>
            <div 
              onClick={onLogout}
              className="p-3 md:p-4 flex justify-between items-center cursor-pointer hover:bg-coral-light group transition-colors rounded-b-xl"
            >
              <div className="flex items-center gap-2 text-coral-dark">
                <LogOut size={16} />
                <span className="text-[13px] font-medium">Log out of all devices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
