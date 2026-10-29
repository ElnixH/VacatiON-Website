// src/components/EarlyBirdPopup.jsx
import { useState } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../data/siteData';

export default function EarlyBirdPopup({ setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  // Minimized bottom-right floating pill button (Translated)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-[#191D30] text-white border border-white/15 px-5 py-3 shadow-2xl flex items-center gap-2.5 hover:bg-[#A18E7E] transition-all duration-500 cursor-pointer"
        aria-label={t.earlyBird.badge}
      >
        <Sparkles size={14} className="text-[#A18E7E]" />
        <span className="font-body text-[10px] tracking-[0.24em] uppercase">
          {t.earlyBird.pillLabel}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed z-50 w-[calc(100%-2rem)] max-w-sm bg-[#FAF9F6] border border-[#A18E7E]/30 p-6 shadow-2xl animate-fade-in-up top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-auto md:left-auto md:bottom-6 md:right-6 md:translate-x-0 md:translate-y-0">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-[#191D30]/40 hover:text-[#191D30] transition-colors cursor-pointer"
        aria-label={t.earlyBird.closeLabel}
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      <div className="flex items-center gap-3 mb-4 text-[#A18E7E]">
        <Calendar size={22} strokeWidth={1.5} />
        <h3 className="font-display font-bold text-base tracking-widest uppercase text-[#191D30]">
          {t.earlyBird.badge}
        </h3>
      </div>

      <div className="mb-6">
        <p className="font-body text-[15px] font-medium text-[#191D30] mb-2">
          {t.earlyBird.title}
        </p>
        <p className="font-body text-sm leading-relaxed text-[#191D30]/70">
          {t.earlyBird.description}
        </p>
      </div>

      <button
        onClick={() => {
          setView('reserve');
          window.location.hash = 'reserve';
          setIsOpen(false);
        }}
        className="w-full rounded-full bg-[#191D30] text-[#FAF9F6] font-body text-xs tracking-[0.2em] uppercase py-3.5 hover:bg-[#A18E7E] transition-colors duration-300 cursor-pointer"
      >
        {t.earlyBird.button}
      </button>
    </div>
  );
}