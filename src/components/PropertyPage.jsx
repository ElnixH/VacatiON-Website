import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Star,
} from 'lucide-react';
import { PROPERTIES } from '../data/siteData';
import SmoothImage from './SmoothImage';

export default function PropertyPage({ view, setView }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const property = PROPERTIES[view];

  useEffect(() => {
    setCurrentImageIndex(0);
    const timer = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(timer);
  }, [view]);

  // Preload adjacent gallery images for instant transitions
  useEffect(() => {
    if (!property?.gallery?.length) return;
    const total = property.gallery.length;
    const nextIdx = (currentImageIndex + 1) % total;
    const prevIdx = (currentImageIndex - 1 + total) % total;
    [property.gallery[nextIdx], property.gallery[prevIdx]].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [currentImageIndex, property]);

  if (!property) return null;

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % property.gallery.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.gallery.length) % property.gallery.length
    );

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (delta > 40) nextImage();
    if (delta < -40) prevImage();
    setTouchStartX(null);
  };

  return (
    <div
      className={`relative min-h-screen bg-[#FAF9F6] pt-28 pb-32 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Top Back Pill Button */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => setView('home')}
            className="rounded-full px-6 py-3 border border-[#191D30]/20 text-[#191D30] font-body text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-3 hover:bg-[#191D30] hover:text-white transition-all duration-500"
          >
            <ArrowLeft size={14} />
            <span>Back to Collection</span>
          </button>

          <div className="flex items-center gap-2 text-[#191D30]">
            <Star size={14} className="fill-[#A18E7E] text-[#A18E7E]" />
            <span className="font-body text-xs tracking-[0.2em] uppercase">
              {property.rating} / 10 {property.ratingLabel}
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <span className="font-body text-[11px] tracking-[0.3em] text-[#A18E7E] uppercase block mb-3">
              {property.subtitle}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-[#191D30] tracking-[0.06em] uppercase">
              {property.name}
            </h1>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end gap-3">
            <button
              onClick={() => setView('reservation')}
              className="rounded-full bg-[#191D30] text-white px-8 py-4 font-body text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-3 hover:bg-[#A18E7E] transition-all duration-500"
            >
              <span>Direct Inquiry</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Main Gallery Viewer — Straight Square Corners (rounded-none) */}
        <div
          className="relative aspect-[16/10] w-full bg-[#191D30]/10 overflow-hidden rounded-none mb-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <SmoothImage
            src={property.gallery[currentImageIndex]}
            alt={`${property.name} photo ${currentImageIndex + 1}`}
            eager={true}
            containerClassName="w-full h-full rounded-none"
            className="w-full h-full object-cover rounded-none"
          />

          {/* Round Pill Gallery Controls */}
          <button
            onClick={prevImage}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-[#191D30] flex items-center justify-center hover:bg-[#191D30] hover:text-white transition-all shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-[#191D30] flex items-center justify-center hover:bg-[#191D30] hover:text-white transition-all shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-5 right-6 bg-[#191D30]/85 px-4 py-1.5 font-body text-[11px] tracking-[0.25em] text-white">
            {currentImageIndex + 1} / {property.gallery.length}
          </div>
        </div>

        {/* Straight Square Thumbnail Strip */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-20">
          {property.gallery.map((imgSrc, idx) => (
            <button
              key={imgSrc}
              onClick={() => setCurrentImageIndex(idx)}
              className={`relative w-24 h-20 flex-shrink-0 overflow-hidden rounded-none border-2 transition-all ${
                idx === currentImageIndex
                  ? 'border-[#191D30] opacity-100'
                  : 'border-transparent opacity-55 hover:opacity-90'
              }`}
            >
              <img
                src={imgSrc}
                alt=""
                className="w-full h-full object-cover rounded-none"
              />
            </button>
          ))}
        </div>

        {/* Editorial Details + Architectural Specs Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-display text-2xl md:text-3xl text-[#191D30] tracking-[0.08em] uppercase">
              The Sanctuary Experience
            </h2>
            <p className="font-body font-light text-[14px] md:text-[15px] leading-[2.1] text-[#191D30]/85">
              {property.description}
            </p>
            {property.story && (
              <p className="font-body font-light text-[14px] md:text-[15px] leading-[2.1] text-[#191D30]/80">
                {property.story}
              </p>
            )}

            {/* Amenities Grid */}
            <div className="pt-8 border-t border-[#191D30]/10">
              <h3 className="font-display text-sm tracking-[0.25em] text-[#191D30] uppercase mb-6">
                Curated Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities?.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <Check size={14} className="text-[#A18E7E] flex-shrink-0" />
                    <span className="font-body text-[13px] text-[#191D30]/80">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reference-Inspired Specification Rows + Booking CTAs */}
          <div className="lg:col-span-5 bg-[#191D30] text-white p-8 md:p-12 rounded-none">
            <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase block mb-2">
              Residence Specifications
            </span>
            <h3 className="font-display text-2xl tracking-[0.08em] uppercase mb-8">
              {property.name}
            </h3>

            <div className="divide-y divide-white/15 border-t border-b border-white/15 mb-8">
              {property.specs?.map((spec) => (
                <div
                  key={spec.label}
                  className="py-4 flex items-center justify-between"
                >
                  <span className="font-body text-[11px] tracking-[0.2em] text-white/60 uppercase">
                    {spec.label}
                  </span>
                  <span className="font-body text-[13px] text-white">
                    {spec.value}
                  </span>
                </div>
              ))}
              {property.distances?.map((d) => (
                <div
                  key={d.place}
                  className="py-4 flex items-center justify-between"
                >
                  <span className="font-body text-[11px] tracking-[0.15em] text-white/60 uppercase flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#A18E7E]" />
                    {d.place}
                  </span>
                  <span className="font-body text-[12px] text-white/90">
                    {d.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={property.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full bg-white text-[#191D30] py-4 px-8 font-body text-[11px] tracking-[0.25em] uppercase text-center hover:bg-[#A18E7E] hover:text-white transition-all duration-500"
              >
                Check Availability on Booking.com →
              </a>
              <button
                onClick={() => setView('reservation')}
                className="w-full rounded-full border border-white/40 text-white py-4 px-8 font-body text-[11px] tracking-[0.25em] uppercase text-center hover:bg-white hover:text-[#191D30] transition-all duration-500"
              >
                Direct Concierge Inquiry →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}