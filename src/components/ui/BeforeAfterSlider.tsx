import React, { useState, useRef, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string; // Bản phác thảo / Sketch / Lineart
  afterImage: string; // Bản hoàn thiện / Final Render
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Sketch / Lineart",
  afterLabel = "Final Artwork",
  className = "",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-xl select-none cursor-ew-resize border border-neutral-800 bg-neutral-900 ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      {/* Background Image (After - Final Render) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        onDragStart={(e) => e.preventDefault()}
      />
      <span className="absolute top-4 right-4 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur z-10 border border-white/10">
        {afterLabel}
      </span>

      {/* Foreground Image Clipped (Before - Sketch / Lineart) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 max-w-none w-full h-full object-cover pointer-events-none"
          style={{ width: containerRef.current?.clientWidth || "100%" }}
          onDragStart={(e) => e.preventDefault()}
        />
        <span className="absolute top-4 left-4 bg-amber-500/80 text-black font-semibold text-xs px-3 py-1 rounded-full backdrop-blur z-10">
          {beforeLabel}
        </span>
      </div>

      {/* Divider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-amber-400 cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg border-2 border-neutral-900">
          <MoveHorizontal className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
