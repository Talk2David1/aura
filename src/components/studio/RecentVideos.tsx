import React from 'react';
import { Circle, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const playlist = [
  { id: 1, title: '5 stocks to watch in Q3', tag: 'Faceless', dur: '2:14', thumbColor: 'bg-brand-light', iconColor: 'text-brand-primary' },
  { id: 2, title: 'Morning routine for focus', tag: 'Text-to-video', dur: '0:58', thumbColor: 'bg-success-light', iconColor: 'text-success-dark' },
  { id: 3, title: 'AI tools for creators 2025', tag: 'YT repurpose', dur: '3:40', thumbColor: 'bg-coral-light', iconColor: 'text-coral-dark' },
  { id: 4, title: "Beginner's guide to budgeting", tag: 'Photos + script', dur: '1:45', thumbColor: 'bg-amber-light', iconColor: 'text-amber-primary' },
];

const getTagClasses = (tag: string) => {
  switch (tag) {
    case 'Faceless':
      return 'bg-brand-light text-brand-hover';
    case 'Text-to-video':
      return 'bg-success-light text-success-dark';
    case 'YT repurpose':
      return 'bg-coral-light text-coral-dark';
    default:
      return 'bg-amber-light text-amber-primary';
  }
};

export function RecentVideos() {
  const nowPlaying = playlist[0];

  return (
    <div className="bg-bg-primary border border-border-tertiary rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-3.5 border-b border-border-tertiary">
        <div className="flex items-center gap-1.5 text-[14px] font-medium text-text-primary">
          <Circle size={12} className="text-brand-primary" />
          Recent videos
        </div>
        <span className="text-[12px] text-brand-primary cursor-pointer hover:underline">See all</span>
      </div>

      <div className="p-3">
        <div className="rounded-2xl bg-[#171a3d] text-white p-3.5">
          <div className="h-28 rounded-xl flex items-center justify-center bg-transparent mb-3">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
              <Play size={16} className="text-brand-primary ml-0.5" />
            </div>
          </div>

          <p className="text-[30px] leading-none text-center tracking-[5px] text-brand-primary/60 mb-4">IIIIIIII</p>

          <div className="mb-2">
            <p className="text-[15px] font-semibold">{nowPlaying.title}</p>
            <p className="text-[12px] text-white/70">
              {nowPlaying.tag} · {nowPlaying.dur}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-white/70 mb-3">
            <span>0:51</span>
            <div className="h-0.5 flex-1 bg-white/30 rounded-full relative">
              <div className="absolute left-0 top-0 h-full w-[38%] bg-white/80 rounded-full" />
              <div className="absolute left-[38%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span>2:14</span>
          </div>

          <div className="flex items-center justify-between text-white/90">
            <SkipBack size={14} />
            <Play size={18} className="ml-0.5" />
            <SkipForward size={14} />
            <div className="flex items-center gap-2">
              <Volume2 size={14} />
              <div className="w-10 h-0.5 bg-white/40 rounded-full">
                <div className="w-6 h-full bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border-tertiary">
        {playlist.slice(0, 4).map((video, index) => {
          const isNowPlaying = index === 0;

          return (
            <div
              key={video.id}
              className={`flex items-center gap-2.5 px-3 py-2.5 border-b border-border-tertiary last:border-b-0 ${
                isNowPlaying ? 'bg-brand-light/50' : 'bg-bg-primary'
              }`}
            >
              <div className={`w-12 h-10 rounded-lg ${video.thumbColor} flex items-center justify-center`}>
                <Play size={12} className={`${video.iconColor} ml-0.5`} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-text-primary truncate">{video.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getTagClasses(video.tag)}`}>{video.tag}</span>
                  <span className="text-[11px] text-text-tertiary">{video.dur}</span>
                </div>
              </div>

              {isNowPlaying ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-primary text-white font-medium">Now playing</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="px-3 py-3 border-t border-border-tertiary">
        <div className="flex items-center justify-between mb-1 text-[13px]">
          <div className="flex items-center gap-1.5 text-text-primary">
            <Circle size={8} className="fill-amber-600 text-amber-600" />
            <span>In progress · Crypto beginner's guide</span>
          </div>
          <span className="text-brand-hover font-medium">73%</span>
        </div>
        <div className="h-1 bg-border-tertiary rounded-full mb-1.5">
          <div className="h-full bg-brand-primary rounded-full" style={{ width: '73%' }} />
        </div>
        <p className="text-[12px] text-text-tertiary">Rendering audio track...</p>
      </div>
    </div>
  );
}
