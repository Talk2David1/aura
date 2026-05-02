import { ACCESS_TOKEN_KEY, getApiBaseUrl } from './config';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function messageFromBody(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Request failed';
  const m = (data as { message?: unknown }).message;
  if (Array.isArray(m)) return m.map(String).join(', ');
  if (typeof m === 'string') return m;
  return 'Request failed';
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * JSON fetch to the Nest API. Sends Bearer token when present.
 * Omits JSON Content-Type for FormData bodies.
 */
export async function apiClient<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers);
  const isForm = init.body instanceof FormData;
  if (!isForm && init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...init, headers });
  const text = await response.text();
  let data: unknown = undefined;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, messageFromBody(data), data);
  }

  return data as T;
}
