"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCode,
  Camera,
  Search,
  X,
  Sparkles,
  AlertCircle,
  Upload,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { extractPassportId } from "./candidate-lookup";
import { toast } from "sonner";
import jsQR from "jsqr";

interface PassportScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_CANDIDATE_IDS = [
  {
    id: "MSK-2026-IND-0491",
    name: "Subham Singh",
    college: "NIT · Full-Stack & AI",
    status: "14 Repos Audited",
  },
  {
    id: "MSK26S1104",
    name: "Aarav Mehta",
    college: "IIT Delhi · Distributed Systems",
    status: "8 Repos Audited",
  },
  {
    id: "MSK26S7421",
    name: "Ananya Roy",
    college: "BITS Pilani · Machine Learning",
    status: "11 Repos Audited",
  },
];

export function PassportScannerModal({ isOpen, onClose }: PassportScannerModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"camera" | "id">("camera");
  const [passportId, setPassportId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera media tracks cleanly without re-triggering component re-renders
  const stopCameraTracks = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  // Navigate to candidate dossier with extracted ID
  const handleDirectLookup = useCallback((raw: string) => {
    const cleanId = extractPassportId(raw);
    if (!cleanId) {
      setError("Please provide a valid Passport ID or verification URL.");
      return;
    }
    if (cleanId.length < 3) {
      setError(`"${cleanId}" is too short to be a valid passport ID.`);
      return;
    }

    toast.success(`Found Passport #${cleanId}! Loading dossier...`);
    stopCameraTracks();
    onClose();
    router.push(`/recruiter/candidate/${cleanId}`);
  }, [router, onClose, stopCameraTracks]);

  // Frame scanner loop using jsQR on off-screen canvas (zero blinking, constant stream)
  const scanVideoFrame = useCallback(() => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Use lightweight resolution for sub-10ms CPU decode
    const width = 480;
    const height = Math.floor((video.videoHeight / video.videoWidth) * width) || 360;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data) {
        handleDirectLookup(code.data);
        return; // Stop scan loop once detected
      }
    }

    // Continue scanning next frame smoothly
    animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
  }, [handleDirectLookup]);

  // Initialize camera only once when opening modal or switching tab
  useEffect(() => {
    let isCancelled = false;

    async function initCamera() {
      if (!isOpen || activeTab !== "camera") {
        stopCameraTracks();
        return;
      }

      // If stream is already active and healthy, don't restart it (prevents blinking)
      if (streamRef.current && streamRef.current.active) {
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = streamRef.current;
          try {
            await videoRef.current.play();
          } catch {
            // ignore
          }
        }
        setIsScanning(true);
        animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
        return;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (!isCancelled) {
            setError("Camera access is not supported on this browser.");
            setCameraPermission("denied");
          }
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraPermission("granted");
        setIsScanning(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Start smooth QR frame processing loop
        animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
      } catch (err: any) {
        if (!isCancelled) {
          console.warn("[PassportScanner] Camera permission error:", err);
          setCameraPermission("denied");
          setError("Camera permission was denied or camera is currently unavailable.");
        }
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      stopCameraTracks();
    };
  }, [isOpen, activeTab, stopCameraTracks, scanVideoFrame]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDirectLookup(passportId);
  };

  // Real QR Code Image Decoder: extracts QR from uploaded image file
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingFile(true);
    setError(null);
    toast.info("Analyzing QR code image...");

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          if (!ctx) {
            setError("Could not initialize image processing canvas.");
            setIsAnalyzingFile(false);
            URL.revokeObjectURL(objectUrl);
            return;
          }

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });

          URL.revokeObjectURL(objectUrl);
          setIsAnalyzingFile(false);

          if (code && code.data) {
            handleDirectLookup(code.data);
          } else {
            setError("No QR code detected in this image. Please try another photo or enter Passport ID directly.");
            toast.error("Could not find a valid QR code in the image.");
          }
        } catch (decodeErr) {
          console.error("QR decode error:", decodeErr);
          setIsAnalyzingFile(false);
          setError("Failed to parse image for QR data.");
          URL.revokeObjectURL(objectUrl);
        }
      };

      img.onerror = () => {
        setIsAnalyzingFile(false);
        setError("Failed to load image file.");
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    } catch (err: any) {
      setIsAnalyzingFile(false);
      setError(err.message || "Failed to process image file.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            stopCameraTracks();
            onClose();
          }}
          className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-3xl border-2 border-zinc-900 bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_#18181B] dark:shadow-[8px_8px_0px_0px_#000000] z-10 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b-2 border-zinc-900 dark:border-zinc-800 bg-[#FAF9F6] dark:bg-zinc-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
                  Candidate Passport Scanner
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Scan physical cards, QR codes, or upload QR screenshots
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stopCameraTracks();
                onClose();
              }}
              className="w-8 h-8 rounded-xl border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-3 bg-zinc-100 dark:bg-zinc-800/80 border-b-2 border-zinc-900 dark:border-zinc-800 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("camera");
                setError(null);
              }}
              className={cn(
                "py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 border-2 transition-all cursor-pointer",
                activeTab === "camera"
                  ? "bg-white dark:bg-zinc-900 text-blue-600 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B]"
                  : "bg-transparent text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-900"
              )}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera QR Scanner</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("id");
                stopCameraTracks();
                setError(null);
              }}
              className={cn(
                "py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 border-2 transition-all cursor-pointer",
                activeTab === "id"
                  ? "bg-white dark:bg-zinc-900 text-blue-600 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B]"
                  : "bg-transparent text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-900"
              )}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Direct Passport ID</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6 flex-1">
            {activeTab === "camera" ? (
              <div className="flex flex-col items-center gap-4">
                {/* Viewfinder Window with Stable Video Stream */}
                <div className="relative w-full h-64 rounded-2xl border-2 border-zinc-900 bg-zinc-950 overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="w-full h-full object-cover"
                  />

                  {/* Laser Scanline */}
                  {isScanning && cameraPermission === "granted" && (
                    <motion.div
                      animate={{ y: [-100, 100] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-8 right-8 h-0.5 bg-blue-500 shadow-[0_0_12px_2px_#3B82F6]"
                    />
                  )}

                  {/* Optical Reticle Frame Brackets */}
                  <div className="absolute inset-8 border-2 border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-t-2 border-l-2 border-blue-400 -mt-2 -ml-2" />
                      <div className="w-4 h-4 border-t-2 border-r-2 border-blue-400 -mt-2 -mr-2" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-b-2 border-l-2 border-blue-400 -mb-2 -ml-2" />
                      <div className="w-4 h-4 border-b-2 border-r-2 border-blue-400 -mb-2 -mr-2" />
                    </div>
                  </div>

                  {/* Camera Not Granted or Error state */}
                  {cameraPermission === "denied" && (
                    <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center text-white gap-2 z-10">
                      <AlertCircle className="w-8 h-8 text-amber-400" />
                      <span className="font-black text-sm">Camera Unavailable</span>
                      <p className="text-xs text-zinc-400 max-w-xs">
                        Camera access is disabled. You can upload a QR image below or choose a sample candidate.
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload QR Image Button */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="qr-image-upload-input"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzingFile}
                    className="w-full sm:w-auto flex-1 h-10 px-4 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-black border-2 border-zinc-900 dark:border-zinc-700 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Decoding QR image...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Upload QR Code Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
                    Enter Passport ID or Verification URL
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={passportId}
                      onChange={(e) => {
                        setPassportId(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="e.g. CDY26S7421 or MSK-2026-IND-0491"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!passportId.trim()}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Fetch Candidate Summary</span>
                </button>
              </form>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-3.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Preset Candidates */}
            <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                  OR TEST AUDITED SAMPLE DOSSIERS
                </span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_CANDIDATE_IDS.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => handleDirectLookup(candidate.id)}
                    className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 group-hover:text-blue-600 block truncate">
                      {candidate.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate font-mono">
                      #{candidate.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
