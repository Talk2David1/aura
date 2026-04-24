import React, { useEffect, useState } from 'react';
import { Play, MoreVertical, Clock, Search, Filter } from 'lucide-react';
import { projectService } from '@/lib/api/projects';
import { Project } from '@/types';

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusColor = (status: Project['status']) => {
    switch(status) {
      case 'completed': return 'bg-success-light text-success-dark';
      case 'generating': return 'bg-amber-light text-amber-primary';
      case 'failed': return 'bg-coral-light text-coral-dark';
      default: return 'bg-bg-secondary text-text-secondary';
    }
  };

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl p-4 md:p-6 mb-8 min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-96 bg-bg-secondary border border-border-tertiary rounded-lg px-3 py-2">
          <Search size={16} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search projects by name..." 
            className="bg-transparent border-none outline-none text-[13px] text-text-primary w-full placeholder:text-text-tertiary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border-tertiary rounded-lg text-[13px] text-text-secondary hover:bg-border-tertiary transition-colors">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-text-tertiary text-[13px]">
          Loading projects...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="group border border-border-tertiary rounded-xl overflow-hidden hover:border-[#AFA9EC] transition-all bg-bg-primary relative">
              
              {/* Thumbnail Area */}
              <div className="aspect-video bg-bg-secondary flex items-center justify-center relative">
                <span className="text-[32px]">{project.thumbnail || '🎬'}</span>
                
                {project.status === 'completed' && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                      <Play size={16} className="text-brand-primary ml-0.5" />
                    </div>
                  </div>
                )}
                
                {project.status === 'generating' && (
                  <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-[1px]">
                    <div className="w-6 h-6 border-2 border-brand-light border-t-brand-primary rounded-full animate-spin mb-2" />
                    <span className="text-[11px] font-medium text-brand-hover">Generating...</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wide shadow-sm ${getStatusColor(project.status)}`}>
                {project.status}
              </div>

              {/* Info Area */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-[13px] font-medium text-text-primary line-clamp-1 flex-1" title={project.title}>
                    {project.title}
                  </h3>
                  <button className="text-text-tertiary hover:text-text-primary transition-colors">
                    <MoreVertical size={14} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3 text-[11px] text-text-tertiary">
                  <span className="bg-bg-secondary px-2 py-1 rounded border border-border-tertiary truncate max-w-[100px]">
                    {project.mode}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {project.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
