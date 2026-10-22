import { useState, type ReactNode } from 'react';
import { AltArrowLeft, AltArrowRight } from '../icons';

interface ImageCarouselProps {
  /** Slide; tiap item dirender penuh di area carousel. */
  slides: ReactNode[];
  /** Indeks awal (tidak terkontrol). */
  defaultIndex?: number;
  /** Tampilkan tombol sebelumnya / berikutnya. */
  showArrows?: boolean;
  className?: string;
  testId?: string;
}

/** Image Carousel WDS: slide dengan dot indikator (aktif memanjang) dan tombol navigasi. */
function ImageCarousel({ slides, defaultIndex = 0, showArrows = true, className = '', testId }: ImageCarouselProps) {
  const [index, setIndex] = useState(Math.min(defaultIndex, Math.max(0, slides.length - 1)));
  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      data-testid={testId}
      className={`wds-carousel ${className}`}
    >
      <div className="wds-carousel__viewport" aria-live="polite">
        {slides[index]}
        {showArrows && slides.length > 1 && (
          <>
            <button type="button" aria-label="Previous" onClick={() => go(index - 1)} className="wds-carousel__nav" data-side="prev">
              <AltArrowLeft />
            </button>
            <button type="button" aria-label="Next" onClick={() => go(index + 1)} className="wds-carousel__nav" data-side="next">
              <AltArrowRight />
            </button>
          </>
        )}
      </div>
      <div className="wds-carousel__dots" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1} / ${slides.length}`}
            data-current={i === index || undefined}
            onClick={() => setIndex(i)}
            className="wds-carousel__dot"
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
