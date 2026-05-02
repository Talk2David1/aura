"use client";

import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Loader2, Mail, User } from 'lucide-react';
import { authService } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

type Step = 'email' | 'code' | 'profile';

export function OtpSignUpFlow({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await authService.signupRequestOtp(email.trim());
      setInfo('Check your inbox for the code.');
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
      await authService.signupResendOtp(email.trim());
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
      const { setupToken: st } = await authService.signupVerifyOtp(email.trim(), code.trim());
      setSetupToken(st);
      setStep('profile');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the terms');
      return;
    }
    setLoading(true);
    try {
      await authService.signupComplete({
        setupToken,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
        confirmPassword,
        termsAccepted: true,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not complete signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary border border-border-tertiary w-full max-w-[420px] md:max-w-[390px] rounded-2xl p-6 md:p-7 shadow-xl relative z-10 mx-4 md:max-h-[90vh] md:overflow-y-auto">
      <button
        type="button"
        onClick={step === 'email' ? onBack : () => setStep(step === 'code' ? 'email' : 'code')}
        className="flex items-center gap-1 text-[12px] text-text-tertiary hover:text-text-primary mb-4"
      >
        <ArrowLeft size={14} />
        {step === 'email' ? 'Back to sign in' : 'Back'}
      </button>

      <h1 className="text-[22px] font-medium text-text-primary tracking-tight mb-1">
        {step === 'email' && 'Sign up with email'}
        {step === 'code' && 'Enter verification code'}
        {step === 'profile' && 'Finish your profile'}
      </h1>
      <p className="text-[13px] text-text-tertiary mb-5">
        {step === 'email' && 'We will send a one-time code to your email.'}
        {step === 'code' && `Code sent to ${email}`}
        {step === 'profile' && 'Choose your name and password.'}
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
            <label htmlFor="otp-signup-email" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="otp-signup-email"
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
            Send code
          </button>
        </form>
      ) : null}

      {step === 'code' ? (
        <form onSubmit={verifyCode} className="space-y-3">
          <div>
            <label htmlFor="otp-signup-code" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              6-digit code
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="otp-signup-code"
                name="one-time-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={8}
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
            Verify & continue
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

      {step === 'profile' ? (
        <form onSubmit={completeProfile} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="otp-signup-firstname" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
                First name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  id="otp-signup-firstname"
                  name="given-name"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-bg-secondary border border-border-tertiary rounded-xl py-2 pl-10 pr-4 text-[14px] text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
            <div>
              <label htmlFor="otp-signup-lastname" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
                Last name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  id="otp-signup-lastname"
                  name="family-name"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-bg-secondary border border-border-tertiary rounded-xl py-2 pl-10 pr-4 text-[14px] text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="otp-signup-password" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="otp-signup-password"
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
            <label htmlFor="otp-signup-password2" className="block text-[12px] text-text-secondary mb-1.5 font-medium ml-1">
              Confirm password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                id="otp-signup-password2"
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
          <label htmlFor="otp-signup-terms" className="flex items-start gap-2.5 text-[12px] text-text-tertiary leading-relaxed cursor-pointer">
            <input
              id="otp-signup-terms"
              name="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border-tertiary bg-bg-secondary text-brand-primary"
            />
            <span>I agree to the Terms and Privacy Policy.</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2 bg-brand-primary text-white rounded-xl text-[14px] font-medium hover:bg-brand-hover"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Create account
          </button>
        </form>
      ) : null}
    </div>
  );
}
