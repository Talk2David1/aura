import fs from 'fs';
import path from 'path';

const dc = '</' + 'div>';
const odiv = '<' + 'div';

function writeStats() {
  const L = (s) => s;
  const content = [
    '"use client";',
    '',
    'import React from "react";',
    'import type { VideoStudioPollState } from "@/lib/hooks/useVideoStudioPoll";',
    '',
    'interface StatsOverviewProps {',
    '  poll: VideoStudioPollState;',
    '}',
    '',
    'function StatCard({ num, label }: { num: string; label: string }) {',
    '  return (',
    `    ${odiv} className="bg-bg-primary border border-border-tertiary rounded-xl p-3.5 px-4">`,
    `      ${odiv} className="text-[22px] font-medium text-text-primary">{num}${dc}`,
    `      ${odiv} className="text-[11px] text-text-tertiary mt-0.5">{label}${dc}`,
    `    ${dc}`,
    '  );',
    '}',
    '',
    'export function StatsOverview({ poll }: StatsOverviewProps) {',
    '  const d = poll.dashboard;',
    '  const videos = d ? String(d.stats.videosCreated) : poll.loading ? "…" : "—";',
    '  const minutes = d ? String(d.stats.minutesGenerated) : poll.loading ? "…" : "—";',
    '  const credits = d ? String(d.stats.creditsLeft) : poll.loading ? "…" : "—";',
    '',
    '  const job = d?.inProgress;',
    '  const inProgressTitle = job ? job.title || "Untitled" : null;',
    '  const inProgressPct = job ? Math.min(100, Math.max(0, job.progress ?? 0)) : 0;',
    '  const inProgressHint =',
    '    job?.status === "in_progress"',
    '      ? "Generation in progress…"',
    '      : job?.status === "failed"',
    '        ? "Generation failed"',
    '        : job',
    '          ? String(job.status)',
    '          : "";',
    '',
    '  return (',
    '    <>',
    `      ${odiv} className="hidden md:grid grid-cols-3 gap-3 mb-6">`,
    '        <StatCard num={videos} label="Videos created" />',
    '        <StatCard num={minutes} label="Minutes generated" />',
    '        <StatCard num={credits} label="Credits left" />',
    `      ${dc}`,
    '',
    `      ${odiv} className="md:hidden grid grid-cols-2 gap-2 mb-4 mt-1">`,
    `        ${odiv} className="bg-bg-primary border border-border-tertiary rounded-xl p-3">`,
    `          ${odiv} className="text-[20px] font-medium text-text-primary">{videos}${dc}`,
    `          ${odiv} className="text-[10px] text-text-tertiary mt-0.5">Videos created${dc}`,
    `        ${dc}`,
    `        ${odiv} className="bg-bg-primary border border-border-tertiary rounded-xl p-3">`,
    `          ${odiv} className="text-[20px] font-medium text-text-primary">{credits}${dc}`,
    `          ${odiv} className="text-[10px] text-text-tertiary mt-0.5">Credits left${dc}`,
    `        ${dc}`,
    `      ${dc}`,
    '',
    '      {inProgressTitle ? (',
    `        ${odiv} className="md:hidden bg-bg-primary border border-border-tertiary rounded-xl p-3 mb-4">`,
    `          ${odiv} className="flex justify-between mb-2">`,
    `            <span className="text-[12px] font-medium text-text-primary truncate pr-2">`,
    '              {inProgressTitle}',
    '            </span>',
    '            <span className="text-[11px] text-brand-hover font-medium shrink-0">{inProgressPct}%</span>',
    `          ${dc}`,
    `          ${odiv} className="h-1 bg-bg-secondary rounded-full mb-1.5">`,
    `            ${odiv}`,
    '              className="h-full bg-brand-primary rounded-full transition-all"',
    '              style={{ width: `${inProgressPct}%` }}',
    '            />',
    `          ${dc}`,
    `          ${odiv} className="text-[10px] text-text-tertiary">`,
    '            {inProgressHint}',
    '            {poll.hasActiveJobs ? " · Updating every few seconds" : ""}',
    `          ${dc}`,
    `        ${dc}`,
    '      ) : null}',
    '    </>',
    '  );',
    '}',
    '',
  ].join('\n');

  fs.writeFileSync(path.join('src/components/studio', 'StatsOverview.tsx'), content);
}

