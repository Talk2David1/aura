import { apiClient } from './client';

export interface GeneralSettings {
  language: string;
  timezone: string;
  themePreference: string;
}

export interface NotificationSettings {
  videoGenerationComplete: boolean;
  weeklyReport: boolean;
  productUpdates: boolean;
}

export interface VideoDefaultsSettings {
  defaultVoice: string;
  captionsStyle: string;
  options?: {
    defaultVoice: Array<{ id: string; label: string }>;
    captionsStyle: Array<{ id: string; label: string }>;
  };
}

export const settingsService = {
  getGeneral(): Promise<GeneralSettings> {
    return apiClient<GeneralSettings>('/studio/settings/general');
  },

  patchGeneral(body: Partial<GeneralSettings>): Promise<GeneralSettings> {
    return apiClient<GeneralSettings>('/studio/settings/general', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  getNotifications(): Promise<NotificationSettings> {
    return apiClient<NotificationSettings>('/studio/settings/notifications');
  },

  patchNotifications(body: Partial<NotificationSettings>): Promise<NotificationSettings> {
    return apiClient<NotificationSettings>('/studio/settings/notifications', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  getVideoDefaults(): Promise<VideoDefaultsSettings> {
    return apiClient<VideoDefaultsSettings>('/studio/settings/video-defaults');
  },

  patchVideoDefaults(body: {
    defaultVoice?: string;
    captionsStyle?: string;
  }): Promise<VideoDefaultsSettings> {
    return apiClient<VideoDefaultsSettings>('/studio/settings/video-defaults', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};
