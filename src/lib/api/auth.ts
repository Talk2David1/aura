import { apiClient, clearAccessToken, setAccessToken } from './client';
import { AUTH_USER_KEY, getApiBaseUrl } from './config';

export interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  displayName: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface OtpMessageResponse {
  message: string;
}

export interface SetupTokenResponse {
  setupToken: string;
}

export interface ResetTokenResponse {
  resetToken: string;
}

function persistSession(res: AuthResponse): void {
  setAccessToken(res.access_token);
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
  }
}

/** After OAuth redirect: token (and optional user) from query/hash */
export function persistOAuthSession(accessToken: string, user?: AuthUser | null): void {
  setAccessToken(accessToken);
  if (user && typeof window !== 'undefined') {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  clearAccessToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    persistSession(res);
    return res;
  },

  async register(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    persistSession(res);
    return res;
  },

  startGoogleLogin(): void {
    if (typeof window === 'undefined') return;
    window.location.href = `${getApiBaseUrl()}/auth/google`;
  },

  async signupRequestOtp(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/signup/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async signupResendOtp(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/signup/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async signupVerifyOtp(email: string, code: string): Promise<SetupTokenResponse> {
    return apiClient<SetupTokenResponse>('/auth/signup/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async signupComplete(payload: {
    setupToken: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/signup/complete', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    persistSession(res);
    return res;
  },

  async emailVerificationRequestOtp(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/email-verification/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async emailVerificationResendOtp(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/email-verification/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async emailVerificationVerifyOtp(email: string, code: string): Promise<SetupTokenResponse> {
    return apiClient<SetupTokenResponse>('/auth/email-verification/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async forgotPasswordRequest(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async forgotPasswordResendOtp(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/forgot-password/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async forgotPasswordVerify(email: string, code: string): Promise<ResetTokenResponse> {
    return apiClient<ResetTokenResponse>('/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async forgotPasswordComplete(
    resetToken: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/forgot-password/complete', {
      method: 'POST',
      body: JSON.stringify({ resetToken, password, confirmPassword }),
    });
    persistSession(res);
    return res;
  },

  async resetPasswordRequest(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/reset-password/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPasswordResendOtp(email: string): Promise<OtpMessageResponse> {
    return apiClient<OtpMessageResponse>('/auth/reset-password/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPasswordVerify(email: string, code: string): Promise<ResetTokenResponse> {
    return apiClient<ResetTokenResponse>('/auth/reset-password/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async resetPasswordComplete(
    resetToken: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/reset-password/complete', {
      method: 'POST',
      body: JSON.stringify({ resetToken, password, confirmPassword }),
    });
    persistSession(res);
    return res;
  },
};
