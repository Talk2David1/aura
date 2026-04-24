import { apiClient } from './client';
import { Project, GenerationHistory } from '@/types';

// Mock Data
const MOCK_PROJECTS: Project[] = [
  { id: '1', title: '5 stocks to watch in Q3', status: 'completed', mode: 'faceless', duration: '2:14', createdAt: '2026-04-20T10:00:00Z', thumbnail: '📈' },
  { id: '2', title: 'Morning routine for focus', status: 'completed', mode: 'text-to-video', duration: '0:58', createdAt: '2026-04-19T14:30:00Z', thumbnail: '🧘' },
  { id: '3', title: 'AI tools for creators 2025', status: 'completed', mode: 'youtube', duration: '3:40', createdAt: '2026-04-18T09:15:00Z', thumbnail: '🤖' },
  { id: '4', title: 'Crypto beginner\'s guide', status: 'generating', mode: 'faceless', duration: 'Unknown', createdAt: '2026-04-24T15:30:00Z', thumbnail: '🪙' },
  { id: '5', title: 'Healthy meal prep ideas', status: 'failed', mode: 'photos-to-video', duration: '0:00', createdAt: '2026-04-15T11:20:00Z', thumbnail: '🥗' },
];

const MOCK_HISTORY: GenerationHistory[] = [
  { id: 'h1', action: 'Generate Faceless Video', prompt: 'Crypto beginner guide...', creditsUsed: 2, status: 'pending', date: '2026-04-24T15:30:00Z' },
  { id: 'h2', action: 'Text to Video', prompt: '5 stocks to watch...', creditsUsed: 1, status: 'success', date: '2026-04-20T10:00:00Z' },
  { id: 'h3', action: 'Upload Photos', prompt: 'Morning routine images', creditsUsed: 0.5, status: 'success', date: '2026-04-19T14:30:00Z' },
  { id: 'h4', action: 'YouTube Repurpose', prompt: 'URL: https://youtu.be/...', creditsUsed: 3, status: 'success', date: '2026-04-18T09:15:00Z' },
  { id: 'h5', action: 'Photos to Video', prompt: 'Meal prep ideas', creditsUsed: 1, status: 'failed', date: '2026-04-15T11:20:00Z' },
  { id: 'h6', action: 'Export Video', prompt: '1080p MP4 Export', creditsUsed: 0, status: 'success', date: '2026-04-10T12:00:00Z' },
];

export const projectService = {
  /**
   * Fetch all user projects/videos
   */
  async getProjects(): Promise<Project[]> {
    await apiClient('/projects');
    return MOCK_PROJECTS;
  },

  /**
   * Fetch generation history/audit log
   */
  async getHistory(): Promise<GenerationHistory[]> {
    await apiClient('/history');
    return MOCK_HISTORY;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    await apiClient(`/projects/${id}`, { method: 'DELETE' });
    return true;
  }
};
