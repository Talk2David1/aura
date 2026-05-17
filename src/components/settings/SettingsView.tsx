"use client";

import React, { useEffect, useState } from "react";
import { Settings, Bell, PlaySquare, Save, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { ApiError } from "@/lib/api/client";
import {
  settingsService,
  type GeneralSettings,
  type NotificationSettings,
  type VideoDefaultsSettings,
} from "@/lib/api/settings";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [general, setGeneral] = useState<GeneralSettings>({
    language: "English (US)",
    timezone: "UTC-08:00 Pacific Time",
    themePreference: "dark",
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    videoGenerationComplete: true,
    weeklyReport: false,
    productUpdates: true,
  });
  const [videoDefaults, setVideoDefaults] = useState<VideoDefaultsSettings>({
    defaultVoice: "professional_male",
    captionsStyle: "dynamic_word_by_word",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [g, n, v] = await Promise.all([
          settingsService.getGeneral(),
          settingsService.getNotifications(),
          settingsService.getVideoDefaults(),
        ]);
        if (cancelled) return;
        setGeneral(g);
        setNotifications(n);
        setVideoDefaults(v);
        if (g.themePreference) setTheme(g.themePreference);
      } catch { /* defaults */ } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [setTheme]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (activeTab === "general") {
        const updated = await settingsService.patchGeneral({
          ...general,
          themePreference: theme || general.themePreference,
        });
        setGeneral(updated);
      } else if (activeTab === "notifications") {
        setNotifications(await settingsService.patchNotifications(notifications));
      } else {
        setVideoDefaults(
          await settingsService.patchVideoDefaults({
            defaultVoice: videoDefaults.defaultVoice,
            captionsStyle: videoDefaults.captionsStyle,
          })
        );
      }
      setMessage("Settings saved.");
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const voices = videoDefaults.options?.defaultVoice ?? [
    { id: "professional_male", label: "Professional male" },
    { id: "professional_female", label: "Professional female" },
  ];
  const captions = videoDefaults.options?.captionsStyle ?? [
    { id: "dynamic_word_by_word", label: "Dynamic word-by-word" },
    { id: "standard_lower_thirds", label: "Standard lower-thirds" },
  ];

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl p-6 mb-8 max-w-4xl">
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["general", "notifications", "defaults"] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-3 py-2 rounded-lg text-[13px] ${activeTab === tab ? "bg-brand-light text-brand-hover" : "text-text-secondary"}`}>
            {tab === "general" ? "General" : tab === "notifications" ? "Notifications" : "Video defaults"}
          </button>
        ))}
      </div>
      {loading ? <p className="text-[13px] text-text-tertiary">Loading…</p> : null}
      {!loading && activeTab === "general" ? (
        <div className="space-y-4">
          <label className="block text-[12px] text-text-secondary">Language
            <input className="mt-1 w-full p-2 border rounded-lg bg-bg-secondary" value={general.language} onChange={(e) => setGeneral({ ...general, language: e.target.value })} />
          </label>
          <label className="block text-[12px] text-text-secondary">Timezone
            <input className="mt-1 w-full p-2 border rounded-lg bg-bg-secondary" value={general.timezone} onChange={(e) => setGeneral({ ...general, timezone: e.target.value })} />
          </label>
          <div className="flex gap-2">
            {["light", "dark", "system"].map((t) => (
              <button key={t} type="button" onClick={() => { setTheme(t); setGeneral({ ...general, themePreference: t }); }} className="px-3 py-1 border rounded-lg capitalize text-[12px]">{t}</button>
            ))}
          </div>
        </div>
      ) : null}
      {!loading && activeTab === "notifications" ? (
        <div className="space-y-3">
          {([
            ["videoGenerationComplete", "Video complete"],
            ["weeklyReport", "Weekly report"],
            ["productUpdates", "Product updates"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-3 border rounded-xl">
              <span className="text-[13px]">{label}</span>
              <input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} />
            </label>
          ))}
        </div>
      ) : null}
      {!loading && activeTab === "defaults" ? (
        <div className="space-y-4">
          <label className="block text-[12px]">Default voice
            <select className="mt-1 w-full p-2 border rounded-lg" value={videoDefaults.defaultVoice} onChange={(e) => setVideoDefaults({ ...videoDefaults, defaultVoice: e.target.value })}>
              {voices.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          <label className="block text-[12px]">Captions
            <select className="mt-1 w-full p-2 border rounded-lg" value={videoDefaults.captionsStyle} onChange={(e) => setVideoDefaults({ ...videoDefaults, captionsStyle: e.target.value })}>
              {captions.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
        </div>
      ) : null}
      {message ? <p className="text-[12px] mt-4 text-text-secondary">{message}</p> : null}
      <button type="button" onClick={save} disabled={saving || loading} className="mt-6 flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-[13px]">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
      </button>
    </div>
  );
}
