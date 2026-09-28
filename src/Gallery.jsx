import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ photos, name }) {
  const [i, setI] = useState(0);
  const go = (n) => setI((n + photos.length) % photos.length);
  const many = photos.length > 1;

  return (
    <div className="gallery" role="group" aria-label={`${name} photos`}>
      <div className="gallery-stage">
        <img className="product-photo" src={photos[i]} alt={`${name}, photo ${i + 1} of ${photos.length}`} width="350" height="392" />
        {many && (
          <>
            <button className="gallery-arrow prev" onClick={() => go(i - 1)} aria-label="Previous photo"><ChevronLeft size={20} /></button>
            <button className="gallery-arrow next" onClick={() => go(i + 1)} aria-label="Next photo"><ChevronRight size={20} /></button>
          </>
        )}
      </div>
      {many && (
        <div className="thumbs">
          {photos.map((src, n) => (
            <button key={src} className={`thumb${n === i ? " active" : ""}`} onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`} aria-pressed={n === i}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}