import { apiClient } from './client';
import { PlanPricing } from '@/types';

const MOCK_PLANS: PlanPricing[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 5,
    features: ['720p Exports', 'Standard Voices', 'Watermarked Videos', 'Community Support']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    credits: 100,
    isPopular: true,
    features: ['1080p Exports', 'Premium Voices', 'No Watermark', 'Custom Asset Uploads', 'Priority Support']
  },
  {
    id: 'teams',
    name: 'Teams',
    price: 99,
    credits: 500,
    features: ['4K Exports', 'Voice Cloning', 'Custom Brand Kits', 'Team Collaboration', '24/7 Dedicated Support']
  }
];

export const billingService = {
  /**
   * Fetch available subscription plans
   */
  async getPlans(): Promise<PlanPricing[]> {
    await apiClient('/billing/plans');
    return MOCK_PLANS;
  },

  /**
   * Attempt to upgrade or downgrade a plan
   */
  async changePlan(planId: string): Promise<boolean> {
    await apiClient(`/billing/subscription`, {
      method: 'POST',
      body: JSON.stringify({ planId })
    });
    return true;
  }
};
