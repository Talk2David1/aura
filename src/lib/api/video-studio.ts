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
  outputVideoUrls: string[];
  hasAudio: boolean;
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

export interface StudioOptionItem {
  id: string;
  label: string;
  description?: string;
}

export interface VideoStudioOptions {
  creationModes: StudioOptionItem[];
  dropdowns: {
    videoLengths: StudioOptionItem[];
    voiceStyles: StudioOptionItem[];
    visualStyles: StudioOptionItem[];
    niches: StudioOptionItem[];
    aspectRatios: StudioOptionItem[];
  };
}

export interface TextToVideoBody {
  title?: string;
  prompt: string;
  voiceStyle: string;
  visualStyle: string;
  videoLength: string;
}

export interface PhotosScriptBody {
  title?: string;
  photos: string[];
  script: string;
  videoLength: string;
}

export interface YoutubeRepurposeBody {
  title?: string;
  youtubeUrl: string;
  additionalPhotos?: string[];
  customScript?: string;
  videoLength: string;
}

export interface FacelessVideoBody {
  title?: string;
  topic: string;
  niche: string;
  aspectRatio: string;
  videoLength: string;
}

export const POLL_INTERVAL_MS = 3000;

export function formatProjectDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '—';
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export function mapApiStatus(status: string): Project['status'] {
  if (status === 'completed') return 'completed';
  if (status === 'failed') return 'failed';
  return 'generating';
}

export function mapApiMode(mode: string): Project['mode'] {
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

function isLikelyImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url) || url.includes('/image/upload/');
}

/** Playback uses the composed output first; clip URLs are supporting fallbacks only. */
export function getPlaybackUrls(p: ApiVideoProject): string[] {
  if (p.outputVideoUrl) return [p.outputVideoUrl];
  if (p.outputVideoUrls?.length) return p.outputVideoUrls;
  return [];
}

/** Image-only completion: Cloudinary image/keyframe instead of a playable video. */
export function isImageOnlyOutput(p: ApiVideoProject): boolean {
  return (
    p.status === 'completed' &&
    !!p.outputVideoUrl &&
    isLikelyImageUrl(p.outputVideoUrl)
  );
}

export function mapApiProjectToProject(p: ApiVideoProject): Project {
  const thumb = p.thumbnailUrl || '🎬';
  const playbackUrls = getPlaybackUrls(p);
  return {
    id: p.id,
    title: p.title || 'Untitled',
    thumbnail: thumb,
    status: mapApiStatus(p.status),
    mode: mapApiMode(p.mode),
    duration: formatProjectDuration(p.durationSeconds),
    createdAt: p.createdAt,
    progress: p.progress ?? 0,
    outputVideoUrl: p.outputVideoUrl,
    outputVideoUrls: p.outputVideoUrls ?? [],
    hasAudio: p.hasAudio ?? false,
    playbackUrls,
    isImageOnly: isImageOnlyOutput(p),
    videoLength: p.videoLength,
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
  async getOptions(): Promise<VideoStudioOptions> {
    return apiClient<VideoStudioOptions>('/video-studio/options');
  },

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

  async createTextToVideo(body: TextToVideoBody): Promise<ApiVideoProject> {
    return apiClient<ApiVideoProject>('/video-studio/projects/text-to-video', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async createPhotosScript(body: PhotosScriptBody): Promise<ApiVideoProject> {
    return apiClient<ApiVideoProject>('/video-studio/projects/photos-script', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async createYoutubeRepurpose(body: YoutubeRepurposeBody): Promise<ApiVideoProject> {
    return apiClient<ApiVideoProject>('/video-studio/projects/youtube-repurpose', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async createFacelessVideo(body: FacelessVideoBody): Promise<ApiVideoProject> {
    return apiClient<ApiVideoProject>('/video-studio/projects/faceless-video', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** Generic fallback (all modes) */
  async createProject(body: Record<string, unknown>): Promise<ApiVideoProject> {
    return apiClient<ApiVideoProject>('/video-studio/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
