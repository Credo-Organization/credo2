"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
      onChange?.([...files, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      onChange?.([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  return (
    <div className="w-full mb-8">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group",
          isDragActive
            ? "border-amber-500 bg-amber-200/50"
            : "border-amber-300/80 hover:border-amber-400 bg-white/80 hover:bg-white/95"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
        
        <div className="relative z-10 flex flex-col items-center space-y-3">
          <motion.div
            animate={{ y: isDragActive ? -6 : 0, scale: isDragActive ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-3.5 rounded-full bg-amber-100 border border-amber-300/70 group-hover:bg-amber-200/60 transition-colors"
          >
            <UploadCloud className="w-6 h-6 text-amber-950" />
          </motion.div>
          
          <div className="text-center">
            <p className="text-xs sm:text-sm font-semibold text-zinc-900">
              {isDragActive ? "Drop files here to upload" : "Drag & drop certificates here"}
            </p>
            <p className="text-[11px] text-amber-950/70 mt-0.5">
              or click to browse from your computer (PDF, PNG, JPG)
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2.5 overflow-hidden"
          >
            <h4 className="text-[11px] font-semibold text-amber-950/70 uppercase tracking-wider mb-2">
              Selected Files ({files.length})
            </h4>
            {files.map((file, idx) => {
              const isImage = file.type.startsWith('image/');
              const previewUrl = isImage ? URL.createObjectURL(file) : null;
              
              return (
                <motion.div
                  key={file.name + idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="flex flex-col rounded-xl border border-amber-300/80 bg-white/90 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="p-1.5 rounded-lg bg-amber-100 border border-amber-300/70 text-amber-950">
                        <File className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-medium text-zinc-900 truncate">{file.name}</span>
                        <span className="text-[10px] text-amber-950/60">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="p-1 rounded-md text-amber-900/50 hover:text-red-600 hover:bg-amber-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  {isImage && previewUrl && (
                    <div className="w-full h-28 bg-amber-50/50 border-t border-amber-200/80 flex items-center justify-center overflow-hidden">
                      <img src={previewUrl} alt={file.name} className="object-contain h-full w-full" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
