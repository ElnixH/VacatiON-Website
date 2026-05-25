import { ArrowLeft } from 'lucide-react';

export default function AboutUs({ setView }) {
  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCookies = (e) => {
    e.preventDefault();
    setView('cookies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrivacy = (e) => {
    e.preventDefault();
    setView('privacy'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-32 pb-32">
      
      <button 
        onClick={goHome}
        className="fixed top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center transition-all duration-500 z-50"
        aria-label="Return to Home"
      >
        <ArrowLeft 
          size={28} 
          strokeWidth={1} 
          className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500" 
        />
      </button>

      <div className="max-w-[1000px] mx-auto px-8 md:px-12">
        
        <div className="text-center mb-24">
          <h1 className="font-display text-2xl md:text-4xl tracking-[0.4em] text-[#191D30] uppercase mb-8">
            About Vacation
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50 uppercase">
            Our Philosophy & Identity
          </p>
        </div>

        <div className="mb-32 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-[16px] tracking-[0.3em] text-[#191D30] uppercase mb-8">
            A Sanctuary By The Shore
          </h2>
          <div className="font-body font-light text-[14px] leading-[2.2] text-[#191D30]/80 space-y-6">
            <p>
              [We need to write your brand story here. This is where we talk about the vision behind Vacation, the architecture, the feeling of the sunsets, and the high-end hospitality experience you are creating in Albania and Greece.]
            </p>
            <p>
              [We can discuss the dedication to slow luxury, natural textures, and timeless details that make every guest feel like the space is theirs alone.]
            </p>
          </div>
        </div>

        <div className="border-t border-[#191D30]/10 pt-20">
          <h2 className="font-display text-[14px] tracking-[0.3em] text-[#191D30] uppercase mb-12 text-center">
            Corporate Identity & Legal Disclosures
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-body font-light text-[13px] leading-[2] text-[#191D30]/80">
            
            <div>
              <h3 className="font-medium uppercase tracking-wider text-[11px] mb-4 text-[#A18E7E]">Business Entity</h3>
              <ul className="space-y-2">
                <li><strong>Company Name:</strong> THEODORA LEKASI PC</li>
                <li><strong>Legal Form:</strong> Private Company (I.K.E. equivalent)</li>
                <li><strong>Registered Office:</strong> Tinos, Cyclades, Hellenic Republic</li>
                <li><strong>G.E.MI. Number:</strong> 192807138000</li>
                <li><strong>VAT Number (AFM):</strong> 803239089</li> 
                <li><strong>Contact Email:</strong> <a href="mailto:info@vacationofficial.com" className="text-[#A18E7E] hover:text-[#191D30] transition-colors">info@vacationofficial.com</a></li>
                <li><strong>Manager/Representative:</strong> Theodora Lekasi</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium uppercase tracking-wider text-[11px] mb-4 text-[#A18E7E]">Data & Privacy</h3>
              <p className="mb-6">
                Vacation respects your privacy and complies with European data protection regulations (GDPR). We collect specific data necessary to process your reservations and enhance your digital experience.
              </p>
              
              <div className="space-y-4">
                <a 
                  href="#privacy" 
                  onClick={handlePrivacy}
                  className="block w-max border-b border-[#191D30]/20 pb-1 hover:text-[#A18E7E] hover:border-[#A18E7E] transition-all uppercase tracking-widest text-[11px]"
                >
                  Read Privacy Policy
                </a>
                
                <a 
                  href="#cookies" 
                  onClick={handleCookies}
                  className="block w-max border-b border-[#191D30]/20 pb-1 hover:text-[#A18E7E] hover:border-[#A18E7E] transition-all uppercase tracking-widest text-[11px]"
                >
                  Read Cookies Policy & Consent
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}