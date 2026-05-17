import { apiClient } from './client';
import type { Asset, Template } from '@/types';

export interface TemplatesPayload {
  categories: string[];
  templates: Template[];
}

interface ApiTemplatesResponse {
  categories: string[];
  templates: Array<{
    id: string;
    title: string;
    category: string;
    duration: string;
    thumbnail: string;
  }>;
}

interface ApiAssetRow {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function mapApiTemplate(row: ApiTemplatesResponse['templates'][0]): Template {
  return {
    id: row.id,
    name: row.title,
    category: row.category,
    thumbnail: row.thumbnail,
    aspectRatio: '16:9',
  };
}

function mapApiAsset(row: ApiAssetRow): Asset {
  const t = row.type as Asset['type'];
  const type: Asset['type'] = t === 'audio' || t === 'video' || t === 'image' ? t : 'image';
  return {
    id: row.id,
    name: row.name,
    type,
    url: row.url,
    size: formatBytes(row.sizeBytes ?? 0),
    addedAt: row.createdAt,
  };
}

export const libraryService = {
  async getTemplates(options?: { category?: string; search?: string }): Promise<TemplatesPayload> {
    const q = new URLSearchParams();
    if (options?.category && options.category !== 'all') q.set('category', options.category);
    if (options?.search?.trim()) q.set('search', options.search.trim());
    const qs = q.toString();
    const raw = await apiClient<ApiTemplatesResponse>(`/studio/templates${qs ? `?${qs}` : ''}`);
    return {
      categories: raw.categories?.length ? raw.categories : ['all'],
      templates: (raw.templates ?? []).map(mapApiTemplate),
    };
  },

  async getAssets(type?: string): Promise<Asset[]> {
    const qs = type && type !== 'all' ? `?type=${encodeURIComponent(type)}` : '';
    const rows = await apiClient<ApiAssetRow[]>(`/studio/assets${qs}`);
    return rows.map(mapApiAsset);
  },

  async createAssetRecord(payload: {
    name: string;
    type: 'image' | 'audio' | 'video';
    sizeBytes: number;
    url: string;
  }): Promise<Asset> {
    const created = await apiClient<ApiAssetRow>('/studio/assets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapApiAsset(created);
  },

  /** @deprecated Use createAssetRecord with a real CDN URL after upload */
  async uploadAsset(file: File): Promise<Asset> {
    const type: Asset['type'] = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('audio/')
        ? 'audio'
        : 'video';
    return this.createAssetRecord({
      name: file.name,
      type,
      sizeBytes: file.size,
      url: typeof URL !== 'undefined' ? URL.createObjectURL(file) : '',
    });
  },

  async deleteAsset(id: string): Promise<boolean> {
    try {
      await apiClient(`/studio/assets/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};
