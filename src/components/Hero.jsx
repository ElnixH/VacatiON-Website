// src/components/Hero.jsx
import { ArrowUpRight, Star } from 'lucide-react';
import { BRAND_ASSETS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

const GUEST_INITIALS = ['C', 'M', 'S', 'J'];

export default function Hero({ setView }) {
  const { t } = useLanguage();

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (setView) {
      setView('reserve');
    }
  };

  return (
    <section
      id="home"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden flex flex-col justify-end bg-[#191D30]"
    >
      {/* Static Full-Bleed Hero Image (Protected & Non-Switching) */}
      <div className="absolute inset-0 z-0">
        <SmoothImage
          src={BRAND_ASSETS.heroImage}
          alt="Vacation Tinos Sanctuary"
          eager={true}
          containerClassName="w-full h-full rounded-none"
          className="w-full h-full object-cover rounded-none"
        />
        {/* Editorial Gradient for Lower-Left Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191D30]/90 via-[#191D30]/30 to-[#191D30]/35" />
      </div>

      {/* Main Lower Editorial Container (Palmora Layout) */}
      <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 md:px-14 pb-12 sm:pb-16 md:pb-20">
        {/* Trust Avatar Cluster (Above Headline on Left) */}
        <div className="mb-8 sm:mb-10 flex flex-col items-start">
          <div className="flex items-center -space-x-2.5 mb-3">
            {GUEST_INITIALS.map((initial, i) => (
              <div
                key={initial}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#191D30] border-2 border-[#A18E7E] text-white font-display text-xs flex items-center justify-center shadow-md"
              >
                {initial}
              </div>
            ))}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#A18E7E] border-2 border-white text-[#191D30] font-body text-[10px] font-bold flex items-center justify-center shadow-md">
              9.9
            </div>
          </div>

          <p className="font-body text-[11px] sm:text-xs text-white/80 leading-relaxed max-w-[230px]">
            Trusted by Guests Who Believe <br />
            in Authentic Cycladic Care
          </p>
        </div>

        {/* Bottom Split Row: Left Headline & Subtitle | Right Dual-Pill Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 pt-2">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-white tracking-[0.02em] leading-[1.14] font-normal mb-5">
              Discover the perfect <br />
              blend of luxury &amp; <br />
              comfort on Tinos Island
            </h1>

            <p className="font-body font-light text-xs sm:text-sm text-white/75 leading-relaxed max-w-md">
              Enjoy your vacation &amp; experience the ultimate in Cycladic luxury and serenity as you relax and unwind above the Aegean Sea.
            </p>
          </div>

          {/* Signature Palmora Dual-Pill Button: [ Explore Sanctuaries ] ( ↗ ) */}
          <div className="flex items-center gap-2 self-start lg:self-end shrink-0">
            <button
              onClick={scrollToCollection}
              className="group inline-flex items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <span className="rounded-full bg-white group-hover:bg-[#A18E7E] text-[#191D30] group-hover:text-white px-7 sm:px-8 py-3.5 sm:py-4 font-body text-xs font-medium tracking-[0.08em] transition-all duration-300 shadow-lg">
                {t.hero.exploreBtn}
              </span>
              <span className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white group-hover:bg-[#A18E7E] text-[#191D30] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg group-hover:rotate-45">
                <ArrowUpRight size={18} strokeWidth={1.75} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}