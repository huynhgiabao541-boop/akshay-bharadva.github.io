import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, X, Maximize2, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  tags?: string[] | null;
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  description,
  tags,
}: ImageLightboxModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-zinc-950/95 border-zinc-800 text-zinc-100 shadow-2xl backdrop-blur-xl">
        <div className="relative flex flex-col lg:flex-row max-h-[85vh] overflow-y-auto lg:overflow-hidden">
          {/* Close button override */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-3 right-3 z-50 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90 backdrop-blur-md"
          >
            <X className="size-5" />
          </Button>

          {/* Image Display Area */}
          <div className="relative flex-1 bg-black/90 flex items-center justify-center min-h-[350px] lg:min-h-[550px] p-4 group overflow-hidden">
            <motion.img
              src={imageUrl}
              alt={title || "Artwork preview"}
              animate={{ scale: isZoomed ? 1.4 : 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-md shadow-2xl cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
            />

            {/* Quick Action overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-zinc-300">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1 hover:text-white"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <ZoomIn className="size-3.5" />
                {isZoomed ? "Thu nhỏ" : "Phóng to"}
              </Button>
              <span className="w-px h-3 bg-zinc-700" />
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1 text-xs px-2"
              >
                <Maximize2 className="size-3.5" /> Ảnh gốc
              </a>
            </div>
          </div>

          {/* Side Artwork Details (If title or description present) */}
          {(title || description || tags?.length) && (
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 flex flex-col justify-between bg-zinc-900/60 backdrop-blur-md">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">
                    Illustration Detail
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>

                {description && (
                  <div className="text-sm text-zinc-300 leading-relaxed font-light whitespace-pre-line border-t border-zinc-800/80 pt-3">
                    {description}
                  </div>
                )}

                {tags && tags.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800/80">
                    <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 mb-2">
                      <Tag className="size-3 text-primary" /> Phong cách / Thể loại:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 text-[11px] text-zinc-500 font-mono text-center lg:text-left">
                Văn Lang Illustration Portfolio
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
