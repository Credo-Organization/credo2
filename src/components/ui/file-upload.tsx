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
          "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group",
          isDragActive
            ? "border-cyan-500 bg-cyan-500/10"
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900/80"
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
        
        {/* Subtle background grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 [mask-image:linear-gradient(to_bottom,white,transparent)]" 
             style={{ backgroundImage: "radial-gradient(#3f3f46 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <motion.div
            animate={{ y: isDragActive ? -10 : 0, scale: isDragActive ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-4 rounded-full bg-zinc-800/50 shadow-inner group-hover:bg-zinc-800 transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-cyan-400" />
          </motion.div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-300">
              {isDragActive ? "Drop files here to upload" : "Drag & drop certificates here"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              or click to browse from your computer
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
            className="mt-6 space-y-3 overflow-hidden"
          >
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Selected Files ({files.length})
            </h4>
            {files.map((file, idx) => {
              // Create an object URL for images to show preview
              const isImage = file.type.startsWith('image/');
              const previewUrl = isImage ? URL.createObjectURL(file) : null;
              
              return (
                <motion.div
                  key={file.name + idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2 rounded-md bg-zinc-800 text-cyan-400">
                        <File className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-zinc-200 truncate">{file.name}</span>
                        <span className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {isImage && previewUrl && (
                    <div className="w-full h-32 bg-black/40 border-t border-zinc-800 flex items-center justify-center overflow-hidden">
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
