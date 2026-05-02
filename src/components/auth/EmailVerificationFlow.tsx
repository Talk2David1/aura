"use client";

import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Loader2, Mail } from 'lucide-react';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

type Step = 'email' | 'code' | 'done';

export function EmailVerificationFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await authService.emailVerificationRequestOtp(email.trim());
      setInfo('Check your inbox for the verification code.');
      setStep('code');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send code');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.emailVerificationResendOtp(email.trim());
      setInfo('A new code was sent.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await authService.emailVerificationVerifyOtp(email.trim(), code.trim());
      setStep('done');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary border border-border-tertiary w-full max-w-[420px] md:max-w-[390px] rounded-2xl p-6 md:p-7 shadow-xl relative z-10 mx-4 md:max-h-[90vh] md:overflow-y-auto">
      <button
        type="button"
        onClick={step === 'email' || step === 'done' ? onBack : () => setStep('email')}
        className="flex items-center gap-1 text-[12px] text-text-tertiary hover:text-text-primary mb-4"
      >
        <ArrowLeft size={14} />
        {step === 'email' || step === 'done' ? 'Back to sign in' : 'Back'}
      </button>

      <h1 className="text-[22px] font-medium text-text-primary tracking-tight mb-1">
        {step !== 'done' ? 'Verify your email' : 'Email verified'}
      </h1>
      <p className="text-[13px] text-text-tertiary mb-5">
        {step === 'email' && 'Uses the same OTP flow as signup (email verification routes).'}
        {step === 'code' && `Code sent to ${email}`}
        {step === 'done' && 'You can close this and sign in with your password.'}
      </p>

      {error ? (
        <p className="text-[12px] text-coral-dark bg-coral-light/50 border border-coral-primary/30 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="text-[12px] text-success-dark bg-success-light/50 border border-success-primary/30 rounded-lg px-3 py-2 mb-3">
          {info}
        </p>
      ) : null}

      {step === 'email' ? (
        <form onSubmit={sendCode} className="space-y-3">
          <div>
            <label htmlFor="ev-email" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="ev-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-secondary border border-border-tertiary rounded-xl py-2 pl-10 pr-4 text-[14px] text-text-primary focus:outline-none focus:border-brand-primary"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2 bg-brand-primary text-white rounded-xl text-[14px] font-medium hover:bg-brand-hover"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Send verification code
          </button>
        </form>
      ) : null}

      {step === 'code' ? (
        <form onSubmit={verify} className="space-y-3">
          <div>
            <label htmlFor="ev-code" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Code
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="ev-code"
                name="one-time-code"
                type="text"
                inputMode="numeric"
                required
                maxLength={8}
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="w-full bg-bg-secondary border border-border-tertiary rounded-xl py-2 pl-10 pr-4 text-[14px] text-text-primary focus:outline-none focus:border-brand-primary tracking-widest"
                placeholder="123456"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2 bg-brand-primary text-white rounded-xl text-[14px] font-medium hover:bg-brand-hover"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Verify email
          </button>
          <button
            type="button"
            onClick={resend}
            disabled={loading}
            className="w-full py-2 text-[13px] text-brand-primary hover:text-brand-hover font-medium"
          >
            Resend code
          </button>
        </form>
      ) : null}

      {step === 'done' ? (
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 bg-brand-light text-brand-hover rounded-xl text-[14px] font-medium hover:bg-[#DEDCFC]"
        >
          Back to sign in
        </button>
      ) : null}
    </div>
  );
}
