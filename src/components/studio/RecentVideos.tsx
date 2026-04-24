import React from 'react';
import { Play, Circle } from 'lucide-react';

const videos = [
  { id: 1, title: '5 stocks to watch in Q3', emoji: '📈', tag: 'Faceless', tagColor: 'tag-purple', dur: '2:14', thumbColor: 'bg-brand-light', iconColor: 'text-brand-primary' },
  { id: 2, title: 'Morning routine for focus', emoji: '🧘', tag: 'Text-to-video', tagColor: 'tag-teal', dur: '0:58', thumbColor: 'bg-success-light', iconColor: 'text-success-dark' },
  { id: 3, title: 'AI tools for creators 2025', emoji: '🤖', tag: 'YT repurpose', tagColor: 'tag-coral', dur: '3:40', thumbColor: 'bg-coral-light', iconColor: 'text-coral-dark' },
];

export function RecentVideos() {
  return (
    <div className="bg-transparent md:bg-bg-primary md:border border-border-tertiary rounded-xl md:p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 text-[14px] font-medium text-text-primary">
          <Circle size={14} className="text-brand-primary fill-brand-primary hidden md:block" />
          <span className="md:hidden hidden md:inline ml-1 font-medium">Recent videos</span>
          <span className="md:hidden font-medium">Recent videos</span>
        </div>
        <span className="text-[11px] md:text-[12px] text-brand-primary cursor-pointer hover:underline">See all</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-3 flex-1 content-start">
        {videos.map((vid) => (
          <div key={vid.id} className="flex md:flex-col bg-bg-primary border border-border-tertiary rounded-xl overflow-hidden cursor-pointer hover:border-[#AFA9EC] transition-all">
            <div className={`w-[72px] md:w-full h-[72px] md:h-[90px] shrink-0 flex flex-col items-center justify-center relative ${vid.thumbColor}`}>
              <div className="text-[18px] md:text-[22px]">{vid.emoji}</div>
              <div className="absolute w-5 h-5 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center z-10">
                <Play size={10} className={`${vid.iconColor} ml-0.5`} />
              </div>
            </div>
            <div className="p-2.5 md:p-3 flex-1 min-w-0 flex flex-col justify-center md:justify-start">
              <div className="text-[12px] font-medium text-text-primary mb-1 md:mb-1.5 whitespace-nowrap md:whitespace-normal overflow-hidden overflow-ellipsis">{vid.title}</div>
              <div className="flex items-center gap-1.5 md:justify-between">
                <span className={`text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded font-medium ${
                  vid.tagColor === 'tag-purple' ? 'bg-brand-light text-brand-hover' :
                  vid.tagColor === 'tag-teal' ? 'bg-success-light text-success-dark' :
                  'bg-coral-light text-coral-dark'
                }`}>
                  {vid.tag}
                </span>
                <span className="text-[10px] text-text-tertiary">{vid.dur}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop In Progress (Hidden on mobile as it's separate) */}
      <div className="hidden md:block mt-5 pt-4 border-t border-border-tertiary">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-text-primary mb-3">
          <Circle size={14} className="text-brand-primary" />
          In progress
        </div>
        <div className="bg-bg-secondary rounded-xl p-3">
          <div className="flex justify-between mb-2">
            <span className="text-[12px] font-medium text-text-primary">Crypto beginner's guide</span>
            <span className="text-[11px] text-brand-hover">73%</span>
          </div>
          <div className="h-1 bg-border-tertiary rounded-full mb-1.5">
            <div className="h-full bg-brand-primary rounded-full transition-all" style={{ width: '73%' }}></div>
          </div>
          <div className="text-[11px] text-text-tertiary">Rendering audio track...</div>
        </div>
      </div>
    </div>
  );
}
