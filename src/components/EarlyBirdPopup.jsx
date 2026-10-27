import { useState } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';

export default function EarlyBirdPopup({ setView }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 px-5 py-3.5 rounded-lg bg-[#191D30] text-white border border-white/15 shadow-2xl hover:bg-[#A18E7E] transition-all duration-300 cursor-pointer"
      >
        <Sparkles size={14} className="text-[#A18E7E] group-hover:text-white" />
        <span className="font-body text-[11px] tracking-[0.2em] uppercase font-medium">
          Early Bird 2027
        </span>
      </button>
    );
  }

  return (
    <div className="fixed z-50 w-[calc(100%-2rem)] max-w-sm bg-[#FAF9F6] rounded-xl border border-[#A18E7E]/40 p-6 shadow-2xl bottom-5 right-4 sm:right-6 animate-in fade-in zoom-in-95 duration-200">
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-4 right-4 p-1.5 rounded-md text-[#191D30]/50 hover:text-[#191D30]"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-2.5 mb-3 text-[#A18E7E]">
        <Calendar size={18} />
        <span className="font-display text-xs tracking-[0.25em] uppercase text-[#191D30] font-semibold">
          EARLY BIRD 2027
        </span>
      </div>

      <p className="font-body text-sm font-medium text-[#191D30] mb-1.5">
        Your Tinos Escape Starts Here
      </p>

      <p className="font-body font-light text-xs text-[#191D30]/70 leading-relaxed mb-5">
        Book your stay for 2027 and enjoy our exclusive Early Bird offers across Villa Leonora and Andrea&apos;s Houses.
      </p>

      <button
        onClick={() => {
          setView('reserve');
          setIsExpanded(false);
        }}
        className="w-full rounded-lg bg-[#191D30] text-white font-body text-[11px] tracking-[0.22em] uppercase font-medium py-3.5 hover:bg-[#A18E7E] transition-colors cursor-pointer"
      >
        Reserve Now
      </button>
    </div>
  );
}