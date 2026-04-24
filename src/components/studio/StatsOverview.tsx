import React from 'react';

export function StatsOverview() {
  return (
    <>
      {/* Desktop Stat Row */}
      <div className="hidden md:grid grid-cols-3 gap-3 mb-6">
        <StatCard num="24" label="Videos created" change="+6 this week" />
        <StatCard num="180" label="Minutes generated" change="+32 this week" />
        <StatCard num="8" label="Credits left" change="Renews in 4 days" changeColor="text-amber-primary" />
      </div>

      {/* Mobile Stat Row */}
      <div className="md:hidden grid grid-cols-2 gap-2 mb-4 mt-1">
        <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3">
          <div className="text-[20px] font-medium text-text-primary">24</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">Videos created</div>
          <div className="text-[10px] text-success-dark mt-1">+6 this week</div>
        </div>
        <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3">
          <div className="text-[20px] font-medium text-text-primary">8</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">Credits left</div>
          <div className="text-[10px] text-amber-primary mt-1">Renews in 4 days</div>
        </div>
      </div>
      
      {/* Mobile Active Progress (Visible only on mobile) */}
      <div className="md:hidden bg-bg-primary border border-border-tertiary rounded-xl p-3 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-[12px] font-medium text-text-primary">Crypto beginner's guide</span>
          <span className="text-[11px] text-brand-hover font-medium">73%</span>
        </div>
        <div className="h-1 bg-bg-secondary rounded-full mb-1.5">
          <div className="h-full bg-brand-primary rounded-full transition-all" style={{ width: '73%' }}></div>
        </div>
        <div className="text-[10px] text-text-tertiary">Rendering audio track...</div>
      </div>
    </>
  );
}

function StatCard({ num, label, change, changeColor = 'text-success-dark' }: { num: string, label: string, change: string, changeColor?: string }) {
  return (
    <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3.5 px-4">
      <div className="text-[22px] font-medium text-text-primary">{num}</div>
      <div className="text-[11px] text-text-tertiary mt-0.5">{label}</div>
      <div className={`text-[11px] mt-1 ${changeColor}`}>{change}</div>
    </div>
  );
}
