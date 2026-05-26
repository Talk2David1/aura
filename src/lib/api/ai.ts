import { apiClient } from './client';

export interface PromptGenerateRequest {
  idea: string;
  tone?: string;
  style?: string;
  targetAudience?: string;
}

export interface PromptGenerateResponse {
  prompt: string;
}

export interface ImageGenerateRequest {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  negativePrompt?: string;
}

export interface CloudinaryUploadMeta {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
}

export interface ImageGenerateResponse {
  predictionId: string | null;
  model: string;
  outputs: string[];
  cloudinary: CloudinaryUploadMeta;
}

export interface CharacterGenerateRequest {
  name: string;
  description: string;
  style?: string;
  mood?: string;
}

export const aiService = {
  generatePrompt(body: PromptGenerateRequest): Promise<PromptGenerateResponse> {
    return apiClient<PromptGenerateResponse>('/ai/prompts/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  generateImage(body: ImageGenerateRequest): Promise<ImageGenerateResponse> {
    return apiClient<ImageGenerateResponse>('/ai/images/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  generateCharacter(body: CharacterGenerateRequest): Promise<ImageGenerateResponse> {
    return apiClient<ImageGenerateResponse>('/ai/characters/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
