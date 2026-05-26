"use client";

import React, { useMemo, useState } from "react";
import { Circle, Play } from "lucide-react";
import {
  formatProjectDuration,
  getPlaybackUrls,
  isImageOnlyOutput,
  modeLabel,
  type ApiVideoProject,
} from "@/lib/api/video-studio";
import type { VideoStudioPollState } from "@/lib/hooks/useVideoStudioPoll";
import { VideoPlayerModal } from "@/components/studio/VideoPlayerModal";

const getTagClasses = (tag: string) => {
  switch (tag) {
    case "Faceless":
      return "bg-brand-light text-brand-hover";
    case "Text-to-video":
      return "bg-success-light text-success-dark";
    case "YT repurpose":
      return "bg-coral-light text-coral-dark";
    case "Photos + script":
      return "bg-amber-light text-amber-primary";
    default:
      return "bg-amber-light text-amber-primary";
  }
};

interface RecentVideosProps {
  poll: VideoStudioPollState;
  onViewAllProjects?: () => void;
}

export function RecentVideos({ poll, onViewAllProjects }: RecentVideosProps) {
  const [player, setPlayer] = useState<ApiVideoProject | null>(null);
  const recent = poll.dashboard?.recentVideos ?? [];
  const playlist = useMemo(() => recent.slice(0, 4), [recent]);
  const featured = playlist[0];
  const job = poll.dashboard?.inProgress;
  const inProgressTitle = job ? job.title || "Untitled" : null;
  const inProgressPct = job ? Math.min(100, Math.max(0, job.progress ?? 0)) : 0;

  const openPlayer = (p: ApiVideoProject) => {
    if (getPlaybackUrls(p).length) setPlayer(p);
  };

  return (
    <>
      <div className="bg-bg-primary border border-border-tertiary rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-3.5 border-b border-border-tertiary">
          <div className="flex items-center gap-1.5 text-[14px] font-medium text-text-primary">
            <Circle size={12} className="text-brand-primary" />
            Recent videos
          </div>
          {onViewAllProjects ? (
            <button type="button" onClick={onViewAllProjects} className="text-[12px] text-brand-primary hover:underline">
              See all
            </button>
          ) : (
            <span className="text-[12px] text-brand-primary">See all</span>
          )}
        </div>

        <div className="p-3">
          <div className="rounded-2xl bg-[#171a3d] text-white p-3.5">
            {featured && getPlaybackUrls(featured).length > 0 ? (
              <button type="button" onClick={() => openPlayer(featured)} className="w-full h-28 rounded-xl flex items-center justify-center bg-white/10 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                  <Play size={16} className="text-brand-primary ml-0.5" />
                </div>
              </button>
            ) : (
              <div className="h-28 rounded-xl flex items-center justify-center bg-white/5 mb-3">
                <p className="text-[12px] text-white/60">No playable video yet</p>
              </div>
            )}
            {featured ? (
              <div className="mb-2">
                <p className="text-[15px] font-semibold">{featured.title || "Untitled"}</p>
                <p className="text-[12px] text-white/70">
                  {modeLabel(featured.mode)} · {formatProjectDuration(featured.durationSeconds)}
                </p>
              </div>
            ) : (
              <p className="text-[13px] text-white/70 text-center">No completed videos yet.</p>
            )}
          </div>
        </div>

        <div className="border-t border-border-tertiary">
          {playlist.length === 0 ? (
            <div className="px-3 py-6 text-center text-[12px] text-text-tertiary">
              {poll.loading ? "Loading…" : "Nothing in your recent list yet."}
            </div>
          ) : (
            playlist.map((video) => {
              const canPlay = getPlaybackUrls(video).length > 0;
              return (
                <div key={video.id} className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border-tertiary">
                  <button type="button" disabled={!canPlay} onClick={() => openPlayer(video)} className="w-12 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0 disabled:opacity-40">
                    <Play size={12} className="text-brand-primary ml-0.5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-text-primary truncate">{video.title || "Untitled"}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getTagClasses(modeLabel(video.mode))}`}>{modeLabel(video.mode)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {inProgressTitle ? (
          <div className="px-3 py-3 border-t border-border-tertiary">
            <div className="flex justify-between mb-1 text-[13px]">
              <span className="truncate text-text-primary">In progress · {inProgressTitle}</span>
              <span className="text-brand-hover font-medium">{inProgressPct}%</span>
            </div>
            <div className="h-1 bg-border-tertiary rounded-full mb-1.5">
              <div className="h-full bg-brand-primary rounded-full" style={{ width: `${inProgressPct}%` }} />
            </div>
            <p className="text-[12px] text-text-tertiary">Rendering…{poll.hasActiveJobs ? " (updating)" : ""}</p>
          </div>
        ) : null}
      </div>

      {player ? (
        <VideoPlayerModal
          title={player.title || "Untitled"}
          urls={getPlaybackUrls(player)}
          hasAudio={player.hasAudio}
          isImageOnly={isImageOnlyOutput(player)}
          onClose={() => setPlayer(null)}
        />
      ) : null}
    </>
  );
}
