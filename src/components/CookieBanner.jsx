import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage for existing cookie consent
    const consent = localStorage.getItem('vacation_cookie_consent');
    if (!consent) {
      // Delay banner display to allow initial page animations to complete
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vacation_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-8 pointer-events-none flex justify-center animate-fade-in-up">
      <div className="bg-[#191D30] text-white shadow-2xl rounded-sm p-6 md:p-8 max-w-4xl w-full pointer-events-auto border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="text-center md:text-left">
          <h3 className="font-display text-[12px] tracking-[0.3em] uppercase text-[#A18E7E] mb-2">
            Privacy & Cookies
          </h3>
          <p className="font-body text-[11px] leading-relaxed text-white/70 max-w-2xl tracking-wide">
            We use cookies to elevate your experience, analyze site traffic, and curate personalized hospitality offerings. By continuing to browse, you consent to our use of cookies.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto shrink-0">
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-1 md:flex-none px-6 py-3 border border-white/20 text-[10px] font-body tracking-[0.2em] uppercase hover:bg-white/5 transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-8 py-3 bg-white text-[#191D30] text-[10px] font-body font-bold tracking-[0.2em] uppercase hover:bg-[#A18E7E] hover:text-white transition-colors"
          >
            Accept
          </button>
        </div>

      </div>
    </div>
  );
}