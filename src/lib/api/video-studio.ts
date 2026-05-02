import { apiClient } from './client';
import type { Project } from '@/types';

/** Raw project shape from Nest `/video-studio` routes */
export interface ApiVideoProject {
  id: string;
  mode: string;
  title: string | null;
  status: string;
  progress: number;
  videoLength: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  outputVideoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiDashboard {
  stats: {
    videosCreated: number;
    minutesGenerated: number;
    creditsLeft: number;
  };
  recentVideos: ApiVideoProject[];
  inProgress: ApiVideoProject | null;
}

export function formatProjectDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '—';
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function mapApiStatus(status: string): Project['status'] {
  if (status === 'completed') return 'completed';
  if (status === 'failed') return 'failed';
  return 'generating';
}

function mapApiMode(mode: string): Project['mode'] {
  switch (mode) {
    case 'text_to_video':
      return 'text-to-video';
    case 'photos_script':
      return 'photos-to-video';
    case 'youtube_repurpose':
      return 'youtube';
    case 'faceless_video':
      return 'faceless';
    default:
      return 'text-to-video';
  }
}

export function mapApiProjectToProject(p: ApiVideoProject): Project {
  const thumb = p.thumbnailUrl || '🎬';
  return {
    id: p.id,
    title: p.title || 'Untitled',
    thumbnail: thumb,
    status: mapApiStatus(p.status),
    mode: mapApiMode(p.mode),
    duration: formatProjectDuration(p.durationSeconds),
    createdAt: p.createdAt,
  };
}

export function modeLabel(mode: string): string {
  switch (mode) {
    case 'text_to_video':
      return 'Text-to-video';
    case 'photos_script':
      return 'Photos + script';
    case 'youtube_repurpose':
      return 'YT repurpose';
    case 'faceless_video':
      return 'Faceless';
    default:
      return mode.replace(/_/g, ' ');
  }
}

export const videoStudioService = {
  async getDashboard(): Promise<ApiDashboard> {
    return apiClient<ApiDashboard>('/video-studio/dashboard');
  },

  async listProjects(params?: { status?: string; limit?: number }): Promise<ApiVideoProject[]> {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.limit != null) q.set('limit', String(params.limit));
    const qs = q.toString();
    return apiClient<ApiVideoProject[]>(`/video-studio/projects${qs ? `?${qs}` : ''}`);
  },

  async createProject(body: Record<string, unknown>): Promise<ApiVideoProject> {
    return apiClient<ApiVideoProject>('/video-studio/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
