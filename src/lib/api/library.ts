import { apiClient } from './client';
import { Template, Asset } from '@/types';

const MOCK_TEMPLATES: Template[] = [
  { id: 't1', name: 'Tech Startup Explainer', category: 'Explainer', thumbnail: '🚀', aspectRatio: '16:9' },
  { id: 't2', name: 'Motivational Morning', category: 'Social Media', thumbnail: '☀️', aspectRatio: '9:16' },
  { id: 't3', name: 'Real Estate Tour', category: 'Corporate', thumbnail: '🏠', aspectRatio: '16:9' },
  { id: 't4', name: 'Crypto Daily News', category: 'Finance', thumbnail: '📊', aspectRatio: '9:16' },
  { id: 't5', name: 'Instagram Product Showcase', category: 'Social Media', thumbnail: '🛍️', aspectRatio: '1:1' },
  { id: 't6', name: 'Fitness 30-Day Challenge', category: 'Lifestyle', thumbnail: '🏋️', aspectRatio: '9:16' }
];

const MOCK_ASSETS: Asset[] = [
  { id: 'a1', name: 'Corporate_Background.mp3', type: 'audio', url: '🎵', size: '3.4 MB', addedAt: '2026-04-22T08:15:00Z' },
  { id: 'a2', name: 'Company_Logo.png', type: 'image', url: '🖼️', size: '1.2 MB', addedAt: '2026-04-10T14:30:00Z' },
  { id: 'a3', name: 'Product_Shot_01.jpg', type: 'image', url: '🖼️', size: '2.8 MB', addedAt: '2026-04-18T09:45:00Z' },
  { id: 'a4', name: 'Intro_Stinger.mp4', type: 'video', url: '🎬', size: '15.6 MB', addedAt: '2026-03-05T11:20:00Z' }
];

export const libraryService = {
  /**
   * Fetch templates available to the user
   */
  async getTemplates(): Promise<Template[]> {
    await apiClient('/library/templates');
    return MOCK_TEMPLATES;
  },

  /**
   * Fetch user's uploaded assets
   */
  async getAssets(): Promise<Asset[]> {
    await apiClient('/library/assets');
    return MOCK_ASSETS;
  },

  /**
   * Upload an asset
   */
  async uploadAsset(file: File): Promise<Asset> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Simulate network upload
    await apiClient('/library/assets', {
      method: 'POST',
      body: formData
    });

    return {
      id: `a${Date.now()}`,
      name: file.name,
      type: file.type.includes('image') ? 'image' : file.type.includes('audio') ? 'audio' : 'video',
      url: file.type.includes('image') ? '🖼️' : '📁',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      addedAt: new Date().toISOString()
    };
  },

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<boolean> {
    await apiClient(`/library/assets/${id}`, { method: 'DELETE' });
    return true;
  }
};
