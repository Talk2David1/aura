export const ACCESS_TOKEN_KEY = 'auravid_access_token';
export const AUTH_USER_KEY = 'auravid_user';

export function getApiBaseUrl(): string {
  const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined;
  const base = (raw && raw.trim()) || 'http://localhost:3000';
  return base.replace(/\/$/, '');
}
