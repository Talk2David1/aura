"use client";

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
      <div className="bg-bg-primary md:border border-border-tertiary rounded-xl p-4 md:p-6 mb-8 min-h-[500px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 w-full md:w-96 bg-bg-secondary border border-border-tertiary rounded-lg px-3 py-2">
            <Search size={16} className="text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="bg-transparent border-none outline-none text-[13px] text-text-primary w-full"
            />
          </div>
          {poll.hasActiveJobs ? (
            <span className="text-[11px] text-text-tertiary">Auto-refreshing…</span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-text-tertiary text-[13px]">Loading…</div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-text-tertiary text-[13px]">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group border border-border-tertiary rounded-xl overflow-hidden bg-bg-primary relative">
                <div className="aspect-video bg-bg-secondary flex items-center justify-center relative">
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
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand-light border-t-brand-primary rounded-full animate-spin mb-2" />
                      <span className="text-[11px] text-brand-hover">{project.progress}%</span>
                    </div>
                  )}
                </div>
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] uppercase ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <div className="p-3">
                  <h3 className="text-[13px] font-medium truncate">{project.title}</h3>
                  <div className="flex justify-between mt-2 text-[11px] text-text-tertiary">
                    <span>{project.mode}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{project.duration}</span>
                  </div>
                  {project.status === "failed" && onCreateNew ? (
                    <button type="button" onClick={onCreateNew} className="mt-2 w-full text-[11px] text-brand-primary border rounded-lg py-1.5 flex items-center justify-center gap-1">
                      <RotateCcw size={12} /> Try again
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
