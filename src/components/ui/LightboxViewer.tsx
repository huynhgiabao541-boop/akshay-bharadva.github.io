import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxImage {
  src: string;
  title?: string;
  caption?: string;
  artistMark?: string;
}

interface LightboxViewerProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export const LightboxViewer: React.FC<LightboxViewerProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
    setZoomLevel(1);
  }, [currentIndex, isOpen]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[index] || images[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  const handlePrev = () => {
    const newIdx = index === 0 ? images.length - 1 : index - 1;
    setIndex(newIdx);
    setZoomLevel(1);
    if (onNavigate) onNavigate(newIdx);
  };

  const handleNext = () => {
    const newIdx = index === images.length - 1 ? 0 : index + 1;
    setIndex(newIdx);
    setZoomLevel(1);
    if (onNavigate) onNavigate(newIdx);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 bg-black/95 border-neutral-800 text-white flex flex-col justify-between overflow-hidden backdrop-blur-xl">
        {/* Top bar controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 border-b border-neutral-800 z-10">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-200">
              {currentImage.title || `Artwork #${index + 1}`}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {Math.round(zoomLevel * 100)}% Zoom
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              title="Zoom In (Phóng to soi nét vẽ)"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 ml-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main image viewer viewport */}
        <div className="relative flex-1 flex items-center justify-center overflow-auto p-4 select-none">
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 z-10 p-3 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white border border-neutral-700 backdrop-blur transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 z-10 p-3 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white border border-neutral-700 backdrop-blur transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative overflow-hidden flex items-center justify-center max-w-full max-h-full">
            <motion.img
              key={currentImage.src}
              src={currentImage.src}
              alt={currentImage.title || "Illustration Artwork"}
              style={{
                scale: zoomLevel,
                transformOrigin: "center center",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="max-h-[75vh] w-auto object-contain cursor-grab active:cursor-grabbing rounded shadow-2xl"
              onDragStart={(e) => e.preventDefault()}
            />
            {/* Watermark Protection Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
              <span className="text-3xl md:text-5xl font-extrabold tracking-widest text-white uppercase rotate-[-25deg] select-none">
                {currentImage.artistMark || "VLU Illustration © Watermark"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar caption & status */}
        <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/80 border-t border-neutral-800 text-xs text-neutral-400">
          <p>{currentImage.caption || "Click and drag to pan when zoomed in."}</p>
          <span>
            {index + 1} / {images.length}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LightboxViewer;
