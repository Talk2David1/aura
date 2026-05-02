"use client";

import React, { useState } from 'react';
import { Loader2, PlaySquare, UploadCloud, UserX, Video } from 'lucide-react';
import { ApiError } from '@/lib/api/client';
import { videoStudioService } from '@/lib/api/video-studio';

const modes = [
  { id: 't2v', icon: PlaySquare, label: 'Text to video', desc: 'Script → instant video', color: 'bg-brand-light', outline: 'border-brand-primary', textColor: 'text-brand-primary' },
  { id: 'yt', icon: Video, label: 'YouTube repurpose', desc: 'Link → new video', color: 'bg-coral-light', outline: 'border-coral-primary', textColor: 'text-coral-primary' },
  { id: 'faceless', icon: UserX, label: 'Faceless video', desc: 'No face, full content', color: 'bg-amber-light', outline: 'border-amber-primary', textColor: 'text-amber-primary' },
];

const VOICES = [
  { id: 'professional_male', label: 'Professional male' },
  { id: 'professional_female', label: 'Professional female' },
  { id: 'casual_upbeat', label: 'Casual upbeat' },
  { id: 'documentary', label: 'Documentary' },
] as const;

const VISUALS = [
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'news_style', label: 'News-style' },
] as const;

const NICHES = [
  { id: 'finance', label: 'Finance' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'tech', label: 'Tech' },
  { id: 'health', label: 'Health' },
  { id: 'lifestyle', label: 'Lifestyle' },
] as const;

const ASPECTS = [
  { id: '9:16', label: '9:16 (Reels/TikTok)' },
  { id: '16:9', label: '16:9 (YouTube)' },
  { id: '1:1', label: '1:1 (Square)' },
] as const;

export function CreationForm() {
  const [activeMode, setActiveMode] = useState('t2v');
  const [activeLength, setActiveLength] = useState('short');
  const [prompt, setPrompt] = useState('');
  const [voiceStyle, setVoiceStyle] = useState<string>(VOICES[0].id);
  const [visualStyle, setVisualStyle] = useState<string>(VISUALS[0].id);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [customScript, setCustomScript] = useState('');
  const [facelessTopic, setFacelessTopic] = useState('');
  const [niche, setNiche] = useState<string>(NICHES[0].id);
  const [aspectRatio, setAspectRatio] = useState<string>(ASPECTS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setMessage(null);
    setSubmitting(true);
    try {
      const base = { videoLength: activeLength };
      let body: Record<string, unknown>;

      if (activeMode === 't2v') {
        body = {
          ...base,
          mode: 'text_to_video',
          prompt: prompt.trim(),
          voiceStyle,
          visualStyle,
        };
      } else if (activeMode === 'yt') {
        body = {
          ...base,
          mode: 'youtube_repurpose',
          youtubeUrl: youtubeUrl.trim(),
        };
        const cs = customScript.trim();
        if (cs) body.customScript = cs;
      } else if (activeMode === 'faceless') {
        body = {
          ...base,
          mode: 'faceless_video',
          topic: facelessTopic.trim(),
          niche,
          aspectRatio,
        };
      } else {
        setMessage('Unknown creation mode.');
        setSubmitting(false);
        return;
      }

      const created = await videoStudioService.createProject(body);
      setMessage(`Project started: ${created.title || created.id}`);
      setPrompt('');
      setYoutubeUrl('');
      setCustomScript('');
      setFacelessTopic('');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not start generation';
      setMessage(msg);
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 md:mb-5">
        {modes.map((mode) => {
          const isSelected = activeMode === mode.id;
          return (
            <div
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`border rounded-xl p-3 cursor-pointer transition-all ${
                isSelected ? 'border-brand-primary bg-brand-light' : 'border-border-tertiary bg-bg-secondary hover:border-[#AFA9EC]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${mode.color}`}>
                <mode.icon size={16} className={mode.textColor} />
              </div>
              <div className="text-[12px] font-medium text-text-primary">{mode.label}</div>
              <div className="text-[10px] md:text-[11px] text-text-tertiary mt-0.5">{mode.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 md:space-y-3.5">
        {activeMode === 't2v' && (
          <>
            <div>
              <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Script / prompt</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write your video script or describe what you want to create..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Voice style</label>
                <select
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value)}
                  className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Visual style</label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]"
                >
                  {VISUALS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {activeMode === 'yt' && (
          <>
            <div>
              <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">YouTube video link</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]"
              />
            </div>
            <div className="border border-dashed border-border-secondary rounded-xl p-4 text-center bg-bg-secondary cursor-pointer hover:border-brand-primary transition-colors">
              <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-brand-light flex items-center justify-center">
                <UploadCloud size={16} className="text-brand-primary" />
              </div>
              <div className="text-[12px] text-text-secondary">Optional: add your own photos</div>
              <div className="text-[10px] text-text-tertiary mt-1">These will be mixed into the output</div>
            </div>
            <div>
              <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Custom script (optional)</label>
              <textarea
                rows={2}
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
                placeholder="Override the original script or add talking points..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
              />
            </div>
          </>
        )}

        {activeMode === 'faceless' && (
          <>
            <div>
              <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Topic / script</label>
              <textarea
                rows={3}
                value={facelessTopic}
                onChange={(e) => setFacelessTopic(e.target.value)}
                placeholder="What is this video about? Describe the topic or paste your script..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Niche</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]"
                >
                  {NICHES.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Aspect ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]"
                >
                  {ASPECTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Video length</label>
          <div className="grid grid-cols-3 gap-1.5 md:gap-2">
            {[
              { id: 'short', label: 'Short (15-60s)' },
              { id: 'medium', label: 'Medium (1-3m)' },
              { id: 'long', label: 'Long (3-10m)' },
            ].map((len) => (
              <div
                key={len.id}
                onClick={() => setActiveLength(len.id)}
                className={`py-1.5 md:py-2 px-1 text-center border rounded-lg text-[10px] md:text-[12px] cursor-pointer transition-colors ${
                  activeLength === len.id
                    ? 'border-brand-primary text-brand-hover bg-brand-light font-medium'
                    : 'border-border-tertiary text-text-secondary bg-bg-secondary'
                }`}
              >
                {len.label}
              </div>
            ))}
          </div>
        </div>
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
        className="w-full py-2.5 md:py-3 bg-brand-primary text-white border-none rounded-xl text-[14px] font-medium hover:bg-brand-hover transition-colors mt-4 md:mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        Generate video ↗
      </button>
    </div>
  );
}