function writeVideoPlayer() {
  const content = `"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface VideoPlayerModalProps {
  title: string;
  urls: string[];
  hasAudio?: boolean;
  isImageOnly?: boolean;
  onClose: () => void;
}

function isMediaVideo(url: string, isImageOnly: boolean): boolean {
  if (isImageOnly) return false;
  if (/\\.(jpg|jpeg|png|gif|webp)(\\?|$)/i.test(url) || url.includes("/image/upload/")) {
    return false;
  }
  return true;
}

export function VideoPlayerModal({
  title,
  urls,
  hasAudio = true,
  isImageOnly = false,
  onClose,
}: VideoPlayerModalProps) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const safeUrls = urls.filter(Boolean);
  const current = safeUrls[segmentIndex] ?? safeUrls[0];
  const isVideo = current ? isMediaVideo(current, isImageOnly) : false;

  if (!current) return null;

  return (
    ${odiv}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="presentation"
    >
      ${odiv}
        className="w-full max-w-3xl bg-bg-primary rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        ${odiv} className="flex items-center justify-between px-4 py-3 border-b border-border-tertiary">
          <h3 className="text-[14px] font-medium text-text-primary truncate pr-4">{title}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary" aria-label="Close">
            <X size={18} />
          </button>
        ${dc}

        ${odiv} className="p-4 bg-black flex items-center justify-center min-h-[200px] max-h-[70vh]">
          {isImageOnly || !isVideo ? (
            <img src={current} alt={title} className="max-h-[65vh] max-w-full object-contain" />
          ) : (
            <video key={current} src={current} controls autoPlay className="max-h-[65vh] max-w-full" playsInline />
          )}
        ${dc}

        {safeUrls.length > 1 ? (
          ${odiv} className="px-4 py-3 border-t border-border-tertiary flex items-center justify-between gap-2">
            <button type="button" disabled={segmentIndex <= 0} onClick={() => setSegmentIndex((i) => Math.max(0, i - 1))} className="flex items-center gap-1 text-[12px] text-text-secondary disabled:opacity-40">
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-[12px] text-text-tertiary">Segment {segmentIndex + 1} of {safeUrls.length}</span>
            <button type="button" disabled={segmentIndex >= safeUrls.length - 1} onClick={() => setSegmentIndex((i) => Math.min(safeUrls.length - 1, i + 1))} className="flex items-center gap-1 text-[12px] text-text-secondary disabled:opacity-40">
              Next <ChevronRight size={16} />
            </button>
          ${dc}
        ) : null}

        {!hasAudio && !isImageOnly ? (
          <p className="px-4 pb-3 text-[11px] text-text-tertiary">This clip has no generated audio.</p>
        ) : null}
        {isImageOnly ? (
          <p className="px-4 pb-3 text-[11px] text-amber-primary">Image-only output (animation unavailable).</p>
        ) : null}
      ${dc}
    ${dc}
  );
}
`;

  fs.writeFileSync(path.join('src/components/studio', 'VideoPlayerModal.tsx'), content);
}

