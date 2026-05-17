"use client";

import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { aiService } from "@/lib/api/ai";

type ToolTab = "prompt" | "image" | "character" | "remix";

export function AiToolsView() {
  const [tab, setTab] = useState<ToolTab>("prompt");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [promptIdea, setPromptIdea] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [charName, setCharName] = useState("");
  const [charDesc, setCharDesc] = useState("");
  const [remixUrl, setRemixUrl] = useState("");
  const [remixInstruction, setRemixInstruction] = useState("");

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (tab === "prompt") {
        const r = await aiService.generatePrompt({ idea: promptIdea });
        setResult(r.prompt);
      } else if (tab === "image") {
        const r = await aiService.generateImage({ prompt: imagePrompt });
        setResult(r.cloudinary?.secureUrl || r.outputs?.[0] || JSON.stringify(r));
      } else if (tab === "character") {
        const r = await aiService.generateCharacter({ name: charName, description: charDesc });
        setResult(r.cloudinary?.secureUrl || r.outputs?.[0] || JSON.stringify(r));
      } else {
        const r = await aiService.remixVideo({ sourceVideoUrl: remixUrl, instruction: remixInstruction });
        setResult(r.cloudinary?.secureUrl || r.outputs?.[0] || JSON.stringify(r));
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary border border-border-tertiary rounded-xl p-6 mb-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-brand-primary" size={18} />
        <h2 className="text-[16px] font-medium">AI Tools</h2>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["prompt", "image", "character", "remix"] as ToolTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-[12px] capitalize ${tab === t ? "bg-brand-light text-brand-hover" : "text-text-secondary"}`}>{t}</button>
        ))}
      </div>
      {tab === "prompt" ? (
        <textarea rows={3} value={promptIdea} onChange={(e) => setPromptIdea(e.target.value)} placeholder="Your idea…" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
      ) : null}
      {tab === "image" ? (
        <textarea rows={3} value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="Image prompt…" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
      ) : null}
      {tab === "character" ? (
        <>
          <input value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded-lg mb-2 text-[13px]" />
          <textarea rows={2} value={charDesc} onChange={(e) => setCharDesc(e.target.value)} placeholder="Description" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
        </>
      ) : null}
      {tab === "remix" ? (
        <>
          <input value={remixUrl} onChange={(e) => setRemixUrl(e.target.value)} placeholder="Source video URL" className="w-full p-2 border rounded-lg mb-2 text-[13px]" />
          <textarea rows={2} value={remixInstruction} onChange={(e) => setRemixInstruction(e.target.value)} placeholder="Instruction" className="w-full p-2 border rounded-lg mb-3 text-[13px]" />
        </>
      ) : null}
      <button type="button" onClick={run} disabled={loading} className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[13px] flex items-center gap-2">
        {loading ? <Loader2 size={14} className="animate-spin" /> : null} Run
      </button>
      {error ? <p className="text-[12px] text-coral-primary mt-3">{error}</p> : null}
      {result ? <pre className="mt-3 p-3 bg-bg-secondary rounded-lg text-[11px] whitespace-pre-wrap break-all">{result}</pre> : null}
    </div>
  );
}
