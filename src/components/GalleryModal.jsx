import React, { useEffect } from "react";

export default function GalleryModal({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  if (index === null || index < 0 || index >= images.length) return null;
  const img = images[index];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="flex justify-end p-3">
        <button
          aria-label="Close"
          onClick={onClose}
          className="rounded-xl border border-white/40 text-white px-3 py-1.5 hover:bg-white/10"
        >
          Close ✕
        </button>
      </div>
      <div className="flex-1 relative flex items-center justify-center px-2 sm:px-6">
        <button
          aria-label="Previous"
          onClick={onPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
        >
          ‹
        </button>
        <img
          src={img.url}
          alt={img.category}
          className="max-h-[70vh] sm:max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
        />
        <button
          aria-label="Next"
          onClick={onNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
        >
          ›
        </button>
      </div>
      <div className="p-4 text-center text-white/80 text-sm">
        {index + 1} / {images.length} — {img.category}
      </div>
    </div>
  );
}
