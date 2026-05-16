import { ArrowLeft } from 'lucide-react';

export default function ContactUs({ setView }) {
  const goHome = () => {
    setView('home');
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

      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        
        {/* Page header */}
        <div className="text-center mb-24">
          <h1 className="font-display text-2xl md:text-4xl tracking-[0.4em] text-[#191D30] uppercase mb-8">
            Contact Us
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50 uppercase">
            
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
          
          {/* Company directory */}
          <div className="space-y-16">
            
            <div>
              <h2 className="font-display text-[14px] tracking-[0.3em] text-[#191D30] uppercase mb-6">
                Headquarters
              </h2>
              <div className="font-body font-light text-[13px] leading-[2] text-[#191D30]/70 uppercase tracking-wider">
                <p>THEODORA LEKASI PC</p>
                <p>Tinos, Cyclades</p>
                <p>Hellenic Republic</p>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="font-display text-[11px] tracking-[0.2em] text-[#A18E7E] uppercase mb-2">
                  ENQUIRIES
                </h3>
                <a href="mailto:info@vacationofficial.com" className="block font-body font-light text-[13px] tracking-widest text-[#191D30] hover:text-[#A18E7E] transition-colors lowercase">
                  info@vacationofficial.com
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-display text-[14px] tracking-[0.3em] text-[#191D30] uppercase mb-10">
              Direct Inquiry
            </h2>
            
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              
              <div className="relative">
                <input 
                  type="text" 
                  id="name"
                  className="peer w-full bg-transparent border-b border-[#191D30]/20 py-3 font-body font-light text-[13px] text-[#191D30] focus:outline-none focus:border-[#191D30] transition-colors placeholder-transparent"
                  placeholder="Name"
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 -top-3.5 font-body text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50 transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-[#A18E7E]"
                >
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input 
                  type="email" 
                  id="email"
                  className="peer w-full bg-transparent border-b border-[#191D30]/20 py-3 font-body font-light text-[13px] text-[#191D30] focus:outline-none focus:border-[#191D30] transition-colors placeholder-transparent"
                  placeholder="Email"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 -top-3.5 font-body text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50 transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-[#A18E7E]"
                >
                  Email Address
                </label>
              </div>

              <div className="relative">
                <select 
                  id="subject"
                  className="w-full bg-transparent border-b border-[#191D30]/20 py-3 font-body font-light text-[13px] text-[#191D30] focus:outline-none focus:border-[#191D30] transition-colors appearance-none cursor-pointer uppercase tracking-wider"
                >
                  <option value="reservation">Reservation Inquiry</option>
                  <option value="event">Private Events</option>
                  <option value="career">Careers</option>
                  <option value="other">General Question</option>
                </select>
                <div className="absolute right-0 top-4 pointer-events-none text-[#191D30]/50">
                  ▼
                </div>
              </div>

              <div className="relative">
                <textarea 
                  id="message"
                  rows="4"
                  className="peer w-full bg-transparent border-b border-[#191D30]/20 py-3 font-body font-light text-[13px] text-[#191D30] focus:outline-none focus:border-[#191D30] transition-colors placeholder-transparent resize-none"
                  placeholder="Message"
                ></textarea>
                <label 
                  htmlFor="message" 
                  className="absolute left-0 -top-3.5 font-body text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50 transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-[#A18E7E]"
                >
                  Your Message
                </label>
              </div>

              <button 
                type="submit"
                className="w-full mt-8 px-10 py-5 bg-[#191D30] text-white font-body text-[10px] tracking-[0.3em] uppercase hover:bg-[#A18E7E] transition-colors duration-300"
              >
                Send Inquiry
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}