function writeRecentVideos() {
  const content = `"use client";

import React, { useMemo, useState } from "react";
import { Circle, Play } from "lucide-react";
import {
  formatProjectDuration,
  getPlaybackUrls,
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
      ${odiv} className="bg-bg-primary border border-border-tertiary rounded-xl overflow-hidden">
        ${odiv} className="flex items-center justify-between p-3.5 border-b border-border-tertiary">
          ${odiv} className="flex items-center gap-1.5 text-[14px] font-medium text-text-primary">
            <Circle size={12} className="text-brand-primary" />
            Recent videos
          ${dc}
          {onViewAllProjects ? (
            <button type="button" onClick={onViewAllProjects} className="text-[12px] text-brand-primary hover:underline">
              See all
            </button>
          ) : (
            <span className="text-[12px] text-brand-primary">See all</span>
          )}
        ${dc}

        ${odiv} className="p-3">
          ${odiv} className="rounded-2xl bg-[#171a3d] text-white p-3.5">
            {featured && getPlaybackUrls(featured).length > 0 ? (
              <button type="button" onClick={() => openPlayer(featured)} className="w-full h-28 rounded-xl flex items-center justify-center bg-white/10 mb-3">
                ${odiv} className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                  <Play size={16} className="text-brand-primary ml-0.5" />
                ${dc}
              </button>
            ) : (
              ${odiv} className="h-28 rounded-xl flex items-center justify-center bg-white/5 mb-3">
                <p className="text-[12px] text-white/60">No playable video yet</p>
              ${dc}
            )}
            {featured ? (
              ${odiv} className="mb-2">
                <p className="text-[15px] font-semibold">{featured.title || "Untitled"}</p>
                <p className="text-[12px] text-white/70">
                  {modeLabel(featured.mode)} · {formatProjectDuration(featured.durationSeconds)}
                </p>
              ${dc}
            ) : (
              <p className="text-[13px] text-white/70 text-center">No completed videos yet.</p>
            )}
          ${dc}
        ${dc}

        ${odiv} className="border-t border-border-tertiary">
          {playlist.length === 0 ? (
            ${odiv} className="px-3 py-6 text-center text-[12px] text-text-tertiary">
              {poll.loading ? "Loading…" : "Nothing in your recent list yet."}
            ${dc}
          ) : (
            playlist.map((video) => {
              const canPlay = getPlaybackUrls(video).length > 0;
              return (
                ${odiv} key={video.id} className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border-tertiary">
                  <button type="button" disabled={!canPlay} onClick={() => openPlayer(video)} className="w-12 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0 disabled:opacity-40">
                    <Play size={12} className="text-brand-primary ml-0.5" />
                  </button>
                  ${odiv} className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-text-primary truncate">{video.title || "Untitled"}</p>
                    <span className={\`text-[10px] px-1.5 py-0.5 rounded font-medium \${getTagClasses(modeLabel(video.mode))}\`}>{modeLabel(video.mode)}</span>
                  ${dc}
                ${dc}
              );
            })
          )}
        ${dc}

        {inProgressTitle ? (
          ${odiv} className="px-3 py-3 border-t border-border-tertiary">
            ${odiv} className="flex justify-between mb-1 text-[13px]">
              <span className="truncate text-text-primary">In progress · {inProgressTitle}</span>
              <span className="text-brand-hover font-medium">{inProgressPct}%</span>
            ${dc}
            ${odiv} className="h-1 bg-border-tertiary rounded-full mb-1.5">
              <div className="h-full bg-brand-primary rounded-full" style={{ width: \`\${inProgressPct}%\` }} />
            ${dc}
            <p className="text-[12px] text-text-tertiary">Rendering…{poll.hasActiveJobs ? " (updating)" : ""}</p>
          ${dc}
        ) : null}
      ${dc}

      {player ? (
        <VideoPlayerModal
          title={player.title || "Untitled"}
          urls={getPlaybackUrls(player)}
          hasAudio={player.hasAudio}
          isImageOnly={!!player.outputVideoUrl && !(player.outputVideoUrls?.length) && !player.hasAudio}
          onClose={() => setPlayer(null)}
        />
      ) : null}
    </>
  );
}
`;
  fs.writeFileSync(path.join('src/components/studio', 'RecentVideos.tsx'), content);
}

