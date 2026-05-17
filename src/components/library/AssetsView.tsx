import React, { useEffect, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Music, Video, Trash2, MoreVertical, File } from 'lucide-react';
import { libraryService } from '@/lib/api/library';
import { Asset } from '@/types';

export function AssetsView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'audio' | 'video'>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const data = await libraryService.getAssets(activeFilter === 'all' ? undefined : activeFilter);
        if (!cancelled) setAssets(data);
      } catch (error) {
        console.error("Failed to fetch assets", error);
        if (!cancelled) setAssets([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setAssets(prev => prev.filter(a => a.id !== id));
    try {
      await libraryService.deleteAsset(id);
    } catch {
      // Handle error natively
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPublicUrl('');
    setUploadError(null);
    setUploadOpen(true);
    e.target.value = '';
  };

  const submitAsset = async () => {
    if (!pendingFile || !publicUrl.trim().startsWith('http')) {
      setUploadError('Upload your file to Cloudinary or another CDN, then paste the public https URL.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const created = await libraryService.createAssetRecord({
        name: pendingFile.name,
        type: pendingFile.type.startsWith('image/')
          ? 'image'
          : pendingFile.type.startsWith('audio/')
            ? 'audio'
            : 'video',
        sizeBytes: pendingFile.size,
        url: publicUrl.trim(),
      });
      setAssets((prev) => [created, ...prev]);
      setUploadOpen(false);
      setPendingFile(null);
      setPublicUrl('');
    } catch {
      setUploadError('Could not save asset record.');
    } finally {
      setUploading(false);
    }
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch(type) {
      case 'image': return <ImageIcon size={16} className="text-brand-primary" />;
      case 'audio': return <Music size={16} className="text-amber-primary" />;
      case 'video': return <Video size={16} className="text-success-primary" />;
    }
  };

  return (
    <div className="bg-bg-primary md:border border-border-tertiary rounded-xl p-4 md:p-6 mb-8 min-h-[500px]">
      
      <label className="border-2 border-dashed border-border-secondary hover:border-brand-primary transition-colors rounded-2xl bg-bg-secondary flex flex-col items-center justify-center p-8 md:p-12 mb-8 cursor-pointer group">
        <input type="file" className="hidden" accept="image/*,audio/*,video/*" onChange={handleFilePick} />
        <div className="w-12 h-12 bg-white border border-border-tertiary rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <UploadCloud size={24} className="text-brand-primary" />
        </div>
        <h3 className="text-[14px] font-medium text-text-primary mb-1">Select file to register</h3>
        <p className="text-[12px] text-text-tertiary text-center max-w-sm">
          Upload to your CDN, then save via POST /studio/assets with the public https URL.
        </p>
      </label>

      {uploadOpen && pendingFile ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-bg-primary rounded-xl p-5 max-w-md w-full border border-border-tertiary">
            <h4 className="text-[14px] font-medium mb-2">Register asset</h4>
            <p className="text-[12px] text-text-tertiary mb-3">
              {pendingFile.name} ({Math.round(pendingFile.size / 1024)} KB)
            </p>
            <label className="block text-[12px] mb-1">Public URL</label>
            <input
              type="url"
              value={publicUrl}
              onChange={(e) => setPublicUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full p-2 border rounded-lg text-[13px] mb-3"
            />
            {uploadError ? <p className="text-[11px] text-coral-primary mb-2">{uploadError}</p> : null}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setUploadOpen(false)} className="px-3 py-2 text-[13px] border rounded-lg">
                Cancel
              </button>
              <button type="button" onClick={submitAsset} disabled={uploading} className="px-3 py-2 text-[13px] bg-brand-primary text-white rounded-lg">
                {uploading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 border border-border-tertiary border-dashed rounded-xl bg-bg-secondary text-text-tertiary">
          <File size={32} className="mb-3 opacity-50" />
          <p className="text-[13px]">No {activeFilter !== 'all' ? activeFilter : ''} assets found in your library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map(asset => (
            <div key={asset.id} className="group border border-border-tertiary rounded-xl overflow-hidden hover:border-[#AFA9EC] transition-colors bg-bg-primary">
              <div className="aspect-square bg-bg-secondary flex items-center justify-center relative break-all p-2 text-center text-4xl overflow-hidden">
                {asset.url.startsWith('http') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  asset.url
                )}
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
