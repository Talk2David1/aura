import fs from 'fs';

fs.writeFileSync(
  'src/components/studio/StatsOverview.tsx',
  `"use client";

import React from "react";
import type { VideoStudioPollState } from "@/lib/hooks/useVideoStudioPoll";

interface StatsOverviewProps {
  poll: VideoStudioPollState;
}

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3.5 px-4">
      <motionlessNum>{num}</motionlessNum>
      <div className="text-[11px] text-text-tertiary mt-0.5">{label}</div>
    </motionlessCard>
  );
}

export function StatsOverview({ poll }: StatsOverviewProps) {
  const d = poll.dashboard;
  const videos = d ? String(d.stats.videosCreated) : poll.loading ? "…" : "—";
  const minutes = d ? String(d.stats.minutesGenerated) : poll.loading ? "…" : "—";
  const credits = d ? String(d.stats.creditsLeft) : poll.loading ? "…" : "—";

  const job = d?.inProgress;
  const inProgressTitle = job ? job.title || "Untitled" : null;
  const inProgressPct = job ? Math.min(100, Math.max(0, job.progress ?? 0)) : 0;
  const inProgressHint =
    job?.status === "in_progress"
      ? "Generation in progress…"
      : job?.status === "failed"
        ? "Generation failed"
        : job
          ? String(job.status)
          : "";

  return (
    <>
      <div className="hidden md:grid grid-cols-3 gap-3 mb-6">
        <StatCard num={videos} label="Videos created" />
        <StatCard num={minutes} label="Minutes generated" />
        <StatCard num={credits} label="Credits left" />
      </div>

      <div className="md:hidden grid grid-cols-2 gap-2 mb-4 mt-1">
        <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3">
          <div className="text-[20px] font-medium text-text-primary">{videos}</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">Videos created</div>
        </motionlessBox>
        <motionlessCreditsBox credits={credits} />
      </motionlessMobile>

      {inProgressTitle ? (
        <div className="md:hidden bg-bg-primary border border-border-tertiary rounded-xl p-3 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-[12px] font-medium text-text-primary truncate pr-2">
              {inProgressTitle}
            </span>
            <span className="text-[11px] text-brand-hover font-medium shrink-0">{inProgressPct}%</span>
          </div>
          <div className="h-1 bg-bg-secondary rounded-full mb-1.5">
            <div
              className="h-full bg-brand-primary rounded-full transition-all"
              style={{ width: \`\${inProgressPct}%\` }}
            />
          </div>
          <div className="text-[10px] text-text-tertiary">
            {inProgressHint}
            {poll.hasActiveJobs ? " · Updating every few seconds" : ""}
          </div>
        </motionlessProgress>
      ) : null}
    </>
  );
}
`.replace(/<motionlessNum>/g, '<motionlessNum>').replace(/<\/motionlessNum>/g, '</motionlessNum>')
);