function writeProjectsView() {
  const content = `"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Play, MoreVertical, Clock, Search, RotateCcw } from "lucide-react";
import {
  videoStudioService,
  mapApiProjectToProject,
} from "@/lib/api/video-studio";
import { useVideoStudioPoll } from "@/lib/hooks/useVideoStudioPoll";
import { VideoPlayerModal } from "@/components/studio/VideoPlayerModal";
import type { Project } from "@/types";

interface ProjectsViewProps {
  onCreateNew?: () => void;
}

export function ProjectsView({ onCreateNew }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [player, setPlayer] = useState<Project | null>(null);
  const poll = useVideoStudioPoll(true, refreshToken);

  const loadProjects = useCallback(async () => {
    try {
      const rows = await videoStudioService.listProjects({ limit: 50 });
      setProjects(rows.map(mapApiProjectToProject));
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects, refreshToken]);

  useEffect(() => {
    if (poll.hasActiveJobs) {
      const id = setInterval(() => setRefreshToken((t) => t + 1), 3000);
      return () => clearInterval(id);
    }
  }, [poll.hasActiveJobs]);

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success-light text-success-dark";
      case "generating":
        return "bg-amber-light text-amber-primary";
      case "failed":
        return "bg-coral-light text-coral-dark";
      default:
        return "bg-bg-secondary text-text-secondary";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      project.title.toLowerCase().includes(query) ||
      project.mode.toLowerCase().includes(query) ||
      project.status.toLowerCase().includes(query)
    );
  });

  return (
    <>
      ${odiv} className="bg-bg-primary md:border border-border-tertiary rounded-xl p-4 md:p-6 mb-8 min-h-[500px]">
        ${odiv} className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          ${odiv} className="flex items-center gap-2 w-full md:w-96 bg-bg-secondary border border-border-tertiary rounded-lg px-3 py-2">
            <Search size={16} className="text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="bg-transparent border-none outline-none text-[13px] text-text-primary w-full"
            />
          ${dc}
          {poll.hasActiveJobs ? (
            <span className="text-[11px] text-text-tertiary">Auto-refreshing…</span>
          ) : null}
        ${dc}

        {isLoading ? (
          ${odiv} className="flex items-center justify-center h-64 text-text-tertiary text-[13px]">Loading…${dc}
        ) : filteredProjects.length === 0 ? (
          ${odiv} className="flex items-center justify-center h-64 text-text-tertiary text-[13px]">No projects found.${dc}
        ) : (
          ${odiv} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => (
              ${odiv} key={project.id} className="group border border-border-tertiary rounded-xl overflow-hidden bg-bg-primary relative">
                ${odiv} className="aspect-video bg-bg-secondary flex items-center justify-center relative">
                  {project.thumbnail?.startsWith("http") ? (
                    <img src={project.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="text-[32px]">{project.thumbnail || "🎬"}</span>
                  )}
                  {project.status === "completed" && project.playbackUrls.length > 0 && (
                    <button type="button" onClick={() => setPlayer(project)} className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100">
                      <Play size={16} className="text-white" />
                    </button>
                  )}
                  {project.status === "generating" && (
                    ${odiv} className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand-light border-t-brand-primary rounded-full animate-spin mb-2" />
                      <span className="text-[11px] text-brand-hover">{project.progress}%</span>
                    ${dc}
                  )}
                ${dc}
                <span className={\`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] uppercase \${getStatusColor(project.status)}\`}>
                  {project.status}
                </span>
                ${odiv} className="p-3">
                  <h3 className="text-[13px] font-medium truncate">{project.title}</h3>
                  ${odiv} className="flex justify-between mt-2 text-[11px] text-text-tertiary">
                    <span>{project.mode}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{project.duration}</span>
                  ${dc}
                  {project.status === "failed" && onCreateNew ? (
                    <button type="button" onClick={onCreateNew} className="mt-2 w-full text-[11px] text-brand-primary border rounded-lg py-1.5 flex items-center justify-center gap-1">
                      <RotateCcw size={12} /> Try again
                    </button>
                  ) : null}
                ${dc}
              ${dc}
            ))}
          ${dc}
        )}
      ${dc}

      {player ? (
        <VideoPlayerModal
          title={player.title}
          urls={player.playbackUrls}
          hasAudio={player.hasAudio}
          isImageOnly={player.isImageOnly}
          onClose={() => setPlayer(null)}
        />
      ) : null}
    </>
  );
}
`;
  fs.writeFileSync(path.join('src/components/studio', 'ProjectsView.tsx'), content);
}

