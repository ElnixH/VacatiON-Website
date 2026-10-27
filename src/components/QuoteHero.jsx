import { ArrowRight } from 'lucide-react';
import { TINOS_ATTRACTIONS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

export default function QuoteHero({ setView }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#191D30]">
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <SmoothImage
          src={TINOS_ATTRACTIONS.hero}
          alt="Tinos Island"
          containerClassName="w-full h-full"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#191D30]/60 via-[#191D30]/35 to-[#191D30]/75" />
      </div>

      {/* Subtle Inner Frame */}
      <div className="absolute inset-4 sm:inset-8 rounded-2xl border border-white/15 pointer-events-none z-10" />

      {/* Center Full-Screen Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl flex flex-col items-center">
        <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 font-body text-[10px] tracking-[0.35em] text-[#E6D9CE] uppercase mb-6">
          {t.quoteHero.eyebrow}
        </span>

        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-[0.3em] text-white uppercase mb-6 drop-shadow-lg">
          {t.quoteHero.title}
        </h2>

        <div className="w-16 h-[1px] bg-[#A18E7E] mb-8" />

        <p className="font-body text-xs sm:text-sm tracking-[0.3em] text-white/85 uppercase leading-[2.2] mb-12 max-w-xl">
          {t.quoteHero.subtitle}
        </p>

        <button
          onClick={() => setView('discover-tinos')}
          className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#191D30] hover:bg-[#A18E7E] hover:text-white font-body text-[10px] tracking-[0.35em] font-semibold uppercase transition-all duration-500 shadow-2xl cursor-pointer"
        >
          <span>{t.quoteHero.button}</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
}