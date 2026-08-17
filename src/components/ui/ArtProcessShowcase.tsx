import React, { useState } from "react";
import { motion } from "framer-motion";
import LightboxViewer, { LightboxImage } from "./LightboxViewer";

export interface ProcessStep {
  stepName: string;
  description?: string;
  imageUrl: string;
}

interface ArtProcessShowcaseProps {
  title?: string;
  steps: ProcessStep[];
}

export const ArtProcessShowcase: React.FC<ArtProcessShowcaseProps> = ({
  title = "Quy trình sáng tác (Art Process Steps)",
  steps,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!steps || steps.length === 0) return null;

  const lightboxImages: LightboxImage[] = steps.map((step) => ({
    src: step.imageUrl,
    title: step.stepName,
    caption: step.description,
  }));

  const handleOpenLightbox = (index: number) => {
    setActiveStepIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full my-8">
      <h3 className="text-xl font-bold text-neutral-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        {title}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleOpenLightbox(idx)}
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow-md"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={step.imageUrl}
                alt={step.stepName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
            <div className="p-3 bg-neutral-900 border-t border-neutral-800">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                Bước {idx + 1}
              </span>
              <h4 className="text-sm font-medium text-neutral-200 truncate">
                {step.stepName}
              </h4>
              {step.description && (
                <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <LightboxViewer
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={activeStepIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default ArtProcessShowcase;
