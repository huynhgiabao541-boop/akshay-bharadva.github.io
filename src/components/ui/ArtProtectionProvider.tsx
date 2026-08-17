import React, { useEffect } from "react";

interface ArtProtectionProviderProps {
  children: React.ReactNode;
  enableProtection?: boolean;
}

export const ArtProtectionProvider: React.FC<ArtProtectionProviderProps> = ({
  children,
  enableProtection = true,
}) => {
  useEffect(() => {
    if (!enableProtection) return;

    const handleContextMenu = (e: MouseEvent) => {
      // Chặn menu chuột phải trên hình ảnh
      const target = e.target;
      if (target instanceof Element) {
        if (target.tagName === "IMG" || target.closest("img") || (target as HTMLElement).dataset?.artProtected) {
          e.preventDefault();
        }
      }
    };

    const handleDragStart = (e: DragEvent) => {
      // Chặn kéo thả hình ảnh ra ngoài trình duyệt
      const target = e.target;
      if (target instanceof Element) {
        if (target.tagName === "IMG" || target.closest("img")) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, [enableProtection]);

  return <>{children}</>;
};

export default ArtProtectionProvider;
