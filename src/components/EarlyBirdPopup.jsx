import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

export default function EarlyBirdPopup({ setView }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 w-[calc(100%-2rem)] max-w-sm bg-[#FAF9F6] border border-[#A18E7E]/30 p-6 shadow-2xl animate-fade-in-up 
      top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
      md:top-auto md:left-auto md:bottom-6 md:right-6 md:translate-x-0 md:translate-y-0"
    >
      <button 
        onClick={() => setIsOpen(false)} 
        className="absolute top-4 right-4 text-[#191D30]/40 hover:text-[#191D30] transition-colors"
      >
        <X size={20} strokeWidth={1.5} />
      </button>
      
      <div className="flex items-center gap-3 mb-4 text-[#A18E7E]">
        <Calendar size={24} strokeWidth={1.5} />
        <h3 className="font-display font-bold text-lg tracking-widest uppercase text-[#191D30]">
          EARLY BIRD 2027
        </h3>
      </div>
      
      <div className="mb-6">
        <p className="font-body text-[15px] font-medium text-[#191D30] mb-2">
          Your Tinos Escape Starts Here
        </p>
        {/* FIXED: Updated text to be inclusive of all properties */}
        <p className="font-body text-sm leading-relaxed text-[#191D30]/70">
          Book your stay for 2027 and enjoy our exclusive Early Bird offers.
        </p>
      </div>
      
      <button 
        onClick={() => {
          setView('reserve');
          window.location.hash = 'reserve';
          setIsOpen(false);
        }}
        className="w-full bg-[#191D30] text-[#FAF9F6] font-body text-xs tracking-[0.2em] uppercase py-3 hover:bg-[#A18E7E] transition-colors duration-300"
      >
        Reserve Now
      </button>
    </div>
  );
}