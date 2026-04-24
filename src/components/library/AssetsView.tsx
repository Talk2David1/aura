import React, { useEffect, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Music, Video, Trash2, MoreVertical, File } from 'lucide-react';
import { libraryService } from '@/lib/api/library';
import { Asset } from '@/types';

export function AssetsView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'audio' | 'video'>('all');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await libraryService.getAssets();
        setAssets(data);
      } catch (error) {
        console.error("Failed to fetch assets", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setAssets(prev => prev.filter(a => a.id !== id));
    try {
      await libraryService.deleteAsset(id);
    } catch {
      // Handle error natively
    }
  };

  const filteredAssets = activeFilter === 'all' 
    ? assets 
    : assets.filter(a => a.type === activeFilter);

  const getAssetIcon = (type: Asset['type']) => {
    switch(type) {
      case 'image': return <ImageIcon size={16} className="text-brand-primary" />;
      case 'audio': return <Music size={16} className="text-amber-primary" />;
      case 'video': return <Video size={16} className="text-success-primary" />;
    }
  };

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl p-4 md:p-6 mb-8 min-h-[500px]">
      
      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border-secondary hover:border-brand-primary transition-colors rounded-2xl bg-bg-secondary flex flex-col items-center justify-center p-8 md:p-12 mb-8 cursor-pointer group">
        <div className="w-12 h-12 bg-white border border-border-tertiary rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
          <UploadCloud mx-auto size={24} className="text-brand-primary" />
        </div>
        <h3 className="text-[14px] font-medium text-text-primary mb-1">Click or drag & drop to upload</h3>
        <p className="text-[12px] text-text-tertiary text-center max-w-sm">
          Support for images (JPG, PNG), audio (MP3, WAV) and video (MP4, MOV). Maximum 50MB per file.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-[16px] font-medium text-text-primary">Your Media Library</h3>
        
        <div className="flex bg-bg-secondary border border-border-tertiary p-1 rounded-xl">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 text-[12px] font-medium rounded-lg transition-all ${activeFilter === 'all' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('image')}
            className={`px-4 py-1.5 text-[12px] font-medium rounded-lg transition-all ${activeFilter === 'image' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Images
          </button>
          <button 
            onClick={() => setActiveFilter('audio')}
            className={`px-4 py-1.5 text-[12px] font-medium rounded-lg transition-all ${activeFilter === 'audio' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Audio
          </button>
          <button 
            onClick={() => setActiveFilter('video')}
            className={`px-4 py-1.5 text-[12px] font-medium rounded-lg transition-all ${activeFilter === 'video' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Video
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-text-tertiary text-[13px]">
          Loading assets...
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 border border-border-tertiary border-dashed rounded-xl bg-bg-secondary text-text-tertiary">
          <File size={32} className="mb-3 opacity-50" />
          <p className="text-[13px]">No {activeFilter !== 'all' ? activeFilter : ''} assets found in your library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="group border border-border-tertiary rounded-xl overflow-hidden hover:border-[#AFA9EC] transition-colors bg-bg-primary">
              <div className="aspect-square bg-bg-secondary flex items-center justify-center relative break-all p-2 text-center text-4xl">
                {asset.url}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur border border-border-tertiary rounded-md p-1.5 shadow-sm inline-flex">
                  {getAssetIcon(asset.type)}
                </div>
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleDelete(asset.id)}
                    className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-coral-light hover:text-coral-primary transition-colors shadow-sm"
                  >
                    <Trash2 size={14} className="text-text-secondary hover:text-coral-primary transition-colors" />
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[12px] font-medium text-text-primary truncate" title={asset.name}>{asset.name}</span>
                  <button className="text-text-tertiary hover:text-text-primary">
                    <MoreVertical size={12} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-text-tertiary">{asset.size}</span>
                  <span className="text-[10px] text-text-tertiary">{new Date(asset.addedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
