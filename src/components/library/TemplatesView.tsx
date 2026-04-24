import React, { useEffect, useState } from 'react';
import { LayoutTemplate, Search, Filter, MonitorPlay, Smartphone } from 'lucide-react';
import { libraryService } from '@/lib/api/library';
import { Template } from '@/types';

export function TemplatesView() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await libraryService.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl p-4 md:p-6 mb-8 min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-border-tertiary pb-6">
        <div>
          <h3 className="text-[16px] font-medium text-text-primary mb-1">Video Templates</h3>
          <p className="text-[12px] text-text-tertiary">Start with a pre-designed structure for your generative videos.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-64 bg-bg-secondary border border-border-tertiary rounded-lg px-3 py-2">
          <Search size={16} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="bg-transparent border-none outline-none text-[13px] text-text-primary w-full placeholder:text-text-tertiary"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-none">
        {categories.map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`px-4 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors border ${
               activeCategory === cat 
                ? 'bg-brand-primary text-white border-brand-primary' 
                : 'bg-bg-secondary text-text-secondary border-border-tertiary hover:border-[#AFA9EC]'
             }`}
           >
             {cat}
           </button>
        ))}
        <button className="px-3 py-1.5 rounded-full text-[12px] font-medium text-text-secondary border border-border-tertiary bg-bg-primary flex items-center gap-1.5 hover:bg-bg-secondary ml-auto shrink-0 transition-all">
          <Filter size={12} /> Filters
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-text-tertiary text-[13px]">
          Loading templates...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="group border border-border-tertiary rounded-xl overflow-hidden hover:border-[#AFA9EC] hover:shadow-sm transition-all bg-bg-primary flex flex-col">
              <div 
                className={`bg-bg-secondary flex items-center justify-center relative overflow-hidden ${
                  template.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-60' : 
                  template.aspectRatio === '1:1' ? 'aspect-square max-h-60' : 'aspect-video'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent z-0"></div>
                <span className="text-[48px] drop-shadow-sm relative z-10 scale-100 group-hover:scale-110 transition-transform duration-300">
                  {template.thumbnail}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20 gap-2">
                  <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-brand-hover hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                    <LayoutTemplate size={14} /> Use Template
                  </button>
                </div>
                
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-medium flex items-center gap-1.5 z-10">
                  {template.aspectRatio === '9:16' ? <Smartphone size={10} /> : <MonitorPlay size={10} />}
                  {template.aspectRatio}
                </div>
              </div>

              <div className="p-3.5 border-t border-border-tertiary">
                <h3 className="text-[13px] font-medium text-text-primary mb-1">
                  {template.name}
                </h3>
                <span className="text-[11px] text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded border border-border-tertiary">
                  {template.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
