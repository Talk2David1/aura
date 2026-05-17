"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, PlaySquare, Image as ImageIcon, UserX, Video } from 'lucide-react';
import { ApiError } from '@/lib/api/client';
import {
  videoStudioService,
  type StudioOptionItem,
  type VideoStudioOptions,
} from '@/lib/api/video-studio';
import { libraryService } from '@/lib/api/library';
import type { Asset } from '@/types';

const FALLBACK_LENGTHS: StudioOptionItem[] = [
  { id: 'short', label: 'Short (~5s)' },
  { id: 'medium', label: 'Medium (~10s)' },
  { id: 'long', label: 'Long (~3 min, multi-segment)' },
];

const FALLBACK_VOICES: StudioOptionItem[] = [
  { id: 'professional_male', label: 'Professional male' },
  { id: 'professional_female', label: 'Professional female' },
  { id: 'casual_upbeat', label: 'Casual upbeat' },
  { id: 'documentary', label: 'Documentary' },
];

const FALLBACK_VISUALS: StudioOptionItem[] = [
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'news_style', label: 'News-style' },
];

const FALLBACK_NICHES: StudioOptionItem[] = [
  { id: 'finance', label: 'Finance' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'tech', label: 'Tech' },
  { id: 'health', label: 'Health' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

const FALLBACK_ASPECTS: StudioOptionItem[] = [
  { id: '9:16', label: '9:16 (Reels/TikTok)' },
  { id: '16:9', label: '16:9 (YouTube)' },
  { id: '1:1', label: '1:1 (Square)' },
];

const MODES = [
  { id: 't2v' as const, icon: PlaySquare, label: 'Text to video', desc: 'Script → instant video', color: 'bg-brand-light', textColor: 'text-brand-primary' },
  { id: 'photos' as const, icon: ImageIcon, label: 'Photos + script', desc: 'Photos and narration', color: 'bg-success-light', textColor: 'text-success-dark' },
  { id: 'yt' as const, icon: Video, label: 'YouTube repurpose', desc: 'Link → new video', color: 'bg-coral-light', textColor: 'text-coral-primary' },
  { id: 'faceless' as const, icon: UserX, label: 'Faceless video', desc: 'No face, full content', color: 'bg-amber-light', textColor: 'text-amber-primary' },
];

type ModeId = (typeof MODES)[number]['id'];

interface CreationFormProps {
  onProjectCreated?: () => void;
}

export function CreationForm({ onProjectCreated }: CreationFormProps) {
  const [activeMode, setActiveMode] = useState<ModeId>('t2v');
  const [options, setOptions] = useState<VideoStudioOptions | null>(null);
  const [activeLength, setActiveLength] = useState('short');
  const [prompt, setPrompt] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('professional_male');
  const [visualStyle, setVisualStyle] = useState('cinematic');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [customScript, setCustomScript] = useState('');
  const [facelessTopic, setFacelessTopic] = useState('');
  const [niche, setNiche] = useState('finance');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [photosScript, setPhotosScript] = useState('');
  const [photoUrlsText, setPhotoUrlsText] = useState('');
  const [additionalPhotoUrls, setAdditionalPhotoUrls] = useState<string[]>([]);
  const [libraryAssets, setLibraryAssets] = useState<Asset[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [opts, assets] = await Promise.all([
          videoStudioService.getOptions(),
          libraryService.getAssets('image').catch(() => []),
        ]);
        if (cancelled) return;
        setOptions(opts);
        setLibraryAssets(assets);
        const d = opts.dropdowns;
        if (d.videoLengths[0]) setActiveLength(d.videoLengths[0].id);
        if (d.voiceStyles[0]) setVoiceStyle(d.voiceStyles[0].id);
        if (d.visualStyles[0]) setVisualStyle(d.visualStyles[0].id);
        if (d.niches[0]) setNiche(d.niches[0].id);
        if (d.aspectRatios[0]) setAspectRatio(d.aspectRatios[0].id);
      } catch {
        /* fallbacks */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lengths = options?.dropdowns.videoLengths ?? FALLBACK_LENGTHS;
  const voices = options?.dropdowns.voiceStyles ?? FALLBACK_VOICES;
  const visuals = options?.dropdowns.visualStyles ?? FALLBACK_VISUALS;
  const niches = options?.dropdowns.niches ?? FALLBACK_NICHES;
  const aspects = options?.dropdowns.aspectRatios ?? FALLBACK_ASPECTS;

  const parsePhotoUrls = (): string[] => {
    const fromText = photoUrlsText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http'));
    return [...new Set([...fromText, ...additionalPhotoUrls])].slice(0, 12);
  };

  const toggleAssetPhoto = (url: string) => {
    setAdditionalPhotoUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : prev.length >= 12 ? prev : [...prev, url]
    );
  };

  const handleGenerate = async () => {
    setMessage(null);
    setSubmitting(true);
    try {
      const baseLength = { videoLength: activeLength };
      let created;

      if (activeMode === 't2v') {
        created = await videoStudioService.createTextToVideo({
          ...baseLength,
          prompt: prompt.trim(),
          voiceStyle,
          visualStyle,
        });
      } else if (activeMode === 'photos') {
        const photos = parsePhotoUrls();
        if (photos.length === 0) {
          setMessage('Add at least one photo URL (https://…), max 12.');
          setSubmitting(false);
          return;
        }
        if (!photosScript.trim()) {
          setMessage('Enter a narration script.');
          setSubmitting(false);
          return;
        }
        created = await videoStudioService.createPhotosScript({
          ...baseLength,
          photos,
          script: photosScript.trim(),
        });
      } else if (activeMode === 'yt') {
        if (!youtubeUrl.trim()) {
          setMessage('Enter a YouTube URL.');
          setSubmitting(false);
          return;
        }
        const body: Parameters<typeof videoStudioService.createYoutubeRepurpose>[0] = {
          ...baseLength,
          youtubeUrl: youtubeUrl.trim(),
        };
        const extra = parsePhotoUrls();
        if (extra.length) body.additionalPhotos = extra;
        const cs = customScript.trim();
        if (cs) body.customScript = cs;
        created = await videoStudioService.createYoutubeRepurpose(body);
      } else {
        if (!facelessTopic.trim()) {
          setMessage('Enter a topic or script.');
          setSubmitting(false);
          return;
        }
        created = await videoStudioService.createFacelessVideo({
          ...baseLength,
          topic: facelessTopic.trim(),
          niche,
          aspectRatio,
        });
      }

      setMessage(
        `Project started: ${created.title || created.id}. Generation runs in the background — progress updates below.`
      );
      setPrompt('');
      setYoutubeUrl('');
      setCustomScript('');
      setFacelessTopic('');
      setPhotosScript('');
      setPhotoUrlsText('');
      setAdditionalPhotoUrls([]);
      onProjectCreated?.();
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : 'Could not start generation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl md:p-5 p-3.5 mb-4 md:mb-0">
      <div className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-text-secondary mb-3.5">
        <PlaySquare size={14} className="text-brand-primary" />
        Creation mode
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4 md:mb-5">
        {MODES.map((mode) => {
          const isSelected = activeMode === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              className={`border rounded-xl p-3 text-left transition-all ${
                isSelected ? 'border-brand-primary bg-brand-light' : 'border-border-tertiary bg-bg-secondary hover:border-[#AFA9EC]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${mode.color}`}>
                <Icon size={16} className={mode.textColor} />
              </div>
              <div className="text-[12px] font-medium text-text-primary">{mode.label}</div>
              <div className="text-[10px] md:text-[11px] text-text-tertiary mt-0.5">{mode.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 md:space-y-3.5">
        {activeMode === 't2v' && (
          <>
            <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Script / prompt</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <SelectField label="Voice style" value={voiceStyle} onChange={setVoiceStyle} options={voices} />
              <SelectField label="Visual style" value={visualStyle} onChange={setVisualStyle} options={visuals} />
            </div>
          </>
        )}

        {activeMode === 'photos' && (
          <>
            <PhotoUrlFields
              photoUrlsText={photoUrlsText}
              setPhotoUrlsText={setPhotoUrlsText}
              libraryAssets={libraryAssets}
              selected={additionalPhotoUrls}
              onToggle={toggleAssetPhoto}
            />
            <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Narration script</label>
            <textarea
              rows={4}
              value={photosScript}
              onChange={(e) => setPhotosScript(e.target.value)}
              placeholder="Narration script here..."
              className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
            />
          </>
        )}

        {activeMode === 'yt' && (
          <>
            <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">YouTube video link</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]"
            />
            <PhotoUrlFields
              photoUrlsText={photoUrlsText}
              setPhotoUrlsText={setPhotoUrlsText}
              libraryAssets={libraryAssets}
              selected={additionalPhotoUrls}
              onToggle={toggleAssetPhoto}
              optionalLabel="Optional photos (URLs or library)"
            />
            <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Custom script (optional)</label>
            <textarea
              rows={2}
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder="Override or add talking points..."
              className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
            />
          </>
        )}

        {activeMode === 'faceless' && (
          <>
            <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Topic / script</label>
            <textarea
              rows={3}
              value={facelessTopic}
              onChange={(e) => setFacelessTopic(e.target.value)}
              placeholder="What is this video about?"
              className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <SelectField label="Niche" value={niche} onChange={setNiche} options={niches} />
              <SelectField label="Aspect ratio" value={aspectRatio} onChange={setAspectRatio} options={aspects} />
            </div>
          </>
        )}

        <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Video length</label>
        <div className="grid grid-cols-3 gap-1.5 md:gap-2">
          {lengths.map((len) => (
            <button
              key={len.id}
              type="button"
              onClick={() => setActiveLength(len.id)}
              className={`py-1.5 md:py-2 px-1 text-center border rounded-lg text-[10px] md:text-[12px] transition-colors ${
                activeLength === len.id
                  ? 'border-brand-primary text-brand-hover bg-brand-light font-medium'
                  : 'border-border-tertiary text-text-secondary bg-bg-secondary'
              }`}
            >
              {len.label}
            </button>
          ))}
        </div>
        {activeLength === 'long' ? (
          <p className="text-[10px] text-text-tertiary">
            Long jobs run multiple segments (~15s each, up to ~3 min total). Play segments in order; the API does not return one merged MP4.
          </p>
        ) : null}
      </div>

      {message ? (
        <p className="text-[12px] mt-3 text-text-secondary border border-border-tertiary rounded-lg px-3 py-2 bg-bg-secondary">
          {message}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={submitting}
        className="w-full py-2.5 md:py-3 bg-brand-primary text-white border-none rounded-xl text-[14px] font-medium hover:bg-brand-hover transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        Generate video ↗
      </button>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: StudioOptionItem[];
}) {
  return (
    <div>
      <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PhotoUrlFields({
  photoUrlsText,
  setPhotoUrlsText,
  libraryAssets,
  selected,
  onToggle,
  optionalLabel,
}: {
  photoUrlsText: string;
  setPhotoUrlsText: (v: string) => void;
  libraryAssets: Asset[];
  selected: string[];
  onToggle: (url: string) => void;
  optionalLabel?: string;
}) {
  return (
    <>
      <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">
        {optionalLabel ?? 'Photo URLs (one per line or comma-separated, https://)'}
      </label>
      <textarea
        rows={2}
        value={photoUrlsText}
        onChange={(e) => setPhotoUrlsText(e.target.value)}
        placeholder="https://cdn.example.com/photo1.jpg"
        className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
      />
      {libraryAssets.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {libraryAssets
            .filter((a) => a.url.startsWith('http'))
            .slice(0, 12)
            .map((a) => {
              const on = selected.includes(a.url);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onToggle(a.url)}
                  className={`text-[10px] px-2 py-1 rounded border truncate max-w-[140px] ${
                    on ? 'border-brand-primary bg-brand-light' : 'border-border-tertiary'
                  }`}
                  title={a.name}
                >
                  {a.name}
                </button>
              );
            })}
        </div>
      ) : null}
    </>
  );
}
