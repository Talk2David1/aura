export interface Project {
  id: string;
  title: string;
  thumbnail?: string;
  status: 'completed' | 'generating' | 'failed';
  mode: 'text-to-video' | 'photos-to-video' | 'youtube' | 'faceless';
  duration: string;
  createdAt: string;
}

export interface GenerationHistory {
  id: string;
  action: string;
  prompt: string;
  creditsUsed: number;
  date: string;
  status: 'success' | 'failed' | 'pending';
}

export interface PlanPricing {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  isPopular?: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  size: string;
  addedAt: string;
}
