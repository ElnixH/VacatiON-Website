import { ArrowLeft } from 'lucide-react';

export default function LegalNotice({ setView }) {
  const goHome = () => {
    setView('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-32 pb-32">
      
      {/* Back navigation */}
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

      <div className="max-w-[800px] mx-auto px-8 md:px-12">
        
        {/* Page header */}
        <div className="text-center mb-24">
          <h1 className="font-display text-2xl md:text-4xl tracking-[0.3em] text-[#191D30] uppercase mb-8">
            Legal Notice
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50 uppercase">
            Corporate Information & Disclosures
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-16 font-body font-light text-[13px] md:text-[14px] leading-[2.2] text-[#191D30]/80">
          
          <p className="text-center italic text-[#A18E7E] mb-12">
            Information provided in accordance with Greek and European Union e-commerce regulations.
          </p>

          {/* 1. Business Entity */}
          <div className="border-t border-[#191D30]/10 pt-10">
            <h2 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              1. Provider & Business Entity
            </h2>
            <ul className="space-y-2">
              <li><strong>Company Name:</strong> THEODORA LEKASI PC</li>
              <li><strong>Legal Form:</strong> Private Company (I.K.E. equivalent)</li>
              <li><strong>Registered Office:</strong> Tinos, Cyclades, Hellenic Republic</li>
              <li><strong>G.E.MI. Number:</strong> 192807138000</li>
              <li><strong>VAT Number (AFM):</strong> [Pending / Available Upon Request]</li>
            </ul>
          </div>

          {/* 2. Management & Partners */}
          <div className="border-t border-[#191D30]/10 pt-10">
            <h2 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              2. Management & Partners
            </h2>
            <p className="text-[#191D30]/50 italic">
              Information withheld for privacy. Official records are available via the General Commercial Registry.
            </p>
          </div>

          {/* 3. Contact Information */}
          <div className="border-t border-[#191D30]/10 pt-10">
            <h2 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              3. Contact Details
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>Email Address:</strong> <a href="mailto:info@vacationofficial.com" className="text-[#A18E7E] hover:text-[#191D30] transition-colors">info@vacationofficial.com</a>
              </li>
              <li>
                <strong>Website:</strong> vacationofficial.com
              </li>
            </ul>
            <p className="mt-4">
              For immediate inquiries, please use our <button onClick={() => { setView('contact'); window.history.pushState(null, '', '#contact'); window.scrollTo(0,0); }} className="text-[#A18E7E] hover:text-[#191D30] border-b border-[#A18E7E]/30 transition-all">Direct Inquiry Form</button>.
            </p>
          </div>

          {/* 4. Copyright & Intellectual Property */}
          <div className="border-t border-[#191D30]/10 pt-10">
            <h2 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              4. Copyright & Trademarks
            </h2>
            <p>
              All content on this website, including text, photographs, graphics, and design elements, is the exclusive property of Vacation and THEODORA LEKASI PC unless otherwise stated. Unauthorized reproduction, distribution, or use of this material without prior written consent is strictly prohibited.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}