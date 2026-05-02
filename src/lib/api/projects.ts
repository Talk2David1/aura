import { apiClient } from './client';
import { mapApiProjectToProject, videoStudioService } from './video-studio';
import { studioService } from './studio';
import type { Project, GenerationHistory } from '@/types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const rows = await videoStudioService.listProjects({ limit: 50 });
    return rows.map(mapApiProjectToProject);
  },

  async getHistory(): Promise<GenerationHistory[]> {
    return studioService.getHistory(30);
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      await apiClient(`/video-studio/projects/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};
