"use client";

import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Loader2, Mail } from 'lucide-react';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

type Step = 'email' | 'code' | 'password';
type ResetVariant = 'forgot' | 'reset';

export function ForgotPasswordFlow({
  onBack,
  onSuccess,
  initialVariant = 'forgot',
  lockVariant = false,
  initialEmail = '',
  firstStepBackLabel = 'Back to sign in',
}: {
  onBack: () => void;
  onSuccess: () => void;
  /** When `lockVariant` is true, only this alias is used (e.g. `reset` for `/auth/reset-password/*`). */
  initialVariant?: ResetVariant;
  /** Hide forgot vs reset toggle; API routes follow `initialVariant` only. */
  lockVariant?: boolean;
  initialEmail?: string;
  /** Label for the back control on the first step (email). */
  firstStepBackLabel?: string;
}) {
  const [variant, setVariant] = useState<ResetVariant>(initialVariant);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (variant === 'forgot') {
        await authService.forgotPasswordRequest(email.trim());
      } else {
        await authService.resetPasswordRequest(email.trim());
      }
      setInfo('If an account exists, a code was sent.');
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
      if (variant === 'forgot') {
        await authService.forgotPasswordResendOtp(email.trim());
      } else {
        await authService.resetPasswordResendOtp(email.trim());
      }
      setInfo('A new code was sent.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const { resetToken: rt } =
        variant === 'forgot'
          ? await authService.forgotPasswordVerify(email.trim(), code.trim())
          : await authService.resetPasswordVerify(email.trim(), code.trim());
      setResetToken(rt);
      setStep('password');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const setNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (variant === 'forgot') {
        await authService.forgotPasswordComplete(resetToken, password, confirmPassword);
      } else {
        await authService.resetPasswordComplete(resetToken, password, confirmPassword);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary border border-border-tertiary w-full max-w-[420px] md:max-w-[390px] rounded-2xl p-6 md:p-7 shadow-xl relative z-10 mx-4 md:max-h-[90vh] md:overflow-y-auto">
      <button
        type="button"
        onClick={
          step === 'email'
            ? onBack
            : () => setStep(step === 'code' ? 'email' : 'code')
        }
        className="flex items-center gap-1 text-[12px] text-text-tertiary hover:text-text-primary mb-4"
      >
        <ArrowLeft size={14} />
        {step === 'email' ? firstStepBackLabel : 'Back'}
      </button>

      <h1 className="text-[22px] font-medium text-text-primary tracking-tight mb-1">Reset password</h1>
      <p className="text-[13px] text-text-tertiary mb-4">
        {step === 'email' &&
          (lockVariant
            ? 'Uses POST /auth/reset-password (request OTP, verify, then set a new password).'
            : 'Choose which API alias your server uses (same OTP flow).')}
      </p>

      {step === 'email' && !lockVariant ? (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setVariant('forgot')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-medium border ${
              variant === 'forgot'
                ? 'border-brand-primary bg-brand-light text-brand-hover'
                : 'border-border-tertiary text-text-secondary'
            }`}
          >
            /auth/forgot-password
          </button>
          <button
            type="button"
            onClick={() => setVariant('reset')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-medium border ${
              variant === 'reset'
                ? 'border-brand-primary bg-brand-light text-brand-hover'
                : 'border-border-tertiary text-text-secondary'
            }`}
          >
            /auth/reset-password
          </button>
        </div>
      ) : null}

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
        <form onSubmit={requestReset} className="space-y-3">
          <div>
            <label htmlFor="fp-email" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="fp-email"
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
            Send reset code
          </button>
        </form>
      ) : null}

      {step === 'code' ? (
        <form onSubmit={verifyCode} className="space-y-3">
          <div>
            <label htmlFor="fp-code" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Code
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="fp-code"
                name="one-time-code"
                type="text"
                inputMode="numeric"
                required
                maxLength={8}
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="w-full bg-bg-secondary border border-border-tertiary rounded-xl py-2 pl-10 pr-4 text-[14px] text-text-primary focus:outline-none focus:border-brand-primary tracking-widest"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2 bg-brand-primary text-white rounded-xl text-[14px] font-medium hover:bg-brand-hover"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Verify code
          </button>
          <button
            type="button"
            onClick={resend}
            disabled={loading}
            className="w-full py-2 text-[13px] text-brand-primary font-medium"
          >
            Resend code
          </button>
        </form>
      ) : null}

      {step === 'password' ? (
        <form onSubmit={setNewPassword} className="space-y-3">
          <div>
            <label htmlFor="fp-password" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              New password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="fp-password"
                name="new-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-secondary border border-border-tertiary rounded-xl py-2 pl-10 pr-4 text-[14px] text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="fp-password2" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Confirm password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="fp-password2"
                name="confirm-new-password"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-bg-secondary border border-border-tertiary rounded-xl py-2 pl-10 pr-4 text-[14px] text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2 bg-brand-primary text-white rounded-xl text-[14px] font-medium hover:bg-brand-hover"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save password & sign in
          </button>
        </form>
      ) : null}
    </div>
  );
}
