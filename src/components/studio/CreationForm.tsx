"use client";

import React, { useState } from 'react';
import { PlaySquare, Image as ImageIcon, Video, UserX, UploadCloud } from 'lucide-react';

const modes = [
  { id: 't2v', icon: PlaySquare, label: 'Text to video', desc: 'Script → instant video', color: 'bg-brand-light', outline: 'border-brand-primary', textColor: 'text-brand-primary' },
  { id: 'p2v', icon: ImageIcon, label: 'Photos + script', desc: 'Upload images & prompt', color: 'bg-success-light', outline: 'border-success-primary', textColor: 'text-success-primary' },
  { id: 'yt', icon: Video, label: 'YouTube repurpose', desc: 'Link → new video', color: 'bg-coral-light', outline: 'border-coral-primary', textColor: 'text-coral-primary' },
  { id: 'faceless', icon: UserX, label: 'Faceless video', desc: 'No face, full content', color: 'bg-amber-light', outline: 'border-amber-primary', textColor: 'text-amber-primary' },
];

export function CreationForm() {
  const [activeMode, setActiveMode] = useState('t2v');
  const [activeLength, setActiveLength] = useState('short');

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl md:p-5 p-3.5 mb-4 md:mb-0">
      <div className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-text-secondary mb-3.5">
        <PlaySquare size={14} className="text-brand-primary" />
        Creation mode
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 md:mb-5">
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
                placeholder="Write your video script or describe what you want to create..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Voice style</label>
                <select className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]">
                  <option>Professional male</option>
                  <option>Professional female</option>
                  <option>Casual upbeat</option>
                  <option>Documentary</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Visual style</label>
                <select className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]">
                  <option>Cinematic</option>
                  <option>Minimal</option>
                  <option>Vibrant</option>
                  <option>News-style</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeMode === 'p2v' && (
          <>
            <div className="border border-dashed border-border-secondary rounded-xl p-4 md:p-6 text-center bg-bg-secondary cursor-pointer hover:border-brand-primary transition-colors">
              <div className="w-8 h-8 md:w-9 md:h-9 mx-auto mb-1.5 md:mb-2 rounded-lg bg-brand-light flex items-center justify-center">
                <UploadCloud size={18} className="text-brand-primary" />
              </div>
              <div className="text-[12px] md:text-[13px] text-text-secondary">Drop photos here or click to upload</div>
              <div className="text-[10px] md:text-[11px] text-text-tertiary mt-1">JPG, PNG — up to 20 images</div>
            </div>
            <div>
              <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Script / narration</label>
              <textarea 
                rows={3} 
                placeholder="Describe what the video should say or narrate..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
              ></textarea>
            </div>
          </>
        )}

        {activeMode === 'yt' && (
          <>
            <div>
              <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">YouTube video link</label>
              <input 
                type="text" 
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
                placeholder="Override the original script or add talking points..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
              ></textarea>
            </div>
          </>
        )}

        {activeMode === 'faceless' && (
          <>
            <div>
              <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Topic / script</label>
              <textarea 
                rows={3} 
                placeholder="What is this video about? Describe the topic or paste your script..."
                className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC] resize-none"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Niche</label>
                <select className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]">
                  <option>Finance</option>
                  <option>Motivation</option>
                  <option>Tech</option>
                  <option>Health</option>
                  <option>Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] text-text-secondary mb-1">Aspect ratio</label>
                <select className="w-full text-[13px] p-2 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]">
                  <option>9:16 (Reels/TikTok)</option>
                  <option>16:9 (YouTube)</option>
                  <option>1:1 (Square)</option>
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
              { id: 'long', label: 'Long (3-10m)' }
            ].map(len => (
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

      <button className="w-full py-2.5 md:py-3 bg-brand-primary text-white border-none rounded-xl text-[14px] font-medium hover:bg-brand-hover transition-colors mt-4 md:mt-2">
        Generate video ↗
      </button>
    </div>
  );
}
