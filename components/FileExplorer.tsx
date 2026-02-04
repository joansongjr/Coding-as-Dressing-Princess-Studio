
import React from 'react';
import { FileEntry } from '../types';

interface FileExplorerProps {
  files: FileEntry[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFileId, onFileSelect }) => {
  return (
    <div className="flex flex-col h-full bg-[#f8f6f4] border-r border-[#e2d1c3] w-48 md:w-56 select-none shrink-0">
      <div className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#e2d1c3] bg-white/50">
        Project Explorer
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 mb-2 flex items-center gap-2 opacity-40">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-tight">Atelier_V1</span>
        </div>
        <div className="space-y-[1px]">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onFileSelect(file.id)}
              className={`px-6 py-2 flex items-center gap-2 cursor-pointer transition-colors text-xs font-medium ${
                activeFileId === file.id
                  ? 'bg-white text-[#d4af37] border-l-2 border-[#d4af37]'
                  : 'text-gray-600 hover:bg-white/40'
              }`}
            >
              <span className="opacity-50 font-mono text-[8px]">{file.name.split('.').pop()?.toUpperCase()}</span>
              <span className="truncate">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
