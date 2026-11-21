import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';
import { FileData } from '@/src/utils/multi-source-processor';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploaderProps {
  onImageSelect: (files: FileData[] | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  onGenerate, 
  isGenerating 
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles).slice(0, MAX_FILES);
    const validFiles: File[] = [];
    
    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} terlalu besar (max 5MB)`);
        continue;
      }
      
      const isImage = file.type.startsWith('image/');
      
      if (!isImage) {
        alert(`File ${file.name} tidak didukung. Hanya gambar.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    const processedFiles: FileData[] = [...files];
    let processed = 0;
    
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        processedFiles.push({
          name: file.name,
          type: file.type,
          data: reader.result as string,
          isImage: true
        });
        processed++;
        
        if (processed === validFiles.length) {
          const finalFiles = processedFiles.slice(0, MAX_FILES);
          setFiles(finalFiles);
          onImageSelect(finalFiles);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    
    if (pastedFiles.length > 0) processFiles(pastedFiles);
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onImageSelect(newFiles.length > 0 ? newFiles : null);
  };
  
  const handleRemoveAll = () => {
    setFiles([]);
    onImageSelect(null);
  };

  return (
    <div className="space-y-4" onPaste={handlePaste}>
      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 transition-all text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/20 scale-[1.02]'
              : 'border-white/20 hover:border-indigo-500 hover:bg-indigo-500/10'
          }`}
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={32} className="text-indigo-400" />
          </div>
          <p className="text-sm font-bold text-white mb-1">Upload, Drag & Drop, atau Paste (Ctrl+V)</p>
          <p className="text-xs text-slate-400">PNG, JPG (Max {MAX_FILES} files, 5MB each)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">{files.length} file dipilih</span>
            <button
              onClick={handleRemoveAll}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              Hapus Semua
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="relative border border-white/10 rounded-xl overflow-hidden bg-slate-800/50">
                {file.isImage && (
                  <img src={file.data} alt={file.name} className="w-full h-24 object-cover" />
                )}
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-rose-500 transition-all shadow-lg backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isGenerating
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
              <span>Sedang Menganalisis...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate Soal dari Gambar</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
