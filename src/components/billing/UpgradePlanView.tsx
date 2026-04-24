import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { billingService } from '@/lib/api/billing';
import { PlanPricing } from '@/types';

export function UpgradePlanView() {
  const [plans, setPlans] = useState<PlanPricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);

  // In a real app, you'd get this from user context
  const currentPlanId = 'pro'; 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await billingService.getPlans();
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch billing plans", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleUpgrade = async (planId: string) => {
    setUpgradingId(planId);
    try {
      await billingService.changePlan(planId);
      // alert('Plan upgraded successfully');
    } catch {
      // error handling
    } finally {
      setUpgradingId(null);
    }
  };

  return (
    <div className="mb-8">
      <div className="text-center md:max-w-xl mx-auto mb-10 mt-6">
        <h2 className="text-[24px] md:text-[28px] font-medium text-text-primary mb-3">Simple, predictable pricing</h2>
        <p className="text-[14px] text-text-tertiary">Upgrade your plan to unlock more credits, custom voices, and premium exports.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-text-tertiary">
          <Loader2 size={24} className="animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            
            return (
              <div 
                key={plan.id}
                className={`relative bg-bg-primary rounded-2xl p-6 md:p-8 flex flex-col transition-all border ${
                  plan.isPopular 
                    ? 'border-brand-primary shadow-sm scale-100 md:scale-105 z-10' 
                    : 'border-border-tertiary hover:border-border-secondary'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-[18px] font-medium text-text-primary mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-[32px] font-medium text-text-primary">${plan.price}</span>
                  <span className="text-[13px] text-text-tertiary">/mo</span>
                </div>
                
                <div className="bg-bg-secondary border border-border-tertiary rounded-lg p-3 text-center mb-8">
                  <span className="text-[14px] font-medium text-amber-primary">{plan.credits} Credits</span>
                  <span className="text-[11px] text-text-tertiary block mt-0.5">Renews monthly</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-success-light flex justify-center items-center shrink-0 mt-0.5">
                        <Check size={12} className="text-success-dark" />
                      </div>
                      <span className="text-[13px] text-text-secondary leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || upgradingId === plan.id}
                  className={`w-full py-2.5 rounded-xl text-[14px] font-medium transition-colors flex items-center justify-center gap-2 ${
                    isCurrent 
                      ? 'bg-bg-secondary text-text-tertiary cursor-default border border-border-tertiary' 
                      : plan.isPopular
                        ? 'bg-brand-primary text-white hover:bg-brand-hover'
                        : 'bg-brand-light text-brand-hover hover:bg-[#DEDCFC]'
                  }`}
                >
                  {upgradingId === plan.id ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing</>
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    'Upgrade'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
