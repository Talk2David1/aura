'use client';

import React, { useState } from 'react';
import { StatsOverview } from '@/components/studio/StatsOverview';
import { CreationForm } from '@/components/studio/CreationForm';
import { RecentVideos } from '@/components/studio/RecentVideos';
import { useVideoStudioPoll } from '@/lib/hooks/useVideoStudioPoll';

interface StudioViewProps {
  onViewAllProjects?: () => void;
}

export function StudioView({ onViewAllProjects }: StudioViewProps) {
  const [refreshToken, setRefreshToken] = useState(0);
  const poll = useVideoStudioPoll(true, refreshToken);

  const onProjectCreated = () => {
    poll.refresh();
    setRefreshToken((t) => t + 1);
  };

  return (
    <>
      <StatsOverview poll={poll} />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_450px] gap-4 md:gap-5">
        <CreationForm onProjectCreated={onProjectCreated} />
        <RecentVideos poll={poll} onViewAllProjects={onViewAllProjects} />
      </div>
    </>
  );
}