function writeSettingsView() {
  fs.mkdirSync('src/components/settings', { recursive: true });
  const content = `"use client";

import React, { useEffect, useState } from "react";
import { Settings, Bell, PlaySquare, Save, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { ApiError } from "@/lib/api/client";
import {
  settingsService,
  type GeneralSettings,
  type NotificationSettings,
  type VideoDefaultsSettings,
} from "@/lib/api/settings";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [general, setGeneral] = useState<GeneralSettings>({
    language: "English (US)",
    timezone: "UTC-08:00 Pacific Time",
    themePreference: "dark",
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    videoGenerationComplete: true,
    weeklyReport: false,
    productUpdates: true,
  });
  const [videoDefaults, setVideoDefaults] = useState<VideoDefaultsSettings>({
    defaultVoice: "professional_male",
    captionsStyle: "dynamic_word_by_word",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [g, n, v] = await Promise.all([
          settingsService.getGeneral(),
          settingsService.getNotifications(),
          settingsService.getVideoDefaults(),
        ]);
        if (cancelled) return;
        setGeneral(g);
        setNotifications(n);
        setVideoDefaults(v);
        if (g.themePreference) setTheme(g.themePreference);
      } catch { /* defaults */ } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [setTheme]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (activeTab === "general") {
        const updated = await settingsService.patchGeneral({
          ...general,
          themePreference: theme || general.themePreference,
        });
        setGeneral(updated);
      } else if (activeTab === "notifications") {
        setNotifications(await settingsService.patchNotifications(notifications));
      } else {
        setVideoDefaults(
          await settingsService.patchVideoDefaults({
            defaultVoice: videoDefaults.defaultVoice,
            captionsStyle: videoDefaults.captionsStyle,
          })
        );
      }
      setMessage("Settings saved.");
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const voices = videoDefaults.options?.defaultVoice ?? [
    { id: "professional_male", label: "Professional male" },
    { id: "professional_female", label: "Professional female" },
  ];
  const captions = videoDefaults.options?.captionsStyle ?? [
    { id: "dynamic_word_by_word", label: "Dynamic word-by-word" },
    { id: "standard_lower_thirds", label: "Standard lower-thirds" },
  ];

  return (
    ${odiv} className="bg-bg-primary md:border border-border-tertiary rounded-xl p-6 mb-8 max-w-4xl">
      ${odiv} className="flex gap-2 mb-6 flex-wrap">
        {(["general", "notifications", "defaults"] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={\`px-3 py-2 rounded-lg text-[13px] \${activeTab === tab ? "bg-brand-light text-brand-hover" : "text-text-secondary"}\`}>
            {tab === "general" ? "General" : tab === "notifications" ? "Notifications" : "Video defaults"}
          </button>
        ))}
      ${dc}
      {loading ? <p className="text-[13px] text-text-tertiary">Loading…</p> : null}
      {!loading && activeTab === "general" ? (
        ${odiv} className="space-y-4">
          <label className="block text-[12px] text-text-secondary">Language
            <input className="mt-1 w-full p-2 border rounded-lg bg-bg-secondary" value={general.language} onChange={(e) => setGeneral({ ...general, language: e.target.value })} />
          </label>
          <label className="block text-[12px] text-text-secondary">Timezone
            <input className="mt-1 w-full p-2 border rounded-lg bg-bg-secondary" value={general.timezone} onChange={(e) => setGeneral({ ...general, timezone: e.target.value })} />
          </label>
          ${odiv} className="flex gap-2">
            {["light", "dark", "system"].map((t) => (
              <button key={t} type="button" onClick={() => { setTheme(t); setGeneral({ ...general, themePreference: t }); }} className="px-3 py-1 border rounded-lg capitalize text-[12px]">{t}</button>
            ))}
          ${dc}
        ${dc}
      ) : null}
      {!loading && activeTab === "notifications" ? (
        ${odiv} className="space-y-3">
          {([
            ["videoGenerationComplete", "Video complete"],
            ["weeklyReport", "Weekly report"],
            ["productUpdates", "Product updates"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-3 border rounded-xl">
              <span className="text-[13px]">{label}</span>
              <input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} />
            </label>
          ))}
        ${dc}
      ) : null}
      {!loading && activeTab === "defaults" ? (
        ${odiv} className="space-y-4">
          <label className="block text-[12px]">Default voice
            <select className="mt-1 w-full p-2 border rounded-lg" value={videoDefaults.defaultVoice} onChange={(e) => setVideoDefaults({ ...videoDefaults, defaultVoice: e.target.value })}>
              {voices.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          <label className="block text-[12px]">Captions
            <select className="mt-1 w-full p-2 border rounded-lg" value={videoDefaults.captionsStyle} onChange={(e) => setVideoDefaults({ ...videoDefaults, captionsStyle: e.target.value })}>
              {captions.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
        ${dc}
      ) : null}
      {message ? <p className="text-[12px] mt-4 text-text-secondary">{message}</p> : null}
      <button type="button" onClick={save} disabled={saving || loading} className="mt-6 flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-[13px]">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
      </button>
    ${dc}
  );
}
`;
  fs.writeFileSync('src/components/settings/SettingsView.tsx', content);
}

