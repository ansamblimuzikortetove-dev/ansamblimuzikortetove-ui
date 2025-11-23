import React, { useState } from "react";

export default function GallerySlider({ images = [] }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  if (!images.length) return null;

  return (
    <div className="relative card overflow-hidden">
      <img src={images[index]} alt={"Slide " + index} className="w-full h-72 object-cover" />
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-slate-900/60 px-3 py-2 rounded-lg">
        ‹
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-slate-900/60 px-3 py-2 rounded-lg">
        ›
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === index ? "bg-accent" : "bg-white/70 dark:bg-slate-700"}`} />
        ))}
      </div>
    </div>
  );
}
