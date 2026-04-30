import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

export default function Footer({ setView }) {
  
  // Route to coming soon
  const handleComingSoon = (e, hashName) => {
    e.preventDefault();
    setView('coming-soon');
    window.history.pushState(null, '', `#${hashName}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route to cookies
  const handleCookies = (e) => {
    e.preventDefault();
    setView('cookies');
    window.history.pushState(null, '', '#cookies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route to contact
  const handleContact = (e) => {
    e.preventDefault();
    setView('contact');
    window.history.pushState(null, '', '#contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route to legal
  const handleLegal = (e) => {
    e.preventDefault();
    setView('legal');
    window.history.pushState(null, '', '#legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route to media hub
  const handleMedia = (e) => {
    e.preventDefault();
    setView('media');
    window.history.pushState(null, '', '#media');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF9F6] text-[#191D30] pt-24 pb-12 border-t border-[#191D30]/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-32">

          {/* Link columns */}
          <div className="flex flex-col sm:flex-row gap-16 md:gap-32 lg:gap-48">
            
            <div className="space-y-6">
              <a href="#contact" onClick={handleContact} className="block font-body text-[11px] tracking-[0.2em] uppercase hover:text-[#A18E7E] transition-colors">
                Contact Us
              </a>
              <a href="#media" onClick={handleMedia} className="block font-body text-[11px] tracking-[0.2em] uppercase hover:text-[#A18E7E] transition-colors">
                Media Hub
              </a>
              <a href="#cookies" onClick={handleCookies} className="block font-body text-[11px] tracking-[0.2em] uppercase hover:text-[#A18E7E] transition-colors">
                Cookies Policy
              </a>
            </div>

            <div className="space-y-6">
              <a href="#privacy" onClick={(e) => handleComingSoon(e, 'privacy')} className="block font-body text-[11px] tracking-[0.2em] uppercase hover:text-[#A18E7E] transition-colors">
                Privacy Policy
              </a>
              <a href="#legal" onClick={handleLegal} className="block font-body text-[11px] tracking-[0.2em] uppercase hover:text-[#A18E7E] transition-colors font-bold">
                Legal Notice & Company Info
              </a>
            </div>
          </div>

          {/* Newsletter & socials */}
          <div className="flex flex-col items-start md:min-w-[300px]">
            <h3 className="font-display text-2xl tracking-wide mb-6">
              Let's stay in touch
            </h3>
            
            <button className="w-full md:w-auto px-10 py-4 bg-[#191D30] text-white rounded-sm font-body text-[10px] tracking-[0.3em] uppercase hover:bg-[#A18E7E] transition-colors duration-300 mb-10">
              Newsletter Sign-Up
            </button>

            <div className="flex items-center gap-6 text-[#191D30]">
              <a href="#" className="hover:text-[#A18E7E] transition-transform duration-300 hover:-translate-y-1">
                <Facebook size={20} fill="currentColor" strokeWidth={0} />
              </a>
              <a href="#" className="hover:text-[#A18E7E] transition-transform duration-300 hover:-translate-y-1">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-[#A18E7E] transition-transform duration-300 hover:-translate-y-1">
                <Youtube size={22} fill="currentColor" strokeWidth={0} />
              </a>
              <a href="#" className="hover:text-[#A18E7E] transition-transform duration-300 hover:-translate-y-1">
                <Linkedin size={20} fill="currentColor" strokeWidth={0} />
              </a>
            </div>
          </div>

        </div>

        <div className="text-center flex justify-center">
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50">
            © VacatiON 2026
          </p>
        </div>

      </div>
    </footer>
  );
}