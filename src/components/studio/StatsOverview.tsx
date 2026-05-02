"use client";

import React, { useEffect, useState } from 'react';
import { videoStudioService } from '@/lib/api/video-studio';

export function StatsOverview() {
  const [videos, setVideos] = useState<string>('—');
  const [minutes, setMinutes] = useState<string>('—');
  const [credits, setCredits] = useState<string>('—');
  const [inProgressTitle, setInProgressTitle] = useState<string | null>(null);
  const [inProgressPct, setInProgressPct] = useState<number>(0);
  const [inProgressHint, setInProgressHint] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await videoStudioService.getDashboard();
        if (cancelled) return;
        setVideos(String(d.stats.videosCreated));
        setMinutes(String(d.stats.minutesGenerated));
        setCredits(String(d.stats.creditsLeft));
        const job = d.inProgress;
        if (job) {
          setInProgressTitle(job.title || 'Untitled');
          setInProgressPct(Math.min(100, Math.max(0, job.progress ?? 0)));
          setInProgressHint(
            job.status === 'in_progress' ? 'Generation in progress…' : String(job.status || '')
          );
        } else {
          setInProgressTitle(null);
          setInProgressPct(0);
          setInProgressHint('');
        }
      } catch {
        if (!cancelled) {
          setVideos('—');
          setMinutes('—');
          setCredits('—');
          setInProgressTitle(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="hidden md:grid grid-cols-3 gap-3 mb-6">
        <StatCard num={videos} label="Videos created" change="+6 this week" />
        <StatCard num={minutes} label="Minutes generated" change="+32 this week" />
        <StatCard num={credits} label="Credits left" change="Renews in 4 days" changeColor="text-amber-primary" />
      </div>

      <div className="md:hidden grid grid-cols-2 gap-2 mb-4 mt-1">
        <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3">
          <div className="text-[20px] font-medium text-text-primary">{videos}</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">Videos created</div>
          <div className="text-[10px] text-success-dark mt-1">+6 this week</div>
        </div>
        <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3">
          <div className="text-[20px] font-medium text-text-primary">{credits}</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">Credits left</div>
          <div className="text-[10px] text-amber-primary mt-1">Renews in 4 days</div>
        </div>
      </div>

      {inProgressTitle ? (
        <div className="md:hidden bg-bg-primary border border-border-tertiary rounded-xl p-3 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-[12px] font-medium text-text-primary truncate pr-2">{inProgressTitle}</span>
            <span className="text-[11px] text-brand-hover font-medium shrink-0">{inProgressPct}%</span>
          </div>
          <div className="h-1 bg-bg-secondary rounded-full mb-1.5">
            <div
              className="h-full bg-brand-primary rounded-full transition-all"
              style={{ width: `${inProgressPct}%` }}
            />
          </div>
          <div className="text-[10px] text-text-tertiary">{inProgressHint}</div>
        </div>
      ) : null}
    </>
  );
}

function StatCard({
  num,
  label,
  change,
  changeColor = 'text-success-dark',
}: {
  num: string;
  label: string;
  change: string;
  changeColor?: string;
}) {
  return (
    <div className="bg-bg-primary border border-border-tertiary rounded-xl p-3.5 px-4">
      <div className="text-[22px] font-medium text-text-primary">{num}</div>
      <div className="text-[11px] text-text-tertiary mt-0.5">{label}</div>
      <div className={`text-[11px] mt-1 ${changeColor}`}>{change}</div>
    </div>
  );
}
