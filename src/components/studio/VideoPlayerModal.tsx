"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface VideoPlayerModalProps {
  title: string;
  urls: string[];
  hasAudio?: boolean;
  isImageOnly?: boolean;
  onClose: () => void;
}

function isMediaVideo(url: string, isImageOnly: boolean): boolean {
  if (isImageOnly) return false;
  if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url) || url.includes("/image/upload/")) {
    return false;
  }
  return true;
}

export function VideoPlayerModal({
  title,
  urls,
  hasAudio = true,
  isImageOnly = false,
  onClose,
}: VideoPlayerModalProps) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const safeUrls = urls.filter(Boolean);
  const current = safeUrls[segmentIndex] ?? safeUrls[0];
  const isVideo = current ? isMediaVideo(current, isImageOnly) : false;

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl bg-bg-primary rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-tertiary">
          <h3 className="text-[14px] font-medium text-text-primary truncate pr-4">{title}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 bg-black flex items-center justify-center min-h-[200px] max-h-[70vh]">
          {isImageOnly || !isVideo ? (
            <img src={current} alt={title} className="max-h-[65vh] max-w-full object-contain" />
          ) : (
            <video key={current} src={current} controls autoPlay className="max-h-[65vh] max-w-full" playsInline />
          )}
        </div>

        {safeUrls.length > 1 ? (
          <div className="px-4 py-3 border-t border-border-tertiary flex items-center justify-between gap-2">
            <button type="button" disabled={segmentIndex <= 0} onClick={() => setSegmentIndex((i) => Math.max(0, i - 1))} className="flex items-center gap-1 text-[12px] text-text-secondary disabled:opacity-40">
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-[12px] text-text-tertiary">Segment {segmentIndex + 1} of {safeUrls.length}</span>
            <button type="button" disabled={segmentIndex >= safeUrls.length - 1} onClick={() => setSegmentIndex((i) => Math.min(safeUrls.length - 1, i + 1))} className="flex items-center gap-1 text-[12px] text-text-secondary disabled:opacity-40">
              Next <ChevronRight size={16} />
            </button>
          </div>
        ) : null}

        {!hasAudio && !isImageOnly ? (
          <p className="px-4 pb-3 text-[11px] text-text-tertiary">This clip has no generated audio.</p>
        ) : null}
        {isImageOnly ? (
          <p className="px-4 pb-3 text-[11px] text-amber-primary">Image-only output (animation unavailable).</p>
        ) : null}
      </div>
    </div>
  );
}
