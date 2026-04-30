export default function About({ setView }) {
  
  // route to contact
  const handleInquiryClick = (e) => {
    e.preventDefault();
    setView('contact'); 
    window.history.pushState(null, '', '#contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="features" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          <div className="relative aspect-[4/5] w-full overflow-hidden group">
            <img 
              src="/image00002.webp" 
              alt="Luxury Architectural Detail" 
              className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#191D30]/5 pointer-events-none" />
          </div>
          
          <div className="flex flex-col items-start lg:pl-10">
            <h2 className="font-display text-3xl md:text-5xl tracking-[0.2em] md:tracking-[0.3em] text-[#191D30] uppercase mb-8">
              The Art of <br/> Sanctuary
            </h2>
            
            <div className="w-12 h-[1px] bg-[#A18E7E] mb-10" />
            
            <div className="font-body font-light text-[13px] md:text-[14px] leading-[2.2] text-[#191D30]/80 mb-12 space-y-6 max-w-lg">
              <p>
                VacatiON is more than a destination; it is a curated state of being. We believe that true luxury is found in the silent intervals—the play of light on a marble wall, the texture of hand-loomed linen, and the absolute privacy of a space designed just for you.
              </p>
              <p>
                Every element of our collection is chosen to facilitate a deeper connection to the landscape and a total restoration of the self. This is where modern design meets the ancient soul of the Aegean.
              </p>
            </div>

            <button 
              onClick={handleInquiryClick}
              className="px-10 py-5 border border-[#191D30] text-[#191D30] font-body text-[10px] tracking-[0.3em] uppercase hover:bg-[#191D30] hover:text-white transition-colors duration-500"
            >
              Start Your Journey
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}