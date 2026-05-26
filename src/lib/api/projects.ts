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
};
