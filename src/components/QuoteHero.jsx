// src/components/QuoteHero.jsx
import { TINOS_ATTRACTIONS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

export default function QuoteHero({ setView }) {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 bg-[#191D30]">
        <SmoothImage
          src={TINOS_ATTRACTIONS.hero}
          alt="Tinos Island"
          containerClassName="w-full h-full rounded-none"
          className="w-full h-full object-cover rounded-none"
        />
        <div className="absolute inset-0 bg-[#191D30]/35" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl flex flex-col items-center">
        <h2 className="font-display text-3xl md:text-5xl tracking-[0.4em] text-white uppercase mb-6 opacity-95 drop-shadow-lg">
          {t.quoteHero.title}
        </h2>
        <p className="font-body text-[11px] tracking-[0.4em] text-white/80 uppercase mb-12">
          {t.quoteHero.subtitle}
        </p>

        <button
          onClick={() => setView && setView('discover-tinos')}
          className="rounded-full px-9 py-4 bg-white text-[#191D30] font-body text-[10px] tracking-[0.35em] font-semibold uppercase hover:bg-[#A18E7E] hover:text-white transition-all duration-500 cursor-pointer"
        >
          {t.quoteHero.button}
        </button>
      </div>
    </section>
  );
}