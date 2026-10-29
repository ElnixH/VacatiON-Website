// src/components/PropertyPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Star,
  X,
  Maximize2,
} from 'lucide-react';
import {
  SANCTUARY_AMENITY_GROUPS,
  getLocalizedProperty,
  getLocalizedReviews,
  useLanguage,
} from '../data/siteData';
import { DEFAULT_PROPERTY_CONFIG } from '../services/channelManagerStore';
import SmoothImage from './SmoothImage';

export default function PropertyPage({ view, setView }) {
  const { lang, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(null);

  const propertyId = view === 'andreas-house' ? 'andreas-traditional' : view;
  const property = getLocalizedProperty(propertyId, lang);
  const config = DEFAULT_PROPERTY_CONFIG[propertyId];
  const amenityGroups = SANCTUARY_AMENITY_GROUPS[lang] || SANCTUARY_AMENITY_GROUPS.en;

  const propertyReviews = getLocalizedReviews(lang).filter(
    (r) => r.propertyId === propertyId
  );

  useEffect(() => {
    setCurrentImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(timer);
  }, [view]);

  const gallery = property?.gallery || [];

  const nextImage = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (!gallery.length) return;
      setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    },
    [gallery.length]
  );

  const prevImage = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (!gallery.length) return;
      setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  // Preload adjacent gallery images in background for zero-lag switching
  useEffect(() => {
    if (!gallery.length) return;
    const nextIdx = (currentImageIndex + 1) % gallery.length;
    const prevIdx = (currentImageIndex - 1 + gallery.length) % gallery.length;
    [gallery[nextIdx], gallery[prevIdx]].forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [currentImageIndex, gallery]);

  // Keyboard Left/Right navigation + Escape for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  if (!property) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) nextImage();
      else prevImage();
    }
    touchStartX.current = null;
  };

  const goHome = () => {
    setIsLoaded(false);
    setTimeout(() => {
      setView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 220);
  };

  const handleDirectReserve = () => {
    try {
      localStorage.setItem('vacation_selected_property', propertyId);
      localStorage.setItem('vacation_property_locked', 'true');
    } catch {
      // Ignore storage errors
    }
    setView('reserve');
  };

  return (
    <div
      className={`relative min-h-screen bg-[#FAF9F6] pt-28 pb-32 px-6 md:px-12 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Top Back Button */}
        <button
          onClick={goHome}
          className="rounded-full px-5 py-2.5 border border-[#191D30]/15 inline-flex items-center gap-2 text-[#191D30]/70 hover:bg-[#191D30] hover:text-white font-body text-[10px] tracking-[0.25em] uppercase mb-10 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>{t.propertyPage.back}</span>
        </button>

        {/* Main Hero Split: Gallery Carousel (Left 7 Cols) + Sanctuary Details (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Left Interactive Gallery with Frameless Arrows */}
          <div className="lg:col-span-7">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-none bg-[#191D30] mb-3 group select-none"
            >
              <SmoothImage
                key={gallery[currentImageIndex]}
                src={gallery[currentImageIndex]}
                alt={`${property.name} - ${currentImageIndex + 1}`}
                eager={true}
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />

              {/* Frameless Left Arrow (No white circle) */}
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:text-[#A18E7E] hover:scale-110 transition-all cursor-pointer bg-transparent border-none"
                aria-label="Previous photo"
              >
                <ChevronLeft size={36} strokeWidth={1.5} />
              </button>

              {/* Frameless Right Arrow (No white circle) */}
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:text-[#A18E7E] hover:scale-110 transition-all cursor-pointer bg-transparent border-none"
                aria-label="Next photo"
              >
                <ChevronRight size={36} strokeWidth={1.5} />
              </button>

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 z-30 p-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:text-[#A18E7E] transition-colors cursor-pointer bg-transparent border-none"
                aria-label="Open fullscreen gallery"
              >
                <Maximize2 size={18} />
              </button>

              <div className="absolute bottom-4 right-4 z-20 bg-[#191D30]/85 text-white px-3.5 py-1.5 font-body text-xs">
                {currentImageIndex + 1} / {gallery.length} {t.propertyPage.galleryCount}
              </div>
            </div>

            {/* Thumbnail Filmstrip */}
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {gallery.slice(0, 9).map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-[4/3] rounded-none overflow-hidden border-2 transition-all cursor-pointer ${
                    currentImageIndex === idx
                      ? 'border-[#191D30] opacity-100'
                      : 'border-transparent opacity-55 hover:opacity-95'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Sanctuary Story, Specs & Direct Booking Card */}
          <div
            className={`lg:col-span-5 space-y-8 transition-all duration-1000 delay-200 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-[#191D30] text-white px-3.5 py-1 font-body text-[9px] tracking-[0.22em] uppercase">
                  {property.badge}
                </span>
                <span className="font-body text-xs font-semibold text-[#A18E7E]">
                  ★ {property.rating} / 10 ({property.reviewCount})
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-[#191D30] mb-2">
                {property.name}
              </h1>

              <p className="font-body text-xs text-[#191D30]/65 inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-[#A18E7E]" />
                <span>{property.subtitle}</span>
              </p>
            </div>

            {/* 4 Key Specs Grid */}
            <div className="grid grid-cols-2 gap-4 bg-white border border-[#191D30]/10 p-5">
              {property.specs.map((sp, idx) => (
                <div key={idx}>
                  <span className="block font-body text-[9px] tracking-[0.2em] text-[#191D30]/45 uppercase">
                    {sp.label}
                  </span>
                  <span className="font-body text-xs font-semibold text-[#191D30]">
                    {sp.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Description & Sanctuary Story */}
            <div className="space-y-4 font-body font-light text-[13.5px] leading-[1.95] text-[#191D30]/80">
              <p>{property.description}</p>
              <p>{property.story}</p>
            </div>

            {/* Direct Rate & Single Direct Reserve Button ("Check Availability on Booking.com" Removed) */}
            <div className="bg-white border border-[#191D30]/10 p-6 space-y-5">
              <div className="flex items-baseline justify-between border-b border-[#191D30]/10 pb-4">
                <div>
                  <span className="font-body text-[9px] tracking-[0.2em] text-[#191D30]/50 uppercase block">
                    {t.collection.from}
                  </span>
                  <span className="font-display text-2xl text-[#191D30] font-semibold">
                    €{config?.baseRate || 240}
                  </span>
                  <span className="font-body text-xs text-[#191D30]/60 ml-1">
                    {t.collection.perNight}
                  </span>
                </div>
                <span className="font-body text-[10px] text-emerald-700 font-medium">
                  ✓ {t.reservation.welcomeIncluded}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDirectReserve}
                className="w-full rounded-full py-4 px-6 bg-[#191D30] text-white font-body text-[10.5px] tracking-[0.25em] uppercase hover:bg-[#A18E7E] transition-colors cursor-pointer"
              >
                {t.propertyPage.reserveDirect} →
              </button>
            </div>
          </div>
        </div>

        {/* Sanctuary Amenities & Island Distances Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-7 bg-white border border-[#191D30]/10 p-8">
            <h2 className="font-display text-lg tracking-[0.2em] text-[#191D30] uppercase mb-6">
              {t.propertyPage.amenitiesTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {property.amenities
                .filter((am) => !am.toLowerCase().includes('pet'))
                .map((am, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-xs font-body text-[#191D30]/80"
                  >
                    <Check size={14} className="text-[#A18E7E] shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#191D30]/10 p-8">
            <h2 className="font-display text-lg tracking-[0.2em] text-[#191D30] uppercase mb-6">
              {t.propertyPage.distancesTitle}
            </h2>
            <div className="divide-y divide-[#191D30]/10">
              {property.distances.map((d, i) => (
                <div
                  key={i}
                  className="py-3.5 flex items-center justify-between text-xs font-body"
                >
                  <span className="text-[#191D30]/75">{d.place}</span>
                  <span className="font-semibold text-[#191D30]">{d.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete Booking.com Sanctuary Facilities Breakdown */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl text-[#191D30] mb-3">
              {t.collection.facilitiesTitle}
            </h2>
            <p className="font-body font-light text-xs sm:text-sm text-[#191D30]/65">
              {t.collection.facilitiesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenityGroups.map((group, idx) => (
              <div key={idx} className="bg-white border border-[#191D30]/10 p-7">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#191D30]/10">
                  <h3 className="font-display text-sm tracking-[0.15em] text-[#191D30] uppercase">
                    {group.category}
                  </h3>
                  {group.badge && (
                    <span className="rounded-full bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-body text-[9px] tracking-[0.18em] uppercase">
                      {group.badge}
                    </span>
                  )}
                </div>
                <ul className="space-y-2.5">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 font-body font-light text-xs text-[#191D30]/80"
                    >
                      <Check size={14} className="text-[#A18E7E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Guest Reviews for This Residence */}
        {propertyReviews.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-[#191D30] uppercase tracking-[0.15em] mb-8">
              {t.reviews.title} — {property.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {propertyReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-[#191D30]/10 p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-body text-[10px] tracking-[0.2em] text-[#A18E7E] uppercase">
                        {rev.highlight}
                      </span>
                      <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-[#191D30]">
                        <Star size={12} className="fill-[#A18E7E] text-[#A18E7E]" />
                        {rev.score} / 10
                      </span>
                    </div>
                    <h4 className="font-display text-sm tracking-[0.1em] text-[#191D30] uppercase mb-3">
                      “{rev.title}”
                    </h4>
                    <p className="font-body font-light text-xs sm:text-sm leading-relaxed text-[#191D30]/80 mb-6">
                      {rev.text}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#191D30]/10">
                    <p className="font-display text-xs tracking-[0.15em] text-[#191D30] uppercase">
                      {rev.guest}
                    </p>
                    <p className="font-body text-[10px] tracking-[0.12em] text-[#191D30]/55 uppercase mt-0.5">
                      {rev.country} · {rev.travelerType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal (Frameless Arrows) */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-[#191D30]/95 flex items-center justify-center p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/75 hover:text-white cursor-pointer bg-transparent border-none"
          >
            <X size={32} strokeWidth={1.2} />
          </button>

          <button
            type="button"
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:text-[#A18E7E] hover:scale-110 transition-all cursor-pointer bg-transparent border-none"
          >
            <ChevronLeft size={40} strokeWidth={1.5} />
          </button>

          <img
            src={gallery[currentImageIndex]}
            alt={property.name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-[90vw] object-contain"
          />

          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:text-[#A18E7E] hover:scale-110 transition-all cursor-pointer bg-transparent border-none"
          >
            <ChevronRight size={40} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}