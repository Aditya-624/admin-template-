"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Upload, FileText, FileVideo, FileImage, File,
  CheckCircle, AlertCircle, Trash2, Eye, Download,
  CloudUpload, Sparkles, RefreshCw, FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "done" | "error";
  progress: number;
  preview?: string;
}

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesUploaded?: (files: UploadedFile[]) => void;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type: string) => {
  if (type.startsWith("video/"))  return { icon: FileVideo, color: "text-purple-400", bg: "bg-purple-500/15" };
  if (type.startsWith("image/"))  return { icon: FileImage, color: "text-cyan-400",   bg: "bg-cyan-500/15" };
  if (type === "application/pdf") return { icon: FileText,  color: "text-red-400",    bg: "bg-red-500/15" };
  if (type.includes("word"))      return { icon: FileText,  color: "text-blue-400",   bg: "bg-blue-500/15" };
  return { icon: File, color: "text-slate-400", bg: "bg-slate-500/15" };
};

export default function FileUploadModal({
  open,
  onClose,
  title = "Upload Files",
  accept = "*",
  multiple = true,
  maxSizeMB = 500,
  onFilesUploaded,
}: FileUploadModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (file: File): UploadedFile => ({
    id: Math.random().toString(36).slice(2),
    name: file.name,
    size: file.size,
    type: file.type,
    status: "uploading",
    progress: 0,
  });

  const processFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadedFile[] = [];

    Array.from(incoming).forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) return;
      const entry = simulateUpload(file);
      newFiles.push(entry);

      // Simulate progress
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 25 + 10;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) => f.id === entry.id ? { ...f, progress: 100, status: "done" } : f)
          );
        } else {
          setFiles((prev) =>
            prev.map((f) => f.id === entry.id ? { ...f, progress: Math.min(prog, 99) } : f)
          );
        }
      }, 300);
    });

    setFiles((prev) => [...prev, ...newFiles]);
  }, [maxSizeMB]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleDone = () => {
    onFilesUploaded?.(files.filter((f) => f.status === "done"));
    setFiles([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-modal w-full max-w-2xl pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                    <CloudUpload className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-100 text-base">{title}</h2>
                    <p className="text-xs text-slate-500">Max {maxSizeMB} MB per file</p>
                  </div>
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Drop Zone */}
                <motion.div
                  animate={{ borderColor: dragging ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.10)" }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    "relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200",
                    dragging
                      ? "bg-indigo-500/10 border-indigo-500/60 shadow-glow"
                      : "bg-white/3 hover:bg-white/5 hover:border-white/20"
                  )}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => processFiles(e.target.files)}
                  />

                  <motion.div
                    animate={{ scale: dragging ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                      dragging ? "animated-gradient shadow-glow" : "bg-white/8 border border-white/10"
                    )}>
                      <Upload className={cn("w-7 h-7", dragging ? "text-white" : "text-slate-400")} />
                    </div>
                    <div>
                      <p className="text-slate-200 font-semibold text-base">
                        {dragging ? "Drop files here" : "Drag & drop files here"}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        or{" "}
                        <span className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                          browse from your computer
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
                      {["MP4", "PDF", "DOCX", "PNG", "JPG", "ZIP"].map((ext) => (
                        <span key={ext} className="text-xs glass-inner px-2.5 py-1 text-slate-400 font-medium">
                          {ext}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Quick Options */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: FolderOpen, label: "Browse Files",    desc: "From computer",   color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
                    { icon: CloudUpload, label: "Google Drive",   desc: "Import from Drive", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { icon: Sparkles,   label: "AI Generate",     desc: "Create with AI",  color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={opt.label === "Browse Files" ? () => inputRef.current?.click() : undefined}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border glass-inner transition-all hover:scale-[1.02] hover:shadow-sm",
                        opt.border
                      )}
                    >
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", opt.bg)}>
                        <opt.icon className={cn("w-4 h-4", opt.color)} />
                      </div>
                      <div className="text-center">
                        <p className={cn("text-xs font-semibold", opt.color)}>{opt.label}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* File List */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {files.length} file{files.length !== 1 ? "s" : ""} selected
                        </p>
                        <button onClick={() => setFiles([])}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors">
                          Clear all
                        </button>
                      </div>

                      {files.map((file) => {
                        const { icon: FileIcon, color, bg } = getFileIcon(file.type);
                        return (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="glass-inner p-3.5 flex items-center gap-3"
                          >
                            {/* Icon */}
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
                              <FileIcon className={cn("w-5 h-5", color)} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="text-sm font-medium text-slate-200 truncate pr-2">{file.name}</p>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {file.status === "done"      && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                  {file.status === "error"     && <AlertCircle  className="w-4 h-4 text-red-400" />}
                                  {file.status === "uploading" && <RefreshCw    className="w-4 h-4 text-indigo-400 animate-spin" />}
                                  <button onClick={() => removeFile(file.id)}
                                    className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${file.progress}%` }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                      "h-full rounded-full",
                                      file.status === "done"  ? "bg-emerald-500" :
                                      file.status === "error" ? "bg-red-500" :
                                      "bg-gradient-to-r from-indigo-500 to-purple-500"
                                    )}
                                  />
                                </div>
                                <span className="text-xs text-slate-500 w-20 text-right">
                                  {file.status === "done" ? formatBytes(file.size) : `${Math.round(file.progress)}%`}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {files.filter((f) => f.status === "done").length} of {files.length} uploaded
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={onClose}
                    className="px-4 py-2 rounded-xl glass-inner text-slate-400 text-sm font-medium hover:text-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleDone}
                    disabled={files.filter((f) => f.status === "done").length === 0}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-glow"
                  >
                    Attach Files
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
