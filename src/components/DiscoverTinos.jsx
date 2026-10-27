// src/components/DiscoverTinos.jsx
import { useState } from 'react';
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

const ISLAND_METRICS = [
  {
    figure: '40+',
    label: 'Traditional Marble Villages',
    detail: 'Connected by ancient stone footpaths',
  },
  {
    figure: '750+',
    label: 'Historic Cycladic Chapels',
    detail: 'Dotting the hills & coastal cliffs',
  },
  {
    figure: 'UNESCO',
    label: 'Intangible Marble Heritage',
    detail: 'Home of master sculptors in Pyrgos',
  },
  {
    figure: '15 Min',
    label: 'Ferry From Mykonos',
    detail: 'Easy access, worlds away from crowds',
  },
];

export default function DiscoverTinos({ setView }) {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'villages' | 'beaches'

  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                  className="rounded-full bg-[#191D30] hover:bg-[#A18E7E] text-white px-6 py-3 font-body text-[10px] tracking-[0.22em] uppercase inline-flex items-center gap-2 transition-all"
                >
                  <span>Reserve Your Stay Nearby</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. HIGH-CONTRAST EDITORIAL HERO (Fixes washed-out white text over white buildings) */}
      <section className="relative h-[82vh] min-h-[580px] w-full flex flex-col justify-between overflow-hidden bg-[#191D30]">
        <div className="absolute inset-0 z-0">
          <SmoothImage
            src={TINOS_ATTRACTIONS.hero}
            alt="Tinos Island Chora & Aegean Sea"
            eager={true}
            containerClassName="w-full h-full rounded-none"
            className="w-full h-full object-cover rounded-none scale-105"
          />
          {/* Deep Multi-Stop Contrast Vignette so white typography is 100% legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#191D30]/80 via-[#191D30]/55 to-[#191D30]/95" />
        </div>

        {/* Top Bar with Back Pill Button */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 md:px-14 pt-24 flex items-center justify-between">
          <button
            onClick={goHome}
            className="rounded-full px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[#191D30] border border-white/25 font-body text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Sanctuaries</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-body text-[10px] tracking-[0.28em] text-[#A18E7E] uppercase">
            <Compass size={14} />
            <span>37°32′N 25°09′E · CYCLADES, GREECE</span>
          </div>
        </div>

        {/* Center Hero Typography with Strong Contrast Backdrop */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center my-auto">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#A18E7E]/50 bg-[#191D30]/60 rounded-full mb-6">
            <Sparkles size={12} className="text-[#A18E7E]" />
            <span className="font-body text-[10px] tracking-[0.32em] text-white uppercase">
              The Island of Marble &amp; Light
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.35em] text-white uppercase mb-6 drop-shadow-xl">
            Tinos
          </h1>

          <div className="w-14 h-[1px] bg-[#A18E7E] mx-auto mb-6" />

          <p className="font-body text-xs sm:text-sm md:text-base leading-[2] tracking-[0.22em] text-white/95 uppercase max-w-2xl mx-auto drop-shadow-md">
            The hidden muse of the Cyclades. <br />A sanctuary of marble, wind, and wild beauty.
          </p>
        </div>

        {/* Bottom Architectural Stat Strip (Replaces the pale white boxes) */}
        <div className="relative z-20 bg-[#191D30] border-t border-white/15">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {ISLAND_METRICS.map((item) => (
              <div key={item.label} className="py-6 sm:px-6 first:pl-0 last:pr-0">
                <p className="font-display text-2xl sm:text-3xl text-[#A18E7E] tracking-wider mb-1">
                  {item.figure}
                </p>
                <p className="font-body text-[10px] font-medium tracking-[0.2em] text-white uppercase">
                  {item.label}
                </p>
                <p className="font-body text-[11px] text-white/50 mt-0.5 hidden sm:block">
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
                RAW &amp; AUTHENTIC CYCLADES
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#191D30] leading-[1.18]">
              An island kept as a secret among artists &amp; connoisseurs
            </h2>

            <div className="font-body font-light text-xs sm:text-[14px] leading-[2.1] text-[#191D30]/80 space-y-5">
              <p>
                Located in the heart of the Cyclades just 15 minutes by ferry from Mykonos, Tinos embodies a laid-back, grounded glamour not found anywhere else in the Aegean.
              </p>
              <p>
                On this island, all your senses are magnified by its contrasts: lush terraced hills against the lunar granite boulders of Volax, UNESCO-protected marble artistry in Pyrgos, and unspoiled golden shores where the water mirrors the sky.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setView('reserve')}
                className="group inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="rounded-full bg-[#191D30] group-hover:bg-[#A18E7E] text-white px-7 py-3.5 font-body text-xs tracking-[0.12em] uppercase transition-all">
                  Plan Your Tinos Escape
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
              CURATED ISLAND COMPASS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#191D30]">
              Sacred Villages &amp; Untamed Shores
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-white border border-[#191D30]/15 rounded-full p-1.5 self-start">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'villages', label: 'Marble Villages', icon: Landmark },
              { id: 'beaches', label: 'Aegean Beaches', icon: Waves },
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

        {/* Historic Villages Grid */}
        {(activeFilter === 'all' || activeFilter === 'villages') && (
          <div className="mb-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl tracking-[0.15em] text-[#191D30] uppercase flex items-center gap-2.5">
                <Landmark size={18} className="text-[#A18E7E]" />
                <span>I. The Historic Villages</span>
              </h3>
              <span className="font-body text-xs text-[#191D30]/55">
                Click any destination to read the full story
              </span>
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
                        0{idx + 1} · Village
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
                      <MapPin size={12} /> Tinos Highlands
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      Read Guide →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aegean Beaches Grid */}
        {(activeFilter === 'all' || activeFilter === 'beaches') && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl tracking-[0.15em] text-[#191D30] uppercase flex items-center gap-2.5">
                <Waves size={18} className="text-[#A18E7E]" />
                <span>II. The Untamed Shores</span>
              </h3>
              <span className="font-body text-xs text-[#191D30]/55">
                Crystal-clear bays &amp; surf coves
              </span>
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
                        0{idx + 1} · Coastline
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
                      <Waves size={12} /> Aegean Shore
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      Explore Bay →
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