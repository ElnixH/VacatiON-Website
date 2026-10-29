// src/components/DiscoverTinos.jsx
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  MapPin,
  Waves,
  Landmark,
  Sparkles,
  X,
} from 'lucide-react';
import { TINOS_ATTRACTIONS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

export default function DiscoverTinos({ setView }) {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth scroll-linked blend factor (0 at top -> 1 at 550px scroll)
  const scrollProgress = Math.min(scrollY / 550, 1);

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-[#191D30] pb-32">
      {/* Detail Modal Drawer when a Village or Beach is clicked */}
      {selectedLocation && (
        <div
          className="fixed inset-0 z-50 bg-[#191D30]/80 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedLocation(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF9F6] border border-[#191D30]/15 max-w-3xl w-full overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12"
          >
            <div className="md:col-span-6 aspect-[4/3] md:aspect-auto w-full h-full">
              <SmoothImage
                src={selectedLocation.image}
                alt={selectedLocation.name}
                eager={true}
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />
            </div>

            <div className="md:col-span-6 p-8 md:p-10 flex flex-col justify-between relative">
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[#191D30]/15 flex items-center justify-center text-[#191D30]/60 hover:bg-[#191D30] hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              <div>
                <span className="font-body text-[10px] tracking-[0.28em] text-[#A18E7E] uppercase block mb-2">
                  {selectedLocation.subtitle || selectedLocation.tagline}
                </span>
                <h3 className="font-display text-3xl text-[#191D30] uppercase tracking-[0.06em] mb-5">
                  {selectedLocation.name}
                </h3>
                <p className="font-body font-light text-xs sm:text-[13px] leading-[1.9] text-[#191D30]/80 mb-4">
                  {selectedLocation.info}
                </p>
                {selectedLocation.moreInfo && (
                  <p className="font-body font-light text-xs sm:text-[13px] leading-[1.9] text-[#191D30]/70">
                    {selectedLocation.moreInfo}
                  </p>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-[#191D30]/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    setView('reserve');
                  }}
                  className="rounded-full bg-[#191D30] hover:bg-[#A18E7E] text-white px-6 py-3 font-body text-[10px] tracking-[0.22em] uppercase inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>{t.tinosPage.reserveNearby}</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. FULLSCREEN 100VH HERO WITH SEAMLESS SCROLL BLEND INTO #FAF9F6 */}
      <section className="relative h-screen min-h-[720px] w-full flex flex-col justify-between overflow-hidden bg-[#191D30]">
        {/* Parallax & Scroll-Blending Background Image */}
        <div
          className="absolute inset-0 z-0 transition-transform duration-150 ease-out"
          style={{
            transform: `translate3d(0, ${scrollY * 0.22}px, 0) scale(${
              1.05 + scrollProgress * 0.04
            })`,
          }}
        >
          <SmoothImage
            src={TINOS_ATTRACTIONS.hero}
            alt="Tinos Island Chora & Aegean Sea"
            eager={true}
            containerClassName="w-full h-full rounded-none"
            className="w-full h-full object-cover rounded-none"
          />
          {/* Rich Contrast Layer for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#191D30]/75 via-[#191D30]/45 to-[#191D30]/85" />
        </div>

        {/* Seamless Bottom Blend Veil that Melts the Hero into #FAF9F6 as You Scroll */}
        <div
          className="absolute inset-x-0 bottom-0 h-56 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(250,249,246,0) 0%, rgba(250,249,246,0.45) 55%, #FAF9F6 100%)',
          }}
        />

        {/* Top Bar with Back Pill Button */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 md:px-14 pt-10 sm:pt-12 flex items-center justify-between">
          <button
            onClick={goHome}
            className="rounded-full px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[#191D30] border border-white/25 font-body text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{t.tinosPage.back}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-body text-[10px] tracking-[0.28em] text-white/80 uppercase">
            <Compass size={14} className="text-[#A18E7E]" />
            <span>37°32′N 25°09′E · CYCLADES, GREECE</span>
          </div>
        </div>

        {/* Center Hero Typography */}
        <div
          className="relative z-20 max-w-4xl mx-auto px-6 text-center my-auto transition-all duration-200"
          style={{
            opacity: Math.max(1 - scrollProgress * 1.15, 0),
            transform: `translate3d(0, ${-scrollY * 0.12}px, 0)`,
          }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#A18E7E]/60 bg-[#191D30]/65 rounded-full mb-6">
            <Sparkles size={12} className="text-[#A18E7E]" />
            <span className="font-body text-[10px] tracking-[0.32em] text-white uppercase">
              {t.tinosPage.badge}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.35em] text-white uppercase mb-6 drop-shadow-xl">
            {t.tinosPage.title}
          </h1>

          <div className="w-14 h-[1px] bg-[#A18E7E] mx-auto mb-6" />

          <p className="font-body text-xs sm:text-sm md:text-base leading-[2] tracking-[0.22em] text-white uppercase max-w-2xl mx-auto drop-shadow-md whitespace-pre-line">
            {t.tinosPage.subtitle}
          </p>
        </div>

        {/* Bottom Floating Metrics Row (Blends Smoothly into #FAF9F6) */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 md:px-14 pb-10">
          <div className="bg-[#191D30]/85 backdrop-blur-md border border-white/15 shadow-2xl grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {t.tinosPage.metrics.map((item) => (
              <div key={item.label} className="p-6">
                <p className="font-display text-2xl sm:text-3xl text-[#A18E7E] tracking-wider mb-1">
                  {item.figure}
                </p>
                <p className="font-body text-[10px] font-medium tracking-[0.2em] text-white uppercase">
                  {item.label}
                </p>
                <p className="font-body text-[11px] text-white/60 mt-0.5 hidden sm:block">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL INTRODUCTION SPLIT */}
      <section className="py-24 md:py-32 max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-[#A18E7E]" />
              <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase">
                {t.tinosPage.introEyebrow}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#191D30] leading-[1.18]">
              {t.tinosPage.introTitle}
            </h2>

            <div className="font-body font-light text-xs sm:text-[14px] leading-[2.1] text-[#191D30]/80 space-y-5">
              <p>{t.tinosPage.introP1}</p>
              <p>{t.tinosPage.introP2}</p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setView('reserve')}
                className="group inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="rounded-full bg-[#191D30] group-hover:bg-[#A18E7E] text-white px-7 py-3.5 font-body text-xs tracking-[0.12em] uppercase transition-all">
                  {t.tinosPage.planBtn}
                </span>
                <span className="w-11 h-11 rounded-full bg-[#191D30] group-hover:bg-[#A18E7E] text-white flex items-center justify-center transition-all group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-6 items-center">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-none">
              <SmoothImage
                src={TINOS_ATTRACTIONS.intro}
                alt="Tinos Architecture"
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />
            </div>
            <div className="aspect-[3/4] w-full overflow-hidden rounded-none mt-12">
              <SmoothImage
                src={TINOS_ATTRACTIONS.villages[0]?.image}
                alt="Pyrgos Marble Village"
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE VILLAGES & BEACHES CURATION */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#191D30]/10 mb-16">
          <div>
            <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase block mb-3">
              {t.tinosPage.compassEyebrow}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#191D30]">
              {t.tinosPage.compassTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#191D30]/15 rounded-full p-1.5 self-start">
            {[
              { id: 'all', label: t.tinosPage.filterAll },
              { id: 'villages', label: t.tinosPage.filterVillages },
              { id: 'beaches', label: t.tinosPage.filterBeaches },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-full px-5 py-2 font-body text-xs transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#191D30] text-white font-medium'
                    : 'text-[#191D30]/65 hover:text-[#191D30]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {(activeFilter === 'all' || activeFilter === 'villages') && (
          <div className="mb-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl tracking-[0.15em] text-[#191D30] uppercase flex items-center gap-2.5">
                <Landmark size={18} className="text-[#A18E7E]" />
                <span>{t.tinosPage.villagesHeading}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TINOS_ATTRACTIONS.villages.map((village, idx) => (
                <div
                  key={village.name}
                  onClick={() => setSelectedLocation(village)}
                  className="group cursor-pointer bg-white border border-[#191D30]/10 hover:border-[#191D30] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none">
                      <SmoothImage
                        src={village.image}
                        alt={village.name}
                        containerClassName="w-full h-full rounded-none"
                        className="w-full h-full object-cover rounded-none transition-transform duration-[1500ms] group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-[#191D30]/90 text-white px-3 py-1 font-body text-[10px] tracking-[0.2em] uppercase">
                        0{idx + 1}
                      </div>
                    </div>

                    <div className="p-7">
                      <span className="font-body text-[10px] tracking-[0.25em] text-[#A18E7E] uppercase block mb-1.5">
                        {village.tagline || village.subtitle}
                      </span>
                      <h4 className="font-display text-2xl text-[#191D30] mb-3 group-hover:text-[#A18E7E] transition-colors">
                        {village.name}
                      </h4>
                      <p className="font-body font-light text-xs leading-[1.9] text-[#191D30]/75 line-clamp-3">
                        {village.info}
                      </p>
                    </div>
                  </div>

                  <div className="px-7 pb-6 pt-3 border-t border-[#191D30]/10 flex items-center justify-between text-[10px] font-body tracking-[0.2em] uppercase text-[#191D30]">
                    <span className="flex items-center gap-1.5 text-[#A18E7E]">
                      <MapPin size={12} /> Tinos
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {t.tinosPage.readGuide}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'beaches') && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl tracking-[0.15em] text-[#191D30] uppercase flex items-center gap-2.5">
                <Waves size={18} className="text-[#A18E7E]" />
                <span>{t.tinosPage.beachesHeading}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TINOS_ATTRACTIONS.beaches.map((beach, idx) => (
                <div
                  key={beach.name}
                  onClick={() => setSelectedLocation(beach)}
                  className="group cursor-pointer bg-white border border-[#191D30]/10 hover:border-[#191D30] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none">
                      <SmoothImage
                        src={beach.image}
                        alt={beach.name}
                        containerClassName="w-full h-full rounded-none"
                        className="w-full h-full object-cover rounded-none transition-transform duration-[1500ms] group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-[#191D30]/90 text-white px-3 py-1 font-body text-[10px] tracking-[0.2em] uppercase">
                        0{idx + 1}
                      </div>
                    </div>

                    <div className="p-7">
                      <span className="font-body text-[10px] tracking-[0.25em] text-[#A18E7E] uppercase block mb-1.5">
                        {beach.subtitle}
                      </span>
                      <h4 className="font-display text-2xl text-[#191D30] mb-3 group-hover:text-[#A18E7E] transition-colors">
                        {beach.name}
                      </h4>
                      <p className="font-body font-light text-xs leading-[1.9] text-[#191D30]/75 line-clamp-3">
                        {beach.info}
                      </p>
                    </div>
                  </div>

                  <div className="px-7 pb-6 pt-3 border-t border-[#191D30]/10 flex items-center justify-between text-[10px] font-body tracking-[0.2em] uppercase text-[#191D30]">
                    <span className="flex items-center gap-1.5 text-[#A18E7E]">
                      <Waves size={12} /> Tinos
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {t.tinosPage.exploreBay}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}