function writeAiToolsView() {
  fs.mkdirSync('src/components/ai', { recursive: true });
  const content = `"use client";

import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { aiService } from "@/lib/api/ai";

type ToolTab = "prompt" | "image" | "character" | "remix";

export function AiToolsView() {
  const [tab, setTab] = useState<ToolTab>("prompt");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [promptIdea, setPromptIdea] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [charName, setCharName] = useState("");
  const [charDesc, setCharDesc] = useState("");
  const [remixUrl, setRemixUrl] = useState("");
  const [remixInstruction, setRemixInstruction] = useState("");

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (tab === "prompt") {
        const r = await aiService.generatePrompt({ idea: promptIdea });
        setResult(r.prompt);
      } else if (tab === "image") {
        const r = await aiService.generateImage({ prompt: imagePrompt });
        setResult(r.cloudinary?.secureUrl || r.outputs?.[0] || JSON.stringify(r));
      } else if (tab === "character") {
        const r = await aiService.generateCharacter({ name: charName, description: charDesc });
        setResult(r.cloudinary?.secureUrl || r.outputs?.[0] || JSON.stringify(r));
      } else {
        const r = await aiService.remixVideo({ sourceVideoUrl: remixUrl, instruction: remixInstruction });
        setResult(r.cloudinary?.secureUrl || r.outputs?.[0] || JSON.stringify(r));
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    ${odiv} className="bg-bg-primary border border-border-tertiary rounded-xl p-6 mb-8 max-w-2xl">
      ${odiv} className="flex items-center gap-2 mb-4">
        <Sparkles className="text-brand-primary" size={18} />
        <h2 className="text-[16px] font-medium">AI Tools</h2>
      ${dc}
      ${odiv} className="flex flex-wrap gap-2 mb-4">
        {(["prompt", "image", "character", "remix"] as ToolTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={\`px-3 py-1.5 rounded-lg text-[12px] capitalize \${tab === t ? "bg-brand-light text-brand-hover" : "text-text-secondary"}\`}>{t}</button>
        ))}
      ${dc}
      {tab === "prompt" ? (
        <textarea rows={3} value={promptIdea} onChange={(e) => setPromptIdea(e.target.value)} placeholder="Your idea…" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
      ) : null}
      {tab === "image" ? (
        <textarea rows={3} value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="Image prompt…" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
      ) : null}
      {tab === "character" ? (
        <>
          <input value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded-lg mb-2 text-[13px]" />
          <textarea rows={2} value={charDesc} onChange={(e) => setCharDesc(e.target.value)} placeholder="Description" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
        </>
      ) : null}
      {tab === "remix" ? (
        <>
          <input value={remixUrl} onChange={(e) => setRemixUrl(e.target.value)} placeholder="Source video URL" className="w-full p-2 border rounded-lg mb-2 text-[13px]" />
          <textarea rows={2} value={remixInstruction} onChange={(e) => setRemixInstruction(e.target.value)} placeholder="Instruction" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
        </>
      ) : null}
      <button type="button" onClick={run} disabled={loading} className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[13px] flex items-center gap-2">
        {loading ? <Loader2 size={14} className="animate-spin" /> : null} Run
      </button>
      {error ? <p className="text-[12px] text-coral-primary mt-3">{error}</p> : null}
      {result ? <pre className="mt-3 p-3 bg-bg-secondary rounded-lg text-[11px] whitespace-pre-wrap break-all">{result}</pre> : null}
    ${dc}
  );
}
`;
  fs.writeFileSync('src/components/ai/AiToolsView.tsx', content);
}

writeStats();
writeVideoPlayer();
writeRecentVideos();
writeProjectsView();
writeSettingsView();
writeAiToolsView();
console.log('Fixed components');
