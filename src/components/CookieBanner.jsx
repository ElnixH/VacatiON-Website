import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vacation_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for "Reopen Cookie Consent Settings" from Privacy Policy
  useEffect(() => {
    const handleReopen = () => setIsVisible(true);
    window.addEventListener('reopen-cookie-banner', handleReopen);
    return () => window.removeEventListener('reopen-cookie-banner', handleReopen);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vacation_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('vacation_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-8 pointer-events-none flex justify-center animate-fade-in-up">
      <div className="bg-[#191D30] text-white shadow-2xl rounded-2xl p-6 md:p-8 max-w-4xl w-full pointer-events-auto border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-display text-[12px] tracking-[0.3em] uppercase text-[#A18E7E] mb-2">
            Privacy &amp; Cookies
          </h3>
          <p className="font-body text-[11px] leading-relaxed text-white/75 max-w-2xl tracking-wide">
            We use cookies to elevate your experience, analyze site traffic, and curate personalized hospitality offerings. You can accept or decline optional cookies at any time.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-3 rounded-full border border-white/20 text-[10px] font-body tracking-[0.2em] uppercase hover:bg-white/10 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-8 py-3 rounded-full bg-white text-[#191D30] text-[10px] font-body font-bold tracking-[0.2em] uppercase hover:bg-[#A18E7E] hover:text-white transition-colors cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}