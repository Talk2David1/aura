'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  POLL_INTERVAL_MS,
  videoStudioService,
  type ApiDashboard,
  type ApiVideoProject,
} from '@/lib/api/video-studio';

export interface VideoStudioPollState {
  dashboard: ApiDashboard | null;
  inProgressList: ApiVideoProject[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  hasActiveJobs: boolean;
}

export function useVideoStudioPoll(enabled = true, refreshToken = 0): VideoStudioPollState {
  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [inProgressList, setInProgressList] = useState<ApiVideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const mountedRef = useRef(true);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function load() {
      try {
        const [dash, inProg] = await Promise.all([
          videoStudioService.getDashboard(),
          videoStudioService.listProjects({ status: 'in_progress', limit: 20 }),
        ]);
        if (cancelled || !mountedRef.current) return;
        setDashboard(dash);
        setInProgressList(inProg);
        setError(null);
      } catch (e) {
        if (cancelled || !mountedRef.current) return;
        setError(e instanceof Error ? e.message : 'Failed to load studio data');
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    }

    setLoading((prev) => (tick === 0 && refreshToken === 0 ? prev : false));
    load();

    return () => {
      cancelled = true;
    };
  }, [enabled, tick, refreshToken]);

  const hasActiveJobs =
    (dashboard?.inProgress?.status === 'in_progress') || inProgressList.length > 0;

  useEffect(() => {
    if (!enabled || !hasActiveJobs) return;

    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [enabled, hasActiveJobs]);

  return {
    dashboard,
    inProgressList,
    loading,
    error,
    refresh,
    hasActiveJobs,
  };
}
