import { apiClient } from './client';
import type { GenerationHistory } from '@/types';

export interface StudioProfile {
  id: string;
  fullName: string;
  email: string;
  planName: string;
  memberSince: string;
  monthlyCredits: number;
  creditsLeft: number;
}

export interface ApiHistoryRow {
  id: string;
  status: string;
  date: string;
  action: string;
  detail: string;
  costCredits: number;
}

function mapHistoryStatus(s: string): GenerationHistory['status'] {
  if (s === 'failed') return 'failed';
  if (s === 'success') return 'success';
  return 'pending';
}

export function mapHistoryRow(row: ApiHistoryRow): GenerationHistory {
  return {
    id: row.id,
    action: row.action,
    prompt: row.detail,
    creditsUsed: Math.abs(row.costCredits ?? 0),
    date: row.date,
    status: mapHistoryStatus(row.status),
  };
}

export const studioService = {
  async getProfile(): Promise<StudioProfile> {
    return apiClient<StudioProfile>('/studio/profile');
  },

  async getHistory(limit = 30): Promise<GenerationHistory[]> {
    const rows = await apiClient<ApiHistoryRow[]>(`/studio/history?limit=${limit}`);
    return rows.map(mapHistoryRow);
  },
};
