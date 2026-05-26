"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { persistOAuthSession, type AuthUser } from "@/lib/api/auth";

function readTokenFromUrl(): { token: string | null; user: AuthUser | null; error: string | null } {
  if (typeof window === "undefined") {
    return { token: null, user: null, error: null };
  }
  const search = new URLSearchParams(window.location.search);
  const hash =
    window.location.hash && window.location.hash.length > 1
      ? new URLSearchParams(window.location.hash.slice(1))
      : new URLSearchParams();

  const token =
    search.get("access_token") ||
    search.get("token") ||
    hash.get("access_token") ||
    hash.get("token");

  const err = search.get("error") || hash.get("error");
  const errDesc = search.get("error_description") || hash.get("error_description");
  if (err) {
    return {
      token: null,
      user: null,
      error: errDesc ? `${err}: ${decodeURIComponent(errDesc)}` : err,
    };
  }

  let user: AuthUser | null = null;
  const userParam = search.get("user") || hash.get("user");
  if (userParam) {
    try {
      user = JSON.parse(decodeURIComponent(userParam)) as AuthUser;
    } catch {
      try {
        user = JSON.parse(userParam) as AuthUser;
      } catch {
        /* ignore */
      }
    }
  }

  return { token, user, error: null };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const { token, user, error } = readTokenFromUrl();
    if (error) {
      setMessage(error);
      return;
    }
    if (!token) {
      setMessage(
        "No access token in this URL. Configure GOOGLE_AUTH_SUCCESS_REDIRECT_URL to redirect here with #access_token=...&user=... in the URL hash."
      );
      return;
    }
    persistOAuthSession(token, user);
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-bg-tertiary">
      {!message ? (
        <div className="flex flex-col items-center gap-3 text-text-secondary text-[14px]">
          <Loader2 className="animate-spin text-brand-primary" size={28} />
          <span>Signing you in…</span>
        </div>
      ) : (
        <div className="max-w-md text-center space-y-4">
          <p className="text-[14px] text-coral-dark bg-coral-light/40 border border-coral-primary/30 rounded-xl px-4 py-3">
            {message}
          </p>
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="text-[13px] text-brand-primary font-medium hover:underline"
          >
            Back to app
          </button>
        </div>
      )}
    </div>
  );
}
