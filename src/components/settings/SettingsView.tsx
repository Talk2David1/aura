import React, { useState, useEffect } from 'react';
import { Settings, Bell, PlaySquare, Globe, Volume2, Save, Type } from 'lucide-react';
import { useTheme } from 'next-themes';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'defaults', label: 'Video Defaults', icon: PlaySquare },
  ];

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl md:p-6 p-4 mb-8 max-w-4xl min-h-[500px] flex flex-col md:flex-row gap-6">
      
      {/* Settings Navigation */}
      <div className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto border-b md:border-b-0 md:border-r border-border-tertiary pb-4 md:pb-0 md:pr-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-light text-brand-hover'
                : 'text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'text-brand-primary' : 'text-text-tertiary'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div className="flex-1">
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-[16px] font-medium text-text-primary mb-1">General Settings</h3>
              <p className="text-[12px] text-text-tertiary mb-4">Manage your global application preferences.</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-text-secondary mb-1.5 flex items-center gap-1.5">
                    <Globe size={14} className="text-text-tertiary" /> Language
                  </label>
                  <select className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]">
                    <option>English (US)</option>
                    <option>Español</option>
                    <option>Français</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-text-secondary mb-1.5">Timezone</label>
                  <select className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary focus:outline-none focus:border-[#AFA9EC]">
                    <option>UTC-08:00 Pacific Time</option>
                    <option>UTC-05:00 Eastern Time</option>
                    <option>UTC+00:00 GMT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-text-secondary mb-1.5">Theme Preference</label>
                <div className="flex bg-bg-secondary border border-border-tertiary p-1 rounded-xl w-fit">
                  {['light', 'dark', 'system'].map((themeOption) => (
                    <button 
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className={`px-4 py-1.5 text-[12px] font-medium rounded-lg capitalize transition-all ${
                        theme === themeOption || (themeOption === 'system' && theme === undefined)
                          ? 'bg-white dark:bg-bg-primary border border-border-tertiary shadow-sm text-text-primary'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {themeOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-[16px] font-medium text-text-primary mb-1">Notifications</h3>
              <p className="text-[12px] text-text-tertiary mb-4">Choose what updates you want to receive.</p>
            </div>
            
            <div className="space-y-3">
              <ToggleRow 
                title="Video Generation Complete" 
                desc="Receive an email when your video finishes rendering." 
                defaultChecked={true} 
              />
              <ToggleRow 
                title="Weekly Report" 
                desc="Get a summary of your channel's hypothetical growth and credit usage." 
                defaultChecked={false} 
              />
              <ToggleRow 
                title="Product Updates" 
                desc="News about new AI models, limits, and features." 
                defaultChecked={true} 
              />
            </div>
          </div>
        )}

        {activeTab === 'defaults' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-[16px] font-medium text-text-primary mb-1">Video Defaults</h3>
              <p className="text-[12px] text-text-tertiary mb-4">Set default parameters for the 'Faceless Video' flow.</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-text-secondary mb-1.5 flex items-center gap-1.5">
                    <Volume2 size={14} className="text-text-tertiary" /> Default Voice
                  </label>
                  <select className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary outline-none">
                    <option>Professional male</option>
                    <option>Professional female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-text-secondary mb-1.5 flex items-center gap-1.5">
                    <Type size={14} className="text-text-tertiary" /> Captions Style
                  </label>
                  <select className="w-full text-[13px] p-2.5 border border-border-tertiary rounded-lg bg-bg-secondary text-text-primary outline-none">
                    <option>Dynamic word-by-word</option>
                    <option>Standard lower-thirds</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-5 border-t border-border-tertiary flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-[13px] font-medium hover:bg-brand-hover transition-colors">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, defaultChecked }: { title: string, desc: string, defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-3 border border-border-tertiary rounded-xl bg-bg-secondary">
      <div>
        <div className="text-[13px] font-medium text-text-primary">{title}</div>
        <div className="text-[11px] text-text-tertiary mt-0.5">{desc}</div>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-9 h-5 rounded-full relative transition-colors ${checked ? 'bg-brand-primary' : 'bg-border-secondary'}`}
      >
        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${checked ? 'left-[19px]' : 'left-[3px]'}`} />
      </button>
    </div>
  );
}
